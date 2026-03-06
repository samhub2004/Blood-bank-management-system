import { BloodStock, BloodRequest, Donor, HistoricalUsage } from './types';

export const INITIAL_STOCK: BloodStock[] = [
  { type: 'A+', units: 15, lastUpdated: new Date().toISOString() },
  { type: 'A-', units: 4, lastUpdated: new Date().toISOString() },
  { type: 'B+', units: 12, lastUpdated: new Date().toISOString() },
  { type: 'B-', units: 3, lastUpdated: new Date().toISOString() },
  { type: 'AB+', units: 8, lastUpdated: new Date().toISOString() },
  { type: 'AB-', units: 2, lastUpdated: new Date().toISOString() },
  { type: 'O+', units: 20, lastUpdated: new Date().toISOString() },
  { type: 'O-', units: 6, lastUpdated: new Date().toISOString() },
];

export const MOCK_REQUESTS: BloodRequest[] = [
  {
    id: '1',
    patientName: 'John Doe',
    bloodType: 'O-',
    units: 2,
    hospital: 'City General Hospital',
    urgency: 'Critical',
    status: 'Pending',
    requestDate: new Date().toISOString(),
    contactNumber: '+1 234 567 8901',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    bloodType: 'A+',
    units: 1,
    hospital: 'St. Mary Medical Center',
    urgency: 'Normal',
    status: 'Approved',
    requestDate: new Date(Date.now() - 86400000).toISOString(),
    contactNumber: '+1 987 654 3210',
  }
];

export const MOCK_DONORS: Donor[] = [
  {
    id: 'd1',
    name: 'Robert Wilson',
    bloodType: 'O+',
    lastDonationDate: '2024-01-15',
    contactNumber: '+1 555 0101',
    email: 'robert@example.com',
    location: 'Downtown',
    frequency: 4,
  },
  {
    id: 'd2',
    name: 'Sarah Parker',
    bloodType: 'B-',
    lastDonationDate: '2023-11-20',
    contactNumber: '+1 555 0102',
    email: 'sarah@example.com',
    location: 'Westside',
    frequency: 2,
  }
];

export const HISTORICAL_DATA: HistoricalUsage[] = [
  { date: '2023-12-20', bloodType: 'O-', unitsUsed: 12, event: 'Holiday Season' },
  { date: '2023-12-25', bloodType: 'O-', unitsUsed: 15, event: 'Holiday Season' },
  { date: '2024-01-05', bloodType: 'A+', unitsUsed: 8 },
  { date: '2024-02-14', bloodType: 'AB+', unitsUsed: 5, event: 'Winter Storm' },
  { date: '2024-03-01', bloodType: 'O+', unitsUsed: 20 },
];
