// Type definitions for the OIR Dashboard application

// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  position: Position;
  role: Role;
  isActive: boolean;
  lastLogin: string;
}

export interface Position {
  id: number;
  positionCode: string;
  positionName: string;
  salaryGrade: string;
  description?: string;
}

export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  permissionName: string;
  description?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Organization Types
export interface Organization {
  id: string;
  registrationNumber: string;
  organizationName: string;
  organizationType: OrganizationType;
  registrationDate: string;
  expiryDate?: string;
  status: 'active' | 'suspended' | 'deregistered';
  address?: string;
  district?: District;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  membershipCount?: number;
  isCompliant: boolean;
  lastComplianceCheck?: string;
  officials: OrganizationOfficial[];
  constitutions: OrganizationConstitution[];
}

export interface OrganizationType {
  id: number;
  typeName: string;
  description?: string;
}

export interface Region {
  id: number;
  regionName: string;
}

export interface District {
  id: number;
  districtName: string;
  region: Region;
}

export interface OrganizationOfficial {
  id: string;
  position: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface OrganizationConstitution {
  id: string;
  versionNumber: number;
  effectiveDate: string;
  approvalDate?: string;
  approvedBy?: User;
  documentPath?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  notes?: string;
}

// Agreement Types
export interface Agreement {
  id: string;
  agreementNumber: string;
  agreementName: string;
  agreementType: AgreementType;
  primaryOrganization: Organization;
  counterpartyName?: string;
  counterpartyOrganization?: Organization;
  effectiveDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'terminated' | 'in_negotiation';
  documentPath?: string;
  notes?: string;
  amendments: AgreementAmendment[];
}

export interface AgreementType {
  id: number;
  typeName: string;
  description?: string;
}

export interface AgreementAmendment {
  id: string;
  amendmentNumber: string;
  amendmentDate: string;
  description?: string;
  documentPath?: string;
}

// Dispute Types
export interface Dispute {
  id: string;
  disputeNumber: string;
  disputeType: DisputeType;
  agreement?: Agreement;
  organization: Organization;
  counterparty?: Organization;
  filingDate: string;
  resolutionDate?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'escalated';
  resolutionSummary?: string;
  documentPath?: string;
}

export interface DisputeType {
  id: number;
  typeName: string;
  description?: string;
}

// Ballot Types
export interface BallotElection {
  id: string;
  electionNumber: string;
  organization: Organization;
  electionDate: string;
  purpose: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  supervisor?: User;
  location?: string;
  notes?: string;
  positions: BallotPosition[];
}

export interface BallotPosition {
  id: string;
  positionName: string;
  description?: string;
  candidates: BallotCandidate[];
  results: BallotResult[];
}

export interface BallotCandidate {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
}

export interface BallotResult {
  id: string;
  candidate: BallotCandidate;
  votesReceived: number;
  isElected: boolean;
}

// Training Types
export interface TrainingWorkshop {
  id: string;
  workshopName: string;
  trainingType: TrainingType;
  startDate: string;
  endDate: string;
  location?: string;
  facilitator?: string;
  maxParticipants?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  description?: string;
  materialsPath?: string;
  participants: WorkshopParticipant[];
}

export interface TrainingType {
  id: number;
  typeName: string;
  description?: string;
}

export interface WorkshopParticipant {
  id: string;
  organization?: Organization;
  official?: OrganizationOfficial;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  attendanceStatus: 'registered' | 'attended' | 'absent' | 'partial';
  certificateIssued: boolean;
  notes?: string;
}

// Compliance Types
export interface ComplianceRequirement {
  id: number;
  requirementName: string;
  description?: string;
  legalReference?: string;
  frequency?: 'annual' | 'quarterly' | 'monthly' | 'one-time';
}

export interface ComplianceRecord {
  id: string;
  organization: Organization;
  requirement: ComplianceRequirement;
  dueDate: string;
  submissionDate?: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'overdue';
  approvedBy?: User;
  documentPath?: string;
  notes?: string;
}

export interface Inspection {
  id: string;
  organization: Organization;
  inspectionDate: string;
  inspector: User;
  inspectionType: string;
  findings?: string;
  recommendations?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'follow-up-required';
  documentPath?: string;
  nonComplianceIssues: NonComplianceIssue[];
}

export interface NonComplianceIssue {
  id: string;
  issueDate: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  resolutionDeadline?: string;
  resolutionDate?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
}

// Document Types
export interface DocumentType {
  id: number;
  typeName: string;
  description?: string;
}

export interface Document {
  id: string;
  documentNumber: string;
  documentName: string;
  documentType: DocumentType;
  organization?: Organization;
  agreement?: Agreement;
  election?: BallotElection;
  workshop?: TrainingWorkshop;
  filePath: string;
  fileSize?: number;
  fileType?: string;
  uploadDate: string;
  uploadedBy: User;
  isPublic: boolean;
  description?: string;
}

// Notification Types
export interface Notification {
  id: string;
  notificationType: string;
  title: string;
  message: string;
  relatedEntityType?: 'organization' | 'agreement' | 'compliance' | 'ballot' | 'training';
  relatedEntityId?: string;
  isRead: boolean;
  isUrgent: boolean;
  createdAt: string;
  expiryDate?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  pendingRegistrations: number;
  nonCompliantOrganizations: number;
  activeAgreements: number;
  expiringAgreements: number;
  upcomingBallots: number;
  upcomingTrainings: number;
  openDisputes: number;
}

export interface OrganizationCompliance {
  organizationId: string;
  registrationNumber: string;
  organizationName: string;
  organizationStatus: string;
  isCompliant: boolean;
  totalRequirements: number;
  metRequirements: number;
  overdueRequirements: number;
}

export interface UpcomingAgreementRenewal {
  agreementId: string;
  agreementNumber: string;
  agreementName: string;
  primaryOrganization: string;
  counterpartyName?: string;
  effectiveDate: string;
  expiryDate: string;
  status: string;
  daysUntilExpiry: number;
}

export interface UpcomingBallot {
  electionId: string;
  electionNumber: string;
  organizationName: string;
  electionDate: string;
  purpose: string;
  status: string;
  supervisorName?: string;
  positionsCount: number;
  candidatesCount: number;
}

export interface UpcomingTraining {
  workshopId: string;
  workshopName: string;
  trainingType: string;
  startDate: string;
  endDate: string;
  location?: string;
  facilitator?: string;
  maxParticipants?: number;
  registeredParticipants: number;
  status: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and Query Types
export interface OrganizationFilter {
  search?: string;
  status?: string;
  type?: number;
  district?: number;
  region?: number;
  isCompliant?: boolean;
  page?: number;
  pageSize?: number;
}

export interface AgreementFilter {
  search?: string;
  status?: string;
  type?: number;
  organization?: string;
  expiringBefore?: string;
  expiringAfter?: string;
  page?: number;
  pageSize?: number;
}

export interface BallotFilter {
  search?: string;
  status?: string;
  organization?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface TrainingFilter {
  search?: string;
  status?: string;
  type?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface ComplianceFilter {
  search?: string;
  status?: string;
  organization?: string;
  requirement?: number;
  dueFrom?: string;
  dueTo?: string;
  page?: number;
  pageSize?: number;
}

export interface DisputeFilter {
  search?: string;
  status?: string;
  type?: number;
  organization?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface GeoDistributionData {
  region: string;
  count: number;
  latitude: number;
  longitude: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}
