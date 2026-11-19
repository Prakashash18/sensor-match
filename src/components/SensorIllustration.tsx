import type { SensorId } from '../data/sensors';

interface SensorIllustrationProps {
  sensorId: SensorId;
  className?: string;
}

export function SensorIllustration({ sensorId, className = 'w-12 h-12' }: SensorIllustrationProps) {
  switch (sensorId) {
    case 'ultrasonic':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="6" y="16" width="52" height="30" rx="5" fill="#1D4ED8" />
          <rect x="8" y="18" width="48" height="26" rx="3" fill="#2563EB" />
          <circle cx="20" cy="31" r="9.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="20" cy="31" r="6" fill="#334155" />
          <circle cx="20" cy="31" r="2.5" fill="#0F172A" />
          <circle cx="44" cy="31" r="9.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="44" cy="31" r="6" fill="#334155" />
          <circle cx="44" cy="31" r="2.5" fill="#0F172A" />
          <rect x="29" y="20" width="6" height="4" rx="1" fill="#CBD5E1" />
          <path d="M24 46v7M29.5 46v7M34.5 46v7M40 46v7" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'dht22':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="16" y="8" width="32" height="38" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="21" y="14" width="22" height="22" rx="2" fill="#E2E8F0" />
          <path d="M21 21h22M21 28h22M28 14v22M36 14v22" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="32" cy="11" r="1.5" fill="#64748B" />
          <path d="M23 46v9M29 46v9M35 46v9M41 46v9" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'pir':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="10" y="14" width="44" height="36" rx="5" fill="#15803D" />
          <circle cx="32" cy="32" r="15" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M20 26c6 4 18 4 24 0M19 34c7 4 19 4 26 0M27 18c-3 8-3 20 0 28M37 18c3 8 3 20 0 28" stroke="#E2E8F0" strokeWidth="1.4" />
          <circle cx="14" cy="18" r="1.8" fill="#FDE047" />
          <circle cx="50" cy="46" r="1.8" fill="#FDE047" />
        </svg>
      );

    case 'mq2':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="12" y="18" width="40" height="34" rx="5" fill="#1E3A8A" />
          <circle cx="32" cy="29" r="13" fill="#475569" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="32" cy="29" r="9.5" fill="#94A3B8" />
          <path d="M25 24l14 10M25 34l14-10M32 20v18M23 29h18" stroke="#475569" strokeWidth="1.3" />
          <path d="M23 52v6M29 52v6M35 52v6M41 52v6" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'ldr':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="18" y="28" width="28" height="20" rx="3" fill="#2563EB" />
          <ellipse cx="32" cy="22" rx="13" ry="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <path d="M23 20c3-3 5 3 8 0s5 3 8 0M23 24c3-3 5 3 8 0s5 3 8 0" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <path d="M25 48v8M32 48v8M39 48v8" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'soil_moisture':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="20" y="7" width="24" height="16" rx="3" fill="#0F172A" />
          <rect x="25" y="11" width="14" height="7" rx="1.5" fill="#38BDF8" />
          <path d="M22 23h20v29c0 3-2.5 5-5 5h-2V32h-6v25h-2c-2.5 0-5-2-5-5V23z" fill="#1E293B" />
          <rect x="24" y="31" width="3" height="22" rx="1.5" fill="#FBBF24" />
          <rect x="37" y="31" width="3" height="22" rx="1.5" fill="#FBBF24" />
        </svg>
      );

    case 'ir_obstacle':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="14" y="20" width="36" height="28" rx="4" fill="#1D4ED8" />
          <circle cx="24" cy="14" r="5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="21" y="15" width="6" height="6" fill="#E2E8F0" />
          <circle cx="40" cy="14" r="5" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
          <rect x="37" y="15" width="6" height="6" fill="#0F172A" />
          <rect x="27" y="30" width="10" height="10" rx="2" fill="#38BDF8" />
          <circle cx="32" cy="35" r="2.5" fill="#E0F2FE" />
          <path d="M24 48v7M32 48v7M40 48v7" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'rfid':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="10" y="12" width="44" height="36" rx="4" fill="#0F766E" />
          <rect x="15" y="17" width="34" height="24" rx="2" stroke="#5EEAD4" strokeWidth="2" />
          <rect x="20" y="22" width="24" height="14" rx="1.5" stroke="#5EEAD4" strokeWidth="1.5" />
          <rect x="27" y="26" width="10" height="6" rx="1" fill="#0F172A" />
          <path d="M18 48v7M24 48v7M30 48v7M36 48v7M42 48v7" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'bmp280':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="15" y="12" width="34" height="38" rx="5" fill="#6D28D9" />
          <rect x="24" y="22" width="16" height="16" rx="2" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="34" cy="28" r="2" fill="#334155" />
          <circle cx="21" cy="18" r="2" fill="#FDE047" />
          <circle cx="43" cy="18" r="2" fill="#FDE047" />
          <path d="M22 50v7M28.5 50v7M35.5 50v7M42 50v7" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'mpu6050':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="12" y="14" width="40" height="34" rx="4" fill="#1D4ED8" />
          <rect x="24" y="23" width="16" height="16" rx="2" fill="#0F172A" />
          <path d="M19 37V22M19 22l-2.5 3M19 22l2.5 3M19 37h15M34 37l-3-2.5M34 37l-3 2.5" stroke="#F8FAFC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 48v7M26 48v7M33 48v7M40 48v7M47 48v7" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'hx711':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="8" y="25" width="48" height="14" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.8" />
          <circle cx="15" cy="32" r="2.5" fill="#475569" />
          <circle cx="49" cy="32" r="2.5" fill="#475569" />
          <circle cx="29" cy="32" r="3.5" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="35" cy="32" r="3.5" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
          <rect x="27" y="22" width="10" height="3.5" rx="1" fill="#F8FAFC" stroke="#DC2626" strokeWidth="1.2" />
        </svg>
      );

    case 'water_flow':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="8" y="24" width="48" height="16" rx="3" fill="#0F172A" />
          <rect x="20" y="17" width="24" height="30" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="9" fill="#0EA5E9" fillOpacity="0.25" stroke="#38BDF8" strokeWidth="1.8" />
          <path d="M32 25v14M25 32h14" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 32h5M47 32h5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'flame':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="15" y="22" width="34" height="28" rx="4" fill="#BE123C" />
          <rect x="27" y="9" width="10" height="14" rx="5" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="32" cy="14" r="2.5" fill="#FB7185" />
          <rect x="26" y="31" width="12" height="10" rx="2" fill="#38BDF8" />
          <path d="M23 50v7M32 50v7M41 50v7" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'sound':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <rect x="14" y="22" width="36" height="26" rx="4" fill="#DC2626" />
          <circle cx="32" cy="15" r="8" fill="#94A3B8" stroke="#475569" strokeWidth="1.8" />
          <circle cx="32" cy="15" r="4" fill="#334155" />
          <rect x="27" y="32" width="10" height="9" rx="1.5" fill="#2563EB" />
          <path d="M22 48v7M28.5 48v7M35.5 48v7M42 48v7" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
}
