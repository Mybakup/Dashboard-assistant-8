import React, { useState } from 'react';
import { ChevronLeft, LayoutList, Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MedicalCentersList } from '../components/MedicalCentersList';
import { MedicalCenterMap } from '../components/MedicalCenterMap';

const MEDICAL_CENTERS = [
  {
    id: '1',
    name: 'Centre Médical Saint-Michel',
    address: '15 Rue Saint-Michel, 75005 Paris',
    city: 'Paris',
    lat: 48.8534,
    lng: 2.3488,
    phone: '01 42 34 56 78',
    specialties: ['Médecine générale', 'Cardiologie', 'Radiologie'],
    openingHours: '8h-19h',
    rating: 4.5,
    availableSlots: 8,
    languages: ['fr', 'en', 'ar'],
    practitioner: {
      name: 'Dr. Sarah Chen',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&q=80',
      title: 'Cardiologue'
    }
  },
  {
    id: '2',
    name: 'Clinique du Parc',
    address: '23 Avenue du Parc, 75014 Paris',
    city: 'Paris',
    lat: 48.8234,
    lng: 2.3278,
    phone: '01 43 45 67 89',
    specialties: ['Médecine générale', 'Pédiatrie', 'Dermatologie'],
    openingHours: '9h-20h',
    rating: 4.2,
    availableSlots: 5,
    languages: ['fr', 'en', 'es'],
    practitioner: {
      name: 'Dr. Thomas Martin',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&q=80',
      title: 'Pédiatre'
    }
  },
  {
    id: '3',
    name: 'Hôpital Américain de Paris',
    address: '63 Boulevard Victor Hugo, 92200 Neuilly-sur-Seine',
    city: 'Neuilly-sur-Seine',
    lat: 48.8847,
    lng: 2.2719,
    phone: '01 46 41 25 25',
    specialties: ['Médecine générale', 'Chirurgie', 'Urgences'],
    openingHours: '24h/24',
    rating: 4.8,
    availableSlots: 12,
    languages: ['fr', 'en', 'es', 'zh'],
    practitioner: {
      name: 'Dr. Marie Laurent',
      photo: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&h=300&fit=crop&q=80',
      title: 'Chirurgien'
    }
  },
  {
    id: '4',
    name: 'Centre Médical Europe',
    address: '44 Rue d\'Amsterdam, 75009 Paris',
    city: 'Paris',
    lat: 48.8789,
    lng: 2.3278,
    phone: '01 48 78 90 12',
    specialties: ['Médecine générale', 'Gynécologie', 'ORL'],
    openingHours: '8h30-19h30',
    rating: 4.4,
    availableSlots: 3,
    languages: ['fr', 'ru', 'en'],
    practitioner: {
      name: 'Dr. Alexandre Dubois',
      photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&q=80',
      title: 'ORL'
    }
  },
  {
    id: '5',
    name: 'Cabinet Médical Montmartre',
    address: '12 Rue des Abbesses, 75018 Paris',
    city: 'Paris',
    lat: 48.8845,
    lng: 2.3370,
    phone: '01 42 23 45 67',
    specialties: ['Médecine générale', 'Dermatologie', 'Allergologie'],
    openingHours: '9h-18h',
    rating: 4.6,
    availableSlots: 4,
    languages: ['fr', 'en', 'de'],
    practitioner: {
      name: 'Dr. Emma Bernard',
      photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&q=80',
      title: 'Dermatologue'
    }
  },
  {
    id: '6',
    name: 'Centre de Santé Bastille',
    address: '28 Boulevard Richard Lenoir, 75011 Paris',
    city: 'Paris',
    lat: 48.8578,
    lng: 2.3716,
    phone: '01 43 56 78 90',
    specialties: ['Médecine générale', 'Rhumatologie', 'Kinésithérapie'],
    openingHours: '8h-20h',
    rating: 4.3,
    availableSlots: 6,
    languages: ['fr', 'en', 'pt'],
    practitioner: {
      name: 'Dr. Lucas Silva',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&q=80',
      title: 'Rhumatologue'
    }
  },
  {
    id: '7',
    name: 'Clinique des Champs-Élysées',
    address: '45 Avenue Montaigne, 75008 Paris',
    city: 'Paris',
    lat: 48.8666,
    lng: 2.3064,
    phone: '01 40 12 34 56',
    specialties: ['Médecine esthétique', 'Dermatologie', 'Chirurgie plastique'],
    openingHours: '9h-19h',
    rating: 4.7,
    availableSlots: 2,
    languages: ['fr', 'en', 'ar', 'ru'],
    practitioner: {
      name: 'Dr. Sofia Patel',
      photo: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=300&h=300&fit=crop&q=80',
      title: 'Chirurgien esthétique'
    }
  },
  {
    id: '8',
    name: 'Centre Médical Nation',
    address: '15 Avenue du Trône, 75012 Paris',
    city: 'Paris',
    lat: 48.8484,
    lng: 2.3956,
    phone: '01 44 55 66 77',
    specialties: ['Médecine générale', 'Endocrinologie', 'Diabétologie'],
    openingHours: '8h30-18h30',
    rating: 4.4,
    availableSlots: 7,
    languages: ['fr', 'en', 'hi'],
    practitioner: {
      name: 'Dr. Raj Kumar',
      photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&q=80',
      title: 'Endocrinologue'
    }
  }
];

export function PractitionerSearch() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedCenter, setSelectedCenter] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Retour</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Recherche de praticiens</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md ${
                  viewMode === 'map'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List View */}
          <div className={viewMode === 'map' ? 'hidden lg:block' : 'block'}>
            <MedicalCentersList
              centers={MEDICAL_CENTERS}
              selectedCenter={selectedCenter}
              onSelectCenter={setSelectedCenter}
            />
          </div>

          {/* Map View */}
          <div 
            className={`${
              viewMode === 'list' ? 'hidden lg:block' : 'block'
            } h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] rounded-lg overflow-hidden`}
          >
            <MedicalCenterMap
              centers={MEDICAL_CENTERS}
              selectedCenter={selectedCenter}
              onSelectCenter={setSelectedCenter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}