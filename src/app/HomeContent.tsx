'use client';

import React, { useCallback } from 'react';
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from 'next/link';
import { ArrowRight, Users, Target, Crown, GraduationCap, Scroll, Star, Briefcase, Heart, Shield, Presentation, Sword, BarChart, Mail, ChevronDown, Award } from 'lucide-react';
import VideoPlayer from './components/VideoPlayer';
import ClientOnly from './components/ClientOnly';

// Separate the scroll button into its own client component
function ScrollButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center animate-bounce cursor-pointer group mx-auto"
    >
      <span className="text-neutral mb-2 group-hover:text-primary transition-colors">
        Learn More
      </span>
      <ChevronDown className="w-6 h-6 text-primary" />
    </button>
  );
}

function NavCard({ title, description, href }: { 
  title: string; 
  description: string; 
  href: string;
}) {
  return (
    <Link 
      href={href}
      className="card"
    >
      <h2 className="text-neutral-dark text-xl font-semibold mb-2">{title}</h2>
      <p className="text-neutral">{description}</p>
    </Link>
  );
}

function TimelineCard({ era, year, figure, icon, description }: {
  era: string;
  year: string;
  figure: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all group">
      {/* Connector to timeline */}
      <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-primary" />
      
      {/* Era badge */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary text-white text-sm px-3 py-1 rounded-full">
        {era}
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-block p-3 rounded-full bg-neutral-light group-hover:bg-primary transition-colors mb-4">
          <div className="text-neutral-dark group-hover:text-white transition-colors">
            {icon}
          </div>
        </div>
        
        <div className="text-sm text-secondary font-medium mb-2">
          {year}
        </div>
        
        <h3 className="text-xl font-semibold text-neutral-dark mb-2">
          {figure}
        </h3>
        
        <p className="text-neutral text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

function PromiseCard({ icon, title, points }: {
  icon: React.ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all group border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <div className="text-primary">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-neutral-dark ml-4 group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
      
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-2 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <span className="text-neutral text-sm">
              {point}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomeContent() {
  const handleScroll = useCallback(() => {
    const element = document.getElementById('transform-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToVideo = useCallback(() => {
    const element = document.getElementById('video-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <ClientOnly>
      <div className="min-h-screen">
        <SignedIn>
          {/* Authenticated View */}
          <nav className="bg-neutral-dark p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-white text-2xl font-bold">Oratoria</h1>
              <UserButton afterSignOutUrl="/"/>
            </div>
          </nav>
          
          <main className="container mx-auto mt-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <NavCard 
                title="Dashboard" 
                description="View your progress and activities"
                href="/dashboard"
              />
              <NavCard 
                title="Browse Courses" 
                description="Discover new conversation skills"
                href="/courses/browse"
              />
              <NavCard 
                title="Quick Training" 
                description="Practice specific scenarios"
                href="/quick-training"
              />
              <NavCard 
                title="Settings" 
                description="Manage your preferences"
                href="/settings"
              />
            </div>
          </main>
        </SignedIn>

        <SignedOut>
          <nav className="bg-white shadow-sm fixed w-full z-50">
            <div className="container mx-auto flex justify-between items-center h-16 px-4">
              <h1 className="text-neutral-dark text-2xl font-bold">Oratoria</h1>
              <SignInButton mode="modal">
                <button className="btn btn-primary">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </nav>

          <main>
            {/* Hero Section */}
            <section className="relative min-h-screen bg-neutral-light pt-16 flex flex-col">
              {/* Background gradient circles */}
              <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-2xl" />
                <div className="absolute top-40 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-secondary/10 to-secondary/5 blur-2xl" />
                <div className="absolute bottom-20 left-1/3 w-56 h-56 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-2xl" />
              </div>
              
              {/* Main content - centered vertically and horizontally */}
              <div className="flex-grow flex items-center">
                <div className="container relative mx-auto px-4">
                  <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-neutral-dark">
                      Master the Art of <span className="text-primary">Conversation</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 text-neutral">
                      Train like the ancient sophists, powered by modern AI
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                      <SignInButton mode="modal">
                        <button className="btn btn-primary w-full h-full px-6 py-4 text-lg inline-flex flex-col items-center justify-center gap-2 shadow-lg transform hover:scale-105">
                          <span>Start Your Journey</span>
                          <span className="text-sm opacity-90">Sign up and try it yourself</span>
                        </button>
                      </SignInButton>
                      
                      <button 
                        onClick={scrollToVideo}
                        className="btn btn-secondary w-full h-full px-6 py-4 text-lg inline-flex flex-col items-center justify-center gap-2 shadow-lg transform hover:scale-105"
                      >
                        <span>See Trailer</span>
                        <span className="text-sm opacity-90">Watch our over-the-top AI-generated masterpiece</span>
                      </button>

                      <Link 
                        href="https://github.com/wasil-dilawari/elevenlabs-hackathon"
                        target="_blank"
                        className="bg-neutral text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-neutral/90 transition-all transform hover:scale-105 inline-flex flex-col items-center justify-center gap-2 shadow-lg w-full h-full"
                      >
                        <span>Technical Implementation</span>
                        <span className="text-sm opacity-90">AKA how the hell did I make this in less than 30 hours?</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learn More Button - fixed at bottom */}
              <div className="container mx-auto px-4 pb-8">
                <ScrollButton onClick={handleScroll} />
              </div>
            </section>

            {/* Video Section */}
            <section id="video-section" className="relative py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <VideoPlayer 
                    libraryId="387840"
                    videoId="d2b1f5cc-7e7a-412a-9a50-a8250b43fbd8"
                    title="Watch our trailer"
                  />
                  <div className="text-center mt-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-4">
                      The Most Epic AI Training Video Ever Made
                    </h2>
                    <p className="text-neutral text-lg">
                      Watch this overly dramatic video. Fun fact: it was generated entirely by AI, the only thing I did was writing the script, editing, and logo design!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Transform Your Social Life Section */}
            <section id="transform-section" className="py-20 bg-[#ECF0F1]">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2C3E50]">
                  Transform Your Social Life
                </h2>
                <p className="text-center text-[#34495E] mb-16 max-w-2xl mx-auto">
                  Master every social situation with confidence and authenticity
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <PromiseCard
                    icon={<Star className="w-6 h-6" />}
                    title="Charm with Small Talk"
                    points={[
                      "Turn awkward silences into engaging conversations",
                      "Make memorable first impressions",
                      "Keep conversations flowing naturally"
                    ]}
                  />
                  <PromiseCard
                    icon={<Briefcase className="w-6 h-6" />}
                    title="Excel Professionally"
                    points={[
                      "Navigate office politics with grace",
                      "Lead meetings with confidence",
                      "Build strong professional relationships"
                    ]}
                  />
                  <PromiseCard
                    icon={<Heart className="w-6 h-6" />}
                    title="Build Deeper Connections"
                    points={[
                      "Create meaningful friendships",
                      "Express emotions effectively",
                      "Understand and respond to social cues"
                    ]}
                  />
                  <PromiseCard
                    icon={<Shield className="w-6 h-6" />}
                    title="Overcome Social Anxiety"
                    points={[
                      "Practice difficult conversations safely",
                      "Build confidence through preparation",
                      "Turn stress into social energy"
                    ]}
                  />
                  <PromiseCard
                    icon={<Users className="w-6 h-6" />}
                    title="Master Negotiations"
                    points={[
                      "Win deals without compromising relationships",
                      "Handle difficult conversations gracefully",
                      "Achieve mutual understanding"
                    ]}
                  />
                  <PromiseCard
                    icon={<Presentation className="w-6 h-6" />}
                    title="Become a Leader"
                    points={[
                      "Inspire and motivate others",
                      "Command attention in any room",
                      "Build and lead high-performing teams"
                    ]}
                  />
                </div>
              </div>
            </section>

            {/* Professional Practice Section */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#2C3E50]">
                    Master Conversations Like a Professional
                  </h2>
                  <p className="text-xl text-[#34495E]">
                    Just like chess grandmasters or elite athletes, true mastery comes from deliberate practice, analysis, and structured learning
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Traditional Approach Card */}
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-6">
                      <div className="p-3 rounded-lg bg-[#F39C12]/10">
                        <Shield className="w-6 h-6 text-[#F39C12]" />
                      </div>
                      <h3 className="text-xl font-semibold ml-4 text-[#2C3E50]">
                        Traditional Approach
                      </h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start text-[#34495E]/60">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#F39C12]" />
                        </div>
                        <span>Learning only from real interactions</span>
                      </li>
                      <li className="flex items-start text-[#34495E]/60">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#F39C12]" />
                        </div>
                        <span>No way to analyze performance</span>
                      </li>
                      <li className="flex items-start text-[#34495E]/60">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#F39C12]" />
                        </div>
                        <span>Stakes are always high</span>
                      </li>
                      <li className="flex items-start text-[#34495E]/60">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#F39C12]" />
                        </div>
                        <span>Limited opportunities to practice</span>
                      </li>
                    </ul>
                  </div>

                  {/* Professional Approach Card */}
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-6">
                      <div className="p-3 rounded-lg bg-[#27AE60]/10">
                        <Award className="w-6 h-6 text-[#27AE60]" />
                      </div>
                      <h3 className="text-xl font-semibold ml-4 text-[#2C3E50]">
                        Professional Approach with Oratoria
                      </h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start text-[#34495E]">
                        <div className="mr-3 mt-1">
                          <Sword className="w-4 h-4 text-[#27AE60]" />
                        </div>
                        <span>Practice specific scenarios repeatedly, like chess players studying positions</span>
                      </li>
                      <li className="flex items-start text-[#34495E]">
                        <div className="mr-3 mt-1">
                          <BarChart className="w-4 h-4 text-[#27AE60]" />
                        </div>
                        <span>Get detailed feedback and analysis after each conversation</span>
                      </li>
                      <li className="flex items-start text-[#34495E]">
                        <div className="mr-3 mt-1">
                          <Shield className="w-4 h-4 text-[#27AE60]" />
                        </div>
                        <span>Practice in a safe environment where mistakes are learning opportunities</span>
                      </li>
                      <li className="flex items-start text-[#34495E]">
                        <div className="mr-3 mt-1">
                          <Target className="w-4 h-4 text-[#27AE60]" />
                        </div>
                        <span>Focus on specific skills and gradually increase difficulty</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <SignInButton mode="modal">
                    <button className="bg-[#27AE60] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#27AE60]/90 transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-lg">
                      Start Professional Training <ArrowRight className="w-5 h-5" />
                    </button>
                  </SignInButton>
                </div>
              </div>
            </section>

            {/* Historical Timeline Section */}
            <section className="py-20 bg-[#ECF0F1] overflow-x-hidden">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2C3E50]">
                  Legacy of Great Communicators
                </h2>
                <p className="text-center text-[#34495E] mb-16 max-w-2xl mx-auto">
                  From ancient philosophers to modern leaders, the art of conversation has shaped history
                </p>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#27AE60]" />
                  
                  <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                    <TimelineCard
                      era="Ancient Greece"
                      year="470-399 BC"
                      figure="Socrates"
                      icon={<Scroll className="w-6 h-6" />}
                      description="Master of dialectic questioning, showing how conversation can lead to truth"
                    />
                    <TimelineCard
                      era="Renaissance"
                      year="1469-1527"
                      figure="Machiavelli"
                      icon={<Crown className="w-6 h-6" />}
                      description="Taught the art of diplomatic discourse and political persuasion"
                    />
                    <TimelineCard
                      era="Enlightenment"
                      year="1694-1778"
                      figure="Voltaire"
                      icon={<GraduationCap className="w-6 h-6" />}
                      description="Mastered the art of wit and intellectual conversation in French salons"
                    />
                    <TimelineCard
                      era="Modern Era"
                      year="1888-1955"
                      figure="Dale Carnegie"
                      icon={<Users className="w-6 h-6" />}
                      description="Revolutionized the understanding of human relations and communication"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-white text-[#2C3E50] py-16 border-t border-gray-100">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Project Info */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Oratoria</h3>
                    <p className="text-[#34495E] text-sm max-w-md">
                      An AI agent project created for the ElevenLabs x a16z Hackathon. Using advanced language models and voice AI to create an interactive conversation partner that helps you master social interactions.
                    </p>
                    <SignInButton mode="modal">
                      <button className="bg-[#27AE60] text-white px-6 py-2 rounded-lg hover:bg-[#27AE60]/90 transition-all transform hover:scale-105 inline-flex items-center gap-2 text-sm font-semibold">
                        Try the Demo <ArrowRight className="w-4 h-4" />
                      </button>
                    </SignInButton>
                  </div>

                  {/* Contact */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Contact the Creator</h4>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 text-[#34495E]">
                        <Mail className="w-5 h-5" />
                        <a href="mailto:wasilewski.sf@gmail.com" className="hover:text-[#27AE60] transition-colors">
                          wasilewski.sf@gmail.com
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-[#34495E]">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                        </svg>
                        <a href="https://www.linkedin.com/in/stanislaw-wasilewski/" target="_blank" className="hover:text-[#27AE60] transition-colors">
                          Stanislaw Wasilewski
                        </a>
                      </div>
                    </div>
                    <p className="text-[#34495E] text-sm mt-4">
                      This prototype demonstrates how AI agents can revolutionize the way we practice and improve our conversation skills through personalized, interactive training sessions.
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-12 pt-8 text-center text-[#34495E] text-sm">
                  <p>Created by Stanislaw Wasilewski for ElevenLabs x a16z AI Agents Hackathon 2025</p>
                </div>
              </div>
            </footer>
          </main>
        </SignedOut>
      </div>
    </ClientOnly>
  );
} 