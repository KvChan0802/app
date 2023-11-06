export interface TicketType {
  id: string;
  location: string;
  exhibitionId?: string;
  date?: string;
  time?: string;
  count?: number;
  section: string;
  timestamp?: number;
}
