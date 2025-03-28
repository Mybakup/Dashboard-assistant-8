export type UserRole = 'assistant' | 'manager' | 'admin';

export type RequestStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type WorkflowStage = 
  | 'initial_contact'
  | 'appointment_request'
  | 'appointment_scheduled'
  | 'appointment_completed'
  | 'report_available'
  | 'closed';

export type AppointmentType = 'teleconsultation' | 'in_person';
export type AppointmentResponseStatus = 'pending' | 'accepted' | 'declined' | 'alternative_proposed';

export interface MedicalReport {
  id: string;
  doctorName: string;
  createdAt: string;
  status: 'pending' | 'available' | 'archived';
  isConfidential: boolean;
  format: 'pdf' | 'doc' | 'docx';
  size: string;
  paymentStatus?: 'pending' | 'paid';
  paymentAmount?: number;
  paymentDate?: string;
}

export interface MapUsageMetrics {
  requestId: string;
  agentId: string;
  timestamp: string;
  duration: number;
  searchCount: number;
}

export interface AppointmentMetrics {
  totalAppointments: number;
  completedAppointments: number;
  pendingReports: number;
  completedReports: number;
  averageReportTime: number;
}

export interface DoctorPayment {
  doctorId: string;
  doctorName: string;
  reportsSubmitted: number;
  pendingPayment: number;
  lastPaymentDate: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: string;
  department?: string;
  phoneNumber?: string;
  isActive: boolean;
}

export interface MedicalRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  status: RequestStatus;
  urgencyLevel: UrgencyLevel;
  symptoms: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  workflowStage: WorkflowStage;
  appointmentDate?: string;
  appointmentType?: AppointmentType;
  appointmentLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
  appointmentResponse?: {
    status: AppointmentResponseStatus;
    respondedAt: string | null;
    proposedDate: string | null;
    message: string | null;
  };
  medicalReport?: MedicalReport;
  notes: Note[];
  actions: RequestAction[];
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface RequestAction {
  id: string;
  type: 'status_change' | 'assignment' | 'note_added' | 'contact_attempt' | 'workflow_change';
  description: string;
  createdAt: string;
  createdBy: string;
  metadata?: Record<string, any>;
}