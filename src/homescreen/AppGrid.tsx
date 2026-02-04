import type { App } from '../app/types';

interface AppGridProps {
  apps: App[];
  onAppClick: (appId: string) => void;
}

export function AppGrid({ apps, onAppClick }: AppGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onAppClick(app.id)}
          className="flex flex-col items-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
        >
          <div className="w-14 h-14 mb-3 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <span className="text-white text-2xl font-bold">
              {app.icon}
            </span>
          </div>
          <span className="text-xs text-white/90 text-center font-medium">
            {app.name}
          </span>
        </button>
      ))}
    </div>
  );
}
