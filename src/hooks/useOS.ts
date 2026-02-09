import { useCallback } from 'react';
import { useOSContext } from '../app/context';

export function useOS() {
  const { state, dispatch } = useOSContext();

  const openApp = useCallback((appId: string) => {
    dispatch({ type: 'OPEN_APP', payload: appId });
  }, [dispatch]);

  const closeApp = useCallback((appId: string) => {
    dispatch({ type: 'CLOSE_APP', payload: appId });
  }, [dispatch]);

  const switchToApp = useCallback((appId: string) => {
    dispatch({ type: 'SWITCH_TO_APP', payload: appId });
  }, [dispatch]);

  const clearTaskStack = useCallback(() => {
    dispatch({ type: 'CLEAR_TASK_STACK' });
  }, [dispatch]);

  const pauseApp = useCallback((appId: string) => {
    dispatch({ type: 'PAUSE_APP', payload: appId });
  }, [dispatch]);

  const resumeApp = useCallback((appId: string) => {
    dispatch({ type: 'RESUME_APP', payload: appId });
  }, [dispatch]);

  return {
    state,
    actions: {
      openApp,
      closeApp,
      switchToApp,
      clearTaskStack,
      pauseApp,
      resumeApp,
    },
  };
}
