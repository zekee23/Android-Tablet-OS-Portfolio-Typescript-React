import { Globe, Server, Terminal, Wrench, Rocket, Database, Code } from 'lucide-react';
import { useState, useMemo, memo, useCallback } from 'react';

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
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/react/61DAFB'
      },
      {
        name: 'TypeScript',
        level: 'Advanced',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/typescript/3178C6'
      },
      {
        name: 'Tailwind CSS',
        level: 'Advanced',
        experience: '1+ years',
        logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4'
      },
      {
        name:'JavaScript',
        level: 'Expert',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/javascript/F7DF1E'
      },
      {
        name: 'Next.js',
        level: 'Beginner',
        experience: 'less than 1 year',
        logo: 'https://cdn.simpleicons.org/nextdotjs/000000'
      },
      {
        name: 'React Native',
        level: 'Beginner',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/react/61DAFB'
      },
      {
        name: 'Flutter',
        level: 'Intermediate',
        experience: '2+ year',
        logo: 'https://cdn.simpleicons.org/flutter/02569B'
      },
      {
        name: 'HTML',
        level: 'Expert',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/html5/E34F26'
      },
      {
        name: 'CSS',
        level: 'Expert',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/css/06B6D4'
      }
    ]
  },
  {
    id: 'software-dev',
    name: 'Software Development',
    icon: <Code className="w-5 h-5" />,
    color: 'indigo',
    technologies: [
      {
        name: 'Java',
        level: 'Advanced',
        experience: '3+ years',
        logo: 'https://www.vectorlogo.zone/logos/java/java-ar21.svg'
      },
      {
        name: 'C++',
        level: 'Advanced',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/cplusplus/00599C'
      },
      {
        name: 'C#',
        level: 'Advanced',
        experience: '3+ year',
        logo: './csharp-logo.svg'
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
        level: 'Intermediate',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/nodedotjs/339933'
      },
      {
        name: 'C#',
        level: 'Advanced',
        experience: '3+ year',
        logo: './csharp-logo.svg'
      },
      {
        name:'PHP',
        level: 'Advanced',
        experience: '2 years',
        logo: 'https://cdn.simpleicons.org/php/777BB4'
      },
      {
        name: 'Python',
        level: 'Advanced',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/python/3776AB'
      }
    ]
  },
  {
    id: 'database',
    name: 'Database',
    icon: <Database className="w-5 h-5" />,
    color: 'cyan',
    technologies: [
      {
        name: 'PostgreSQL',
        level: 'Intermediate',
        experience: '3+ years',
        logo: 'https://cdn.simpleicons.org/postgresql/4169E1'
      },
      {
        name: 'MongoDB',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/mongodb/47A248'
      },
      {
        name: 'MySQL',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/mysql/4479A1'
      },
      {
        name: 'MSSQL',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg'
      },
      {
        name: 'Firebase',
        level: 'Intermediate',
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/firebase/FFCA28'
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
        name: 'GitHub',
        level: 'Expert',
        experience: '5+ years',
        logo: 'https://cdn.simpleicons.org/github/2088FF'
      },
      {
        name: 'Lighthouse',
        level: 'Expert',
        experience: '5+ years',
        logo: 'https://cdn.simpleicons.org/lighthouse/FFCA28'
      },
      {
        name: 'VS Code',
        level: 'Expert',
        experience: '5+ years',
        logo: './vscode.png'
      },
      {
        name: 'Postman',
        level: 'Intermediate',
        experience: '2+ years',
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
        experience: '2+ years',
        logo: 'https://cdn.simpleicons.org/githubactions/2088FF'
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
    name: 'Cloud Deployment',
    icon: <Rocket className="w-5 h-5" />,
    color: 'teal',
    technologies: [
      {
        name: 'Docker',
        level: 'Beginner',
        experience: '1 year',
        logo: 'https://cdn.simpleicons.org/docker/2496ED'
      },
      {
        name: 'AWS',
        level: 'Beginner',
        experience: '1 year',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg'
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
        experience: '1 year',
        logo: 'https://cdn.simpleicons.org/kubernetes/326CE5'
      }
    ]
  }
];

// Memoized helper functions
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
    teal: 'from-teal-600 to-teal-500',
    indigo: 'from-indigo-600 to-indigo-500',
    cyan: 'from-cyan-600 to-cyan-500'
  };
  return colors[color] || 'from-slate-600 to-slate-500';
};

// Optimized TechItem component without Framer Motion
const TechItem = memo(({ 
  tech, 
  isHovered, 
  onHoverStart, 
  onHoverEnd,
}: { 
  tech: TechItem; 
  isHovered: boolean; 
  onHoverStart: () => void; 
  onHoverEnd: () => void;
}) => {
  const levelColor = useMemo(() => getLevelColor(tech.level), [tech.level]);
  const levelBorderColor = useMemo(() => getLevelBorderColor(tech.level), [tech.level]);

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* Tech Icon Container */}
      <div
        className="relative bg-slate-900/80 rounded-xl p-3 border border-slate-700/50 aspect-square flex items-center justify-center transition-all duration-200 hover:scale-105 hover:-translate-y-1"
      >
        {/* Glow effect on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${levelColor} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
        />
        
        {/* Logo */}
        <img
          src={tech.logo}
          alt={tech.name}
          className="w-full h-full object-contain relative z-10"
          loading="lazy"
        />

        {/* Tooltip - Shows on hover */}
        {isHovered && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap animate-fade-in">
            <div className={`bg-slate-900 border ${levelBorderColor} rounded-lg px-3 py-2 shadow-2xl`}>
              <div className="text-xs font-semibold text-white mb-1">
                {tech.name}
              </div>
              <div className={`text-xs bg-gradient-to-r ${levelColor} bg-clip-text text-transparent font-bold`}>
                {tech.level}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {tech.experience}
              </div>
            </div>
            {/* Arrow */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-slate-900 border-b ${levelBorderColor} border-r rotate-45`} />
          </div>
        )}
      </div>

      {/* Level indicator dot */}
      <div
        className={`absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br ${levelColor} rounded-full border-2 border-slate-900 shadow-lg transition-transform duration-200 ${isHovered ? 'scale-125' : 'scale-100'}`}
      />
    </div>
  );
});

TechItem.displayName = 'TechItem';

// Optimized CategoryCard component without Framer Motion
const CategoryCard = memo(({ 
  category, 
  hoveredTech, 
  setHoveredTech 
}: { 
  category: TechCategory; 
  hoveredTech: string | null; 
  setHoveredTech: (value: string | null) => void;
}) => {
  const categoryColor = useMemo(() => getCategoryColor(category.color), [category.color]);

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
        <div className={`p-2 bg-gradient-to-br ${categoryColor} rounded-lg shadow-lg transition-transform duration-200 hover:scale-110 hover:rotate-3`}>
          {category.icon}
        </div>
        <h2 className="text-lg font-bold text-white">{category.name}</h2>
      </div>

      {/* Technologies Grid */}
      <div className="grid grid-cols-3 gap-3">
        {category.technologies.map((tech, index) => {
          const techId = `${category.id}-${index}`;
          return (
            <TechItem
              key={techId}
              tech={tech}
              isHovered={hoveredTech === techId}
              onHoverStart={() => setHoveredTech(techId)}
              onHoverEnd={() => setHoveredTech(null)}
            />
          );
        })}
      </div>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export function TechAppOptimized() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  // Memoize legend items
  const legendItems = useMemo(() => ['Expert', 'Advanced', 'Intermediate', 'Beginner'], []);
  
  // Memoize the hover handler to prevent recreation
  const handleHoverTech = useCallback((techId: string | null) => {
    setHoveredTech(techId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Simplified background for better performance */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Reduced gradient orbs for performance */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl w-full relative z-10">
        {/* Header - No animations */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl pt-5 font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
            Tech Stack & Skills
          </h1>
          <p className="text-base text-slate-400">
            Hover over any technology to see my proficiency level
          </p>
        </div>

        {/* Tech Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {techData.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              hoveredTech={hoveredTech}
              setHoveredTech={handleHoverTech}
            />
          ))}
        </div>

        {/* Legend - No animations */}
        <div className="flex justify-center items-center gap-6 mt-10 flex-wrap">
          {legendItems.map((level) => {
            const levelColor = getLevelColor(level);
            return (
              <div key={level} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${levelColor}`} />
                <span className="text-xs text-slate-400">{level}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
