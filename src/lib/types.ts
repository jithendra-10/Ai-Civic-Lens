export type Role = 'citizen' | 'authority';

export interface User {
  uid: string;
  email: string;
  fullName: string;
  role: Role;
  photoURL?: string;
  // Citizen-specific
  neighborhood?: string;
  communicationPreferences?: {
    emailOnStatusChange?: boolean;
  };
  // Authority-specific
  department?: string;
  jobTitle?: string;

  createdAt: string; // ISO string
}

export type Report = {
  id?: string;
  reportId?: string;
  userId: string;
  userFullName: string;
  role?: 'citizen' | 'authority'; // Added for feed UI
  imageUrl: string;
  imageHint: string;
  fingerprintKeywords?: string[];
  issueType: string;
  severity: 'Low' | 'Medium' | 'High';
  aiDescription: string;
  status: 'Submitted' | 'In Progress' | 'Resolved';
  authorityId?: string;
  resolvedImageUrl?: string;
  resolvedImageHint?: string;
  location: {
    lat: number;
    lng: number;
  };
  upvoteCount?: number;
  createdAt: string; // ISO string
};


export type DuplicateSubmission = {
  id?: string;
  userId: string;
  userFullName: string;
  originalReportId: string;
  createdAt: string; // ISO string
}

export interface IoTDevice {
  id: string;
  name: string;
  locationName: string;
  lat: number;
  lng: number;
  status: 'active' | 'maintenance' | 'offline';
  lastPing: string; // ISO string
}

export type IoTReport = {
  id: string;
  deviceId: string;
  deviceName: string;
  location: {
    lat: number;
    lng: number;
  };
  issueType: string;
  severity: 'Low' | 'Medium' | 'High';
  confidenceScore: number;
  imageUrl: string;
  aiDescription?: string;  // Gemini AI analysis result
  detectedAt: string; // ISO string
  status: 'Unresolved' | 'Resolved';
};

