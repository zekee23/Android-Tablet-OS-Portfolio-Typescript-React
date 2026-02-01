export interface App {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
}

export interface Task {
  appId: string;
  timestamp: number;
}

export interface OSState {
  activeAppId: string | null;
  taskStack: Task[];
  quickSettingsOpen: boolean;
}

export type OSAction =
  | { type: 'OPEN_APP'; payload: string }
  | { type: 'CLOSE_APP'; payload: string }
  | { type: 'SWITCH_TO_APP'; payload: string }
  | { type: 'TOGGLE_QUICK_SETTINGS' }
  | { type: 'OPEN_QUICK_SETTINGS' }
  | { type: 'CLOSE_QUICK_SETTINGS' }
  | { type: 'CLEAR_TASK_STACK' };
