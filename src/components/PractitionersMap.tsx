import React from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import { MapPin, Phone, Clock, Star } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Practitioner {
  id: string;
  name: string;
  title: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  phone: string;
  rating: number;
  photo: string;
  availableSlots?: number;
}

interface PractitionersMapProps {
  practitioners: Practitioner[];
}

// Mock data for practitioners
const MOCK_PRACTITIONERS: Practitioner[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Médecin généraliste',
    location: {
      address: '15 Rue Saint-Michel, 75005 Paris',
      lat: 48.8534,
      lng: 2.3488
    },
    phone: '01 42 34 56 78',
    rating: 4.8,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    availableSlots: 5
  },
  {
    id: '2',
    name: 'Dr. Jean Martin',
    title: 'Cardiologue',
    location: {
      address: '23 Avenue du Parc, 75014 Paris',
      lat: 48.8234,
      lng: 2.3278
    },
    phone: '01 43 45 67 89',
    rating: 4.5,
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    availableSlots: 3
  },
  {
    id: '3',
    name: 'Dr. Marie Dubois',
    title: 'Pédiatre',
    location: {
      address: '8 Rue de la République, 69001 Lyon',
      lat: 45.7640,
      lng: 4.8357
    },
    phone: '04 72 34 56 78',
    rating: 4.9,
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    availableSlots: 2
  }
];

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export function PractitionersMap({ practitioners = MOCK_PRACTITIONERS }: PractitionersMapProps) {
  const [popupInfo, setPopupInfo] = React.useState<Practitioner | null>(null);

  // Center the map on France
  const [viewState, setViewState] = React.useState({
    latitude: 46.603354,
    longitude: 1.888334,
    zoom: 5
  });

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">Map unavailable - Missing API token</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] rounded-lg overflow-hidden">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={true}
      >
        <NavigationControl position="top-right" />
        
        {practitioners.map(practitioner => (
          <Marker
            key={practitioner.id}
            latitude={practitioner.location.lat}
            longitude={practitioner.location.lng}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(practitioner);
            }}
          >
            <div className="cursor-pointer transition-transform hover:scale-110">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            latitude={popupInfo.location.lat}
            longitude={popupInfo.location.lng}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            offset={40}
          >
            <div className="p-2 min-w-[200px]">
              <div className="flex items-center space-x-3">
                <img
                  src={popupInfo.photo}
                  alt={popupInfo.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{popupInfo.name}</h3>
                  <p className="text-sm text-gray-600">{popupInfo.title}</p>
                </div>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{popupInfo.location.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{popupInfo.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1">{popupInfo.rating}</span>
                  </div>
                  {popupInfo.availableSlots !== undefined && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{popupInfo.availableSlots} créneaux</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}