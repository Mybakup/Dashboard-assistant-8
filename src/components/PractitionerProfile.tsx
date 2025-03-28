import React from 'react';
import { 
  MapPin, 
  Globe2, 
  GraduationCap, 
  Stethoscope, 
  Clock, 
  CreditCard, 
  Shield, 
  Phone,
  ChevronLeft,
  X
} from 'lucide-react';

interface Practitioner {
  id: string;
  name: string;
  title: string;
  photo: string;
  distance: string;
  languages: string[];
  experience: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  fees: {
    service: string;
    price: number;
  }[];
  paymentMethods: string[];
  insurances: string[];
  officePhotos: string[];
  openingHours: {
    day: string;
    hours: string;
  }[];
  address: string;
  phone: string;
}

interface PractitionerProfileProps {
  practitioner: Practitioner;
  onClose: () => void;
  onSchedule: () => void;
}

const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  ar: 'العربية',
  zh: 'Mandarin',
  ru: 'Русский'
};

export function PractitionerProfile({ practitioner, onClose, onSchedule }: PractitionerProfileProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto">
      <div className="bg-[#F8F9FF] w-full max-w-2xl min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white shadow-sm z-10">
          <div className="flex items-center p-4">
            <button onClick={onClose} className="flex items-center text-gray-600">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Retour
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-8">
          {/* Basic Info */}
          <div className="flex flex-col items-center text-center">
            <img
              src={practitioner.photo}
              alt={practitioner.name}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h1 className="text-2xl font-semibold text-gray-900">{practitioner.name}</h1>
            <p className="text-gray-600 mb-2">{practitioner.title}</p>
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{practitioner.distance}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onSchedule}
              className="py-3 px-4 bg-[#4F46E5] text-white rounded-lg font-medium hover:bg-[#4338CA] transition-colors"
            >
              Demander un rendez-vous
            </button>
            <button
              onClick={() => window.location.href = `tel:${practitioner.phone}`}
              className="py-3 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Appeler ce praticien
            </button>
          </div>

          {/* Languages */}
          <div>
            <div className="flex items-center mb-4">
              <Globe2 className="h-5 w-5 text-[#F97316] mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Langues parlées</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {practitioner.languages.map(lang => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700"
                >
                  {LANGUAGE_NAMES[lang]}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center mb-4">
              <Stethoscope className="h-5 w-5 text-[#F97316] mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Expérience</h2>
            </div>
            <div className="bg-white rounded-lg p-4 space-y-2">
              {practitioner.experience.map((exp, index) => (
                <p key={index} className="text-gray-600">{exp}</p>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center mb-4">
              <GraduationCap className="h-5 w-5 text-[#F97316] mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Formation</h2>
            </div>
            <div className="bg-white rounded-lg p-4 space-y-4">
              {practitioner.education.map((edu, index) => (
                <div key={index}>
                  <p className="font-medium text-gray-900">{edu.degree}</p>
                  <p className="text-gray-600">{edu.institution}, {edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fees */}
          <div>
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-[#F97316] mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Tarifs</h2>
            </div>
            <div className="bg-white rounded-lg p-4">
              {practitioner.fees.map((fee, index) => (
                <div key={index} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-gray-600">{fee.service}</span>
                  <span className="font-medium text-gray-900">€{fee.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Moyens de paiement</h2>
            <div className="flex flex-wrap gap-2">
              {practitioner.paymentMethods.map((method, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* Insurance */}
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-[#F97316] mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Assurances acceptées</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {practitioner.insurances.map((insurance, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700"
                >
                  {insurance}
                </span>
              ))}
            </div>
          </div>

          {/* Office Photos */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Photos du cabinet</h2>
            <div className="grid grid-cols-1 gap-4">
              {practitioner.officePhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt="Cabinet médical"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-[#F97316] mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Horaires d'ouverture</h2>
            </div>
            <div className="bg-white rounded-lg p-4">
              {practitioner.openingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-gray-600">{schedule.day}</span>
                  <span className="font-medium text-gray-900">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}