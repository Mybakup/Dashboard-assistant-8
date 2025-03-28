import React, { useState } from 'react';
import { MapPin, Phone, Clock, Star, Users, Globe2, Filter, Search, Plus } from 'lucide-react';
import { PractitionerProfile } from './PractitionerProfile';

interface MedicalCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone?: string;
  specialties?: string[];
  openingHours?: string;
  rating?: number;
  availableSlots?: number;
  languages?: string[];
  practitioner?: {
    name: string;
    photo: string;
    title: string;
  };
}

interface MedicalCentersListProps {
  centers: MedicalCenter[];
  selectedCenter: string;
  onSelectCenter: (centerId: string) => void;
}

const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  ar: 'العربية',
  zh: '中文',
  ru: 'Русский'
};

const SPECIALTY_SUGGESTIONS = [
  'Médecine générale',
  'Cardiologie',
  'Pédiatrie',
  'Dermatologie',
  'Gynécologie',
  'ORL',
  'Radiologie',
  'Chirurgie',
  'Urgences'
];

const CITY_SUGGESTIONS = [
  'Paris',
  'Lyon',
  'Marseille',
  'Neuilly-sur-Seine',
  'Bordeaux',
  'Toulouse',
  'Nice',
  'Nantes',
  'Strasbourg',
  'Montpellier'
];

const MOCK_PRACTITIONERS = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&q=80',
    title: 'Cardiologue',
    distance: '1.2 km',
    languages: ['fr', 'en', 'zh'],
    experience: [
      '10+ years in Family Medicine',
      'Former Chief Resident at Hôpital Saint-Louis',
      'Research in Preventive Medicine',
      'International Medical Experience in China and UK'
    ],
    education: [
      {
        degree: 'MD from Paris Descartes University',
        institution: 'Université Paris Descartes',
        year: '2010'
      },
      {
        degree: 'Residency in Family Medicine',
        institution: 'Hôpital Saint-Louis',
        year: '2013'
      }
    ],
    fees: [
      { service: 'Consultation', price: 60 },
      { service: 'Annual Check-up', price: 120 },
      { service: 'ECG', price: 75 }
    ],
    paymentMethods: ['Credit Card', 'Cash', 'Health Insurance Card'],
    insurances: ['CPAM', 'MGEN', 'Harmonie Mutuelle'],
    officePhotos: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop&q=80',
    ],
    address: '15 Rue Saint-Michel, 75005 Paris',
    phone: '01 42 34 56 78'
  },
  {
    id: '2',
    name: 'Dr. Thomas Martin',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&q=80',
    title: 'Pédiatre',
    distance: '2.3 km',
    languages: ['fr', 'en'],
    experience: [
      '15 years in Pediatrics',
      'Head of Pediatrics at Clinique du Parc',
      'Specialized in Child Development'
    ],
    education: [
      {
        degree: 'MD Pediatrics',
        institution: 'Université Lyon 1',
        year: '2008'
      }
    ],
    fees: [
      { service: 'Consultation', price: 65 },
      { service: 'Child Development Check', price: 90 }
    ],
    paymentMethods: ['Credit Card', 'Cash'],
    insurances: ['CPAM', 'MGEN'],
    officePhotos: [
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&q=80'
    ],
    address: '23 Avenue du Parc, 75014 Paris',
    phone: '01 43 45 67 89'
  },
  {
    id: '3',
    name: 'Dr. Marie Laurent',
    photo: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&h=300&fit=crop&q=80',
    title: 'Chirurgien',
    distance: '3.1 km',
    languages: ['fr', 'en', 'es'],
    experience: [
      '20 years in Surgery',
      'Chief of Surgery at American Hospital of Paris'
    ],
    education: [
      {
        degree: 'MD Surgery',
        institution: 'Harvard Medical School',
        year: '2003'
      }
    ],
    fees: [
      { service: 'Consultation', price: 80 },
      { service: 'Surgery Consultation', price: 150 }
    ],
    paymentMethods: ['Credit Card', 'Insurance'],
    insurances: ['All Major Insurance'],
    officePhotos: [
      'https://images.unsplash.com/photo-1629909615957-be38d48fbbe4?w=800&h=600&fit=crop&q=80'
    ],
    address: '63 Boulevard Victor Hugo, 92200 Neuilly-sur-Seine',
    phone: '01 46 41 25 25'
  }
];

export function MedicalCentersList({ centers, selectedCenter, onSelectCenter }: MedicalCentersListProps) {
  const [selectedPractitioner, setSelectedPractitioner] = useState<string | null>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCity, setNewCity] = useState('');
  const [showSpecialtySuggestions, setShowSpecialtySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const filteredSpecialtySuggestions = SPECIALTY_SUGGESTIONS.filter(
    s => s.toLowerCase().includes(newSpecialty.toLowerCase()) && !selectedSpecialties.includes(s)
  );

  const filteredCitySuggestions = CITY_SUGGESTIONS.filter(
    c => c.toLowerCase().includes(newCity.toLowerCase()) && !selectedCities.includes(c)
  );

  const filteredCenters = centers.filter(center => {
    const matchesSpecialties = selectedSpecialties.length === 0 || 
      (center.specialties && center.specialties.some(s => 
        selectedSpecialties.some(selected => 
          selected.toLowerCase() === s.toLowerCase()
        )
      ));
    
    const matchesCity = selectedCities.length === 0 || 
      selectedCities.some(selected => 
        center.city.toLowerCase().includes(selected.toLowerCase())
      );

    return matchesSpecialties && matchesCity;
  });

  const handleAddSpecialty = (specialty: string = newSpecialty) => {
    if (specialty && !selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(prev => [...prev, specialty]);
      setNewSpecialty('');
      setShowSpecialtySuggestions(false);
    }
  };

  const handleAddCity = (city: string = newCity) => {
    if (city && !selectedCities.includes(city)) {
      setSelectedCities(prev => [...prev, city]);
      setNewCity('');
      setShowCitySuggestions(false);
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => prev.filter(s => s !== specialty));
  };

  const handleRemoveCity = (city: string) => {
    setSelectedCities(prev => prev.filter(c => c !== city));
  };

  return (
    <>
      <div className="space-y-4">
        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-900">Filtres</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{selectedSpecialties.length + selectedCities.length} sélectionné(s)</span>
              <span className="transform transition-transform duration-200" style={{
                transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>▼</span>
            </div>
          </button>

          {showFilters && (
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Spécialités</h4>
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={newSpecialty}
                        onChange={(e) => {
                          setNewSpecialty(e.target.value);
                          setShowSpecialtySuggestions(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSpecialty();
                          }
                        }}
                        placeholder="Ajouter une spécialité..."
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                      {showSpecialtySuggestions && filteredSpecialtySuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                          {filteredSpecialtySuggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleAddSpecialty(suggestion)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddSpecialty()}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSpecialties.map(specialty => (
                    <span
                      key={specialty}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200 flex items-center"
                    >
                      {specialty}
                      <button
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Villes</h4>
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={newCity}
                        onChange={(e) => {
                          setNewCity(e.target.value);
                          setShowCitySuggestions(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCity();
                          }
                        }}
                        placeholder="Ajouter une ville..."
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                      {showCitySuggestions && filteredCitySuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                          {filteredCitySuggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleAddCity(suggestion)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddCity()}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCities.map(city => (
                    <span
                      key={city}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200 flex items-center"
                    >
                      {city}
                      <button
                        onClick={() => handleRemoveCity(city)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Centers List */}
        {filteredCenters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun centre médical ne correspond à vos critères de recherche.
          </div>
        ) : (
          filteredCenters.map(center => {
            const practitioner = MOCK_PRACTITIONERS.find(p => p.id === center.id) || MOCK_PRACTITIONERS[0];
            
            return (
              <div
                key={center.id}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedCenter === center.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={practitioner.photo}
                      alt={practitioner.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPractitioner(center.id);
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <div 
                    className="flex-grow cursor-pointer"
                    onClick={() => onSelectCenter(center.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{center.name}</h3>
                        <p className="text-sm text-gray-600">{center.practitioner?.name}</p>
                        <p className="text-xs text-gray-500">{center.practitioner?.title}</p>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{center.address}</span>
                        </div>
                      </div>
                      {center.rating && (
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm font-medium">{center.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      {center.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{center.phone}</span>
                        </div>
                      )}
                      {center.openingHours && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{center.openingHours}</span>
                        </div>
                      )}
                    </div>

                    {center.languages && center.languages.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center mb-1">
                          <Globe2 className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-600">Langues parlées:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {center.languages.map(lang => (
                            <span
                              key={lang}
                              className="px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full"
                            >
                              {LANGUAGE_NAMES[lang]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {center.specialties && center.specialties.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {center.specialties.map(specialty => (
                            <span
                              key={specialty}
                              className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {center.availableSlots !== undefined && (
                      <div className="mt-3 flex items-center text-sm">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-gray-600">
                          {center.availableSlots} créneaux disponibles
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedPractitioner && (
        <PractitionerProfile
          practitioner={MOCK_PRACTITIONERS.find(p => p.id === selectedPractitioner) || MOCK_PRACTITIONERS[0]}
          onClose={() => setSelectedPractitioner(null)}
          onSchedule={() => {
            onSelectCenter(selectedPractitioner);
            setSelectedPractitioner(null);
          }}
        />
      )}
    </>
  );
}