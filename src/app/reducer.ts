import type { OSState, OSAction, Task } from './types';

export const initialOSState: OSState = {
  activeAppId: null,
  taskStack: [],
  quickSettingsOpen: false,
};

export function osReducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    case 'OPEN_APP': {
      const newTask: Task = {
        appId: action.payload,
        timestamp: Date.now(),
        paused: false,
      };
      
      const existingTaskIndex = state.taskStack.findIndex(task => task.appId === action.payload);
      
      let newTaskStack: Task[];
      if (existingTaskIndex !== -1) {
        newTaskStack = [
          ...state.taskStack.slice(0, existingTaskIndex),
          ...state.taskStack.slice(existingTaskIndex + 1),
          newTask,
        ];
      } else {
        newTaskStack = [...state.taskStack, newTask];
      }

      return {
        ...state,
        activeAppId: action.payload,
        taskStack: newTaskStack,
      };
    }

    case 'CLOSE_APP': {
      const newTaskStack = state.taskStack.filter(task => task.appId !== action.payload);
      
      // Always go to home when closing an app (set activeAppId to null)
      return {
        ...state,
        activeAppId: null,
        taskStack: newTaskStack,
      };
    }

    case 'SWITCH_TO_APP': {
      const taskIndex = state.taskStack.findIndex(task => task.appId === action.payload);
      if (taskIndex === -1) return state;

      const task = state.taskStack[taskIndex];
      const newTaskStack = [
        ...state.taskStack.slice(0, taskIndex),
        ...state.taskStack.slice(taskIndex + 1),
        task,
      ];

      return {
        ...state,
        activeAppId: action.payload,
        taskStack: newTaskStack,
      };
    }

    case 'TOGGLE_QUICK_SETTINGS':
      return {
        ...state,
        quickSettingsOpen: !state.quickSettingsOpen,
      };

    case 'OPEN_QUICK_SETTINGS':
      return {
        ...state,
        quickSettingsOpen: true,
      };

    case 'CLOSE_QUICK_SETTINGS':
      return {
        ...state,
        quickSettingsOpen: false,
      };

    case 'PAUSE_APP': {
      const newTaskStack = state.taskStack.map(task => 
        task.appId === action.payload ? { ...task, paused: true } : task
      );
      
      return {
        ...state,
        taskStack: newTaskStack,
        activeAppId: action.payload === state.activeAppId ? null : state.activeAppId,
      };
    }

    case 'RESUME_APP': {
      const newTaskStack = state.taskStack.map(task => 
        task.appId === action.payload ? { ...task, paused: false } : task
      );
      
      const task = newTaskStack.find(t => t.appId === action.payload);
      const updatedTaskStack = task ? [
        ...newTaskStack.filter(t => t.appId !== action.payload),
        task
      ] : newTaskStack;

      return {
        ...state,
        activeAppId: action.payload,
        taskStack: updatedTaskStack,
      };
    }

    case 'CLEAR_TASK_STACK':
      return {
        ...state,
        taskStack: [],
        activeAppId: null,
      };

    default:
      return state;
  }
}
