import type { App } from './types';
import { AboutApp } from '../apps/AboutApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ContactApp } from '../apps/ContactApp';

export const availableApps: App[] = [
  {
    id: 'about',
    name: 'About',
    icon: '👤',
    component: AboutApp,
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '💼',
    component: ProjectsApp,
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: '📧',
    component: ContactApp,
  },
];

export function getAppComponent(appId: string) {
  const app = availableApps.find(a => a.id === appId);
  return app?.component || null;
}
