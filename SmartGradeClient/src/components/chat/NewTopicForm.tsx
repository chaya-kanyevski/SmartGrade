import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/ui/LoadingButton';

interface Props {
  title: string;
  message: string;
  onChangeTitle: (val: string) => void;
  onChangeMessage: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const NewTopicForm: React.FC<Props> = ({ title, message, onChangeTitle, onChangeMessage, onSubmit, onCancel, isSubmitting}) => (
  <Card className="flex-1 border-0 rounded-none shadow-none">
    <CardHeader>
      <CardTitle>פתיחת נושא חדש</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">כותרת הנושא</label>
        <Input 
          placeholder="הזן כותרת..."
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">תוכן ההודעה</label>
        <textarea 
          className="w-full p-3 border rounded-md min-h-[150px]"
          placeholder="הזן את תוכן ההודעה כאן..."
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
        />
      </div>
    </CardContent>
    <CardFooter className="flex gap-2 justify-end">
      <Button variant="outline" onClick={onCancel}>ביטול</Button>
      <LoadingButton
  isLoading={isSubmitting}
  onClick={onSubmit}
  disabled={!title.trim()}
>
  פרסם נושא חדש
</LoadingButton>

    </CardFooter>
  </Card>
);