import React, { useState } from 'react';
import {
  Plus,
  SlidersHorizontal,
  Wrench,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  Laptop,
  Cpu,
  Trash2,
  X,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SavedDevice } from '../../types';

export const SavedDevicesPage: React.FC = () => {
  const { savedDevices, addSavedDevice, deleteSavedDevice, navigateTo } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Parts');
  const [newSpecs, setNewSpecs] = useState('');
  const [newStatus, setNewStatus] = useState<'Operational' | 'Active Issue' | 'Standby'>('Operational');

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    const initials = newDeviceName.slice(0, 3).toUpperCase();

    addSavedDevice({
      name: newDeviceName,
      category: newCategory,
      subtype: newCategory.toUpperCase(),
      status: newStatus,
      diagnosesCount: 0,
      specsSummary: newSpecs || 'Verified Hardware Profile',
      lastSession: 'Registered today',
      isResolvedLastSession: newStatus === 'Operational',
      imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      tag: initials,
    });

    setIsAddModalOpen(false);
    setNewDeviceName('');
    setNewSpecs('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header matching Stitch Image 29 */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-[#3525cd] uppercase font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>HARDWARE LAB</span>
            <span>•</span>
            <span>{savedDevices.length} Active Profiles</span>
          </div>
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#131b2e] mt-1">
          Saved Devices
        </h1>
        <p className="text-xs text-[#777587] mt-0.5">
          Manage your personal hardware lab and diagnostic profiles.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex-1 py-3 px-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Device</span>
        </button>

        <button
          onClick={() => alert('Filter view: displaying all active device profiles.')}
          className="p-3 bg-white hover:bg-[#f8fafc] text-[#464555] border border-[#e2e8f0] rounded-xl transition-colors"
          title="Filter profiles"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Devices List matching Stitch Image 29 */}
      <div className="space-y-4">
        {savedDevices.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-[#e2e8f0] text-center space-y-3">
            <Cpu className="w-8 h-8 text-[#94a3b8] mx-auto" />
            <h3 className="font-display font-bold text-base text-[#131b2e]">No saved devices yet</h3>
            <p className="text-xs text-[#64748b] max-w-sm mx-auto">
              Save your custom PC builds, laptops, 3D printers, or devices to track repair history and run fast diagnostic checks.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              + Add First Device
            </button>
          </div>
        ) : (
          savedDevices.map((dev) => {
          const hasIssue = dev.status === 'Active Issue';

          return (
            <div
              key={dev.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-3"
            >
              {/* Card top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-[#e2e8f0]">
                    <img
                      src={dev.imageUrl}
                      alt={dev.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 bg-black/80 text-white font-mono text-[9px] px-1 font-bold">
                      {dev.tag}
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] uppercase text-[#777587] font-semibold">
                      {dev.subtype || dev.category}
                    </div>
                    <h3 className="font-display font-bold text-base text-[#131b2e] mt-0.5">
                      {dev.name}
                    </h3>
                    <div className="text-[11px] text-[#64748b] font-mono mt-0.5">
                      ⟳ {dev.diagnosesCount} previous diagnoses
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hasIssue ? 'bg-[#ba1a1a] animate-pulse' : 'bg-[#10b981]'
                    }`}
                  ></span>
                  <span className={hasIssue ? 'text-[#ba1a1a]' : 'text-[#059669]'}>
                    {dev.status}
                  </span>
                </div>
              </div>

              {/* Specs readout pill */}
              <div className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#e2e8f0] text-xs font-mono text-[#334155] truncate">
                {dev.specsSummary}
              </div>

              {/* Last session status */}
              <div className="flex items-center justify-between text-xs font-mono text-[#777587] pt-1">
                <span>Last session:</span>
                <span
                  className={
                    hasIssue
                      ? 'text-[#ba1a1a] font-semibold'
                      : 'text-[#059669] font-semibold'
                  }
                >
                  {dev.lastSession}
                </span>
              </div>

              {/* Actions row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f1f5f9]">
                <button
                  onClick={() => navigateTo('new-diagnosis')}
                  className="py-2 px-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Diagnose</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const updated = prompt('Edit specifications summary:', dev.specsSummary);
                      if (updated) {
                        dev.specsSummary = updated;
                      }
                    }}
                    className="flex-1 py-2 px-3 bg-white hover:bg-[#f8fafc] text-[#131b2e] border border-[#e2e8f0] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#777587]" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Remove ${dev.name} from saved hardware lab?`)) {
                        deleteSavedDevice(dev.id);
                      }
                    }}
                    className="p-2 text-[#777587] hover:text-[#ba1a1a] hover:bg-[#fee2e2] rounded-lg transition-colors border border-transparent hover:border-[#fecaca]"
                    title="Delete Device"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Profiles Synchronized bottom status card matching Stitch Image 29 */}
      <div className="p-4 rounded-2xl bg-[#eaedff]/60 border border-[#dad7ff] flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-[#3525cd] flex items-center justify-center shadow-xs">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#131b2e]">
              Profiles Synchronized
            </div>
            <div className="text-[11px] text-[#464555]">
              Device specs & diagnosis history backed up to ImageFix Cloud
            </div>
          </div>
        </div>

        <span className="font-mono text-[11px] font-bold text-[#059669] px-2.5 py-0.5 rounded bg-white border border-[#a7f3d0]">
          ONLINE
        </span>
      </div>

      {/* Add Device Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#c7c4d8] shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <h3 className="font-display font-bold text-lg text-[#131b2e]">
                Register New Lab Device
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-[#f1f5f9] rounded-lg text-[#777587]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDevice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#464555] mb-1">
                  Device / Rig Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raspberry Pi 5 Cluster, Dell Precision 5820"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e2e8f0] rounded-lg outline-none focus:border-[#4f46e5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464555] mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e2e8f0] rounded-lg outline-none focus:border-[#4f46e5]"
                >
                  <option value="Computer Parts">Computer Parts / GPUs</option>
                  <option value="Computers">Desktop Computers</option>
                  <option value="Laptops">Laptops / MacBooks</option>
                  <option value="3D Printers">3D Printers</option>
                  <option value="Routers & Network">Routers & Network</option>
                  <option value="Gaming Devices">Gaming Consoles</option>
                  <option value="Other Electronics">Other Electronics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464555] mb-1">
                  Hardware Specifications & Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Intel i9-13900K • 64GB DDR5 • RTX 4090"
                  value={newSpecs}
                  onChange={(e) => setNewSpecs(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e2e8f0] rounded-lg outline-none focus:border-[#4f46e5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464555] mb-1">
                  Initial Status
                </label>
                <div className="flex gap-2">
                  {(['Operational', 'Active Issue', 'Standby'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                        newStatus === s
                          ? 'bg-[#4f46e5] text-white border-[#4f46e5]'
                          : 'bg-white text-[#464555] border-[#e2e8f0]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#f1f5f9] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Save to Workbench
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
