import { X, Smartphone } from 'lucide-react';
import { useOS } from '../hooks/useOS';
import { useState } from 'react';
import type { App } from '../app/types';

interface TaskSwitcherProps {
  apps: App[];
  isOpen: boolean;
  onClose: () => void;
}

export function TaskSwitcher({ apps, isOpen, onClose }: TaskSwitcherProps) {
  const { state, actions } = useOS();
  const [isClearing, setIsClearing] = useState(false);
  const [removingTasks, setRemovingTasks] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleAppClick = (appId: string) => {
    if (state.activeAppId === appId) {
      // If clicking the active app, close task switcher
      onClose();
    } else {
      // Switch to the selected app
      actions.switchToApp(appId);
      onClose();
    }
  };

  const handleAppClose = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation(); // Prevent app click
    actions.closeApp(appId);
  };

  const handleClearAll = async () => {
    if (state.taskStack.length === 0) return;
    
    setIsClearing(true);
    
    // Get tasks in reverse order (most recent first) for staggered animation
    const tasksToRemove = [...state.taskStack].reverse();
    
    // Animate each task removal with staggered delay
    tasksToRemove.forEach((task, index) => {
      setTimeout(() => {
        setRemovingTasks(prev => new Set(prev).add(task.appId));
      }, index * 100); // 100ms delay between each
    });
    
    // Wait for all animations to complete, then clear and close
    setTimeout(() => {
      actions.clearTaskStack();
      setRemovingTasks(new Set());
      setIsClearing(false);
      onClose();
    }, tasksToRemove.length * 100 + 300); // Extra 300ms for fade-out
  };

  // Get task info for each task in stack
  const getTaskInfo = (taskId: string) => {
    return apps.find(app => app.id === taskId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Apps</h2>
          <div className="flex items-center gap-2">
            {state.taskStack.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={isClearing}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  isClearing 
                    ? 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
                    : 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                }`}
              >
                {isClearing ? 'Clearing...' : 'Clear All'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {state.taskStack.length === 0 ? (
            <div className="text-center py-12">
              <Smartphone className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No recent apps</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Open some apps to see them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Show tasks in reverse order (most recent first) */}
              {[...state.taskStack].reverse().map((task, index) => {
                const appInfo = getTaskInfo(task.appId);
                if (!appInfo) return null;

                const isActive = state.activeAppId === task.appId;
                const isPaused = task.paused;
                const isRemoving = removingTasks.has(task.appId);

                return (
                  <div
                    key={task.appId}
                    onClick={() => !isClearing && handleAppClick(task.appId)}
                    className={`
                      relative group cursor-pointer rounded-xl p-4 transition-all duration-300
                      ${isRemoving 
                        ? 'opacity-0 scale-95 rotate-3' 
                        : 'opacity-100 scale-100 rotate-0'
                      }
                      ${isActive && !isRemoving
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400' 
                        : isRemoving
                        ? 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                      ${isClearing ? 'pointer-events-none' : ''}
                    `}
                    style={{
                      transitionDelay: isRemoving ? '0ms' : `${index * 50}ms`,
                      transform: isRemoving ? 'translateY(20px)' : 'translateY(0)'
                    }}
                  >
                    {/* Close button */}
                    {!isClearing && (
                      <button
                        onClick={(e) => handleAppClose(e, task.appId)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    {/* App Icon */}
                    <div className="text-4xl mb-2 text-center">
                      {appInfo.icon}
                    </div>

                    {/* App Name */}
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white text-center truncate">
                      {appInfo.name}
                    </h3>

                    {/* Status Indicators */}
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {isActive && !isRemoving && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Active
                        </span>
                      )}
                      {isPaused && !isActive && !isRemoving && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Paused
                        </span>
                      )}
                    </div>

                    {/* Active indicator dot */}
                    {isActive && !isRemoving && (
                      <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with instructions */}
        {state.taskStack.length > 0 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Click an app to switch • Hover and click X to close individual apps
            </p>
          </div>
        )}
      </div>
    </div>
  );
}