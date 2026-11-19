import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { SENSORS, type SensorSpec } from '../data/sensors';
import { SensorIllustration } from './SensorIllustration';

interface FieldGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_SENSORS: SensorSpec[] = Object.values(SENSORS);

export function FieldGuideModal({ isOpen, onClose }: FieldGuideModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? ALL_SENSORS.filter(
        (s) =>
          s.name.toLowerCase().includes(normalized) ||
          s.model.toLowerCase().includes(normalized) ||
          s.shortRole.toLowerCase().includes(normalized) ||
          s.signal.toLowerCase().includes(normalized)
      )
    : ALL_SENSORS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="field-guide-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-3xl max-h-[88vh] bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 shrink-0" />

        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-200">
          <div>
            <h2 id="field-guide-title" className="text-xl font-bold text-slate-900">
              IoT Sensor Field Guide
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              14 lab modules · Hardware specs &amp; signal types
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Field Guide"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sensor, model (e.g. HC-SR04), or signal..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.length === 0 ? (
            <div className="sm:col-span-2 py-10 text-center text-sm text-slate-500">
              No sensors matched &ldquo;{query}&rdquo;. Try another keyword.
            </div>
          ) : (
            filtered.map((sensor) => (
              <div
                key={sensor.id}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-white"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <SensorIllustration sensorId={sensor.id} className="w-11 h-11" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {sensor.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5 font-mono-tabular">
                    {sensor.model} · {sensor.signal}
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {sensor.shortRole}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
