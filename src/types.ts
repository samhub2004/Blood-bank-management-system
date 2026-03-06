export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodStock {
  type: BloodType;
  units: number;
  lastUpdated: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: BloodType;
  units: number;
  hospital: string;
  urgency: 'Normal' | 'Urgent' | 'Critical';
  status: 'Pending' | 'Approved' | 'Fulfilled' | 'Rejected';
  requestDate: string;
  contactNumber: string;
}

export interface Donor {
  id: string;
  name: string;
  bloodType: BloodType;
  lastDonationDate: string;
  contactNumber: string;
  email: string;
  location: string;
  frequency: number; // times donated in last year
}

export interface HistoricalUsage {
  date: string;
  bloodType: BloodType;
  unitsUsed: number;
  event?: string; // e.g., "Holiday Season", "Local Festival"
}

export interface TransportRoute {
  id: string;
  origin: string;
  destination: string;
  bloodType: BloodType;
  units: number;
  status: 'In Transit' | 'Delivered' | 'Delayed';
  estimatedArrival: string;
  optimizedPath: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type UserRole = 'admin' | 'user' | 'hospital' | null;

export interface AuthState {
  user: {
    email: string;
    role: UserRole;
    name: string;
  } | null;
}
