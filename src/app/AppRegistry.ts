import { lazy } from 'react';
import type { App } from './types';

// Lazy load all app components for code splitting
const AboutApp = lazy(() => import('../apps/AboutApp').then(module => ({ default: module.AboutApp })));
const ProjectsApp = lazy(() => import('../apps/ProjectsApp').then(module => ({ default: module.ProjectsApp })));
const ContactApp = lazy(() => import('../apps/ContactApp').then(module => ({ default: module.ContactApp })));
const GalleryApp = lazy(() => import('../apps/GalleryApp').then(module => ({ default: module.GalleryApp })));
const ExperienceApp = lazy(() => import('../apps/ExperienceApp').then(module => ({ default: module.ExperienceApp })));
const TechApp = lazy(() => import('../apps/TechApp').then(module => ({ default: module.TechAppOptimized })));

// Static apps array - no hooks needed at module level
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

// Create a cache for app components to avoid repeated lookups
const appComponentCache = new Map<string, React.ComponentType>();

export function getAppComponent(appId: string) {
  // Check cache first
  if (appComponentCache.has(appId)) {
    return appComponentCache.get(appId)!;
  }

  const app = availableApps.find(a => a.id === appId);
  const component = app?.component || null;
  
  // Cache the result
  if (component) {
    appComponentCache.set(appId, component);
  }
  
  return component;
}
