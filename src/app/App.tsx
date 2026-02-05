import { useState, Suspense, useMemo, useCallback } from 'react';
import { OSProvider } from './context';
import { NavigationBar } from '../system/NavigationBar';
import { TaskSwitcher } from '../system/TaskSwitcher';
import { QuickSettings } from '../system/QuickSettings';
import { HomeScreen } from '../homescreen/HomeScreen';
import { availableApps, getAppComponent } from './AppRegistry';
import { useOS } from '../hooks/useOS';
import { AppLoader, AppErrorBoundary } from '../components/AppLoader';

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

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <AppErrorBoundary>
        <Suspense fallback={<AppLoader />}>
          {ActiveAppComponent ? (
            <ActiveAppComponent />
          ) : (
            <HomeScreen apps={availableApps} />
          )}
        </Suspense>
      </AppErrorBoundary>
      
      {/* Navigation Bar - Always mounted */}
      <NavigationBar />
      
      {/* Overlays */}
      <QuickSettings />
      <TaskSwitcher 
        apps={availableApps}
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
