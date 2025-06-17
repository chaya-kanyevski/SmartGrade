import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { ForumTopic } from '@/models/Forum';
import { formatDateTime } from '@/services/chatService';

interface Props {
  topic: ForumTopic;
  selected: boolean;
  onSelect: () => void;
  currentUserId: number;
}

export const TopicItem: React.FC<Props> = ({ topic, selected, onSelect, currentUserId }) => (
  <div
    className={`p-3 hover:bg-gray-100 cursor-pointer transition-colors ${
      selected ? 'bg-blue-50' : ''
    }`}
    onClick={onSelect}
  >
    <div className="flex items-center gap-3 mb-2">
      <Avatar>
        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
          {topic?.author?.initials || '?'}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium">{topic.title}</h3>
        <p className="text-xs text-gray-500">
          פורסם ע"י {topic.author.id === currentUserId ? "את/ה" : topic?.author?.name} • {topic.time ?  formatDateTime(topic.time) : 'תאריך לא זמין'}
        </p>
      </div>
    </div>
    <p className="text-sm text-gray-600 line-clamp-2">{topic.lastMessage}</p>
    <div className="flex justify-end mt-2">
      <Badge variant="outline" className="bg-blue-50">
        <MessageSquare className="h-3 w-3 ml-1" />
        {topic.messageCount} תגובות
      </Badge>
    </div>  
  </div>
);