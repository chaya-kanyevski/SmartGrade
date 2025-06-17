// components/Chat.tsx
import React, { useContext, useEffect, useState } from 'react';
import { ForumSidebar } from '../components/chat/ForumSidebar';
import { ThreadView } from '../components/chat/ThreadView';
import { NewTopicForm } from '../components/chat/NewTopicForm';
import { ForumTopic, ThreadMessage } from '@/models/Forum';
import { getAllTopics, createTopic, getMessagesByTopic, sendMessageToTopic } from '@/services/chatService';
import { UserContext } from '@/context/UserReducer';

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTopicId) return;
      await sendMessageToTopic(selectedTopicId, newMessage, 1);
      setNewMessage('');
      const msgs = await getMessagesByTopic(selectedTopicId);
    setMessages(msgs);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateTopic = async () => {
    if (!newTopicTitle.trim()) return; 
  
    const newTopic = await createTopic(newTopicTitle, user.id, newTopicMessage);
  
    const enrichedTopic: ForumTopic = {
      ...newTopic,
      author: { name: user.name , initials: user.name ? user.name.charAt(0).toUpperCase() : '?' },
      lastMessage: newTopicMessage || '',
      time: new Date().toLocaleString(),
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
          author: { id: user.id, name: 'את/ה', initials: 'את' },
        },
      ]);
    } else {
      setMessages([]);
    }
  
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