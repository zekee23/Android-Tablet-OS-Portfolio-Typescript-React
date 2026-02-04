import { Globe, Server, Terminal, Wrench, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface TechCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  technologies: TechItem[];
}

interface TechItem {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  experience: string;
  logo: string;
}

const techData: TechCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    icon: <Globe className="w-5 h-5" />,
    color: 'blue',
    technologies: [
      {
        name: 'React',
        level: 'Expert',
        experience: '4+ years',
        logo: 'https://cdn.simpleicons.org/react/61DAFB'
      },
      {
        name: 'TypeScript',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/typescript/3178C6'
      },
      {
        name: 'Tailwind CSS',
        level: 'Expert',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4'
      },
      {
        name: 'Vue.js',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/vuedotjs/4FC08D'
      },
      {
        name: 'Next.js',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/nextdotjs/000000'
      },
      {
        name: 'React Native',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/react/61DAFB'
      },
      {
        name: 'Flutter',
        level: 'Beginner',
        experience: '1+ year',
        logo: 'https://cdn.simpleicons.org/flutter/02569B'
      }
    ]
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: <Server className="w-5 h-5" />,
    color: 'green',
    technologies: [
      {
        name: 'Node.js',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/nodedotjs/339933'
      },
      {
        name: 'Python',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/python/3776AB'
      },
      {
        name: 'PostgreSQL',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/postgresql/4169E1'
      },
      {
        name: 'Java',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/openjdk/000000'
      },
      {
        name: 'C++',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/cplusplus/00599C'
      },
      {
        name: 'C#',
        level: 'Beginner',
        experience: '1+ year',
        logo: 'https://cdn.simpleicons.org/csharp/239120'
      },
      {
        name: 'MongoDB',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/mongodb/47A248'
      }
    ]
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: <Terminal className="w-5 h-5" />,
    color: 'purple',
    technologies: [
      {
        name: 'Git',
        level: 'Expert',
        experience: '5+ years',
        logo: 'https://cdn.simpleicons.org/git/F05032'
      },
      {
        name: 'VS Code',
        level: 'Expert',
        experience: '5+ years',
        logo: 'https://cdn.simpleicons.org/visualstudiocode/007ACC'
      },
      {
        name: 'Figma',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/figma/F24E1E'
      },
      {
        name: 'Postman',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/postman/FF6C37'
      }
    ]
  },
  {
    id: 'cicd',
    name: 'CI/CD',
    icon: <Wrench className="w-5 h-5" />,
    color: 'orange',
    technologies: [
      {
        name: 'GitHub Actions',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/githubactions/2088FF'
      },
      {
        name: 'Jenkins',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/jenkins/D24939'
      },
      {
        name: 'GitLab CI',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/gitlab/FC6D26'
      }
    ]
  },
  {
    id: 'deployment',
    name: 'Deployment',
    icon: <Rocket className="w-5 h-5" />,
    color: 'teal',
    technologies: [
      {
        name: 'Docker',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/docker/2496ED'
      },
      {
        name: 'AWS',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/amazonwebservices/232F3E'
      },
      {
        name: 'Vercel',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/vercel/000000'
      },
      {
        name: 'Netlify',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/netlify/00C7B7'
      },
      {
        name: 'Kubernetes',
        level: 'Beginner',
        experience: '1+ year',
        logo: 'https://cdn.simpleicons.org/kubernetes/326CE5'
      }
    ]
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Expert': return 'from-emerald-500 to-green-600';
    case 'Advanced': return 'from-blue-500 to-blue-600';
    case 'Intermediate': return 'from-amber-500 to-orange-600';
    case 'Beginner': return 'from-slate-500 to-slate-600';
    default: return 'from-slate-500 to-slate-600';
  }
};

const getLevelBorderColor = (level: string) => {
  switch (level) {
    case 'Expert': return 'border-emerald-500/50';
    case 'Advanced': return 'border-blue-500/50';
    case 'Intermediate': return 'border-amber-500/50';
    case 'Beginner': return 'border-slate-500/50';
    default: return 'border-slate-500/50';
  }
};

const getCategoryColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'from-blue-600 to-blue-500',
    green: 'from-green-600 to-green-500',
    purple: 'from-purple-600 to-purple-500',
    orange: 'from-orange-600 to-orange-500',
    teal: 'from-teal-600 to-teal-500'
  };
  return colors[color] || 'from-slate-600 to-slate-500';
};

export function TechApp() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Tech Stack & Skills
          </motion.h1>
          <motion.p
            className="text-base text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Hover over any technology to see my proficiency level
          </motion.p>
        </motion.div>

        {/* Tech Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {techData.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl"
            >
              {/* Category Header */}
              <motion.div
                className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className={`p-2 bg-gradient-to-br ${getCategoryColor(category.color)} rounded-lg shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {category.icon}
                </motion.div>
                <h2 className="text-lg font-bold text-white">{category.name}</h2>
              </motion.div>

              {/* Technologies Grid */}
              <div className="grid grid-cols-3 gap-3">
                {category.technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: categoryIndex * 0.1 + index * 0.05 }}
                    onHoverStart={() => setHoveredTech(`${category.id}-${index}`)}
                    onHoverEnd={() => setHoveredTech(null)}
                  >
                    {/* Tech Icon Container */}
                    <motion.div
                      className="relative bg-slate-900/80 rounded-xl p-3 border border-slate-700/50 cursor-pointer aspect-square flex items-center justify-center"
                      whileHover={{ scale: 1.1, y: -4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      {/* Glow effect on hover */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${getLevelColor(tech.level)} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                      ></motion.div>
                      
                      {/* Logo */}
                      <img
                        src={tech.logo}
                        alt={tech.name}
                        className="w-full h-full object-contain relative z-10"
                        loading="lazy"
                      />

                      {/* Tooltip - Shows on hover */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={
                          hoveredTech === `${category.id}-${index}`
                            ? { opacity: 1, scale: 1, y: 0 }
                            : { opacity: 0, scale: 0.9, y: 10 }
                        }
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap"
                      >
                        <div className={`bg-slate-900 border ${getLevelBorderColor(tech.level)} rounded-lg px-3 py-2 shadow-2xl`}>
                          <div className="text-xs font-semibold text-white mb-1">
                            {tech.name}
                          </div>
                          <div className={`text-xs bg-gradient-to-r ${getLevelColor(tech.level)} bg-clip-text text-transparent font-bold`}>
                            {tech.level}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {tech.experience}
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-slate-900 border-b ${getLevelBorderColor(tech.level)} border-r rotate-45`}></div>
                      </motion.div>
                    </motion.div>

                    {/* Level indicator dot */}
                    <motion.div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br ${getLevelColor(tech.level)} rounded-full border-2 border-slate-900 shadow-lg`}
                      animate={
                        hoveredTech === `${category.id}-${index}`
                          ? { scale: [1, 1.3, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.6, repeat: hoveredTech === `${category.id}-${index}` ? Infinity : 0 }}
                    ></motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center items-center gap-6 mt-10 flex-wrap"
        >
          {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getLevelColor(level)}`}></div>
              <span className="text-xs text-slate-400">{level}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}