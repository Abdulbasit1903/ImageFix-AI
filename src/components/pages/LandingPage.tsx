import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Search,
  Wrench,
  Radio,
  Monitor,
  Laptop,
  Tv,
  Printer,
  Boxes,
  Smartphone,
  Gamepad2,
  Cable,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_CATEGORIES } from '../../data/mockData';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useApp();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor': return <Monitor className="w-6 h-6 text-[#3525cd]" />;
      case 'Laptop': return <Laptop className="w-6 h-6 text-[#3525cd]" />;
      case 'Tv': return <Tv className="w-6 h-6 text-[#3525cd]" />;
      case 'Printer': return <Printer className="w-6 h-6 text-[#3525cd]" />;
      case 'Boxes': return <Boxes className="w-6 h-6 text-[#3525cd]" />;
      case 'Radio': return <Radio className="w-6 h-6 text-[#3525cd]" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-[#3525cd]" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-[#3525cd]" />;
      case 'Gamepad2': return <Gamepad2 className="w-6 h-6 text-[#3525cd]" />;
      default: return <Cable className="w-6 h-6 text-[#3525cd]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e]">
      {/* Top Navigation for Landing */}
      <header className="h-16 border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md sticky top-0 z-30 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 font-display font-bold text-xl text-[#131b2e]">
            <div className="w-9 h-9 rounded-xl bg-[#4f46e5] text-white flex items-center justify-center shadow-md shadow-[#4f46e5]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>ImageFix<span className="text-[#4f46e5]"> AI</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#464555]">
            <a href="#how-it-works" className="hover:text-[#3525cd] transition-colors">How It Works</a>
            <a href="#categories" className="hover:text-[#3525cd] transition-colors">Categories</a>
            <a href="#features" className="hover:text-[#3525cd] transition-colors">Features</a>
            <a href="#safety" className="hover:text-[#3525cd] transition-colors">Safety Protocols</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('signin')}
            className="px-4 py-2 text-sm font-medium text-[#464555] hover:text-[#131b2e] transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigateTo('new-diagnosis')}
            className="px-4 py-2 text-sm font-semibold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg shadow-sm shadow-[#4f46e5]/30 transition-all hover:shadow"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 pb-16 px-6 lg:px-12 max-w-6xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f3ff] border border-[#dad7ff] text-[#3525cd] font-mono text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span>Autonomous Hardware Diagnostics v2.4</span>
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#131b2e] tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Diagnose Tech Problems <br />
          <span className="text-[#3525cd] bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-[#2170e4] bg-clip-text text-transparent">
            with Hardware AI
          </span>
        </h1>

        <p className="mt-4 text-lg text-[#464555] max-w-2xl mx-auto leading-relaxed">
          Upload a photo, describe the problem, and let ImageFix AI help you understand what might be wrong and what to check next.
        </p>

        {/* Tagline callout */}
        <div className="mt-2 font-mono text-xs tracking-widest uppercase text-[#777587]">
          "See the problem. Find the fix."
        </div>

        {/* Hero CTA buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigateTo('new-diagnosis')}
            className="px-6 py-3.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-base flex items-center gap-2.5 shadow-lg shadow-[#4f46e5]/30 transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            <span>Diagnose a Device</span>
          </button>
          <a
            href="#how-it-works"
            className="px-6 py-3.5 bg-white hover:bg-[#f8fafc] text-[#131b2e] border border-[#e2e8f0] font-semibold rounded-xl text-base flex items-center gap-2 transition-all hover:border-[#cbd5e1]"
          >
            <span>See How It Works</span>
          </a>
        </div>

        {/* Live Session Visual HUD (Matches Image 7) */}
        <div className="mt-14 rounded-2xl bg-white border border-[#c7c4d8] shadow-xl overflow-hidden text-left">
          {/* HUD Top Bar */}
          <div className="px-4 py-2.5 bg-[#131b2e] text-white flex items-center justify-between font-mono text-xs border-b border-[#283044]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
              </div>
              <span className="text-[#dad7ff] font-medium">live-session: visual-diagnostic-09174.gpu</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-[#a5b4fc]">ENGINE: GA104-RTX3070</span>
              <span className="flex items-center gap-1 text-[#34d399]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-ping"></span>
                0.42s LATENCY
              </span>
            </div>
          </div>

          {/* 3-Column Diagnostic Workflow View */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e2e8f0] p-4 lg:p-6 bg-[#faf8ff]">
            {/* Phase 01: Capture */}
            <div className="space-y-3 pb-4 md:pb-0 md:pr-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#3525cd] font-bold">PHASE 01 // CAPTURE</span>
                <span className="text-[#777587]">device_image.jpg</span>
              </div>

              {/* Optical Feed Image with Bounding Boxes */}
              <div className="relative rounded-xl overflow-hidden border border-[#c7c4d8] aspect-4/3 bg-black">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"
                  alt="Hardware component visual inspection showing a circuit board with thermal and electrical indicators"
                  className="w-full h-full object-cover opacity-90"
                />
                {/* Bounding box mock overlay */}
                <div className="absolute top-[25%] left-[28%] w-[38%] h-[38%] border-2 border-[#3b82f6] rounded bg-[#3b82f6]/10 flex flex-col justify-between p-1 text-[10px] font-mono text-white">
                  <span className="bg-[#3b82f6] px-1 py-0.2 rounded w-fit text-[9px] font-bold">DIE: GA104</span>
                  <span className="bg-[#ba1a1a]/90 px-1 py-0.2 rounded w-fit self-end text-[9px]">HOTSPOT 98.4°C</span>
                </div>
                <div className="absolute bottom-[20%] right-[12%] border border-[#f59e0b] bg-[#f59e0b]/20 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">
                  VRM 1.2mm PAD
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                  PCB_Mainboard_V4.jpg • Uploaded
                </div>
              </div>

              <div className="text-xs text-[#464555] leading-relaxed">
                High-fidelity optical scan processed via high-density computer vision edge node.
              </div>
              <div className="font-mono text-[11px] text-[#777587] flex justify-between">
                <span>Resolution: 4032x3024</span>
                <span>ISO: 100 • 28mm</span>
              </div>
            </div>

            {/* Phase 02: Neural Inference */}
            <div className="space-y-3 py-4 md:py-0 md:px-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#3525cd] font-bold">PHASE 02 // NEURAL INFERENCE</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] font-semibold text-[10px]">
                  94% Confidence
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#dad7ff] space-y-2.5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#131b2e]">Thermal Throttling Isolated</div>
                    <div className="text-[11px] text-[#464555]">
                      Degraded VRAM GDDR6 thermal pads & dried silicon paste detected under cold plate.
                    </div>
                  </div>
                </div>

                {/* Micro temperature delta graph */}
                <div className="pt-2 border-t border-[#f1f5f9]">
                  <div className="flex justify-between text-[10px] font-mono text-[#777587]">
                    <span>THERMAL DELTA ΔT</span>
                    <span className="text-[#ba1a1a] font-bold">+28.4°C vs Normal</span>
                  </div>
                  <div className="h-7 w-full flex items-end gap-1 mt-1">
                    {[20, 24, 28, 35, 45, 60, 82, 98].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t ${i > 4 ? 'bg-[#ba1a1a]' : 'bg-[#4f46e5]'}`}
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f1f5f9] font-mono text-[11px]">
                  <div>
                    <span className="text-[#777587] block text-[9px]">ASIC Node:</span>
                    <span className="font-semibold text-[#131b2e]">GA104-300-A1</span>
                  </div>
                  <div>
                    <span className="text-[#777587] block text-[9px]">Phase Rail Impedance:</span>
                    <span className="font-semibold text-[#059669]">0.82 Ω (Nominal)</span>
                  </div>
                </div>
              </div>

              <div className="font-mono text-[11px] bg-[#eaedff] text-[#3525cd] p-2 rounded-lg font-medium">
                DIAGNOSTIC SIGNATURE: ERR_VRAM_CONTACT_VOID_0x77FA
              </div>
            </div>

            {/* Phase 03: Step Engine */}
            <div className="space-y-3 pt-4 md:pt-0 md:pl-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#3525cd] font-bold">PHASE 03 // STEP ENGINE</span>
                <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#3525cd] font-semibold text-[10px]">
                  Stage 2 of 4
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#dad7ff] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-1.5 py-0.5 rounded bg-[#4f46e5] text-white text-[10px] font-mono font-semibold">
                      Current Action
                    </span>
                    <div className="text-xs font-bold text-[#131b2e] mt-1">
                      Step 2: Clean heatsink & replace thermal pads
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                </div>

                <p className="text-[11px] text-[#464555] leading-relaxed">
                  Deploy 1.5mm 12.8 W/mK silicone pads across all 8 Micron GDDR6 banks. Strip dried paste with 99.9% Isopropyl.
                </p>

                <div className="space-y-1.5 text-xs text-[#334155]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-[#4f46e5]" />
                    <span className="text-[11px]">Discharge residual capacitors (Grounding wrist strap)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-[#4f46e5]" />
                    <span className="text-[11px]">Remove 4x spring-tension bracket screws</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded accent-[#4f46e5]" />
                    <span className="text-[11px]">Apply pea-sized non-conductive thermal compound</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] text-[#059669]">
                <span className="flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Safety Level: ESD SECURE
                </span>
                <button
                  onClick={() => navigateTo('new-diagnosis')}
                  className="text-[#3525cd] font-bold hover:underline inline-flex items-center gap-1"
                >
                  Continue Flow →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How FixIt AI Works Section (Matches Image 7) */}
      <section id="how-it-works" className="py-16 px-6 lg:px-12 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs font-semibold text-[#3525cd] uppercase tracking-wider">
              Standard Diagnostic Sequence
            </span>
            <h2 className="font-display font-bold text-3xl text-[#131b2e] mt-1">
              How FixIt AI Works
            </h2>
            <p className="text-sm text-[#464555] mt-2">
              From hardware anomaly capture to verifiable bench repair in three deterministic execution phases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] relative group hover:border-[#3525cd] transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-bold text-4xl text-[#3525cd]/40 group-hover:text-[#3525cd] transition-colors">
                  01
                </span>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#dad7ff] flex items-center justify-center text-[#3525cd] shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-display font-bold text-lg text-[#131b2e]">Snap a Photo</h3>
              <p className="text-sm text-[#464555] mt-2 leading-relaxed">
                Position your phone or bench microscope over the faulty motherboard, logic board, or casing. FixIt AI handles micro-focus, glare rejection, and low-light sensor calibration automatically.
              </p>
              <div className="flex flex-wrap gap-2 mt-4 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#464555]">Optical Macro</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#464555]">QR/Serial OCR</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#464555]">Colorimetric Test</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] relative group hover:border-[#3525cd] transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-bold text-4xl text-[#3525cd]/40 group-hover:text-[#3525cd] transition-colors">
                  02
                </span>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#dad7ff] flex items-center justify-center text-[#3525cd] shadow-xs">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-display font-bold text-lg text-[#131b2e]">Instant AI Analysis</h3>
              <p className="text-sm text-[#464555] mt-2 leading-relaxed">
                The proprietary hardware neural parser references millions of component schematics, identifying bulging electrolytic caps, blown MOSFETs, cold solder joints, and burnt traces in under two seconds.
              </p>
              <div className="flex flex-wrap gap-2 mt-4 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#464555]">CAD Overlay</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#464555]">Boardview Sync</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#464555]">Thermal Simulation</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] relative group hover:border-[#3525cd] transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-bold text-4xl text-[#3525cd]/40 group-hover:text-[#3525cd] transition-colors">
                  03
                </span>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#dad7ff] flex items-center justify-center text-[#3525cd] shadow-xs">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-display font-bold text-lg text-[#131b2e]">Step-by-Step Repair Guide</h3>
              <p className="text-sm text-[#464555] mt-2 leading-relaxed">
                Receive verified torque specs, SMD replacement part numbers, multimeter test points, and sequential reassembly instructions designed to preserve manufacturer warranty bounds.
              </p>
              <div className="flex flex-wrap gap-2 mt-4 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#464555]">ESD Protocol</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#464555]">Multimeter Pts</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#464555]">Torque Specs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Device Categories Section (Matches Image 7) */}
      <section id="categories" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-mono text-xs font-semibold text-[#3525cd] uppercase tracking-wider">
            Extensive Hardware Taxonomy
          </span>
          <h2 className="font-display font-bold text-3xl text-[#131b2e] mt-1">
            Supported Device Categories
          </h2>
          <p className="text-sm text-[#464555] mt-2">
            Pre-trained on over 14,000 service manuals, micro-soldering schematics, and factory pinouts.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {SUPPORTED_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigateTo('new-diagnosis')}
              className="p-4 rounded-xl bg-white border border-[#e2e8f0] hover:border-[#3525cd] hover:shadow-md transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="p-2.5 rounded-lg bg-[#f2f3ff] group-hover:bg-[#eaedff] transition-colors mb-2.5">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div className="font-semibold text-sm text-[#131b2e]">{cat.name}</div>
              <div className="text-[11px] text-[#777587] font-mono mt-0.5">{cat.subtext}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Engineered for Precision & Hardware Safety (Matches Image 7) */}
      <section id="features" className="py-16 px-6 lg:px-12 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-10">
            <span className="font-mono text-xs font-semibold text-[#3525cd] uppercase tracking-wider">
              Industrial Capability
            </span>
            <h2 className="font-display font-bold text-3xl text-[#131b2e] mt-1">
              Engineered for Precision & Hardware Safety
            </h2>
            <p className="text-sm text-[#464555] mt-2">
              Built for hardware enthusiasts, system integrators, and bench technicians who demand trace-level accuracy without bricking expensive silicon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#dad7ff] flex items-center justify-center text-[#3525cd] mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#131b2e]">Visual Recognition</h3>
                <p className="text-sm text-[#464555] mt-2 leading-relaxed">
                  Convolutional models isolate micro-fractured ball grid arrays (BGA), oxidized copper traces, blown diodes, and delaminated PCB layers with 0.1mm bounding tolerance.
                </p>
              </div>
              <div className="pt-6 border-t border-[#e2e8f0] flex justify-between items-center text-xs font-mono mt-4">
                <span className="text-[#777587]">Optical Accuracy:</span>
                <span className="font-bold text-[#059669]">99.2% Sub-mm</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#dad7ff] flex items-center justify-center text-[#3525cd] mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#131b2e]">Component Schematics</h3>
                <p className="text-sm text-[#464555] mt-2 leading-relaxed">
                  Dynamic sync with open-source and vendor boardview repositories. Click any identified resistor or chip to instantly inspect ground planes, power rails, and pull-up values.
                </p>
              </div>
              <div className="pt-6 border-t border-[#e2e8f0] flex justify-between items-center text-xs font-mono mt-4">
                <span className="text-[#777587]">Supported Schematics:</span>
                <span className="font-bold text-[#3525cd]">14,800+ Repos</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#dad7ff] flex items-center justify-center text-[#3525cd] mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#131b2e]">Real-Time Guardrails</h3>
                <p className="text-sm text-[#464555] mt-2 leading-relaxed">
                  ImageFix AI continuously audits actions against catastrophic risks: capacitor high-voltage discharge warnings, toxic vapor safety, battery swelling alerts, and power disconnect confirmations.
                </p>
              </div>
              <div className="pt-6 border-t border-[#e2e8f0] flex justify-between items-center text-xs font-mono mt-4">
                <span className="text-[#777587]">Safety Standard:</span>
                <span className="font-bold text-[#059669]">ANSI/ESD S20.20</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Voltage Alert & Capacitive Discharge Compliance Banner (Matches Image 7) */}
      <section id="safety" className="py-8 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="p-5 sm:p-6 rounded-2xl bg-[#fffbeb] border-l-4 border-[#f59e0b] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#fde68a] text-[#b45309] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-[#b45309] uppercase tracking-wider">
                Safety-First Diagnostics • Mandatory Protocol
              </div>
              <h4 className="font-display font-bold text-base text-[#78350f] mt-0.5">
                High-Voltage Alert & Capacitive Discharge Compliance
              </h4>
              <p className="text-xs text-[#92400e] mt-1 max-w-2xl leading-relaxed">
                Always ensure power supplies, desktop PCs, and electronics are unplugged and allowed to discharge before touching internal boards. ImageFix AI prompts mandatory safety warnings for high voltage or hazardous components.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('settings')}
            className="px-4 py-2 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
          >
            Read Safety Matrix
          </button>
        </div>
      </section>

      {/* CTA Banner "Ready to fix your device?" (Matches Image 7) */}
      <section className="py-12 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-[#2170e4] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="font-mono text-xs uppercase tracking-wider text-[#dad7ff] font-semibold">
              Zero Setup Required
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">
              Ready to fix your device?
            </h2>
            <p className="text-sm text-[#e0e7ff] max-w-md">
              Join over 42,000 electrical engineers, IT administrators, and hardware hobbyists using FixIt AI's vision engine today.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-[#dad7ff] font-medium justify-center md:justify-start">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#34d399]" /> Free Tier Available</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#34d399]" /> No Card Required</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#34d399]" /> Instant Web Scan</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('new-diagnosis')}
            className="px-6 py-4 bg-white text-[#3525cd] hover:bg-[#f8fafc] font-bold rounded-xl text-base shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
          >
            <span>Start Free Diagnosis Now</span>
            <Sparkles className="w-4 h-4 text-[#4f46e5]" />
          </button>
        </div>
      </section>

      {/* Footer (Matches Image 7) */}
      <footer className="bg-white border-t border-[#e2e8f0] py-12 px-6 lg:px-12 text-xs text-[#777587]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-display font-bold text-base text-[#131b2e]">
              <div className="w-6 h-6 rounded-md bg-[#4f46e5] text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>FixIt AI</span>
            </div>
            <p className="text-[#64748b]">
              AI-powered visual troubleshooting for computers, consumer electronics, and electronic devices.
            </p>
          </div>

          <div>
            <div className="font-mono uppercase font-semibold text-[#131b2e] mb-3">Platform</div>
            <ul className="space-y-2">
              <li><button onClick={() => navigateTo('dashboard')} className="hover:text-[#3525cd]">Diagnostics Core</button></li>
              <li><button onClick={() => navigateTo('history')} className="hover:text-[#3525cd]">Diagnosis History</button></li>
              <li><button onClick={() => navigateTo('saved-devices')} className="hover:text-[#3525cd]">Component Guides</button></li>
            </ul>
          </div>

          <div>
            <div className="font-mono uppercase font-semibold text-[#131b2e] mb-3">Integrity & Standards</div>
            <ul className="space-y-2">
              <li><span>ESD Safety Compliance</span></li>
              <li><span>SMD Specifications</span></li>
              <li className="font-mono font-bold text-[#059669]">ISO/IEC 17025 COMPLIANT</li>
            </ul>
          </div>

          <div>
            <div className="font-mono uppercase font-semibold text-[#131b2e] mb-3">System Status</div>
            <div className="flex items-center gap-2 text-[#059669] font-mono text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              <span>AI Engine: 100% Online</span>
            </div>
            <p className="mt-2 text-[#64748b]">
              Intelligent Multimodal Visual Diagnostic Engine active.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#f1f5f9] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© 2026 FixIt AI / ImageFix AI Technologies Inc. All rights reserved.</div>
          <div className="flex gap-4">
            <button onClick={() => navigateTo('settings')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => navigateTo('settings')} className="hover:underline">Terms of Service</button>
            <button onClick={() => navigateTo('settings')} className="hover:underline">Hardware Safety Protocol</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
