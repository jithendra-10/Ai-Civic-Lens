import { IoTDevice, IoTReport } from './types';

// Mock IoT Devices
const DEVICES: IoTDevice[] = [
    {
        id: 'cam-001',
        name: 'Main St. Junction Camera',
        locationName: 'Main St & 4th Ave',
        lat: 17.385044,
        lng: 78.486671,
        status: 'active',
        lastPing: new Date().toISOString(),
    },
    {
        id: 'cam-002',
        name: 'Market Road East',
        locationName: 'City Market Entrance',
        lat: 17.387044,
        lng: 78.489671,
        status: 'active',
        lastPing: new Date().toISOString(),
    },
    {
        id: 'cam-003',
        name: 'Industrial Zone Monitor',
        locationName: 'Zone 5 Waste Audit',
        lat: 17.485044,
        lng: 78.386671,
        status: 'maintenance',
        lastPing: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: 'cam-004',
        name: 'Highway Exit 12',
        locationName: 'NH 44 Exit 12B',
        lat: 17.285044,
        lng: 78.586671,
        status: 'active',
        lastPing: new Date().toISOString(),
    },
    {
        id: 'cam-005',
        name: 'Tech Park Entrance',
        locationName: 'Cyber Towers Gate 1',
        lat: 17.45044,
        lng: 78.380671,
        status: 'active',
        lastPing: new Date().toISOString(),
    },
];

// Sample Issue Types and Images (reusing placeholders for demo)
const ISSUE_TYPES = ['Garbage Overflow', 'Pothole', 'Illegal Parking', 'Road Damage', 'Waterlogging'];
const SEVERITIES = ['Low', 'Medium', 'High'] as const;

// Helper to get random item
function getRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a random report for a device
export function generateMockIoTReport(device: IoTDevice): IoTReport {
    const isGoodCondition = Math.random() > 0.7; // 30% chance of issue

    // Use placeholder images. In a real app, these would be from storage.
    // Using generic placeholders for now.
    const imageUrl = `https://placehold.co/600x400?text=${encodeURIComponent(device.locationName + ' Feed')}`;

    return {
        id: `rep-${Math.random().toString(36).substr(2, 9)}`,
        deviceId: device.id,
        deviceName: device.name,
        location: { lat: device.lat, lng: device.lng },
        issueType: isGoodCondition ? 'No Issues' : getRandom(ISSUE_TYPES),
        severity: isGoodCondition ? 'Low' : getRandom(SEVERITIES),
        confidenceScore: 0.85 + Math.random() * 0.14, // 0.85 - 0.99
        imageUrl,
        detectedAt: new Date().toISOString(),
        status: 'Unresolved',
    };
}

export async function getMockIoTDevices(): Promise<IoTDevice[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return DEVICES;
}

export async function getMockIoTFeeds(): Promise<IoTReport[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return DEVICES.map(generateMockIoTReport);
}
