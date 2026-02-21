import { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { OSProvider } from './context';
import { NavigationBar } from '../system/NavigationBar';
import { TaskSwitcher } from '../components/TaskSwitcher';
import { QuickSettings } from '../system/QuickSettings';
import { HomeScreen } from '../homescreen/HomeScreen';
import { availableApps, getAppComponent } from './AppRegistry';
import { useOS } from '../hooks/useOS';
import { AppErrorBoundary } from '../components/AppLoader';

// Memoize availableApps to prevent unnecessary re-renders
const memoizedAvailableApps = availableApps;

function OSContent() {
  const { state } = useOS();
  const [taskSwitcherOpen, setTaskSwitcherOpen] = useState(false);
  
  // Memoize the active app component to prevent unnecessary re-renders
  const ActiveAppComponent = useMemo(() => {
    return state.activeAppId ? getAppComponent(state.activeAppId) : null;
  }, [state.activeAppId]);

  // Memoize the task switcher handler
  const handleTaskSwitcherToggle = useCallback(() => {
    setTaskSwitcherOpen(prev => !prev);
  }, []);

  // Listen for custom event to open task switcher
  useEffect(() => {
    const handleOpenTaskSwitcher = () => {
      setTaskSwitcherOpen(true);
    };

    window.addEventListener('openTaskSwitcher', handleOpenTaskSwitcher);
    
    return () => {
      window.removeEventListener('openTaskSwitcher', handleOpenTaskSwitcher);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Home Screen - Always mounted */}
      <HomeScreen apps={memoizedAvailableApps} />
      
      {/* App Overlay - Shows on top of homescreen when app is open */}
      {ActiveAppComponent && (
        <div className="absolute inset-0 z-30 bg-gray-50 dark:bg-gray-900">
          <AppErrorBoundary>
            <Suspense fallback={null}>
              <ActiveAppComponent />
            </Suspense>
          </AppErrorBoundary>
        </div>
      )}
      
      {/* Navigation Bar - Always mounted */}
      <NavigationBar />
      
      {/* Overlays */}
      <QuickSettings />
      <TaskSwitcher 
        apps={memoizedAvailableApps}
        isOpen={taskSwitcherOpen}
        onClose={handleTaskSwitcherToggle}
      />
    </div>
  );
}

function App() {
  return (
    <OSProvider>
      <OSContent />
    </OSProvider>
  );
}

export default App;
