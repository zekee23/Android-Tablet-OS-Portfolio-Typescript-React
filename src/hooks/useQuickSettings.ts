import { useCallback } from 'react';
import { useOSContext } from '../app/context';

export function useQuickSettings() {
  const { state, dispatch } = useOSContext();

  const toggleQuickSettings = useCallback(() => {
    dispatch({ type: 'TOGGLE_QUICK_SETTINGS' });
  }, [dispatch]);

  const openQuickSettings = useCallback(() => {
    dispatch({ type: 'OPEN_QUICK_SETTINGS' });
  }, [dispatch]);

  const closeQuickSettings = useCallback(() => {
    dispatch({ type: 'CLOSE_QUICK_SETTINGS' });
  }, [dispatch]);

  return {
    isOpen: state.quickSettingsOpen,
    toggle: toggleQuickSettings,
    open: openQuickSettings,
    close: closeQuickSettings,
  };
}
