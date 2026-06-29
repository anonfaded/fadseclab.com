import { createContext, useContext } from 'react';

export interface AppContextType {
  activeDialog: string | null;
  setActiveDialog: (v: string | null) => void;
  lightboxSrc: string | null;
  setLightboxSrc: (v: string | null) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContext.Provider');
  return ctx;
}
