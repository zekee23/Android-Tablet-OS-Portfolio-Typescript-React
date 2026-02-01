import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { osReducer, initialOSState } from './reducer';
import type { OSState, OSAction } from './types';

interface OSContextType {
  state: OSState;
  dispatch: React.Dispatch<OSAction>;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

interface OSProviderProps {
  children: ReactNode;
}

export function OSProvider({ children }: OSProviderProps) {
  const [state, dispatch] = useReducer(osReducer, initialOSState);

  return (
    <OSContext.Provider value={{ state, dispatch }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOSContext() {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error('useOSContext must be used within an OSProvider');
  }
  return context;
}
