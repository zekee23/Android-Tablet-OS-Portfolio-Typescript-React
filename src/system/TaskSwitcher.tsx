import { X } from 'lucide-react';
import { useOS } from '../hooks/useOS';
import type { App } from '../app/types';

interface TaskSwitcherProps {
  apps: App[];
  isOpen: boolean;
  onClose: () => void;
}

export function TaskSwitcher({ apps, isOpen, onClose }: TaskSwitcherProps) {
  const { state, actions } = useOS();

  if (!isOpen) return null;

  const handleTaskClick = (appId: string) => {
    actions.switchToApp(appId);
    onClose();
  };

  const handleTaskClose = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    actions.closeApp(appId);
  };

  const recentApps = state.taskStack
    .slice()
    .reverse()
    .map(task => apps.find(app => app.id === task.appId))
    .filter(Boolean) as App[];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end">
      <div className="bg-white dark:bg-gray-800 w-full max-h-96 rounded-t-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Apps
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {recentApps.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No recent apps
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {recentApps.map((app) => (
              <div
                key={app.id}
                onClick={() => handleTaskClick(app.id)}
                className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <button
                  onClick={(e) => handleTaskClose(e, app.id)}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-2 flex items-center justify-center bg-blue-500 rounded-lg">
                    <span className="text-white text-xl font-bold">
                      {app.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 text-center">
                    {app.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
