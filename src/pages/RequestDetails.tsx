import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Clock,
  Phone,
  MapPin,
  User,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Send,
  CalendarCheck,
  FileText,
  PhoneCall,
  Calendar,
  ClipboardCheck,
  LockKeyhole,
  AlertTriangle,
  Info,
  Video,
  MapPinned,
  Building2,
  LayoutList,
  Map as MapIcon,
  Globe2,
  Timer,
  CheckCircle2,
  XCircle as XCircle2,
  CalendarX,
  Download,
  Eye,
  Lock,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { MedicalCenterMap } from '../components/MedicalCenterMap';
import { MedicalCentersList } from '../components/MedicalCentersList';
import type { MedicalRequest, RequestStatus, Note, WorkflowStage, AppointmentType } from '../types';

// Mock data - replace with actual data fetching
const MOCK_REQUEST: MedicalRequest = {
  id: 'MED-2024-001',
  patientName: 'Marie Dubois',
  patientPhone: '+33612345678',
  status: 'in_progress',
  urgencyLevel: 'high',
  symptoms: 'Severe chest pain and difficulty breathing',
  location: 'Paris, 75001',
  createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  assignedTo: '1',
  workflowStage: 'initial_contact',
  medicalReport: {
    id: 'REPORT-001',
    doctorName: 'Dr. Sarah Chen',
    createdAt: new Date().toISOString(),
    status: 'available',
    isConfidential: true,
    format: 'pdf',
    size: '2.4 MB'
  },
  notes: [
    {
      id: '1',
      content: 'Patient contacted, ambulance dispatched',
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      createdBy: 'Jean Dupont'
    }
  ],
  actions: [
    {
      id: '1',
      type: 'workflow_change',
      description: 'Initial contact established with patient',
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      createdBy: 'Jean Dupont'
    }
  ]
};

const LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'ru', name: 'Русский' }
];

// Mock medical centers data
const MEDICAL_CENTERS = [
  {
    id: '1',
    name: 'Centre Médical Saint-Michel',
    address: '15 Rue Saint-Michel, 75005 Paris',
    lat: 48.8534,
    lng: 2.3488,
    phone: '01 42 34 56 78',
    specialties: ['Médecine générale', 'Cardiologie', 'Radiologie'],
    openingHours: '8h-19h',
    rating: 4.5,
    availableSlots: 8,
    languages: ['fr', 'en', 'ar']
  },
  {
    id: '2',
    name: 'Clinique du Parc',
    address: '23 Avenue du Parc, 75014 Paris',
    lat: 48.8234,
    lng: 2.3278,
    phone: '01 43 45 67 89',
    specialties: ['Médecine générale', 'Pédiatrie', 'Dermatologie'],
    openingHours: '9h-20h',
    rating: 4.2,
    availableSlots: 5,
    languages: ['fr', 'en', 'es']
  },
  {
    id: '3',
    name: 'Hôpital Américain de Paris',
    address: '63 Boulevard Victor Hugo, 92200 Neuilly-sur-Seine',
    lat: 48.8847,
    lng: 2.2719,
    phone: '01 46 41 25 25',
    specialties: ['Médecine générale', 'Chirurgie', 'Urgences'],
    openingHours: '24h/24',
    rating: 4.8,
    availableSlots: 12,
    languages: ['fr', 'en', 'es', 'zh']
  },
  {
    id: '4',
    name: 'Centre Médical Europe',
    address: '44 Rue d\'Amsterdam, 75009 Paris',
    lat: 48.8789,
    lng: 2.3278,
    phone: '01 48 78 90 12',
    specialties: ['Médecine générale', 'Gynécologie', 'ORL'],
    openingHours: '8h30-19h30',
    rating: 4.4,
    availableSlots: 3,
    languages: ['fr', 'ru', 'en']
  }
];

const WORKFLOW_STAGES: { stage: WorkflowStage; label: string; icon: React.ReactNode }[] = [
  { stage: 'initial_contact', label: 'Premier contact', icon: <PhoneCall className="h-5 w-5" /> },
  { stage: 'appointment_request', label: 'Demande de rendez-vous', icon: <Calendar className="h-5 w-5" /> },
  { stage: 'appointment_scheduled', label: 'Rendez-vous programmé', icon: <CalendarCheck className="h-5 w-5" /> },
  { stage: 'appointment_completed', label: 'Rendez-vous effectué', icon: <CheckCircle className="h-5 w-5" /> },
  { stage: 'report_available', label: 'Compte rendu disponible', icon: <FileText className="h-5 w-5" /> },
  { stage: 'closed', label: 'Clôturé', icon: <LockKeyhole className="h-5 w-5" /> }
];

export function RequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [newNote, setNewNote] = useState('');
  const [request, setRequest] = useState<MedicalRequest>(MOCK_REQUEST);
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('in_person');
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedStage, setSelectedStage] = useState<WorkflowStage | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showReportConfirmation, setShowReportConfirmation] = useState(false);
  const [isExpandedView, setIsExpandedView] = useState(false);

  const handleDownloadReport = () => {
    if (request.medicalReport?.isConfidential) {
      setShowReportConfirmation(true);
      return;
    }
    // Simulation du téléchargement
    console.log('Téléchargement du rapport médical...');
  };

  const handleConfirmDownload = () => {
    setShowReportConfirmation(false);
    // Simulation du téléchargement
    console.log('Téléchargement du rapport médical confidentiel...');
  };

  const handleViewReport = () => {
    // Simulation de l'affichage du rapport
    console.log('Affichage du rapport médical...');
  };

  const getStatusColor = (status: RequestStatus) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getUrgencyColor = (level: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || colors.medium;
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(dateString));
  };

  const handleStatusChange = (newStatus: RequestStatus) => {
    setRequest(prev => ({
      ...prev,
      status: newStatus,
      actions: [
        {
          id: Date.now().toString(),
          type: 'status_change',
          description: `Status changed to ${newStatus}`,
          createdAt: new Date().toISOString(),
          createdBy: user?.firstName || 'Unknown'
        },
        ...prev.actions
      ]
    }));
  };

  const handleStageClick = (stage: WorkflowStage) => {
    setSelectedStage(stage);
    setShowConfirmation(true);
  };

  const handleWorkflowChange = (newStage: WorkflowStage) => {
    setRequest(prev => ({
      ...prev,
      workflowStage: newStage,
      actions: [
        {
          id: Date.now().toString(),
          type: 'workflow_change',
          description: `Workflow stage changed to: ${WORKFLOW_STAGES.find(s => s.stage === newStage)?.label}`,
          createdAt: new Date().toISOString(),
          createdBy: user?.firstName || 'Unknown'
        },
        ...prev.actions
      ]
    }));
    setShowConfirmation(false);
    setSelectedStage(null);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const noteId = Date.now().toString();
    setRequest(prev => ({
      ...prev,
      notes: [
        {
          id: noteId,
          content: newNote,
          createdAt: new Date().toISOString(),
          createdBy: user?.firstName || 'Unknown'
        },
        ...prev.notes
      ],
      actions: [
        {
          id: `action-${noteId}`,
          type: 'note_added',
          description: 'New note added',
          createdAt: new Date().toISOString(),
          createdBy: user?.firstName || 'Unknown'
        },
        ...prev.actions
      ]
    }));
    setNewNote('');
  };

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentDate) return;
    
    let appointmentLocation;
    if (appointmentType === 'in_person' && selectedCenter) {
      const center = MEDICAL_CENTERS.find(c => c.id === selectedCenter);
      if (center) {
        appointmentLocation = {
          address: center.address,
          lat: center.lat,
          lng: center.lng
        };
      }
    }

    const actionId = Date.now().toString();
    setRequest(prev => ({
      ...prev,
      appointmentDate,
      appointmentType,
      appointmentLocation,
      actions: [
        {
          id: `appointment-${actionId}`,
          type: 'workflow_change',
          description: `${appointmentType === 'teleconsultation' ? 'Téléconsultation' : 'Consultation'} programmée pour le ${new Date(appointmentDate).toLocaleDateString('fr-FR')}${appointmentLocation ? ` à ${appointmentLocation.address}` : ''}`,
          createdAt: new Date().toISOString(),
          createdBy: user?.firstName || 'Unknown',
          metadata: { appointmentDate, appointmentType, appointmentLocation }
        },
        ...prev.actions
      ]
    }));
    handleWorkflowChange('appointment_scheduled');
    setAppointmentDate('');
    setSelectedCenter('');
  };

  const handleLanguageToggle = (langCode: string) => {
    setSelectedLanguages(prev => 
      prev.includes(langCode)
        ? prev.filter(code => code !== langCode)
        : [...prev, langCode]
    );
  };

  const handleExpandView = () => {
    setIsExpandedView(!isExpandedView);
    setViewMode('map');
  };

  const filteredCenters = MEDICAL_CENTERS.filter(center => 
    selectedLanguages.length === 0 || 
    selectedLanguages.every(lang => center.languages.includes(lang))
  );

  return (
    <div className="space-y-6">
      {showConfirmation && selectedStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium">Confirmer le changement</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir passer à l'étape "{WORKFLOW_STAGES.find(s => s.stage === selectedStage)?.label}" ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedStage(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={() => handleWorkflowChange(selectedStage)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium">Document confidentiel</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Ce compte rendu médical est marqué comme confidentiel. En le téléchargeant, vous vous engagez à respecter la confidentialité des informations qu'il contient.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReportConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDownload}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Confirmer le téléchargement
              </button>
            </div>
          </div>
        </div>
      )}

      {isExpandedView && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="h-full flex">
            {/* Left side - Centers List */}
            <div className="w-1/2 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsExpandedView(false)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span>Retour</span>
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">Recherche de praticiens</h2>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Globe2 className="h-4 w-4 mr-1" />
                    Langues parlées
                  </div>
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageToggle(lang.code)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedLanguages.includes(lang.code)
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } border`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-y-auto">
                <MedicalCentersList
                  centers={filteredCenters}
                  selectedCenter={selectedCenter}
                  onSelectCenter={setSelectedCenter}
                />
              </div>
            </div>

            {/* Right side - Map */}
            <div className="w-1/2 relative">
              <MedicalCenterMap
                centers={filteredCenters}
                selectedCenter={selectedCenter}
                onSelectCenter={setSelectedCenter}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Retour</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Dossier #{request.id}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
          {request.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Patient</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{request.patientName}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 mt-2">
                  <Phone className="h-5 w-5" />
                  <span>{request.patientPhone}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{request.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 mt-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                    {request.urgencyLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Symptômes</h4>
              <p className="text-gray-600">{request.symptoms}</p>
            </div>
          </div>

          {/* Workflow Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Progression du dossier</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Info className="h-4 w-4 mr-1" />
                <span>Cliquez sur une étape pour changer le statut</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200"></div>
              <div className="relative flex justify-between">
                {WORKFLOW_STAGES.map(({ stage, label, icon }, index) => {
                  const currentIndex = WORKFLOW_STAGES.findIndex(s => s.stage === request.workflowStage);
                  const isCompleted = currentIndex >= index;
                  const isCurrent = request.workflowStage === stage;

                  return (
                    <div
                      key={`workflow-${stage}`}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => handleStageClick(stage)}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center relative bg-white border-2 transition-all duration-200 ${
                          isCompleted
                            ? 'border-green-500 text-green-500'
                            : 'border-gray-300 text-gray-400'
                        } ${isCurrent ? 'ring-2 ring-green-500 ring-offset-2' : ''} hover:border-blue-500 hover:text-blue-500 hover:scale-110`}
                      >
                        {icon}
                      </div>
                      <div className="mt-2 text-xs text-center w-20">{label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
            <form onSubmit={handleAddNote} className="mb-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ajouter une note..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
            <div className="space-y-4">
              {request.notes.map((note) => (
                <div key={`note-${note.id}`} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-600">{note.content}</p>
                    <span className="text-sm text-gray-500">{formatTime(note.createdAt)}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Par {note.createdBy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
            <div className="space-y-4">
              {request.workflowStage === 'appointment_request' && (
                <form onSubmit={handleScheduleAppointment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de consultation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAppointmentType('teleconsultation')}
                        className={`flex items-center justify-center px-4 py-2 rounded-md ${
                          appointmentType === 'teleconsultation'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-white text-gray-700 border-gray-200'
                        } border`}
                      >
                        <Video className="w-5 h-5 mr-2" />
                        Téléconsultation
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppointmentType('in_person')}
                        className={`flex items-center justify-center px-4 py-2 rounded-md ${
                          appointmentType === 'in_person'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-white text-gray-700 border-gray-200'
                        } border`}
                      >
                        <Building2 className="w-5 h-5 mr-2" />
                        En cabinet
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date et heure
                    </label>
                    <input
                      type="datetime-local"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {appointmentType === 'in_person' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Centre médical
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
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
                            type="button"
                            onClick={() => setViewMode('map')}
                            className={`p-2 rounded-md ${
                              viewMode === 'map'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <MapIcon className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleExpandView}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                          >
                            {isExpandedView ? (
                              <Minimize2 className="w-5 h-5" />
                            ) : (
                              <Maximize2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Globe2 className="h-4 w-4 mr-1" />
                            Langues parlées
                          </div>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map(lang => (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => handleLanguageToggle(lang.code)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                selectedLanguages.includes(lang.code)
                                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              } border`}
                            >
                              {lang.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {viewMode === 'list' ? (
                        <div className="mb-4 max-h-[400px] overflow-y-auto">
                          <MedicalCentersList
                            centers={filteredCenters}
                            selectedCenter={selectedCenter}
                            onSelectCenter={setSelectedCenter}
                          />
                        </div>
                      ) : (
                        <div className="mb-4">
                          <MedicalCenterMap
                            centers={filteredCenters}
                            selectedCenter={selectedCenter}
                            onSelectCenter={setSelectedCenter}
                          />
                        </div>
                      )}

                      {selectedCenter && (
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinned className="h-4 w-4 mr-1" />
                            <span>
                              {MEDICAL_CENTERS.find(c => c.id === selectedCenter)?.address}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <CalendarCheck className="h-5 w-5 mr-2" />
                    Confirmer le rendez-vous
                  </button>
                </form>
              )}

              {request.workflowStage === 'report_available' && (
                <div className="space-y-4">
                  <button
                    onClick={handleDownloadReport}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Télécharger le compte rendu
                  </button>
                  <button
                    onClick={handleViewReport}
                    className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Visualiser le compte rendu
                  </button>
                </div>
              )}

              <button
                onClick={() => handleStatusChange('completed')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Marquer comme terminé
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Annuler la demande
              </button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Historique</h3>
            <div className="space-y-4">
              {request.actions.map((action) => (
                <div key={`action-${action.id}`} className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <div className="mt-1 text-xs text-gray-500">
                      {formatTime(action.createdAt)} par {action.createdBy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}