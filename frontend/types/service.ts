export interface ApiService {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: string;
  isActive: boolean;
  ownerId: string;
  ownerName: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  condition: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  ownerId: string;
  ownerName: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ApiResource {
  id: string;
  name: string;
  description?: string | null;
  code: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  createdAt: string;
}

export interface ApiLoan {
  id: string;
  resourceId: string;
  borrowerId: string;
  status: string;
  dueDate: string;
  returnedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  resource: ApiResource;
}

export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface ApiChat {
  id: string;
  participants: { id: string; name: string; avatarUrl?: string | null }[];
  lastMessage?: { body: string; createdAt: string; senderId: string } | null;
  createdAt: string;
}

export interface ApiMessage {
  id: string;
  chatId: string;
  senderId: string;
  body: string;
  readAt?: string | null;
  createdAt: string;
  sender: { id: string; name: string; avatarUrl?: string | null };
}
