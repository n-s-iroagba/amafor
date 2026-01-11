// src/types/global.d.ts
interface Window {
  gtag: (
    command: 'config' | 'event' | 'set' | 'js',
    targetId: string,
    config?: Record<string, any>
  ) => void;
  
  dataLayer?: any[];
}