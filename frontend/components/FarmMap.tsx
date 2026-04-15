'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import type { FarmProfile } from '@/lib/types';

// Fix Leaflet default icon issue in Next.js
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
const blueIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

interface Props {
  farms: FarmProfile[];
  userLocation: { lat: number; lng: number } | null;
}

export default function FarmMap({ farms, userLocation }: Props) {
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [18.5204, 73.8567];

  return (
    <MapContainer center={center as [number, number]} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
      />

      {/* User location */}
      {userLocation && (
        <>
          <Marker position={[userLocation.lat, userLocation.lng]} icon={blueIcon}>
            <Popup>You are here</Popup>
          </Marker>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={50000}
            pathOptions={{ color: '#3a7d44', fillColor: '#3a7d44', fillOpacity: 0.05 }}
          />
        </>
      )}

      {/* Farm markers */}
      {farms.map((farm) => (
        <Marker key={farm.id} position={[farm.latitude, farm.longitude]} icon={greenIcon}>
          <Popup>
            <div className="p-1 min-w-[160px]">
              <p className="font-bold text-green-900 text-sm">{farm.farm_name}</p>
              <p className="text-xs text-gray-500 mb-2">{farm.district} · ★ {farm.rating.toFixed(1)}</p>
              <Link
                href={`/farm/${farm.id}`}
                className="block text-center bg-green-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg"
              >
                View Farm
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
