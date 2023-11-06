export interface MessageType {
  id: number;
  title: string;
  content: string;
  status: 'read' | 'unread' | 'archived';
  date: string;
}
