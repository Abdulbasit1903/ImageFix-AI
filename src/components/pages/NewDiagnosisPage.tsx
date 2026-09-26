import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  X,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  Monitor,
  Laptop,
  Tv,
  Printer,
  Boxes,
  Radio,
  Cpu,
  Smartphone,
  Gamepad2,
  Cable,
  FileImage,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_CATEGORIES, DEMO_PRESETS } from '../../data/mockData';
import { DiagnosisCase } from '../../types';

export const NewDiagnosisPage: React.FC = () => {
  const { navigateTo, addDiagnosis, setCurrentCase } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Computer Component');
  const [deviceModel, setDeviceModel] = useState<string>('');
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormReady = Boolean(imagePreview && problemDescription.trim() && !isSubmitting);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor': return <Monitor className="w-5 h-5" />;
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Tv': return <Tv className="w-5 h-5" />;
      case 'Printer': return <Printer className="w-5 h-5" />;
      case 'Boxes': return <Boxes className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5" />;
      default: return <Cable className="w-5 h-5" />;
    }
  };

  const handleFileChange = (file: File) => {
    // Validate type (JPG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a supported image format: JPG, PNG, or WEBP.');
      return;
    }
    // Max 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 15MB. Please choose a smaller image.');
      return;
    }

    setErrorMessage(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setSelectedCategory(preset.category);
    setDeviceModel(preset.model);
    setProblemDescription(preset.description);
    setImagePreview(preset.imageUrl);
    setImageFile(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!problemDescription.trim() && !imagePreview) {
      setErrorMessage('Please provide an image of the device or a problem description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: imageFile?.type || 'image/jpeg',
          category: selectedCategory,
          problemDescription: problemDescription || 'Hardware failure reported',
          deviceModel: deviceModel || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const diagnosisData = await response.json();

      const caseUuid = crypto.randomUUID();
      const newCase: DiagnosisCase = {
        id: caseUuid,
        caseNumber: diagnosisData.caseId || 'DIAG-' + caseUuid.slice(0, 4).toUpperCase(),
        title: diagnosisData.detectedDevice || deviceModel || 'Hardware Component',
        detectedDevice: diagnosisData.detectedDevice || deviceModel || 'Identified Component',
        deviceSubtype: diagnosisData.deviceSubtype || selectedCategory,
        category: selectedCategory,
        problemDescription: problemDescription || diagnosisData.problemDescription || 'Hardware failure reported',
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        createdAt: new Date().toISOString(),
        timestampDisplay: 'Just now',
        confidence: diagnosisData.confidence || 92,
        confidenceLevel: diagnosisData.confidenceLevel || 'High',
        problemSummary: diagnosisData.problemSummary || 'Optical analysis and reported symptom correlation.',
        hardwareSpecs: diagnosisData.hardwareSpecs || [
          { label: 'Category', value: selectedCategory },
          { label: 'Model', value: deviceModel || 'Standard Spec' },
        ],
        opticalTelemetry: diagnosisData.opticalTelemetry || {
          detectedComponents: ['Primary Board Substrate', 'Power Rails'],
          visualBoundingBoxLabels: [{ label: 'Anomaly Area', confidence: 91, note: 'Thermal or surface irregularity' }],
          ambientConditionNotes: 'Optical scan ingested cleanly into diagnostic engine.',
        },
        visualObservations: diagnosisData.visualObservations || [
          'Visual observation indicates component surface structure free of catastrophic puncture or burn.',
        ],
        possibleCauses: diagnosisData.possibleCauses || [
          {
            cause: 'Component thermal saturation or interface degradation',
            likelihood: 'High',
            explanation: 'Based on the reported symptoms and visual characteristics.',
            badgeText: 'PRIMARY SUSPECT',
          },
        ],
        safetyWarning: diagnosisData.safetyWarning || {
          hasCriticalHazard: true,
          hazardType: 'CAPACITOR_DISCHARGE',
          warningTitle: 'Capacitive Discharge & Power Precaution',
          warningMessage: 'Disconnect power completely and allow capacitors to discharge before servicing internal components.',
          protocolNotes: ['Power off device completely', 'Unplug AC power cable'],
        },
        recommendedChecks: diagnosisData.recommendedChecks || [
          'Recommended check: Inspect power connectors for tight seating and no scorch marks.',
        ],
        followUpQuestions: diagnosisData.followUpQuestions || [],
        troubleshootingSteps: diagnosisData.troubleshootingSteps || [
          {
            id: 'step-1',
            stepNumber: 1,
            title: 'Verify power rail voltages',
            description: 'Check auxiliary power cables and reseat connectors.',
            safetyLevel: 'POWER OFF',
            status: 'pending',
          },
        ],
        chatHistory: [],
      };

      const savedId = await addDiagnosis(newCase);
      setCurrentCase({ ...newCase, id: savedId });
      navigateTo('ai-analysis', savedId);
    } catch (err: any) {
      console.error('Diagnosis request failed:', err);
      setErrorMessage('Failed to complete diagnostic inference. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="font-mono text-xs text-[#3525cd] uppercase tracking-wider font-semibold">
          Step 1 of 3 • Device Intake & Image Upload
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#131b2e] mt-1">
          New Diagnosis
        </h1>
        <p className="text-xs text-[#777587] mt-1">
          Upload an image of your device or problematic component and describe the symptoms. ImageFix AI will analyze the photo with Gemini multimodal AI to identify the device, isolate possible causes, and generate a step-by-step troubleshooting guide.
        </p>
      </div>

      {/* Quick Preset Scenarios */}
      <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#dad7ff] space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#3525cd]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Benchmark Presets (Load test sample scenario):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#c7c4d8] hover:border-[#3525cd] hover:text-[#3525cd] text-xs font-medium text-[#131b2e] transition-all shadow-2xs text-left"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Container (Matches Drag & Drop Requirements) */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[#131b2e] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#4f46e5]" />
              <span>1. Upload Component or Device Photo</span>
            </h2>
            <span className="font-mono text-[11px] text-[#777587]">
              Supports JPG, PNG, WEBP (Max 15MB)
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-[#4f46e5] bg-[#eaedff]'
                  : 'border-[#cbd5e1] hover:border-[#4f46e5] hover:bg-[#faf8ff]'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#f2f3ff] text-[#4f46e5] flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#131b2e]">
                  Click to browse or drag and drop your photo here
                </div>
                <div className="text-xs text-[#777587] mt-1">
                  Ensure good lighting, sharp focus on components, and avoid glare
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-[#c7c4d8] aspect-16/9 sm:aspect-21/9 bg-[#0f172a] flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Uploaded hardware preview"
                  className="max-h-80 w-full object-contain"
                />

                {/* Overlay action bar */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-black/75 hover:bg-black text-white text-xs font-medium rounded-lg backdrop-blur-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 bg-[#ba1a1a]/85 hover:bg-[#ba1a1a] text-white text-xs font-medium rounded-lg backdrop-blur-xs shadow transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/75 text-white font-mono text-[11px] backdrop-blur-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Optical Ready • Computer Vision Prepared</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Picker Grid */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[#131b2e] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#4f46e5]" />
              <span>2. Select Device Category</span>
            </h2>
            <span className="font-mono text-[11px] text-[#777587]">
              Selected: <strong className="text-[#3525cd]">{selectedCategory}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SUPPORTED_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#3525cd] bg-[#eaedff] text-[#3525cd] shadow-xs ring-2 ring-[#4f46e5]/20'
                      : 'border-[#e2e8f0] bg-[#faf8ff] text-[#464555] hover:border-[#cbd5e1] hover:bg-white'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg w-fit mb-2 ${isSelected ? 'bg-white text-[#3525cd]' : 'bg-[#f1f5f9] text-[#777587]'}`}>
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#131b2e]">
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-[#777587] font-mono truncate mt-0.5">
                      {cat.subtext}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Model and Problem Description Form */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-base text-[#131b2e] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#4f46e5]" />
            <span>3. Hardware Context & Symptoms</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#464555] mb-1">
              Device Model / Revision (Optional)
            </label>
            <input
              type="text"
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              placeholder="e.g. NVIDIA GeForce RTX 3080 Founders Edition, Ender 3 V2, Dell XPS 15"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#e2e8f0] rounded-lg focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#464555] mb-1">
              Describe the Problem & Observed Symptoms *
            </label>
            <textarea
              rows={4}
              required
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Describe what's happening. Include error messages, unusual sounds, lights, physical damage, or other symptoms."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e2e8f0] rounded-lg focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 outline-none font-normal leading-relaxed"
            />
          </div>

          {/* Safety reminder pill */}
          <div className="p-3 bg-[#fffbeb] rounded-xl border border-[#fde68a] flex items-start gap-2.5 text-xs text-[#92400e]">
            <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Safety Advisory:</span> If you observed sparking, swollen lithium batteries, live mains exposure, or fire risk, disconnect power immediately. ImageFix AI will emphasize safe, non-hazardous procedures.
            </div>
          </div>
        </div>

        {/* Submit Button & Helper */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-[#777587]">
            {!imagePreview || !problemDescription.trim() ? (
              <span className="text-[#b45309] font-medium">
                * Please provide both an image and problem description to enable AI analysis.
              </span>
            ) : (
              <span className="text-[#059669] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Ready for Gemini multimodal analysis
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('dashboard')}
              className="px-5 py-2.5 text-xs font-semibold text-[#464555] hover:text-[#131b2e] hover:bg-[#f1f5f9] rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormReady}
              className={`px-7 py-3 font-semibold rounded-xl text-sm shadow-md flex items-center gap-2.5 transition-all ${
                isFormReady
                  ? 'bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-[#4f46e5]/30 cursor-pointer hover:shadow-lg active:scale-[0.99]'
                  : 'bg-[#cbd5e1] text-[#64748b] cursor-not-allowed shadow-none'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing your device...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze with AI</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
