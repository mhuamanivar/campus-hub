// API response shape for an event
export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  category: string;        // enum value e.g. "TECNOLOGIA"
  date: string;
  location: string;
  capacity: number;
  imageUrl?: string | null;
  registrationCount: number;
  organizerName: string;
  organizerEmail?: string;
  isCancelled: boolean;
  isRegistered: boolean;
  qrToken?: string;        // present when isRegistered = true
  createdAt: string;
}
