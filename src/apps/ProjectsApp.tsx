import { ExternalLink} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  demoUrl?: string;
  githubUrl?: string;
  motivation?: string;
  problemSolved?: string;
  userFeedback?: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Android Portfolio',
    description:
      'A React + TypeScript portfolio that simulates an Android OS experience with system-style navigation and interactive UI.',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/yourusername/android-portfolio',
    motivation: 'I wanted to explore creative UI concepts while building a portfolio that feels interactive and memorable.',
    problemSolved: 'Traditional portfolios can feel static and unengaging. This project presents information in a familiar, app-based interface.',
    userFeedback: 'Users found the interface intuitive and appreciated the Android-like experience.',
  },
  {
    id: '2',
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce application featuring authentication, product management, and secure checkout flow.',
    tech: ['Node.js', 'MongoDB', 'React'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    motivation: 'To understand how full-stack systems work together in a real-world shopping flow.',
    problemSolved: 'Provides a simple and structured way to browse products and complete purchases securely.',
    userFeedback: 'Test users reported smooth navigation and a clear checkout process.',
  },
  {
    id: '3',
    title: 'Task Management App',
    description:
      'A collaborative task management app focused on simplicity, productivity, and real-time updates.',
    tech: ['Vue.js', 'Firebase'],
    demoUrl: 'https://tasks.example.com',
    githubUrl: 'https://github.com/yourusername/task-app',
    motivation: 'I wanted to practice building real-time features and collaborative workflows.',
    problemSolved: 'Helps users track tasks clearly without unnecessary complexity.',
    userFeedback: 'Users liked the clean UI and fast updates.',
  },
];

export function ProjectsApp() {
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto ">

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8"
        >
          Projects
        </motion.h1>

        <div className="grid gap-6">
          {projects.map((project, index) => {
            const isOpen = openProjectId === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>

                {/* Tech */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-6 mb-4">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:underline"
                    >
                      <FaGithub className="w-4 h-4" />
                      Source Code
                    </a>
                  )}
                </div>

                {/* Toggle */}
                {(project.motivation || project.problemSolved) && (
                  <button
                    onClick={() =>
                      setOpenProjectId(isOpen ? null : project.id)
                    }
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {isOpen ? 'Hide Project Insights' : 'View Project Insights'}
                  </button>
                )}

                {/* Insights */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300"
                    >
                      {project.motivation && (
                        <p>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            Why I built it:
                          </span>{' '}
                          {project.motivation}
                        </p>
                      )}
                      {project.problemSolved && (
                        <p>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            Problem it solves:
                          </span>{' '}
                          {project.problemSolved}
                        </p>
                      )}
                      {project.userFeedback && (
                        <p>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            User feedback:
                          </span>{' '}
                          {project.userFeedback}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}