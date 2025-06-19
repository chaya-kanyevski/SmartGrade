// components/Chat.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ForumSidebar } from '../components/chat/ForumSidebar';
import { ThreadView } from '../components/chat/ThreadView';
import { NewTopicForm } from '../components/chat/NewTopicForm';
import { ForumTopic, ThreadMessage } from '@/models/Forum';
import { getAllTopics, createTopic, getMessagesByTopic, sendMessageToTopic } from '@/services/chatService';
import { UserContext } from '@/context/UserReducer';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

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
  const { user } = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const connectionRef = useRef<HubConnection | null>(null);

  // ✅ יצירת חיבור SignalR פעם אחת
  useEffect(() => {
    const connection = new HubConnectionBuilder()
    .withUrl('https://localhost:7276/chatHub', {
      accessTokenFactory: () => localStorage.getItem('token') || ''
    })
    .withAutomaticReconnect()
    .build();
  

    connectionRef.current = connection;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('✅ Connected to SignalR hub');

        connection.on('ReceiveMessage', (topicId: string, message: any) => {
          console.log(`📩 Received message for topic ${topicId}:`, message);

          // עדכן הודעות אם רלוונטי
          setMessages(prev =>
            topicId === selectedTopicId ? [...prev, message] : prev
          );

          // עדכן טופיקים (מונה + הודעה אחרונה)
          setTopics(prev =>
            prev.map(t =>
              t.id === topicId
                ? {
                    ...t,
                    messageCount: (t.messageCount ?? 0) + 1,
                    lastMessage: message.text,
                  }
                : t
            )
          );

          // עדכן topic נבחר אם רלוונטי
          setSelectedTopic(prev =>
            prev?.id === topicId
              ? {
                  ...prev,
                  messageCount: (prev.messageCount ?? 0) + 1,
                  lastMessage: message.text,
                }
              : prev
          );
        });
      } catch (err) {
        console.error('❌ Connection failed:', err);
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, []);

  // ✅ שליפת טופיקים בהתחלה
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

  // ✅ שליפת הודעות בעת בחירת נושא
  useEffect(() => {
    if (!selectedTopicId) return;

    const fetchMessages = async () => {
      const msgs = await getMessagesByTopic(selectedTopicId);
      setMessages(msgs);
    };

    const topic = topics.find(t => t.id === selectedTopicId);
    setSelectedTopic(topic || null);
    fetchMessages();
  }, [selectedTopicId, topics]);

  // ✅ שליחת הודעה
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTopicId) return;
    setIsSending(true);
    await sendMessageToTopic(selectedTopicId, newMessage, user.id);
    setNewMessage('');
    setTopics(prevTopics =>
      prevTopics.map(t =>
        t.id === selectedTopicId
          ? {
              ...t,
              messageCount: (t.messageCount ?? 0) + 1,
              lastMessage: newMessage,
              time: new Date().toISOString(), // למשל גם זמן מעודכן
            }
          : t
      )
    );
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ✅ יצירת נושא חדש
  const handleCreateTopic = async () => {
    if (!newTopicTitle.trim()) return;
    setIsSubmitting(true);
    const newTopic = await createTopic(newTopicTitle, user.id, newTopicMessage);

    const enrichedTopic: ForumTopic = {
      ...newTopic,
      author: {
        id: user.id,
        name: user.name,
        initials: user.name ? user.name.charAt(0).toUpperCase() : '?',
      },
      lastMessage: newTopicMessage || '',
      time: new Date().toISOString(),
      messageCount: newTopicMessage.trim() ? 1 : 0,
    };

    setTopics([enrichedTopic, ...topics]);
    setNewTopicMode(false);
    setSelectedTopicId(enrichedTopic.id);

    if (newTopicMessage.trim()) {
      setMessages([
        {
          id: Math.random().toString(36),
          content: newTopicMessage,
          time: new Date().toLocaleString(),
          author: {
            id: user.id,
            name: 'את/ה',
            initials: 'את',
          },
        },
      ]);
    } else {
      setMessages([]);
    }

    setNewTopicTitle('');
    setNewTopicMessage('');
    setIsSubmitting(false);

  };

  const filteredTopics = topics.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <ForumSidebar
        topics={filteredTopics}
        isLoading={isLoading}
        selectedTopicId={selectedTopicId}
        onSelectTopic={id => {
          setNewTopicMode(false);
          setSelectedTopicId(id);
        }}
        onNewTopic={() => setNewTopicMode(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUserId={user.id}
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
            isSubmitting={isSubmitting}
          />
        ) : selectedTopic ? (
          <ThreadView
            topic={selectedTopic}
            messages={messages}
            newMessage={newMessage}
            onChangeMessage={setNewMessage}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            currentUser={user}
            isSending={isSending}
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