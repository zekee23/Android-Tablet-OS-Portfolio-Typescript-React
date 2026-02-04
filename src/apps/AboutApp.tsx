import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

export function AboutApp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="relative w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
            <img
              src="/avatar.jpg"
              alt="Earl Jann Rivera"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Earl Jann Rivera
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Junior Full Stack Developer • PERN & MERN Stack
          </p>

          <div className="mt-4 flex justify-center">
            <a
              href="/Earl Jann Rivera Resume (3).pdf"
              download
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-md"
            >
              Download Resume
            </a>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            About Me
          </h2>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            I’m a <span className="font-medium text-gray-800 dark:text-gray-200">
              Junior Full Stack Developer
            </span>{' '}
            focused on building clean, reliable, and user-friendly web applications using modern
            JavaScript technologies.
            <br /><br />
            I primarily work with the PERN stack (PostgreSQL, Express, React, Node.js) and have
            experience with the MERN stack and core JavaScript. I enjoy learning best practices,
            writing maintainable code, and understanding how systems work end to end — from the
            user interface down to the backend logic.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact & Links
          </h2>

          <div className="space-y-4">
            <a
              href="mailto:earlrivera00@gmail.com"
              className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <Mail className="w-5 h-5" />
              <span>earlrivera00@gmail.com</span>
            </a>

            <a
              href="https://github.com/zekee23"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <FaGithub className="w-5 h-5" />
              <span>github.com/zekee23</span>
            </a>

            <a
              href="www.linkedin.com/in/earl-jann-rivera-835a8034a"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <FaLinkedin className="w-5 h-5" />
              <span>www.linkedin.com/in/earl-jann-rivera-835a8034a</span>
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
