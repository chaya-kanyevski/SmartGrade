import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, PlusCircle } from 'lucide-react';
import { ForumTopic } from '@/models/Forum';
import { TopicItem } from './TopicItem';

interface Props {
  topics: ForumTopic[];
  isLoading: boolean;
  selectedTopicId: string | null;
  onSelectTopic: (id: string) => void;
  onNewTopic: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUserId?: number; 
}

export const ForumSidebar: React.FC<Props> = ({
  topics,
  isLoading,
  selectedTopicId,
  onSelectTopic,
  onNewTopic,
  searchQuery,
  onSearchChange,
  currentUserId
}) => (
  <div className="w-full md:w-80 border-l bg-gray-50">
    <div className="p-4 border-b">
      <div className="relative mb-3">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pr-10"
          placeholder="חיפוש בפורום..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        onClick={onNewTopic}
      >
        <PlusCircle className="ml-2 h-4 w-4" />
        פתיחת נושא חדש
      </Button>
    </div>

    <ScrollArea className="h-[calc(100vh-16rem)]">
      {isLoading ? (
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y">
          {topics.map(topic => (
            <TopicItem
              key={topic.id}
              topic={topic}
              selected={selectedTopicId === topic.id}
              onSelect={() => onSelectTopic(topic.id)}
              currentUserId={currentUserId || 0} 
            />
          ))}
        </div>
      )}
    </ScrollArea>
  </div>
);
