import { DiagnosisCase, SavedDevice, UserProfile } from '../types';

export interface DeviceCategoryOption {
  id: string;
  name: string;
  subtext: string;
  iconName: string;
}

export const SUPPORTED_CATEGORIES: DeviceCategoryOption[] = [
  { id: 'computer', name: 'Computer', subtext: 'Desktops, Workstations & Towers', iconName: 'Monitor' },
  { id: 'laptop', name: 'Laptop', subtext: 'Notebooks, Ultrabooks & MacBooks', iconName: 'Laptop' },
  { id: 'monitor', name: 'Monitor', subtext: 'Screens, Panels & Displays', iconName: 'Tv' },
  { id: 'printer', name: 'Printer', subtext: 'Laser, Inkjet & Multi-function', iconName: 'Printer' },
  { id: '3d-printer', name: '3D Printer', subtext: 'FDM, Resin & Extruders', iconName: 'Boxes' },
  { id: 'router-networking', name: 'Router / Networking', subtext: 'Modems, Switches & Access Points', iconName: 'Radio' },
  { id: 'computer-component', name: 'Computer Component', subtext: 'GPUs, Motherboards, RAM, PSUs', iconName: 'Cpu' },
  { id: 'mobile-device', name: 'Mobile Device', subtext: 'Smartphones, Tablets & e-Readers', iconName: 'Smartphone' },
  { id: 'gaming-device', name: 'Gaming Device', subtext: 'Consoles, Handhelds & Controllers', iconName: 'Gamepad2' },
  { id: 'other-electronics', name: 'Other Electronics', subtext: 'Audio DACs, Smart Home, Gadgets', iconName: 'Cable' },
];

export const EMPTY_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  tier: 'BENCH TECHNICIAN TIER',
  proId: '',
  stats: {
    solvedCount: 0,
    devicesCount: 0,
    accuracyRate: '100%',
  },
};

export const INITIAL_USER: UserProfile = EMPTY_USER;

export const INITIAL_SAVED_DEVICES: SavedDevice[] = [];

export const INITIAL_DIAGNOSES: DiagnosisCase[] = [];

export const DEMO_PRESETS = [
  {
    name: 'RTX 3080 GPU Artifacting & Black Screen',
    category: 'Computer Component',
    model: 'NVIDIA GeForce RTX 3080 Founders Edition',
    description: 'Visual artifacting and sudden black screen under sustained load during 3D benchmarks. System fans ramp to 100% and screen loses signal after 40 seconds of FurMark.',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ender 3 V2 Extruder Clicking & Under-Extrusion',
    category: '3D Printer',
    model: 'Creality Ender 3 V2',
    description: 'Extruder stepper motor clicks loudly and skips steps starting on layer 4. Filament is ground down and under-extrusion leaves brittle hollow layers.',
    imageUrl: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'MacBook Pro Battery Drain & Fan Noise',
    category: 'Laptop',
    model: 'Apple MacBook Pro 16" (M1 Pro)',
    description: 'Battery drains rapidly from 100% to 20% in 2 hours even while sleeping or idle. Chassis gets warm near the display hinge and fans run constantly.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
];
