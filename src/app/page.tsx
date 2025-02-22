import { Zap, PlusCircle, ChevronRight } from 'lucide-react';
import Navigation from './components/Navigation';
import Link from 'next/link';

// Temporary mock data
const recentCourses = [
  { id: 1, title: 'Small Talk', progress: 60, lastAccessed: '2024-02-22' },
  { id: 2, title: 'Negotiations', progress: 30, lastAccessed: '2024-02-21' },
  { id: 3, title: 'Interviews', progress: 15, lastAccessed: '2024-02-20' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-8">Welcome to Oratoria</h1>
        
        {/* Continue Courses Section */}
        <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#2C3E50]">Continue Learning</h2>
            <Link 
              href="/courses" 
              className="flex items-center text-[#27AE60] hover:text-[#219653] transition-colors"
            >
              See all courses
              <ChevronRight size={20} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div 
                key={course.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-[#34495E]">{course.title}</h3>
                  <p className="text-sm text-gray-500">
                    Last accessed: {course.lastAccessed}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                    <div 
                      className="h-full bg-[#27AE60] rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{course.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Training Card */}
          <Link 
            href="/quick-training"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-[#F39C12] bg-opacity-10">
                <Zap size={24} className="text-[#F39C12]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#2C3E50] group-hover:text-[#27AE60] transition-colors">
                  Quick Training
                </h2>
                <p className="text-gray-600">Practice with random situations</p>
              </div>
            </div>
          </Link>
          
          {/* Custom Situation Card */}
          <Link 
            href="/custom"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-[#27AE60] bg-opacity-10">
                <PlusCircle size={24} className="text-[#27AE60]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#2C3E50] group-hover:text-[#27AE60] transition-colors">
                  Custom Situation
                </h2>
                <p className="text-gray-600">Create your own scenario</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
} 