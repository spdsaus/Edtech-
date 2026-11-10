import React, { useState } from 'react';
import {
  Settings,
  User,
  School,
  BookOpen,
  Radio,
  Bell,
  Moon,
  Wifi,
  WifiOff,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Plus,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { TeacherSettings, LanguageCode, ChannelType } from '../../types';
import { OFFICIAL_LANGUAGES } from '../../data/initialData';
import { useToast } from '../../context/ToastContext';

interface SettingsViewProps {
  settings: TeacherSettings;
  onSaveSettings: (settings: TeacherSettings) => void;
  onToggleOnline: () => void;
  onResetDemoData: () => void;
  onOpenOnboarding: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onToggleOnline,
  onResetDemoData,
  onOpenOnboarding,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<TeacherSettings>({ ...settings });
  const [newTextbook, setNewTextbook] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    showToast('success', 'Settings Saved', 'Platform configuration persisted to local storage.');
  };

  const handleAddTextbook = () => {
    if (!newTextbook.trim()) return;
    setFormData((prev) => ({
      ...prev,
      textbooks: [...prev.textbooks, newTextbook.trim()],
    }));
    setNewTextbook('');
    showToast('info', 'Textbook Added', 'CAPS approved material registered.');
  };

  const handleRemoveTextbook = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      textbooks: prev.textbooks.filter((_, i) => i !== index),
    }));
  };

  const handleForceSync = () => {
    const updated = {
      ...formData,
      pendingSyncCount: 0,
      lastSyncedAt: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (Manual Sync)',
    };
    setFormData(updated);
    onSaveSettings(updated);
    showToast('info', 'Local Data Saved', 'This prototype stores data in this browser only. Cloud sync is not connected.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#171936] tracking-tight">
            Platform Settings & School Configuration
          </h2>
          <p className="text-xs text-gray-500">
            Educator identity, CAPS curriculum registry, quiet hours & offline network simulator
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#5145C5] text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-[#5145C5]" />
            <span>Guided App Tour</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* NETWORK / OFFLINE LOAD-SHEDDING SIMULATOR WIDGET */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          formData.isOnlineMode
            ? 'bg-white border-gray-200 shadow-sm'
            : 'bg-amber-50/80 border-amber-300 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                formData.isOnlineMode ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-200 text-amber-900'
              }`}
            >
              {formData.isOnlineMode ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#171936]">
                  {formData.isOnlineMode ? 'Simulated Online Mode' : 'Simulated Load-Shedding / Offline Mode'}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    formData.isOnlineMode
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {formData.isOnlineMode ? 'Connected' : 'Offline Cache Active'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Local storage status: <strong className="text-gray-900">{formData.lastSyncedAt}</strong>
                {formData.pendingSyncCount > 0 && (
                  <span className="text-amber-800 font-semibold ml-2">
                    • {formData.pendingSyncCount} changes queued locally
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleOnline}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                formData.isOnlineMode
                  ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                  : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {formData.isOnlineMode ? 'Simulate Going Offline' : 'Reconnect Online'}
            </button>

            <button
              type="button"
              onClick={handleForceSync}
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
            >
              Clear Pending Counter
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Card 1: Educator Profile */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <User className="w-4 h-4 text-[#5145C5]" />
            <h3 className="text-sm font-bold text-[#171936]">Educator Profile</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Staff / Employee ID</label>
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Official Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Professional Title & Role</label>
              <input
                type="text"
                value={formData.teacherTitle}
                onChange={(e) => setFormData({ ...formData, teacherTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Card 2: School Details */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <School className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-[#171936]">School & Circuit Details</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">School Name</label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">District</label>
                <input
                  type="text"
                  value={formData.schoolDistrict}
                  onChange={(e) => setFormData({ ...formData, schoolDistrict: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Circuit</label>
                <input
                  type="text"
                  value={formData.schoolCircuit}
                  onChange={(e) => setFormData({ ...formData, schoolCircuit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Province & National Standard</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Quiet Hours & Communication Policy */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Moon className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-[#171936]">Quiet Hours & POPIA Policy</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={formData.enforceQuietHours}
                onChange={(e) => setFormData({ ...formData, enforceQuietHours: e.target.checked })}
                className="w-4 h-4 rounded text-[#5145C5] focus:ring-[#5145C5]"
              />
              <span>Strictly enforce school quiet hours (Automate morning scheduling)</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Evening Quiet Hours Start</label>
                <input
                  type="text"
                  value={formData.quietHoursStart}
                  onChange={(e) => setFormData({ ...formData, quietHoursStart: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  placeholder="18:00"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Morning Quiet Hours End</label>
                <input
                  type="text"
                  value={formData.quietHoursEnd}
                  onChange={(e) => setFormData({ ...formData, quietHoursEnd: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  placeholder="06:30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Default Parent Channel</label>
                <select
                  value={formData.defaultChannel}
                  onChange={(e) => setFormData({ ...formData, defaultChannel: e.target.value as ChannelType })}
                  className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-white"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="SMS">SMS</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Default Preview Language</label>
                <select
                  value={formData.defaultLanguage}
                  onChange={(e) => setFormData({ ...formData, defaultLanguage: e.target.value as LanguageCode })}
                  className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-white"
                >
                  {OFFICIAL_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Approved CAPS Textbooks */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-[#171936]">Approved CAPS Textbooks</h3>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Spot On Natural Sciences Gr 9"
                value={newTextbook}
                onChange={(e) => setNewTextbook(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddTextbook}
                className="px-3 py-2 bg-[#5145C5] text-white rounded-xl font-bold text-xs hover:bg-[#4337b0] transition-colors"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pt-2">
              {formData.textbooks.map((tb, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between text-[11px]"
                >
                  <span className="font-medium text-gray-800 truncate">{tb}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTextbook(idx)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* DANGER ZONE / DEMO RESET */}
      <div className="p-5 rounded-2xl border border-red-200 bg-red-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-red-950 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span>Clear Local Prototype Data</span>
          </h4>
          <p className="text-xs text-red-800/80 mt-0.5">
            Removes records stored in this browser. This does not affect any cloud account.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Clear all locally stored prototype records? This cannot be undone.')) {
              onResetDemoData();
              showToast('info', 'Workspace Cleared', 'All local records have been cleared.');
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs shrink-0"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
