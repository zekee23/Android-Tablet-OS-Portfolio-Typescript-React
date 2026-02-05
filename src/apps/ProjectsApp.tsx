import React, { useState, useCallback } from 'react';
import { ExternalLink} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

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

const MemoizedExternalLink = React.memo(ExternalLink);
const MemoizedGithub = React.memo(FaGithub);

// Memoized tech tags component
const TechTags = React.memo(({ tech }: { tech: string[] }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {tech.map((techItem) => (
      <span
        key={techItem}
        className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30"
      >
        {techItem}
      </span>
    ))}
  </div>
));

// Memoized project links component
const ProjectLinks = React.memo(({ demoUrl, githubUrl }: { demoUrl?: string; githubUrl?: string }) => (
  <div className="flex gap-6 mb-4">
    {demoUrl && (
      <a
        href={demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
      >
        <MemoizedExternalLink className="w-4 h-4" />
        Live Demo
      </a>
    )}

    {githubUrl && (
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-300 hover:underline"
      >
        <MemoizedGithub className="w-4 h-4" />
        Source Code
      </a>
    )}
  </div>
));

// Memoized project insights component
const ProjectInsights = React.memo(({ project, isOpen }: { project: Project; isOpen: boolean }) => (
  <div className={`mt-4 space-y-3 text-sm text-slate-300 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
    {project.motivation && (
      <p>
        <span className="font-medium text-slate-200">
          Why I built it:
        </span>{' '}
        {project.motivation}
      </p>
    )}
    {project.problemSolved && (
      <p>
        <span className="font-medium text-slate-200">
          Problem it solves:
        </span>{' '}
        {project.problemSolved}
      </p>
    )}
    {project.userFeedback && (
      <p>
        <span className="font-medium text-slate-200">
          User feedback:
        </span>{' '}
        {project.userFeedback}
      </p>
    )}
  </div>
));

// Memoized project card component
const ProjectCard = React.memo(({ 
  project, 
  isOpen, 
  onToggle,
  index 
}: { 
  project: Project; 
  isOpen: boolean; 
  onToggle: (id: string) => void;
  index: number;
}) => {
  const handleToggle = useCallback(() => {
    onToggle(project.id);
  }, [project.id, onToggle]);

  return (
    <div
      key={project.id}
      className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-in animate-delay-100"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <h3 className="text-xl font-semibold text-white mb-2">
        {project.title}
      </h3>

      <p className="text-slate-300 mb-4">
        {project.description}
      </p>

      <TechTags tech={project.tech} />
      <ProjectLinks demoUrl={project.demoUrl} githubUrl={project.githubUrl} />

      {/* Toggle */}
      {(project.motivation || project.problemSolved) && (
        <button
          onClick={handleToggle}
          className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
        >
          {isOpen ? 'Hide Project Insights' : 'View Project Insights'}
        </button>
      )}

      <ProjectInsights project={project} isOpen={isOpen} />
    </div>
  );
});

const projects: Project[] = [
  {
    id: '1',
    title: 'Android Portfolio',
    description:
      'A React + TypeScript portfolio that simulates an Android OS experience with system-style navigation and interactive UI.',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/zekee23/Android-Tablet-OS-Portfolio-Typescript-React',
    motivation: 'I wanted to explore creative UI concepts while building a portfolio that feels interactive and memorable. At the same time, I want to showcase my skills and passion in making Web Apps and Mobile Apps.',
    problemSolved: 'Traditional portfolios can feel static and unengaging. This project presents information in a familiar, app-based interface.',
  },
  {
    id: '2',
    title: 'Overdozed POS system with Dashboard and Analytics ',
    description:
      'A Point of Sale system with dashboard and analytics for a small cafe business in my locality.',
    tech: ['React', 'Javascript', 'CSS', 'PostgreSQL', 'Node.js','Express','bash', 'JWT',],
    githubUrl: 'https://github.com/zekee23/Overdoze-POS',
    motivation: 'To help a small cafe business to manage their sales and inventory efficiently and also practice my skills in FullStack Development and to build a real-world application.',
    problemSolved: 'Helped a small cafe business to manage their sales and inventory efficiently. They now transition from manual to digital system helping them with time management and accuracy with sales records by 97%. ',
  },
  {
    id: '3',
    title: 'Snapcheck: Handwritten Test Paper Checker ',
    description:
      'Flutter application that automatically checks handwritten test papers using PentoPrint API. Built with Flutter and Firebase.',
    tech: ['Firebase', 'Flutter', 'REST APIs', 'Firestore'],
    githubUrl: 'https://github.com/zekee23/Automated-Test-Paper-Checker-using-PentoPrint-API',
    motivation: 'To easily check the handwritten test paper without worrying about the time and effort.',
    problemSolved: 'Provides an accurate and efficient way to check handwritten test papers. Resulting 92% time efficiency and 97% accuracy.',
    userFeedback: 'Test users reported smooth navigation and a clear checkout process.',
  },
  {
    id: '4',
    title: 'Lopez West (DepEd) Application System',
    description:
      'A collaborative task management app focused on assessing the applications of teachers and non-teaching staff.',
    tech: ['HTML', 'CSS', 'JavaScript', 'bash'],
    demoUrl: 'https://teacher-applicant-automation-web-ap.vercel.app/',
    githubUrl: 'https://github.com/zekee23/DepEd-Teacher-Applicant-Web-App-LOCALLY-HOSTED-SERVER-',
    motivation: 'I wanted to provide a solution for manually assessing and putting data in a printing form and at the same time maintain the usability of the system while having low specs device.',
    problemSolved: 'Helps users calculate and print tasks clearly without unnecessary complexity and they can work collaboratively by sharing the data.',
    userFeedback: 'Users liked the clean UI and fast updates. They also appreciated the ability to work offline and work collaboratively.',
  },
  {
    id: '5',
    title: 'HKEPI Scanner',
    description:
      'An Android application for daily real-time attendance and Excel sheet generation.',
    tech: ['Flutter', 'Firebase', 'Firestore', 'Excel', 'Google Sheets API'],
    githubUrl: 'https://github.com/zekee23/hkepiscanner',
    motivation: 'Attendance is the basis for day-to-day operations in any organization. This app aims to streamline the process of recording attendance and generating reports.',
    problemSolved: 'Provides users with accurate, real-time updates, automatic generation of excel file and google sheets.',
    userFeedback: 'Users liked the clean and intuitive interface. The app was helpful for the company to track attendance efficiently without manual effort and automatically detects who is absent.',
  }
];

export function ProjectsApp() {
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  // Memoize toggle handler to prevent recreation on every render
  const handleToggleProject = useCallback((projectId: string) => {
    setOpenProjectId(prev => prev === projectId ? null : projectId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

    <div className="max-w-4xl w-full relative z-10">
      <h1 className="text-4xl md:text-5xl pt-5 font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-8 text-center animate-fade-in">
        Projects
      </h1>

      <div className="grid gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            isOpen={openProjectId === project.id}
            onToggle={handleToggleProject}
            index={index}
          />
        ))}
      </div>
    </div>
  </div>
  );
}