import { useState } from 'react';
import { OSProvider } from './context';
import { NavigationBar } from '../system/NavigationBar';
import { TaskSwitcher } from '../system/TaskSwitcher';
import { QuickSettings } from '../system/QuickSettings';
import { HomeScreen } from '../homescreen/HomeScreen';
import { availableApps, getAppComponent } from './AppRegistry';
import { useOS } from '../hooks/useOS';

function OSContent() {
  const { state } = useOS();
  const [taskSwitcherOpen, setTaskSwitcherOpen] = useState(false);
  
  const ActiveAppComponent = state.activeAppId ? getAppComponent(state.activeAppId) : null;

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      {ActiveAppComponent ? (
        <ActiveAppComponent />
      ) : (
        <HomeScreen apps={availableApps} />
      )}
      
      {/* Navigation Bar - Always mounted */}
      <NavigationBar />
      
      {/* Overlays */}
      <QuickSettings />
      <TaskSwitcher 
        apps={availableApps}
        isOpen={taskSwitcherOpen}
        onClose={() => setTaskSwitcherOpen(false)}
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
