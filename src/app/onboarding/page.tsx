'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2, Languages, Users, Briefcase } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { PostgrestError } from '@supabase/supabase-js';

// Define the steps
const STEPS = [
  {
    id: 'native-languages',
    title: 'Native Languages',
    description: 'What languages are you fluent in?',
    icon: Languages,
    iconColor: '#3498DB'
  },
  {
    id: 'social-languages',
    title: 'Social Languages',
    description: 'What languages do you use in social settings?',
    icon: Users,
    iconColor: '#E74C3C'
  },
  {
    id: 'professional-languages',
    title: 'Professional Languages',
    description: 'What languages do you use at work?',
    icon: Briefcase,
    iconColor: '#27AE60'
  },
  {
    id: 'professional-style',
    title: 'Professional Communication Style',
    description: 'How do you communicate in professional settings?',
    icon: Briefcase,
    iconColor: '#8E44AD'
  },
  {
    id: 'social-style',
    title: 'Social Communication Style',
    description: 'How do you communicate in social settings?',
    icon: Users,
    iconColor: '#D35400'
  }
];

// Common languages for suggestions
const COMMON_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Korean',
  'Russian',
  'Arabic',
  'Portuguese',
  'Italian'
];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const supabase = useSupabaseAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for language selections
  const [nativeLanguages, setNativeLanguages] = useState<string[]>([]);
  const [socialLanguages, setSocialLanguages] = useState<string[]>([]);
  const [professionalLanguages, setProfessionalLanguages] = useState<string[]>([]);
  const [customLanguage, setCustomLanguage] = useState('');

  // Add new state variables for styles
  const [currentProfessionalStyle, setCurrentProfessionalStyle] = useState('');
  const [desiredProfessionalStyle, setDesiredProfessionalStyle] = useState('');
  const [currentSocialStyle, setCurrentSocialStyle] = useState('');
  const [desiredSocialStyle, setDesiredSocialStyle] = useState('');

  // Get current step data
  const currentStepData = STEPS[currentStep];

  // Get current language array and setter based on step
  const getCurrentLanguageState = (): [string[], React.Dispatch<React.SetStateAction<string[]>>] => {
    switch (currentStepData.id) {
      case 'native-languages':
        return [nativeLanguages, setNativeLanguages];
      case 'social-languages':
        return [socialLanguages, setSocialLanguages];
      case 'professional-languages':
        return [professionalLanguages, setProfessionalLanguages];
      default:
        return [[], () => {}];
    }
  };

  const [languages, setLanguages] = getCurrentLanguageState();

  const handleLanguageToggle = (language: string) => {
    if (languages.includes(language)) {
      setLanguages(languages.filter(l => l !== language));
    } else {
      setLanguages([...languages, language]);
    }
  };

  const handleAddCustomLanguage = () => {
    if (customLanguage.trim() && !languages.includes(customLanguage.trim())) {
      setLanguages([...languages, customLanguage.trim()]);
      setCustomLanguage('');
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user || !supabase || isCompleting) return;

    setIsCompleting(true);
    setError(null);

    try {
      // Log the current user ID for debugging
      console.log('Current user ID:', user.id);
      
      // Insert user preferences with explicit user_id
      const { data, error: preferencesError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          native_languages: nativeLanguages,
          social_languages: socialLanguages,
          professional_languages: professionalLanguages,
          desired_professional_style: desiredProfessionalStyle,
          desired_social_style: desiredSocialStyle,
          current_professional_style: currentProfessionalStyle,
          current_social_style: currentSocialStyle
        })
        .select()
        .single();

      if (preferencesError) {
        console.error('Error saving preferences:', preferencesError);
        throw preferencesError;
      }

      console.log('Saved preferences:', data);

      // Update onboarding_completed in Supabase users table
      const { error: onboardingError } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
      if (onboardingError) {
        throw onboardingError;
      }

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      console.error('Error completing onboarding:', err);
      const errorMessage = err instanceof Error ? err.message :
        (err as PostgrestError)?.message || 'Please try again.';
      setError(`Failed to save your preferences. ${errorMessage}`);
      setIsCompleting(false);
    }
  };

  // Update the style inputs to remove sanitization
  const renderStyleInputs = () => {
    if (currentStepData.id === 'professional-style') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Current Professional Style
            </label>
            <textarea
              value={currentProfessionalStyle}
              onChange={(e) => setCurrentProfessionalStyle(e.target.value)}
              placeholder="Example: I tend to be formal and direct in my communication, sometimes too rigid."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-32 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Desired Professional Style
            </label>
            <textarea
              value={desiredProfessionalStyle}
              onChange={(e) => setDesiredProfessionalStyle(e.target.value)}
              placeholder="Example: I want to maintain professionalism while being more approachable and showing empathy."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-32 text-black"
            />
          </div>
        </div>
      );
    }

    if (currentStepData.id === 'social-style') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Current Social Style
            </label>
            <textarea
              value={currentSocialStyle}
              onChange={(e) => setCurrentSocialStyle(e.target.value)}
              placeholder="Example: I'm often quiet in group settings and struggle with small talk."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-32 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Desired Social Style
            </label>
            <textarea
              value={desiredSocialStyle}
              onChange={(e) => setDesiredSocialStyle(e.target.value)}
              placeholder="Example: I want to be more outgoing, tell engaging stories, and make people feel comfortable."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-32 text-black"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  if (!isLoaded || !user) {
    return (
      <main className="min-h-screen bg-[#ECF0F1] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#ECF0F1]">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-neutral-dark">Progress</span>
              <span className="text-sm text-neutral-dark">{Math.round((currentStep + 1) / STEPS.length * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div 
                className="p-3 rounded-full"
                style={{ 
                  backgroundColor: `${currentStepData.iconColor}20`
                }}
              >
                <currentStepData.icon 
                  className="w-6 h-6"
                  style={{ color: currentStepData.iconColor }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark">
                  {currentStepData.title}
                </h1>
                <p className="text-neutral">
                  {currentStepData.description}
                </p>
              </div>
            </div>

            {/* Language selection or style inputs based on step */}
            {['native-languages', 'social-languages', 'professional-languages'].includes(currentStepData.id) ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {COMMON_LANGUAGES.map(language => (
                    <button
                      key={language}
                      onClick={() => handleLanguageToggle(language)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        languages.includes(language)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    placeholder="Add another language..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomLanguage();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddCustomLanguage}
                    disabled={!customLanguage.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>

                {languages.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-neutral mb-2">Selected languages:</h3>
                    <div className="flex flex-wrap gap-2">
                      {languages.map(language => (
                        <div
                          key={language}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2"
                        >
                          {language}
                          <button
                            onClick={() => handleLanguageToggle(language)}
                            className="hover:text-primary/70"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              renderStyleInputs()
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-2 text-neutral-dark hover:text-neutral transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={isCompleting || (
                  ['native-languages', 'social-languages', 'professional-languages'].includes(currentStepData.id) 
                    ? languages.length === 0
                    : currentStepData.id === 'professional-style'
                      ? !currentProfessionalStyle || !desiredProfessionalStyle
                      : !currentSocialStyle || !desiredSocialStyle
                )}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : currentStep === STEPS.length - 1 ? (
                  'Complete'
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 