import { User, Mail, Github, Linkedin } from 'lucide-react';

export function AboutApp() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Earl Jann Rivera
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Full Stack Developer
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            I'm a passionate full stack developer with expertise in modern web technologies. 
            I love building intuitive user interfaces and robust backend systems. 
            This Android-style portfolio showcases my skills in React, TypeScript, and creative UI design.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Contact & Links
          </h2>
          <div className="space-y-3">
            <a 
              href="mailto:your.email@example.com"
              className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>your.email@example.com</span>
            </a>
            <a 
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>github.com/yourusername</span>
            </a>
            <a 
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>linkedin.com/in/yourusername</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
