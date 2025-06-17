import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThreadMessageItem } from './ThreadMessageItem';
import { ForumTopic, ThreadMessage } from '@/models/Forum';
import { User } from '@/models/User';

interface Props {
  topic: ForumTopic;
  messages: ThreadMessage[];
  newMessage: string;
  onChangeMessage: (msg: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  currentUser: User | null;
}

export const ThreadView: React.FC<Props> = ({ topic, messages, newMessage, onChangeMessage, onSend, onKeyPress, currentUser }) => (
  <div className="flex flex-col flex-1">
    <div className="p-4 border-b">
      <h2 className="text-xl font-bold">{topic.title}</h2>
      <p className="text-sm text-gray-500">
      נפתח ע"י {topic?.author?.id === currentUser?.id ? 'את/ה' : topic?.author?.name || '?'} • {topic.messageCount} תגובות
      </p>
    </div>

    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6">
        {messages.map(msg => <ThreadMessageItem key={msg.id} message={msg} />)}
      </div>
    </ScrollArea>

    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          placeholder="הקלד הודעה..."
          value={newMessage}
          onChange={(e) => onChangeMessage(e.target.value)}
          onKeyDown={onKeyPress}
        />
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          onClick={onSend}
        >
          שלח
        </Button>
      </div>
    </div>
  </div>
);