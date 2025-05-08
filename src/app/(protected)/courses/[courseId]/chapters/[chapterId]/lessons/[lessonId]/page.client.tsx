'use client';

import { useUser } from '@clerk/nextjs';
import Navigation from '../../../../../../../components/Navigation';
import { useState, useEffect } from 'react';
import { useSupabase } from '../../../../../../../supabase-provider';
import { ArrowLeft, ArrowRight, CheckCircle, Flag } from 'lucide-react';
import Link from 'next/link';
import { updateLessonProgress } from '@/lib/courses/services';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LessonPageProps {
  lesson: any; // Will be properly typed from DB
  stages: any[]; // Will be properly typed from DB
  courseId: string;
  chapterId: string;
}

export default function LessonPage({ lesson, stages, courseId, chapterId }: LessonPageProps) {
  const { user } = useUser();
  const supabase = useSupabase().supabase;
  const router = useRouter();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exerciseResponse, setExerciseResponse] = useState('');
  const [coachFeedback, setCoachFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const currentStage = stages && stages.length > 0 ? stages[currentStageIndex] : null;
  const isLastStage = currentStageIndex === stages.length - 1;
  const isExerciseStage = currentStage?.is_exercise;

  useEffect(() => {
    const checkLessonProgress = async () => {
      if (!user || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lesson.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error checking lesson progress:', error);
        }
        
        if (data) {
          setCompleted(data.completed);
        }
      } catch (err) {
        console.error('Error checking lesson progress:', err);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    checkLessonProgress();
  }, [user, supabase, lesson.id]);

  const handleNext = async () => {
    if (isLastStage) {
      // Mark lesson as completed
      try {
        setSaving(true);
        await updateLessonProgress(user?.id || '', lesson.id, true);
        setCompleted(true);
        
        // Navigate back to chapter page
        router.push(`/courses/${courseId}/chapters/${chapterId}`);
      } catch (err) {
        console.error('Error updating lesson progress:', err);
      } finally {
        setSaving(false);
      }
    } else {
      // Move to the next stage
      setCurrentStageIndex(prev => prev + 1);
      setExerciseResponse('');
      setCoachFeedback('');
      setShowFeedback(false);
      setSubmitError('');
    }
  };

  const handlePrevious = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(prev => prev - 1);
      setExerciseResponse('');
      setCoachFeedback('');
      setShowFeedback(false);
      setSubmitError('');
    }
  };

  const handleSubmitExercise = async () => {
    if (!exerciseResponse.trim() || !user) return;
    
    setSaving(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/course-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptTemplate: currentStage.coach_prompt || 'Provide feedback on this student exercise response.',
          userResponse: exerciseResponse,
          lessonId: lesson.id
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get coach feedback');
      }
      
      const data = await response.json();
      setCoachFeedback(data.feedback);
      setShowFeedback(true);
    } catch (err) {
      console.error('Error getting exercise feedback:', err);
      setSubmitError('Failed to get coach feedback. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="md:pl-64 transition-all duration-200">
          <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
            <div className="text-center">
              <p className="text-[#34495E] text-lg">Please sign in to view this lesson.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loading || !currentStage) {
    return (
      <main className="min-h-screen bg-[#ECF0F1]">
        <Navigation />
        <div className="md:pl-64 transition-all duration-200">
          <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
            <div className="text-center">
              <p className="text-[#34495E] text-lg">Loading lesson content...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      
      <div className="md:pl-64 transition-all duration-200">
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
          <div className="mb-8">
            <Link 
              href={`/courses/${courseId}/chapters/${chapterId}`}
              className="flex items-center text-[#34495E] hover:text-[#2C3E50] font-medium mb-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Chapter
            </Link>
            
            {/* Progress Indicator */}
            <div className="w-full h-1 bg-gray-200 rounded-full mb-6">
              <div
                className="h-full bg-[#27AE60] rounded-full"
                style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-[#2C3E50]">
                {lesson.title}
              </h1>
              <span className="text-[#7F8C8D]">
                Stage {currentStageIndex + 1} of {stages.length}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-6">
              {currentStage.title}
            </h2>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            {isExerciseStage ? (
              <div>
                <div className="prose max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: currentStage.exercise_instructions || '' }} />
                </div>
                
                {!showFeedback ? (
                  <div>
                    <textarea
                      value={exerciseResponse}
                      onChange={(e) => setExerciseResponse(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg mb-4 min-h-[200px]"
                      placeholder="Type your answer here..."
                    />
                    
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {submitError}
                      </div>
                    )}
                    
                    <button
                      onClick={handleSubmitExercise}
                      disabled={saving || !exerciseResponse.trim()}
                      className="bg-[#27AE60] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#219653] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Submitting...' : 'Submit for Feedback'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#F1F9F5] p-4 rounded-lg border border-[#27AE60] border-opacity-20 mb-6">
                    <h3 className="font-semibold text-[#2C3E50] mb-2 flex items-center">
                      <CheckCircle size={16} className="text-[#27AE60] mr-2" />
                      Your Coach&apos;s Feedback
                    </h3>
                    <p className="text-[#34495E]">{coachFeedback}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {currentStage.content_type === 'image' && currentStage.image_url && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <img
                      src={currentStage.image_url}
                      alt={currentStage.title}
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                )}
                
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentStage.content || '' }} />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStageIndex === 0}
              className={`flex items-center ${
                currentStageIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#34495E] hover:text-[#2C3E50]'
              }`}
            >
              <ArrowLeft size={18} className="mr-2" />
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={isExerciseStage && !showFeedback}
              className={`flex items-center px-6 py-2 rounded-lg ${
                isLastStage
                  ? 'bg-[#27AE60] text-white hover:bg-[#219653]'
                  : 'bg-[#3498DB] text-white hover:bg-[#2980B9]'
              } transition-colors ${
                (isExerciseStage && !showFeedback) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLastStage ? (
                <>
                  {saving ? 'Completing...' : 'Complete Lesson'}
                  <Flag size={18} className="ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 