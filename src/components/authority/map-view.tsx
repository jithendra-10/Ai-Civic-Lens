'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { IoTReport } from '@/lib/types';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapViewProps {
    reports: IoTReport[];
}

export default function MapView({ reports }: MapViewProps) {
    // Default center (Hyderabad)
    const center = [17.3850, 78.4867] as [number, number];

    // If reports exist, center on the first one
    const mapCenter = reports.length > 0
        ? [reports[0].location.lat, reports[0].location.lng] as [number, number]
        : center;

    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports.map((report) => (
                <Marker
                    key={report.id}
                    position={[report.location.lat, report.location.lng]}
                    icon={customIcon}
                >
                    <Popup>
                        <div className="p-1 min-w-[150px]">
                            <h3 className="font-bold text-sm tracking-tight">{report.deviceId}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${report.issueType === 'No Issues' ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-xs text-muted-foreground font-medium">{report.issueType}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">
                                {(new Date(report.detectedAt)).toLocaleString()}
                            </p>
                            {report.imageUrl && (
                                <img src={report.imageUrl} alt="Snapshot" className="mt-2 rounded-md w-full h-24 object-cover" />
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
