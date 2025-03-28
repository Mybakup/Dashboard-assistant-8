import React from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MedicalCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  specialties?: string[];
}

interface MedicalCenterMapProps {
  centers: MedicalCenter[];
  selectedCenter: string;
  onSelectCenter: (centerId: string) => void;
}

// Use environment variable for Mapbox token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is missing. Please check your .env file.');
}

export function MedicalCenterMap({ centers, selectedCenter, onSelectCenter }: MedicalCenterMapProps) {
  const [popupInfo, setPopupInfo] = React.useState<MedicalCenter | null>(null);

  // Center the map on Paris
  const [viewState, setViewState] = React.useState({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 12
  });

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">Map unavailable - Missing API token</p>
      </div>
    );
  }

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: 300 }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={MAPBOX_TOKEN}
      attributionControl={true}
      reuseMaps
    >
      <NavigationControl position="top-right" />
      
      {centers.map(center => (
        <Marker
          key={center.id}
          latitude={center.lat}
          longitude={center.lng}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            setPopupInfo(center);
            onSelectCenter(center.id);
          }}
        >
          <div 
            className={`cursor-pointer transition-transform hover:scale-110 ${
              selectedCenter === center.id ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            <MapPin className="h-8 w-8" />
          </div>
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          anchor="top"
          latitude={popupInfo.lat}
          longitude={popupInfo.lng}
          onClose={() => setPopupInfo(null)}
          closeButton={true}
          offset={40}
        >
          <div className="p-2">
            <h3 className="font-medium text-sm">{popupInfo.name}</h3>
            <p className="text-xs text-gray-600">{popupInfo.address}</p>
            {popupInfo.specialties && (
              <div className="mt-1 flex flex-wrap gap-1">
                {popupInfo.specialties.map(specialty => (
                  <span
                    key={specialty}
                    className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
}