export interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  location?: string;
  type: string;
  attendees?: number;
}

export interface EventFilters {
  type?: string;
  date?: Date;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  popularEventType: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime?: string;
  location?: string;
  type: string; // e.g., 'service', 'meeting', 'special'
  attendees?: number;
  churchId: string;
}

export interface EventDetails extends Event {
  speaker?: string;
  agenda?: string[];
  resources?: string[]; // URLs or resource identifiers
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string; // User ID of the creator
  updatedBy?: string; // User ID of the last updater
}

export interface EventCreation {
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime?: string;
  location?: string;
  type: string; // e.g., 'service', 'meeting', 'special'
  churchId: string;
  speaker?: string;
  agenda?: string[];
  resources?: string[]; // URLs or resource identifiers
  notes?: string;
}
export interface EventUpdate {
  id: string;
  title?: string;
  description?: string;
  date?: Date; startTime?: string;
  endTime?: string;
  location?: string;
  type?: string; // e.g., 'service', 'meeting', 'special'
  attendees?: number;
  speaker?: string;
  agenda?: string[];
  resources?: string[]; // URLs or resource identifiers
  notes?: string;
}





