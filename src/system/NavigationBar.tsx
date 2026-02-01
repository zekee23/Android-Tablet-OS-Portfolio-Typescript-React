import { Home, Square, ArrowLeft } from 'lucide-react';
import { useOS } from '../hooks/useOS';

export function NavigationBar() {
  const { state, actions } = useOS();

  const handleHome = () => {
    actions.closeApp(state.activeAppId || '');
  };

  const handleBack = () => {
    if (state.taskStack.length > 1) {
      const previousApp = state.taskStack[state.taskStack.length - 2];
      actions.switchToApp(previousApp.appId);
    } else {
      actions.closeApp(state.activeAppId || '');
    }
  };

  const handleRecent = () => {
    // TODO: Open task switcher
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-black bg-opacity-90 backdrop-blur flex items-center justify-around z-50">
      <button
        onClick={handleBack}
        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        disabled={!state.activeAppId}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleHome}
        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
      >
        <Home className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleRecent}
        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
      >
        <Square className="w-5 h-5" />
      </button>
    </div>
  );
}
