import type { App } from './types';
import { AboutApp } from '../apps/AboutApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ContactApp } from '../apps/ContactApp';
import {GalleryApp} from '../apps/GalleryApp';
import {ExperienceApp} from '../apps/ExperienceApp';
import {TechApp} from '../apps/TechApp';

export const availableApps: App[] = [
  {
    id: 'about',
    name: 'About Me',
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
    name: 'Contact Me',
    icon: '📧',
    component: ContactApp,
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: '🖼️',
    component: GalleryApp,
  },
  {
    id: 'experience',
    name: 'Experience',
    icon: '📈',
    component: ExperienceApp,
  },
  {
    id: 'tech',
    name: 'TechStack',
    icon: '💻',
    component: TechApp,
  }
];

export function getAppComponent(appId: string) {
  const app = availableApps.find(a => a.id === appId);
  return app?.component || null;
}
