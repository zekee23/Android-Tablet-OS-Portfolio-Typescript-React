import React, { useMemo } from 'react';
import { MapPin, Briefcase, GraduationCap } from 'lucide-react';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  type: 'work' | 'education';
  description: string[];
  skills: string[];
}

const experienceData: ExperienceItem[] = [
  {
    id: '1',
    title: 'IT Programmer Intern',
    company: 'Honkwang Electric Company',
    location: 'Binan, Laguna, Philippines ',
    period: 'March 2025 - August 2025',
    type: 'work',
    description: [
      'Developed Android Application for Attendance Management System',
      'Designed and Developed User Interface for the Application',
      'Developed Scanner System for Daily Production Record by maintaining the accuracy of the data',
      'Optimize company\'s manual process of daily production record and attendance by 95%',
      'Helped office workers to be more productive and efficient by using the Applications I developed.'
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js']
  },
 
  {
    id: '3',
    title: 'Bachelor of Science in Information Technology',
    company: 'Polytechnic University of the Philippines Lopez',
    location: 'Lopez, Quezon',
    period: '2021 - 2025',
    type: 'education',
    description: [
      'Graduated with GWA of 1.62',
      'Focused on Software Engineering, Mobile Application and Web Development',
      'Completed thesis on "SnapCheck: Automatic Checker of handwritten Exams by using Machine Learning"',
      
    ],
    skills: ['Algorithms', 'Data Structures', 'Machine Learning','Android Development','Software Development', 'Web Development', 'Database Design']
  }
];

// Memoized icons to prevent recreation on every render
const MemoizedBriefcase = React.memo(Briefcase);
const MemoizedGraduationCap = React.memo(GraduationCap);
const MemoizedMapPin = React.memo(MapPin);

// Memoized description list component
const DescriptionList = React.memo(({ descriptions }: { descriptions: string[] }) => (
  <ul className="space-y-2 mb-4">
    {descriptions.map((desc, idx) => (
      <li key={idx} className="text-gray-600 dark:text-gray-300 text-sm">
        • {desc}
      </li>
    ))}
  </ul>
));

// Memoized skill tags component
const SkillTags = React.memo(({ skills, colorClass }: { skills: string[]; colorClass: string }) => (
  <div className="flex flex-wrap gap-2">
    {skills.map((skill, idx) => (
      <span
        key={idx}
        className={`px-3 py-1 ${colorClass} text-xs rounded-full`}
      >
        {skill}
      </span>
    ))}
  </div>
));

// Memoized timeline line component to reduce duplication
const TimelineLine = React.memo(() => (
  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
));

// Memoized timeline item component
const TimelineItem = React.memo(({ 
  item, 
  dotColor,
  skillColorClass
}: { 
  item: ExperienceItem; 
  dotColor: string;
  skillColorClass: string;
}) => {

  return (
    <div className="relative flex items-start mb-12 timeline-item gpu-accelerated">
      {/* Timeline Dot */}
      <div 
        className={`absolute left-8 w-4 h-4 ${dotColor} rounded-full border-4 border-white dark:border-gray-900 transform -translate-x-1/2`}
      />
      
      {/* Content */}
      <div className="ml-20 flex-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 gpu-accelerated">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
              {item.period}
            </span>
          </div>
          
          <div className="mb-3">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {item.company}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <MemoizedMapPin className="w-3 h-3" />
              {item.location}
            </p>
          </div>
          
          <DescriptionList descriptions={item.description} />
          <SkillTags skills={item.skills} colorClass={skillColorClass} />
        </div>
      </div>
    </div>
  );
});

// Memoized section header component
const SectionHeader = React.memo(({ 
  icon: Icon, 
  title 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  title: string; 
}) => (
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
    <Icon className="w-6 h-6" />
    {title}
  </h2>
));

// Memoized header component
const Header = React.memo(() => (
  <div className="text-center mb-12">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
      My Experience
    </h1>
    <p className="text-lg text-gray-600 dark:text-gray-300">
      Professional journey and educational background
    </p>
  </div>
));

export function ExperienceApp() {
  // Memoize filtered data and color classes to prevent recalculation on every render
  const { workExperience, education, workSkillClass, educationSkillClass } = useMemo(() => {
    return {
      workExperience: experienceData.filter(exp => exp.type === 'work'),
      education: experienceData.filter(exp => exp.type === 'education'),
      workSkillClass: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      educationSkillClass: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
    };
  }, []);

  // Memoize timeline items to prevent recreation during scroll
  const workTimelineItems = useMemo(() => 
    workExperience.map((exp) => ({
      ...exp,
      key: `work-${exp.id}`,
      dotColor: 'bg-blue-500',
      skillColorClass: workSkillClass
    })),
    [workExperience, workSkillClass]
  );

  const educationTimelineItems = useMemo(() =>
    education.map((edu) => ({
      ...edu,
      key: `education-${edu.id}`,
      dotColor: 'bg-green-500',
      skillColorClass: educationSkillClass
    })),
    [education, educationSkillClass]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16 smooth-scroll">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />

        {/* Work Experience */}
        <section className="mb-16">
          <SectionHeader icon={MemoizedBriefcase} title="Work Experience" />
          
          <div className="relative timeline-container">
            <TimelineLine />
            
            {workTimelineItems.map((timelineItem) => (
              <TimelineItem 
                key={timelineItem.key} 
                item={timelineItem} 
                dotColor={timelineItem.dotColor} 
                skillColorClass={timelineItem.skillColorClass}
              />
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <SectionHeader icon={MemoizedGraduationCap} title="Education" />
          
          <div className="relative timeline-container">
            <TimelineLine />
            
            {educationTimelineItems.map((timelineItem) => (
              <TimelineItem 
                key={timelineItem.key} 
                item={timelineItem} 
                dotColor={timelineItem.dotColor} 
                skillColorClass={timelineItem.skillColorClass}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}