export type PageRoute =
  | 'landing'
  | 'signin'
  | 'signup'
  | 'dashboard'
  | 'new-diagnosis'
  | 'ai-analysis'
  | 'followup-questions'
  | 'troubleshooting-guide'
  | 'troubleshoot-chat'
  | 'history'
  | 'diagnosis-detail'
  | 'saved-devices'
  | 'profile'
  | 'settings';

export type Likelihood = 'High' | 'Medium' | 'Low';

export interface PossibleCause {
  cause: string;
  likelihood: Likelihood;
  explanation: string;
  badgeText?: string;
}

export interface SafetyWarning {
  hasCriticalHazard: boolean;
  hazardType: 'HIGH_VOLTAGE' | 'LITHIUM_BATTERY' | 'THERMAL_BURN' | 'CAPACITOR_DISCHARGE' | 'ESD_SENSITIVE' | 'NONE';
  warningTitle: string;
  warningMessage: string;
  protocolNotes: string[];
}

export interface TroubleshootingStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  safetyLevel: 'ESD SECURE' | 'HIGH VOLTAGE INTERLOCK' | 'POWER OFF' | 'STANDARD' | 'THERMAL BURN PRECAUTION';
  specs?: string;
  status: 'pending' | 'completed' | 'issue_detected';
  resolvedStatusNote?: string;
  solvedTheProblem?: boolean;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  options?: string[];
  contextHelp?: string;
  selectedAnswer?: string;
}

export interface OpticalTelemetry {
  detectedComponents: string[];
  visualBoundingBoxLabels: Array<{
    label: string;
    confidence: number;
    note: string;
  }>;
  ambientConditionNotes: string;
}

export interface HardwareSpec {
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DiagnosisCase {
  id: string;
  caseNumber: string; // e.g. "DIAG-8092"
  title: string;
  detectedDevice: string;
  deviceSubtype: string;
  category: string;
  problemDescription: string;
  imageUrl?: string;
  status: 'active' | 'resolved';
  createdAt: string;
  timestampDisplay: string;
  confidence: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  problemSummary: string;
  hardwareSpecs: HardwareSpec[];
  opticalTelemetry: OpticalTelemetry;
  visualObservations: string[];
  possibleCauses: PossibleCause[];
  safetyWarning: SafetyWarning;
  recommendedChecks: string[];
  followUpQuestions: FollowUpQuestion[];
  troubleshootingSteps: TroubleshootingStep[];
  chatHistory: ChatMessage[];
  telemetryProfile?: string;
  coreTemp?: string;
  hotspotTemp?: string;
  activeStepIndex?: number;
}

export interface SavedDevice {
  id: string;
  name: string;
  category: string;
  subtype: string;
  status: 'Active Issue' | 'Operational' | 'Standby';
  diagnosesCount: number;
  specsSummary: string;
  lastSession: string;
  isResolvedLastSession?: boolean;
  imageUrl: string;
  tag: string;
  hardwareId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  tier: string;
  proId: string;
  stats: {
    solvedCount: number;
    devicesCount: number;
    accuracyRate: string;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  safetyWarningLevel: 'strict' | 'standard';
  pushNotifications: boolean;
  diagnosticTelemetryLogs: boolean;
}
