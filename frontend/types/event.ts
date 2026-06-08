export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  capacity: number;
  imageUrl?: string | null;
  registrationCount: number;
  organizerName: string;
  organizerEmail?: string;
  isCancelled: boolean;
  isRegistered: boolean;
  qrToken?: string;
  createdAt: string;
}
