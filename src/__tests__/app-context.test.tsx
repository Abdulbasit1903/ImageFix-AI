import React from 'react';
import { act, render } from '@testing-library/react';
import { AppProvider, useApp } from '../context/AppContext';

const mockSupabase = vi.hoisted(() => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
  from: vi.fn(),
}));

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: mockSupabase,
}));

describe('AppContext auth and state updates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();

    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    mockSupabase.auth.signUp.mockResolvedValue({
      data: {
        user: { id: 'user-123', email: 'tech@imagefix.ai', user_metadata: { full_name: 'ImageFix Tech' } },
        session: null,
      },
      error: null,
    });

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: {
        user: { id: 'user-123', email: 'tech@imagefix.ai', user_metadata: { full_name: 'ImageFix Tech' } },
        session: { user: { id: 'user-123', email: 'tech@imagefix.ai' } },
      },
      error: null,
    });

    mockSupabase.from.mockImplementation((table: string) => {
      const baseQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        order: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockReturnThis(),
        insert: vi.fn().mockResolvedValue({ error: null }),
        delete: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockResolvedValue({ error: null }),
      };

      if (table === 'diagnoses') {
        baseQuery.select = vi.fn().mockReturnThis();
      }

      return baseQuery;
    });
  });

  it('creates a user account and persists a diagnosis record', async () => {
    let context: ReturnType<typeof useApp> | undefined;

    const Harness = () => {
      context = useApp();
      return null;
    };

    render(
      <AppProvider>
        <Harness />
      </AppProvider>
    );

    await act(async () => {
      await context!.signIn('tech@imagefix.ai', 'secretpassword');
      await context!.addDiagnosis({
        id: 'diag-123',
        caseNumber: 'DIAG-1234',
        title: 'GPU artifacting',
        detectedDevice: 'NVIDIA GeForce RTX 3080',
        deviceSubtype: 'GPU',
        category: 'Computer Component',
        problemDescription: 'Artifacting under load',
        status: 'active',
        createdAt: new Date().toISOString(),
        timestampDisplay: 'Today',
        confidence: 92,
        confidenceLevel: 'High',
        problemSummary: 'Artifacting under load',
        hardwareSpecs: [{ label: 'Category', value: 'Computer Component' }],
        opticalTelemetry: {
          detectedComponents: ['GPU'],
          visualBoundingBoxLabels: [],
          ambientConditionNotes: 'Noisy airflow',
        },
        visualObservations: ['Fans spin'],
        possibleCauses: [{ cause: 'Thermal issue', likelihood: 'High', explanation: 'Hot spot' }],
        safetyWarning: {
          hasCriticalHazard: true,
          hazardType: 'THERMAL_BURN',
          warningTitle: 'Thermal safety',
          warningMessage: 'Disconnect power before servicing',
          protocolNotes: ['Disconnect power'],
        },
        recommendedChecks: ['Inspect fans'],
        followUpQuestions: [],
        troubleshootingSteps: [{
          id: 'step-1',
          stepNumber: 1,
          title: 'Inspect fan',
          description: 'Check airflow',
          safetyLevel: 'STANDARD',
          status: 'pending',
        }],
        chatHistory: [],
      });
    });

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'tech@imagefix.ai',
      password: 'secretpassword',
    });
    expect(mockSupabase.from).toHaveBeenCalledWith('diagnoses');
  });

  it('marks a diagnosis as resolved and updates its step status', async () => {
    let context: ReturnType<typeof useApp> | undefined;

    const Harness = () => {
      context = useApp();
      return null;
    };

    render(
      <AppProvider>
        <Harness />
      </AppProvider>
    );

    await act(async () => {
      await context!.signIn('tech@imagefix.ai', 'secretpassword');
      await context!.addDiagnosis({
        id: '11111111-1111-4111-8111-111111111111',
        caseNumber: 'DIAG-4567',
        title: 'Laptop battery drain',
        detectedDevice: 'MacBook Pro',
        deviceSubtype: 'Laptop',
        category: 'Laptop',
        problemDescription: 'Battery drains overnight',
        status: 'active',
        createdAt: new Date().toISOString(),
        timestampDisplay: 'Today',
        confidence: 83,
        confidenceLevel: 'Medium',
        problemSummary: 'Battery drain issue',
        hardwareSpecs: [{ label: 'Category', value: 'Laptop' }],
        opticalTelemetry: {
          detectedComponents: ['Battery'],
          visualBoundingBoxLabels: [],
          ambientConditionNotes: 'Ambient conditions normal',
        },
        visualObservations: ['Battery swollen'],
        possibleCauses: [{ cause: 'Battery age', likelihood: 'High', explanation: 'Capacity decline' }],
        safetyWarning: {
          hasCriticalHazard: true,
          hazardType: 'LITHIUM_BATTERY',
          warningTitle: 'Battery risk',
          warningMessage: 'Stop use if swollen',
          protocolNotes: ['Do not puncture battery'],
        },
        recommendedChecks: ['Calibrate battery'],
        followUpQuestions: [],
        troubleshootingSteps: [{
          id: 'step-2',
          stepNumber: 1,
          title: 'Check battery history',
          description: 'Review charge cycles',
          safetyLevel: 'STANDARD',
          status: 'pending',
        }],
        chatHistory: [],
      });

      await context!.toggleStepStatus('11111111-1111-4111-8111-111111111111', 'step-2', 'completed', true);
      await context!.markDiagnosisResolved('11111111-1111-4111-8111-111111111111');
    });

    expect(context!.diagnoses[0].status).toBe('resolved');
    expect(context!.diagnoses[0].troubleshootingSteps[0].status).toBe('completed');
  });
});
