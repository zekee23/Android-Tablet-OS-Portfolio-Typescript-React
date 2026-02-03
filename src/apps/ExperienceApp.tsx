import {  MapPin, Briefcase, GraduationCap } from 'lucide-react';

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
    title: 'Senior Frontend Developer',
    company: 'Tech Company',
    location: 'San Francisco, CA',
    period: '2022 - Present',
    type: 'work',
    description: [
      'Lead development of responsive web applications using React and TypeScript',
      'Mentor junior developers and conduct code reviews',
      'Collaborate with UX/UI team to implement pixel-perfect designs',
      'Optimize application performance and improve loading times by 40%'
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js']
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Digital Agency',
    location: 'New York, NY',
    period: '2020 - 2022',
    type: 'work',
    description: [
      'Developed and maintained multiple client websites and web applications',
      'Implemented responsive designs and cross-browser compatibility',
      'Worked in agile teams with daily stand-ups and sprint planning',
      'Integrated RESTful APIs and third-party services'
    ],
    skills: ['JavaScript', 'Vue.js', 'SASS', 'Webpack', 'Git']
  },
  {
    id: '3',
    title: 'Bachelor of Computer Science',
    company: 'University Name',
    location: 'Boston, MA',
    period: '2016 - 2020',
    type: 'education',
    description: [
      'Graduated Magna Cum Laude with GPA 3.8/4.0',
      'Focused on Software Engineering and Web Development',
      'Completed thesis on "Modern Web Application Performance"',
      'President of Web Development Club'
    ],
    skills: ['Algorithms', 'Data Structures', 'Web Development', 'Database Design']
  }
];

export function ExperienceApp() {
  const workExperience = experienceData.filter(exp => exp.type === 'work');
  const education = experienceData.filter(exp => exp.type === 'education');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Experience
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Professional journey and educational background
          </p>
        </div>

        {/* Work Experience */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Work Experience
          </h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
            
            {workExperience.map((exp, index) => (
              <div key={exp.id} className="relative flex items-start mb-12">
                {/* Timeline Dot */}
                <div className="absolute left-8 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 transform -translate-x-1/2"></div>
                
                {/* Content */}
                <div className="ml-20 flex-1">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {exp.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                        {exp.period}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </p>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {exp.description.map((desc, idx) => (
                        <li key={idx} className="text-gray-600 dark:text-gray-300 text-sm">
                          • {desc}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            Education
          </h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
            
            {education.map((edu, index) => (
              <div key={edu.id} className="relative flex items-start mb-12">
                {/* Timeline Dot */}
                <div className="absolute left-8 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 transform -translate-x-1/2"></div>
                
                {/* Content */}
                <div className="ml-20 flex-1">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {edu.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                        {edu.period}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {edu.company}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {edu.location}
                      </p>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {edu.description.map((desc, idx) => (
                        <li key={idx} className="text-gray-600 dark:text-gray-300 text-sm">
                          • {desc}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex flex-wrap gap-2">
                      {edu.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}