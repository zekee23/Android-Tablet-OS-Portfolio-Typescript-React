import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  demoUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Android Portfolio',
    description: 'A React + TypeScript portfolio that simulates an Android OS experience with task management, system UI, and app navigation.',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/yourusername/android-portfolio',
  },
  {
    id: '2',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with user authentication, payment processing, and inventory management.',
    tech: ['Node.js', 'MongoDB', 'React', 'Stripe'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/yourusername/ecommerce',
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'Collaborative task management application with real-time updates and team collaboration features.',
    tech: ['Vue.js', 'Firebase', 'Vuex'],
    demoUrl: 'https://tasks.example.com',
    githubUrl: 'https://github.com/yourusername/task-app',
  },
];

export function ProjectsApp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          My Projects
        </h1>
        
        <div className="space-y-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {project.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
