import { Computer,Globe, Smartphone, Server, Terminal, Cloud } from 'lucide-react';

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
  projects: string[];
  description?: string;
}

const techData: TechCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: <Globe className="w-6 h-6" />,
    color: 'blue',
    technologies: [
      {
        name: 'React',
        level: 'Expert',
        experience: '4+ years',
        projects: ['Portfolio Website', 'E-commerce Platform', 'Admin Dashboard'],
        description: 'Hooks, Context API, Redux, Next.js'
      },
      {
        name: 'TypeScript',
        level: 'Advanced',
        experience: '3+ years',
        projects: ['Type-safe APIs', 'Component Libraries', 'Enterprise Apps'],
        description: 'Advanced types, generics, decorators'
      },
      {
        name: 'Tailwind CSS',
        level: 'Expert',
        experience: '3+ years',
        projects: ['Design Systems', 'Responsive Layouts', 'Component Libraries'],
        description: 'Custom configurations, animations, plugins'
      },
      {
        name: 'Vue.js',
        level: 'Intermediate',
        experience: '2+ years',
        projects: ['SPA Applications', 'Component Libraries'],
        description: 'Vue 3, Composition API, Vuex'
      }
    ]
  },
  {
    id: 'backend',
    name: 'Backend Development',
    icon: <Server className="w-6 h-6" />,
    color: 'green',
    technologies: [
      {
        name: 'Node.js',
        level: 'Advanced',
        experience: '3+ years',
        projects: ['REST APIs', 'GraphQL Services', 'Microservices'],
        description: 'Express, Fastify, NestJS'
      },
      {
        name: 'Python',
        level: 'Intermediate',
        experience: '2+ years',
        projects: ['Data Processing', 'Automation Scripts', 'Web Scraping'],
        description: 'Django, FastAPI, Flask'
      },
      {
        name: 'PostgreSQL',
        level: 'Advanced',
        experience: '3+ years',
        projects: ['Database Design', 'Query Optimization', 'Data Migration'],
        description: 'Advanced queries, indexing, performance tuning'
      }
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    icon: <Smartphone className="w-6 h-6" />,
    color: 'purple',
    technologies: [
      {
        name: 'React Native',
        level: 'Intermediate',
        experience: '2+ years',
        projects: ['iOS Apps', 'Android Apps', 'Cross-platform Solutions'],
        description: 'Native modules, navigation, state management'
      },
      {
        name: 'Flutter',
        level: 'Beginner',
        experience: '1+ year',
        projects: ['Mobile Prototypes', 'Simple Apps'],
        description: 'Widgets, state management, packages'
      }
    ]
  },
  {
    id:'softdev',
    name:'Software Development',
    icon:<Computer className="w-6 h-6" />,
    color:'red',
    technologies:[
        {
            name:'Java',
            level:'Advanced',
            experience:'3+ years',
            projects:['Desktop Apps','Enterprise Apps'],
            description:'Swing, JavaFX, Spring Boot'
        },
        {
            name:'C#',
            level:'Intermediate',
            experience:'2+ years',
            projects:['Desktop Apps','Enterprise Apps'],
            description:'Swing, JavaFX, Spring Boot'
        },
        {
            name:'C#',
            level:'Beginner',
            experience:'1+ year',
            projects:['Desktop Apps','Enterprise Apps'],
            description:'Swing, JavaFX, Spring Boot'
        }
      
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: <Cloud className="w-6 h-6" />,
    color: 'orange',
    technologies: [
      {
        name: 'Docker',
        level: 'Advanced',
        experience: '3+ years',
        projects: ['Containerization', 'Multi-stage builds', 'Docker Compose'],
        description: 'Dockerfiles, optimization, orchestration'
      },
      {
        name: 'AWS',
        level: 'Intermediate',
        experience: '2+ years',
        projects: ['Cloud Deployment', 'Lambda Functions', 'S3 Storage'],
        description: 'EC2, S3, Lambda, CloudFront'
      },
      {
        name: 'CI/CD',
        level: 'Advanced',
        experience: '3+ years',
        projects: ['GitHub Actions', 'Automated Testing', 'Deployment Pipelines'],
        description: 'YAML configurations, testing strategies'
      }
    ]
  },
  {
    id: 'tools',
    name: 'Tools & Technologies',
    icon: <Terminal className="w-6 h-6" />,
    color: 'red',
    technologies: [
      {
        name: 'Git',
        level: 'Expert',
        experience: '5+ years',
        projects: ['Version Control', 'Branch Management', 'Code Reviews'],
        description: 'Advanced workflows, rebase, cherry-pick'
      },
      {
        name: 'VS Code',
        level: 'Expert',
        experience: '5+ years',
        projects: ['Custom Extensions', 'Debugging', 'Productivity Workflows'],
        description: 'Extensions, debugging, snippets'
      },
      {
        name: 'Webpack',
        level: 'Intermediate',
        experience: '2+ years',
        projects: ['Build Optimization', 'Custom Configurations'],
        description: 'Module bundling, optimization, plugins'
      }
    ]
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Expert': return 'bg-green-900 text-green-300';
    case 'Advanced': return 'bg-blue-900 text-blue-300';
    case 'Intermediate': return 'bg-yellow-900 text-yellow-300';
    case 'Beginner': return 'bg-gray-700 text-gray-300';
    default: return 'bg-gray-700 text-gray-300';
  }
};

const getLevelWidth = (level: string) => {
  switch (level) {
    case 'Expert': return 'w-full';
    case 'Advanced': return 'w-4/5';
    case 'Intermediate': return 'w-3/5';
    case 'Beginner': return 'w-2/5';
    default: return 'w-1/5';
  }
};

const getCategoryColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    purple: 'bg-purple-600 text-white',
    orange: 'bg-orange-600 text-white',
    red: 'bg-red-600 text-white'
  };
  return colors[color] || 'bg-slate-600 text-white';
};

const getBarColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600'
  };
  return colors[color] || 'bg-slate-600';
};

const getProjectBadgeColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-900 text-blue-300',
    green: 'bg-green-900 text-green-300',
    purple: 'bg-purple-900 text-purple-300',
    orange: 'bg-orange-900 text-orange-300',
    red: 'bg-red-900 text-red-300'
  };
  return colors[color] || 'bg-slate-700 text-slate-300';
};

export function TechApp() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Tech Stack & Skills
          </h1>
          <p className="text-lg text-gray-300">
            Technologies I work with and my proficiency levels
          </p>
        </div>

        {/* Tech Categories */}
        <div className="space-y-12">
          {techData.map((category) => (
            <section key={category.id}>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <div className={`p-2 ${getCategoryColor(category.color)} rounded-lg`}>
                  {category.icon}
                </div>
                {category.name}
              </h2>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                
                {category.technologies.map((tech, index) => (
                  <div key={index} className="relative flex items-start mb-12">
                    {/* Timeline Dot */}
                    <div className={`absolute left-8 w-4 h-4 ${getBarColor(category.color)} rounded-full border-4 border-gray-900 transform -translate-x-1/2`}></div>
                    
                    {/* Content */}
                    <div className="ml-20 flex-1">
                      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <h3 className="text-xl font-semibold text-white">
                            {tech.name}
                          </h3>
                          <span className={`px-3 py-1 text-xs rounded-full mt-1 sm:mt-0 ${getLevelColor(tech.level)}`}>
                            {tech.level}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-400">
                            {tech.experience} experience
                          </p>
                        </div>
                        
                        {/* Proficiency Bar */}
                        <div className="mb-4">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`${getBarColor(category.color)} h-2 rounded-full transition-all duration-500 ${getLevelWidth(tech.level)}`}
                            ></div>
                          </div>
                        </div>

                        {tech.description && (
                          <p className="text-gray-300 text-sm mb-4">
                            {tech.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {tech.projects.map((project, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 text-xs rounded-full ${getProjectBadgeColor(category.color)}`}
                            >
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}