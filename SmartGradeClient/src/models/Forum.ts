export interface Author {
    name: string;
    initials: string;
  }
  
  export interface ForumTopic {
    id: string;
    title: string;
    author: Author;
    lastMessage: string;
    time: string;
    messageCount: number;
  }
  
  export interface ThreadMessage {
    id: string;
    author: Author;
    content: string;
    time: string;
  }
  