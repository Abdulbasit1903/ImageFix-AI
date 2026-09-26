import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PageRoute,
  DiagnosisCase,
  SavedDevice,
  UserProfile,
  AppSettings,
  ChatMessage,
  FollowUpQuestion,
  TroubleshootingStep,
} from '../types';
import { EMPTY_USER } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppContextType {
  currentRoute: PageRoute;
  navigateTo: (route: PageRoute, caseId?: string) => void;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  diagnoses: DiagnosisCase[];
  currentCase: DiagnosisCase | null;
  setCurrentCase: (c: DiagnosisCase | null) => void;
  addDiagnosis: (newCase: DiagnosisCase) => Promise<string>;
  updateDiagnosis: (id: string, updates: Partial<DiagnosisCase>) => Promise<void>;
  markDiagnosisResolved: (id: string) => Promise<void>;
  deleteDiagnosis: (id: string) => Promise<void>;
  toggleStepStatus: (caseId: string, stepId: string, status: 'completed' | 'pending' | 'issue_detected', solvedTheProblem?: boolean) => Promise<void>;
  addChatMessage: (caseId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  savedDevices: SavedDevice[];
  addSavedDevice: (device: Omit<SavedDevice, 'id'>) => Promise<void>;
  deleteSavedDevice: (id: string) => Promise<void>;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  clearAllCache: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to convert DB diagnosis row to DiagnosisCase
function mapDbDiagnosisToCase(row: any): DiagnosisCase {
  const steps: TroubleshootingStep[] = (row.troubleshooting_steps || [])
    .sort((a: any, b: any) => (a.step_number || 0) - (b.step_number || 0))
    .map((s: any) => {
      const instruction = s.instruction || '';
      const parts = instruction.split(':');
      const title = parts.length > 1 ? parts[0].trim() : `Step ${s.step_number}`;
      const description = parts.length > 1 ? parts.slice(1).join(':').trim() : instruction;
      return {
        id: s.id,
        stepNumber: s.step_number,
        title,
        description,
        safetyLevel: 'STANDARD',
        status: s.completed ? 'completed' : 'pending',
        solvedTheProblem: s.completed,
      };
    });

  const questions: FollowUpQuestion[] = (row.diagnosis_questions || []).map((q: any) => ({
    id: q.id,
    question: q.question,
    selectedAnswer: q.answer || undefined,
    options: [],
  }));

  const chatMessages: ChatMessage[] = (row.chat_messages || [])
    .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((m: any) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.message,
      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

  const safety = typeof row.safety_warnings === 'object' && row.safety_warnings !== null && !Array.isArray(row.safety_warnings)
    ? row.safety_warnings
    : {
        hasCriticalHazard: false,
        hazardType: 'NONE' as const,
        warningTitle: 'Safety Precaution',
        warningMessage: Array.isArray(row.safety_warnings) ? row.safety_warnings.join('. ') : (row.safety_warnings || 'Power off device completely before servicing.'),
        protocolNotes: [],
      };

  return {
    id: row.id,
    caseNumber: `DIAG-${row.id.slice(0, 4).toUpperCase()}`,
    title: row.detected_device || 'Device Diagnosis',
    detectedDevice: row.detected_device || 'Detected Hardware',
    deviceSubtype: row.device_category || 'Electronics',
    category: row.device_category || 'Electronics',
    problemDescription: row.problem_description || '',
    imageUrl: row.image_url || undefined,
    status: row.status === 'resolved' ? 'resolved' : 'active',
    createdAt: row.created_at,
    timestampDisplay: new Date(row.created_at).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    confidence: Number(row.confidence) || 90,
    confidenceLevel: (Number(row.confidence) || 90) >= 90 ? 'High' : (Number(row.confidence) || 90) >= 70 ? 'Medium' : 'Low',
    problemSummary: row.problem_summary || '',
    hardwareSpecs: [
      { label: 'Category', value: row.device_category || 'Electronics' },
      { label: 'Detected Model', value: row.detected_device || 'Hardware Component' },
    ],
    opticalTelemetry: {
      detectedComponents: [],
      visualBoundingBoxLabels: [],
      ambientConditionNotes: 'Visual inspection analyzed via ImageFix AI.',
    },
    visualObservations: Array.isArray(row.visual_observations)
      ? row.visual_observations
      : typeof row.visual_observations === 'string'
      ? [row.visual_observations]
      : ['Visual inspection recorded.'],
    possibleCauses: Array.isArray(row.possible_causes) ? row.possible_causes : [],
    safetyWarning: safety,
    recommendedChecks: Array.isArray(row.recommended_checks) ? row.recommended_checks : [],
    followUpQuestions: questions,
    troubleshootingSteps: steps,
    chatHistory: chatMessages,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('dashboard');
  const [currentCaseId, setCurrentCaseId] = useState<string>('');

  // Auth & Session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(EMPTY_USER);

  // Real Database state
  const [diagnoses, setDiagnoses] = useState<DiagnosisCase[]>([]);
  const [savedDevices, setSavedDevices] = useState<SavedDevice[]>([]);

  // Settings
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    safetyWarningLevel: 'strict',
    pushNotifications: true,
    diagnosticTelemetryLogs: true,
  });

  // Global search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Load user data from Supabase
  const loadUserData = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return;

    try {
      // 1. Fetch user profile from public.profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // 2. Fetch diagnoses with nested steps, questions, and messages
      const { data: dbDiagnoses, error: diagErr } = await supabase
        .from('diagnoses')
        .select(`
          *,
          troubleshooting_steps (*),
          diagnosis_questions (*),
          chat_messages (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (diagErr) {
        console.error('Error fetching diagnoses from Supabase:', diagErr);
      }

      const mappedDiagnoses: DiagnosisCase[] = (dbDiagnoses || []).map(mapDbDiagnosisToCase);
      setDiagnoses(mappedDiagnoses);

      // Set active case ID if needed
      if (mappedDiagnoses.length > 0) {
        setCurrentCaseId((prev) => (prev && mappedDiagnoses.some((d) => d.id === prev) ? prev : mappedDiagnoses[0].id));
      } else {
        setCurrentCaseId('');
      }

      // 3. Fetch devices from public.devices
      const { data: dbDevices, error: devErr } = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (devErr) {
        console.error('Error fetching devices from Supabase:', devErr);
      }

      const mappedDevices: SavedDevice[] = (dbDevices || []).map((dev: any) => ({
        id: dev.id,
        name: dev.name,
        category: dev.category,
        subtype: dev.category,
        status: 'Operational' as const,
        diagnosesCount: mappedDiagnoses.filter((d) => d.category === dev.category).length,
        specsSummary: `${dev.category} Profile`,
        lastSession: new Date(dev.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        isResolvedLastSession: true,
        imageUrl: dev.image_url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
        tag: (dev.name || 'DEV').slice(0, 3).toUpperCase(),
      }));
      setSavedDevices(mappedDevices);

      // 4. Update Current User with real counts
      const resolvedCount = mappedDiagnoses.filter((d) => d.status === 'resolved').length;
      setCurrentUser((prev) => ({
        ...prev,
        id: userId,
        name: profileData?.full_name || prev.name || 'Hardware Tech',
        avatarUrl: profileData?.avatar_url || prev.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        proId: `#FX-${userId.slice(0, 4).toUpperCase()}`,
        stats: {
          solvedCount: resolvedCount,
          devicesCount: mappedDevices.length,
          accuracyRate: mappedDiagnoses.length > 0 ? `${Math.round((resolvedCount / mappedDiagnoses.length) * 100)}%` : '100%',
        },
      }));
    } catch (err) {
      console.error('Failed to load user data from Supabase:', err);
    }
  }, []);

  // Sync / create profile in public.profiles
  const ensureUserProfile = useCallback(async (user: any) => {
    if (!isSupabaseConfigured || !user) return;
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const fullName = existingProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Hardware Tech';
      const avatarUrl = existingProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

      if (!existingProfile) {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
        });
      }

      setCurrentUser({
        id: user.id,
        name: fullName,
        email: user.email || '',
        avatarUrl,
        tier: 'BENCH TECHNICIAN TIER',
        proId: `#FX-${user.id.slice(0, 4).toUpperCase()}`,
        stats: {
          solvedCount: 0,
          devicesCount: 0,
          accuracyRate: '100%',
        },
      });
    } catch (err) {
      console.error('Error ensuring user profile in Supabase:', err);
    }
  }, []);

  // Supabase Auth listener & Session persistence
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsAuthLoading(false);
      return;
    }

    // Check active session on initial load
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('Error fetching Supabase session:', error);
      }
      if (session?.user) {
        setIsAuthenticated(true);
        await ensureUserProfile(session.user);
        await loadUserData(session.user.id);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(EMPTY_USER);
        setDiagnoses([]);
        setSavedDevices([]);
      }
      setIsAuthLoading(false);
    });

    // Listen to Auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        await ensureUserProfile(session.user);
        await loadUserData(session.user.id);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(EMPTY_USER);
        setDiagnoses([]);
        setSavedDevices([]);
      }
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [ensureUserProfile, loadUserData]);

  // Current case reference
  const currentCase = diagnoses.find((d) => d.id === currentCaseId) || diagnoses[0] || null;

  const navigateTo = (route: PageRoute, caseId?: string) => {
    if (caseId) {
      setCurrentCaseId(caseId);
    }

    // Protection check: if unauthenticated and trying to access protected routes, route to signin
    if (!isAuthenticated && !['landing', 'signin', 'signup'].includes(route)) {
      setCurrentRoute('signin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase credentials are not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setIsAuthenticated(true);
        await ensureUserProfile(data.user);
        await loadUserData(data.user.id);
        navigateTo('dashboard');
        return { success: true };
      }

      return { success: false, error: 'No active session returned.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during authentication.' };
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase credentials are not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // If session was established immediately (email confirmation disabled in Supabase)
        if (data.session) {
          setIsAuthenticated(true);
          await ensureUserProfile(data.user);
          await loadUserData(data.user.id);
          navigateTo('dashboard');
          return { success: true, requiresEmailConfirmation: false };
        }

        // Email confirmation is required by Supabase Auth configuration
        return { success: true, requiresEmailConfirmation: true };
      }

      return { success: false, error: 'Failed to create user account.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during sign up.' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setCurrentUser(EMPTY_USER);
    setDiagnoses([]);
    setSavedDevices([]);
    setCurrentCaseId('');
    navigateTo('signin');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));

    if (isSupabaseConfigured && currentUser.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updates.name,
            avatar_url: updates.avatarUrl,
          })
          .eq('id', currentUser.id);
      } catch (err) {
        console.error('Failed to update profile in Supabase:', err);
      }
    }
  };

  // Add diagnosis to public.diagnoses and its related tables
  const addDiagnosis = async (newCase: DiagnosisCase): Promise<string> => {
    // Generate valid UUID for the database primary key
    const caseId = newCase.id && newCase.id.length === 36 ? newCase.id : crypto.randomUUID();
    const caseWithUuid: DiagnosisCase = {
      ...newCase,
      id: caseId,
      caseNumber: `DIAG-${caseId.slice(0, 4).toUpperCase()}`,
    };

    // Update in-memory state immediately for snappy UI
    setDiagnoses((prev) => [caseWithUuid, ...prev]);
    setCurrentCaseId(caseId);

    if (isSupabaseConfigured && currentUser.id) {
      try {
        // 1. Insert into public.diagnoses
        const { error: diagErr } = await supabase.from('diagnoses').insert({
          id: caseId,
          user_id: currentUser.id,
          device_category: newCase.category,
          problem_description: newCase.problemDescription,
          detected_device: newCase.detectedDevice,
          confidence: Math.round(newCase.confidence || 90),
          problem_summary: newCase.problemSummary,
          visual_observations: newCase.visualObservations,
          possible_causes: newCase.possibleCauses,
          safety_warnings: newCase.safetyWarning,
          recommended_checks: newCase.recommendedChecks,
          status: newCase.status || 'active',
          image_url: newCase.imageUrl || '',
        });

        if (diagErr) {
          console.error('Error inserting diagnosis into Supabase:', diagErr);
        }

        // 2. Insert initial troubleshooting_steps into public.troubleshooting_steps
        if (newCase.troubleshootingSteps && newCase.troubleshootingSteps.length > 0) {
          const stepsToInsert = newCase.troubleshootingSteps.map((step, idx) => ({
            id: crypto.randomUUID(),
            diagnosis_id: caseId,
            step_number: step.stepNumber || idx + 1,
            instruction: `${step.title}: ${step.description}`,
            completed: step.status === 'completed',
          }));

          const { error: stepsErr } = await supabase.from('troubleshooting_steps').insert(stepsToInsert);
          if (stepsErr) {
            console.error('Error inserting troubleshooting steps into Supabase:', stepsErr);
          }
        }

        // 3. Insert follow-up questions into public.diagnosis_questions
        if (newCase.followUpQuestions && newCase.followUpQuestions.length > 0) {
          const questionsToInsert = newCase.followUpQuestions.map((q) => ({
            id: crypto.randomUUID(),
            diagnosis_id: caseId,
            question: q.question,
            answer: q.selectedAnswer || '',
          }));

          const { error: questionsErr } = await supabase.from('diagnosis_questions').insert(questionsToInsert);
          if (questionsErr) {
            console.error('Error inserting diagnosis questions into Supabase:', questionsErr);
          }
        }
      } catch (err) {
        console.error('Failed to persist diagnosis in Supabase:', err);
      }
    }

    return caseId;
  };

  const updateDiagnosis = async (id: string, updates: Partial<DiagnosisCase>) => {
    setDiagnoses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    if (isSupabaseConfigured && isAuthenticated) {
      try {
        // If status was updated, persist to public.diagnoses
        if (updates.status) {
          await supabase
            .from('diagnoses')
            .update({ status: updates.status, updated_at: new Date().toISOString() })
            .eq('id', id);
        }

        // If follow-up questions answered, persist to public.diagnosis_questions
        if (updates.followUpQuestions) {
          for (const q of updates.followUpQuestions) {
            if (q.selectedAnswer) {
              // Update by question text and diagnosis_id
              await supabase
                .from('diagnosis_questions')
                .update({ answer: q.selectedAnswer })
                .eq('diagnosis_id', id)
                .eq('question', q.question);
            }
          }
        }
      } catch (err) {
        console.error('Failed to update diagnosis in Supabase:', err);
      }
    }
  };

  const markDiagnosisResolved = async (id: string) => {
    setDiagnoses((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'resolved',
              troubleshootingSteps: c.troubleshootingSteps.map((s) => ({
                ...s,
                status: 'completed',
                solvedTheProblem: true,
              })),
            }
          : c
      )
    );

    setCurrentUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        solvedCount: prev.stats.solvedCount + 1,
      },
    }));

    if (isSupabaseConfigured && isAuthenticated) {
      try {
        await supabase
          .from('diagnoses')
          .update({ status: 'resolved', updated_at: new Date().toISOString() })
          .eq('id', id);

        await supabase
          .from('troubleshooting_steps')
          .update({ completed: true })
          .eq('diagnosis_id', id);
      } catch (err) {
        console.error('Failed to mark diagnosis resolved in Supabase:', err);
      }
    }
  };

  const deleteDiagnosis = async (id: string) => {
    setDiagnoses((prev) => prev.filter((c) => c.id !== id));
    navigateTo('history');

    if (isSupabaseConfigured && isAuthenticated) {
      try {
        await supabase.from('diagnoses').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete diagnosis in Supabase:', err);
      }
    }
  };

  const toggleStepStatus = async (
    caseId: string,
    stepId: string,
    status: 'completed' | 'pending' | 'issue_detected',
    solvedTheProblem?: boolean
  ) => {
    setDiagnoses((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const updatedSteps = c.troubleshootingSteps.map((s) => {
          if (s.id !== stepId) return s;
          return {
            ...s,
            status,
            solvedTheProblem: solvedTheProblem !== undefined ? solvedTheProblem : s.solvedTheProblem,
          };
        });

        const hasSolvedStep = updatedSteps.some((s) => s.solvedTheProblem);

        return {
          ...c,
          status: hasSolvedStep ? 'resolved' : c.status,
          troubleshootingSteps: updatedSteps,
        };
      })
    );

    if (isSupabaseConfigured && isAuthenticated) {
      try {
        const isCompleted = status === 'completed';

        // Update step status in public.troubleshooting_steps
        if (stepId.length === 36) {
          await supabase
            .from('troubleshooting_steps')
            .update({ completed: isCompleted })
            .eq('id', stepId);
        } else {
          await supabase
            .from('troubleshooting_steps')
            .update({ completed: isCompleted })
            .eq('diagnosis_id', caseId);
        }

        if (solvedTheProblem) {
          await supabase
            .from('diagnoses')
            .update({ status: 'resolved', updated_at: new Date().toISOString() })
            .eq('id', caseId);
        }
      } catch (err) {
        console.error('Failed to toggle step status in Supabase:', err);
      }
    }
  };

  const addChatMessage = async (caseId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = crypto.randomUUID();
    const fullMsg: ChatMessage = {
      id: msgId,
      timestamp: time,
      ...message,
    };

    setDiagnoses((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          chatHistory: [...(c.chatHistory || []), fullMsg],
        };
      })
    );

    if (isSupabaseConfigured && isAuthenticated && caseId.length === 36) {
      try {
        await supabase.from('chat_messages').insert({
          id: msgId,
          diagnosis_id: caseId,
          role: message.role,
          message: message.content,
        });
      } catch (err) {
        console.error('Failed to persist chat message in Supabase:', err);
      }
    }
  };

  const addSavedDevice = async (deviceData: Omit<SavedDevice, 'id'>) => {
    const devId = crypto.randomUUID();
    const newDev: SavedDevice = {
      id: devId,
      ...deviceData,
    };

    setSavedDevices((prev) => [newDev, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        devicesCount: prev.stats.devicesCount + 1,
      },
    }));

    if (isSupabaseConfigured && currentUser.id) {
      try {
        await supabase.from('devices').insert({
          id: devId,
          user_id: currentUser.id,
          name: deviceData.name,
          category: deviceData.category,
          image_url: deviceData.imageUrl || '',
        });
      } catch (err) {
        console.error('Failed to persist device in Supabase:', err);
      }
    }
  };

  const deleteSavedDevice = async (id: string) => {
    setSavedDevices((prev) => prev.filter((d) => d.id !== id));
    setCurrentUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        devicesCount: Math.max(0, prev.stats.devicesCount - 1),
      },
    }));

    if (isSupabaseConfigured && isAuthenticated) {
      try {
        await supabase.from('devices').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete device in Supabase:', err);
      }
    }
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const clearAllCache = () => {
    localStorage.clear();
    setDiagnoses([]);
    setSavedDevices([]);
    setCurrentUser(EMPTY_USER);
  };

  const refreshData = async () => {
    if (currentUser.id) {
      await loadUserData(currentUser.id);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        currentUser,
        isAuthenticated,
        isAuthLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        diagnoses,
        currentCase,
        setCurrentCase: (c) => c && setCurrentCaseId(c.id),
        addDiagnosis,
        updateDiagnosis,
        markDiagnosisResolved,
        deleteDiagnosis,
        toggleStepStatus,
        addChatMessage,
        savedDevices,
        addSavedDevice,
        deleteSavedDevice,
        settings,
        updateSettings,
        searchQuery,
        setSearchQuery,
        isSearchModalOpen,
        setIsSearchModalOpen,
        clearAllCache,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
