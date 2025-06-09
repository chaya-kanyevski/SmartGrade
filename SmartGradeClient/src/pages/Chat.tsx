// components/Chat.tsx
import React, { useEffect, useState } from 'react';
import { ForumSidebar } from '../components/chat/ForumSidebar';
import { ThreadView } from '../components/chat/ThreadView';
import { NewTopicForm } from '../components/chat/NewTopicForm';
import { ForumTopic, ThreadMessage } from '@/models/Forum';
import { getAllTopics, createTopic, getMessagesByTopic } from '@/services/chatService';

const Chat: React.FC = () => {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTopicMode, setNewTopicMode] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicMessage, setNewTopicMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load all topics
  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const data = await getAllTopics();
        console.log('topics fetched:', data);
        if (!Array.isArray(data)) {
          console.error('getAllTopics did not return an array:', data);
          return;
        }
        setTopics(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Load messages for selected topic
  useEffect(() => {
    if (!selectedTopicId) return;

    const fetchMessages = async () => {
      const msgs = await getMessagesByTopic(selectedTopicId);
      setMessages(msgs);
    };

    const topic = topics.find((t) => t.id === selectedTopicId);
    setSelectedTopic(topic || null);
    fetchMessages();
  }, [selectedTopicId, topics]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const newMsg: ThreadMessage = {
      id: Math.random().toString(36).substr(2, 9),
      content: newMessage,
      time: new Date().toLocaleString(),
      author: {
        name: 'את/ה',
        initials: 'את',
      },
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateTopic = async () => {
    if (!newTopicTitle.trim() || !newTopicMessage.trim()) return;

    const newTopic = await createTopic(newTopicTitle);
    const enrichedTopic: ForumTopic = {
      ...newTopic,
      author: { name: 'את/ה', initials: 'את' },
      lastMessage: newTopicMessage,
      time: new Date().toLocaleString(),
      messageCount: 1,
    };

    setTopics([enrichedTopic, ...topics]);
    setNewTopicMode(false);
    setSelectedTopicId(enrichedTopic.id);
    setMessages([
      {
        id: Math.random().toString(36),
        content: newTopicMessage,
        time: new Date().toLocaleString(),
        author: { name: 'את/ה', initials: 'את' },
      },
    ]);

    setNewTopicTitle('');
    setNewTopicMessage('');
  };

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <ForumSidebar
        topics={filteredTopics}
        isLoading={isLoading}
        selectedTopicId={selectedTopicId}
        onSelectTopic={(id) => {
          setNewTopicMode(false);
          setSelectedTopicId(id);
        }}
        onNewTopic={() => setNewTopicMode(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1">
        {newTopicMode ? (
          <NewTopicForm
            title={newTopicTitle}
            message={newTopicMessage}
            onChangeTitle={setNewTopicTitle}
            onChangeMessage={setNewTopicMessage}
            onSubmit={handleCreateTopic}
            onCancel={() => setNewTopicMode(false)}
          />
        ) : selectedTopic ? (
          <ThreadView
            topic={selectedTopic}
            messages={messages}
            newMessage={newMessage}
            onChangeMessage={setNewMessage}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            בחר נושא מהצד או פתח חדש כדי להתחיל
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { User } from '@/models/User';
// import { Send, MessageSquare, FileText, MoreVertical, Search, PlusCircle } from 'lucide-react';

// interface Author {
//     name: string;
//     initials: string;
//   }
  
//   interface ForumTopic {
//     id: string;
//     title: string;
//     author: Author;
//     lastMessage: string;
//     time: string;
//     messageCount: number;
//   }
  
//   interface ThreadMessage {
//     id: string;
//     author: Author;
//     content: string;
//     time: string;
//   }

// const SAMPLE_FORUM_TOPICS: ForumTopic[] = [
//   {
//     id: '1',
//     title: 'שיתוף חומרי לימוד להיסטוריה',
//     author: {
//       name: 'דנה לוי',
//       initials: 'דל',
//     },
//     lastMessage: 'האם מישהו יכול לשתף חומרים לבגרות בהיסטוריה?',
//     time: '10:23',
//     messageCount: 12,
//   },
//   {
//     id: '2',
//     title: 'רעיונות לפעילויות כיתה',
//     author: {
//       name: 'יוסי כהן',
//       initials: 'יכ',
//     },
//     lastMessage: 'מישהו מכיר פעילויות מעניינות לשיעורי מתמטיקה?',
//     time: 'אתמול',
//     messageCount: 8,
//   },
//   {
//     id: '3',
//     title: 'טיפים להוראה מרחוק',
//     author: {
//       name: 'מיכל שפירא',
//       initials: 'מש',
//     },
//     lastMessage: 'איזה כלים אתם משתמשים להוראה מרחוק?',
//     time: 'אתמול',
//     messageCount: 15,
//   }
// ];

// // Sample messages for a forum thread
// const SAMPLE_THREAD_MESSAGES: ThreadMessage[] = [
//   {
//     id: '1',
//     author: {
//       name: 'דנה לוי',
//       initials: 'דל',
//     },
//     content: 'האם מישהו יכול לשתף חומרים לבגרות בהיסטוריה? אני מחפשת חומרים מעודכנים על מלחמת העולם השנייה.',
//     time: 'אתמול, 10:20',
//   },
//   {
//     id: '2',
//     author: {
//       name: 'רון אברהם',
//       initials: 'רא',
//     },
//     content: 'יש לי מצגת טובה על התקופה, אשמח לשתף! האם יש לך העדפה לנושא ספציפי?',
//     time: 'אתמול, 10:35',
//   },
//   {
//     id: '3',
//     author: {
//       name: 'מיכל שפירא',
//       initials: 'מש',
//     },
//     content: 'אני משתמשת בחוברת העבודה של משרד החינוך, היא די טובה ומעודכנת. אפשר למצוא אותה באתר של המשרד.',
//     time: 'אתמול, 11:20',
//   },
//   {
//     id: '4',
//     author: {
//       name: 'דנה לוי',
//       initials: 'דל',
//     },
//     content: 'תודה רבה! אשמח גם לחומרים על עליית הנאציזם ספציפית.',
//     time: 'אתמול, 12:45',
//   }
// ];

// export default function Chat() {
//     const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
//     const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
//     const [newMessage, setNewMessage] = useState<string>('');
//     const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null); // selectedTopic יכול להיות ForumTopic או null
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [searchQuery, setSearchQuery] = useState<string>('');
//     const [currentUser, setCurrentUser] = useState<User | null>(null); // וודא ש-User מגיע ממודל User
//     const [showNewTopicForm, setShowNewTopicForm] = useState<boolean>(false);
//     const [newTopicTitle, setNewTopicTitle] = useState<string>('');
//     const [newTopicMessage, setNewTopicMessage] = useState<string>('');

//   useEffect(() => {
//     // Simulate loading forum topics
//     setTimeout(() => {
//       setForumTopics(SAMPLE_FORUM_TOPICS);
//       setIsLoading(false);
//     }, 1000);

//     // Get current user
//     const loadUser = async () => {
//     //   try {
//     //     const user = await User.me();
//     //     setCurrentUser(user);
//     //   } catch (error) {
//     //     console.error("Failed to load user:", error);
//     //     // Set default user for demo
//     //     setCurrentUser({
//     //       first_name: 'משתמש דמו',
//     //       email: 'demo@example.com'
//     //     });
//     //   }
//     };

//     loadUser();
//   }, []);

//   useEffect(() => {
//     // Load thread messages when topic is selected
//     if (selectedTopic) {
//       setThreadMessages(SAMPLE_THREAD_MESSAGES);
//     } else {
//       setThreadMessages([]);
//     }
//   }, [selectedTopic]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;
    
//     const newMsg = {
//       id: `new-${Date.now()}`,
//       author: {
//         name: 
//        // currentUser?.full_name || 
//         'משתמש',
//         initials: 
//         //currentUser?.full_name?.split(' ').map(n => n[0]).join('') ||
//          'מ',
//       },
//       content: newMessage,
//       time: 'עכשיו',
//     };
    
//     setThreadMessages([...threadMessages, newMsg]);
//     setNewMessage('');
//   };

//   const handleCreateNewTopic = () => {
//     if (!newTopicTitle.trim() || !newTopicMessage.trim()) return;
    
//     const newTopic = {
//       id: `new-${Date.now()}`,
//       title: newTopicTitle,
//       author: {
//         name:
//         // currentUser?.full_name || 
//          'משתמש',
//         initials: 
//        // currentUser?.full_name?.split(' ').map(n => n[0]).join('') || 
//         'מ',
//       },
//       lastMessage: newTopicMessage,
//       time: 'עכשיו',
//       messageCount: 1,
//     };
    
//     setForumTopics([newTopic, ...forumTopics]);
//     setSelectedTopic(newTopic);
//     setThreadMessages([{
//       id: `msg-${Date.now()}`,
//       author: {
//         name:
//         // currentUser?.full_name ||
//           'משתמש',
//         initials:
//         // currentUser?.full_name?.split(' ').map(n => n[0]).join('') ||
//           'מ',
//       },
//       content: newTopicMessage,
//       time: 'עכשיו',
//     }]);
    
//     setShowNewTopicForm(false);
//     setNewTopicTitle('');
//     setNewTopicMessage('');
//   };

//   const filteredTopics = forumTopics.filter(
//     topic => topic.title.includes(searchQuery) || topic.lastMessage.includes(searchQuery)
//   );

//   const handleKeyPress = (e : React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     if (e.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="fade-in h-[calc(100vh-12rem)]">
//       <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">פורום מורים</h1>
      
//       <div className="bg-white rounded-xl shadow overflow-hidden h-full flex">
//         {/* Topics sidebar */}
//         <div className="w-full md:w-80 border-l bg-gray-50">
//           <div className="p-4 border-b">
//             <div className="relative mb-3">
//               <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 className="pr-10"
//                 placeholder="חיפוש בפורום..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
            
//             <Button 
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//               onClick={() => setShowNewTopicForm(true)}
//             >
//               <PlusCircle className="ml-2 h-4 w-4" />
//               פתיחת נושא חדש
//             </Button>
//           </div>
          
//           <ScrollArea className="h-[calc(100vh-16rem)]">
//             {isLoading ? (
//               <div className="p-4 space-y-4">
//                 {[1, 2, 3, 4].map(i => (
//                   <div key={i} className="flex items-center gap-3 animate-pulse">
//                     <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//                     <div className="flex-1">
//                       <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
//                       <div className="h-3 bg-gray-200 rounded w-40"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="divide-y">
//                 {filteredTopics.map(topic => (
//                   <div
//                     key={topic.id}
//                     className={`p-3 hover:bg-gray-100 cursor-pointer transition-colors ${
//                       selectedTopic?.id === topic.id ? 'bg-blue-50' : ''
//                     }`}
//                     onClick={() => setSelectedTopic(topic)}
//                   >
//                     <div className="flex items-center gap-3 mb-2">
//                       <Avatar>
//                         <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
//                           {topic.author.initials}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <h3 className="font-medium">{topic.title}</h3>
//                         <p className="text-xs text-gray-500">
//                           פורסם ע"י {topic.author.name} • {topic.time}
//                         </p>
//                       </div>
//                     </div>
//                     <p className="text-sm text-gray-600 line-clamp-2">{topic.lastMessage}</p>
//                     <div className="flex justify-end mt-2">
//                       <Badge variant="outline" className="bg-blue-50">
//                         <MessageSquare className="h-3 w-3 ml-1" />
//                         {topic.messageCount} תגובות
//                       </Badge>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </ScrollArea>
//         </div>
        
//         {/* Main content area */}
//         <div className="hidden md:flex flex-col flex-1">
//           {showNewTopicForm ? (
//             <Card className="flex-1 border-0 rounded-none shadow-none">
//               <CardHeader>
//                 <CardTitle>פתיחת נושא חדש</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">כותרת הנושא</label>
//                   <Input 
//                     placeholder="הזן כותרת..."
//                     value={newTopicTitle}
//                     onChange={(e) => setNewTopicTitle(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">תוכן ההודעה</label>
//                   <textarea 
//                     className="w-full p-3 border rounded-md min-h-[150px]"
//                     placeholder="הזן את תוכן ההודעה כאן..."
//                     value={newTopicMessage}
//                     onChange={(e) => setNewTopicMessage(e.target.value)}
//                   />
//                 </div>
//               </CardContent>
//               <CardFooter className="flex gap-2 justify-end">
//                 <Button 
//                   variant="outline"
//                   onClick={() => setShowNewTopicForm(false)}
//                 >
//                   ביטול
//                 </Button>
//                 <Button 
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                   disabled={!newTopicTitle.trim() || !newTopicMessage.trim()}
//                   onClick={handleCreateNewTopic}
//                 >
//                   פרסם נושא חדש
//                 </Button>
//               </CardFooter>
//             </Card>
//           ) : selectedTopic ? (
//             <>
//               {/* Thread header */}
//               <div className="p-4 border-b">
//                 <h2 className="text-xl font-bold">{selectedTopic.title}</h2>
//                 <p className="text-sm text-gray-500">
//                   נפתח ע"י {selectedTopic.author.name} • {selectedTopic.messageCount} תגובות
//                 </p>
//               </div>
              
//               {/* Thread messages */}
//               <ScrollArea className="flex-1 p-4">
//                 <div className="space-y-6">
//                   {threadMessages.map(message => (
//                     <div key={message.id} className="flex gap-4">
//                       <Avatar>
//                         <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
//                           {message.author.initials}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1">
//                         <div className="flex justify-between items-center mb-1">
//                           <p className="font-medium">{message.author.name}</p>
//                           <span className="text-xs text-gray-500">{message.time}</span>
//                         </div>
//                         <div className="p-3 bg-gray-50 rounded-lg">
//                           <p>{message.content}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </ScrollArea>
              
//               {/* Message input */}
//               <div className="p-4 border-t">
//                 <div className="flex gap-2">
//                   <Input
//                     placeholder="הקלד תגובה..."
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     className="flex-1"
//                   />
//                   <Button 
//                     onClick={handleSendMessage} 
//                     disabled={!newMessage.trim()}
//                     className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                   >
//                     <Send className="h-5 w-5" />
//                   </Button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
//               <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
//               <h3 className="text-xl font-medium text-gray-700">ברוכים הבאים לפורום</h3>
//               <p className="text-gray-500 mt-2 max-w-md">
//                 בחר נושא מהרשימה או פתח נושא חדש כדי להתחיל בדיון
//               </p>
//               <Button 
//                 className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                 onClick={() => setShowNewTopicForm(true)}
//               >
//                 <PlusCircle className="ml-2 h-4 w-4" />
//                 פתיחת נושא חדש
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }