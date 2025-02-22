'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from 'next/link';
import { ArrowRight, Users, Target, Crown, GraduationCap, Scroll, Star, Briefcase, Heart, ShieldCheck, Handshake, Presentation, Swords, BarChart, Shield, Trophy, Mail, ChevronDown } from 'lucide-react';

// Client-side wrapper component
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <>{children}</>
  ) : (
    <div className="min-h-screen bg-[#2C3E50] flex items-center justify-center" suppressHydrationWarning>
      <div className="text-white text-2xl" suppressHydrationWarning>Loading...</div>
    </div>
  );
}

// Separate the scroll button into its own client component
function ScrollButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center animate-bounce cursor-pointer group mx-auto"
    >
      <span className="text-gray-300 mb-2 group-hover:text-[#F39C12] transition-colors">
        Learn More
      </span>
      <ChevronDown className="w-6 h-6 text-[#F39C12]" />
    </button>
  );
}

export default function HomeContent() {
  const handleScroll = useCallback(() => {
    const element = document.getElementById('transform-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <ClientOnly>
      <div className="min-h-screen">
        <SignedIn>
          {/* Authenticated View */}
          <nav className="bg-[#2C3E50] p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-white text-2xl font-bold">Oratoria</h1>
              <UserButton afterSignOutUrl="/"/>
            </div>
          </nav>
          
          <main className="container mx-auto mt-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <NavCard 
                title="My Courses" 
                description="Access your selected courses"
                href="/courses"
              />
              <NavCard 
                title="Browse Courses" 
                description="Discover new conversation skills"
                href="/browse"
              />
              <NavCard 
                title="Quick Training" 
                description="Practice specific scenarios"
                href="/training"
              />
              <NavCard 
                title="Profile" 
                description="Manage your preferences"
                href="/profile"
              />
            </div>
          </main>
        </SignedIn>

        <SignedOut>
          <nav className="bg-[#2C3E50]/95 backdrop-blur-sm fixed w-full z-50 p-4" suppressHydrationWarning>
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-white text-2xl font-bold">Oratoria</h1>
              <SignInButton mode="modal">
                <button className="bg-[#27AE60] text-white px-6 py-2 rounded-lg hover:bg-[#27AE60]/90 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </nav>

          <main>
            {/* Hero Section */}
            <section className="relative min-h-screen bg-gradient-to-br from-[#2C3E50] to-[#34495E] flex flex-col" suppressHydrationWarning>
              {/* Background circles */}
              <div className="absolute inset-0 opacity-20">
                <div className="animate-pulse absolute top-20 left-20 w-64 h-64 rounded-full bg-[#27AE60]" />
                <div className="animate-pulse absolute top-40 right-20 w-48 h-48 rounded-full bg-[#F39C12]" />
                <div className="animate-pulse absolute bottom-20 left-1/3 w-56 h-56 rounded-full bg-[#27AE60]" />
              </div>
              
              {/* Main content - centered vertically and horizontally */}
              <div className="flex-grow flex items-center">
                <div className="container relative mx-auto px-4">
                  <div className="max-w-4xl mx-auto text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" suppressHydrationWarning>
                      Master the Art of <span className="text-[#F39C12]">Conversation</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-300">
                      Train like the ancient sophists, powered by modern AI
                    </p>
                    <SignInButton mode="modal">
                      <button className="bg-[#F39C12] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#F39C12]/90 transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-lg">
                        Start Your Journey <ArrowRight className="w-5 h-5" />
                      </button>
                    </SignInButton>
                  </div>
                </div>
              </div>

              {/* Learn More Button - fixed at bottom */}
              <div className="container mx-auto px-4 pb-8">
                <ScrollButton onClick={handleScroll} />
              </div>
            </section>

            {/* Transform Your Social Life Section */}
            <section id="transform-section" className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2C3E50]">
                  Transform Your Social Life
                </h2>
                <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
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
                    icon={<ShieldCheck className="w-6 h-6" />}
                    title="Overcome Social Anxiety"
                    points={[
                      "Practice difficult conversations safely",
                      "Build confidence through preparation",
                      "Turn stress into social energy"
                    ]}
                  />
                  <PromiseCard
                    icon={<Handshake className="w-6 h-6" />}
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
            <section className="py-20 bg-[#2C3E50] text-white">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Master Conversations Like a Professional
                  </h2>
                  <p className="text-xl text-gray-300">
                    Just like chess grandmasters or elite athletes, true mastery comes from deliberate practice, analysis, and structured learning
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Left side - Traditional Learning */}
                  <div className="bg-[#34495E]/50 p-8 rounded-xl">
                    <div className="flex items-center mb-6">
                      <div className="p-3 rounded-lg bg-[#F39C12]/20">
                        <Shield className="w-6 h-6 text-[#F39C12]" />
                      </div>
                      <h3 className="text-xl font-semibold ml-4">
                        Traditional Approach
                      </h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start opacity-60">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#F39C12]" />
                        </div>
                        <span>Learning only from real interactions</span>
                      </li>
                      <li className="flex items-start opacity-60">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#F39C12]" />
                        </div>
                        <span>No way to analyze performance</span>
                      </li>
                      <li className="flex items-start opacity-60">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#F39C12]" />
                        </div>
                        <span>Stakes are always high</span>
                      </li>
                      <li className="flex items-start opacity-60">
                        <div className="mr-3 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#F39C12]" />
                        </div>
                        <span>Limited opportunities to practice</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right side - Professional Approach */}
                  <div className="bg-[#27AE60]/20 p-8 rounded-xl">
                    <div className="flex items-center mb-6">
                      <div className="p-3 rounded-lg bg-[#27AE60]/30">
                        <Trophy className="w-6 h-6 text-[#27AE60]" />
                      </div>
                      <h3 className="text-xl font-semibold ml-4">
                        Professional Approach with Oratoria
                      </h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="mr-3 mt-1">
                          <Swords className="w-4 h-4 text-[#27AE60]" />
                        </div>
                        <span>Practice specific scenarios repeatedly, like chess players studying positions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 mt-1">
                          <BarChart className="w-4 h-4 text-[#27AE60]" />
                        </div>
                        <span>Get detailed feedback and analysis after each conversation</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 mt-1">
                          <Shield className="w-4 h-4 text-[#27AE60]" />
                        </div>
                        <span>Practice in a safe environment where mistakes are learning opportunities</span>
                      </li>
                      <li className="flex items-start">
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
                    <button className="bg-[#F39C12] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#F39C12]/90 transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-lg">
                      Start Professional Training <ArrowRight className="w-5 h-5" />
                    </button>
                  </SignInButton>
                </div>
              </div>
            </section>

            {/* Historical Timeline Section */}
            <section className="py-20 bg-white overflow-x-hidden">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2C3E50]">
                  Legacy of Great Communicators
                </h2>
                <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
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
            <footer className="bg-[#2C3E50] text-white py-16">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Project Info */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Oratoria</h3>
                    <p className="text-gray-300 text-sm max-w-md">
                      An AI agent project created for the ElevenLabs x a16z Hackathon. Using advanced language models and voice AI to create an interactive conversation partner that helps you master social interactions.
                    </p>
                    <SignInButton mode="modal">
                      <button className="bg-[#F39C12] text-white px-6 py-2 rounded-lg hover:bg-[#F39C12]/90 transition-all transform hover:scale-105 inline-flex items-center gap-2 text-sm">
                        Try the Demo <ArrowRight className="w-4 h-4" />
                      </button>
                    </SignInButton>
                  </div>

                  {/* Contact */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Contact the Creator</h4>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Mail className="w-5 h-5" />
                      <a href="mailto:wasilewski.sf@gmail.com" className="hover:text-[#F39C12] transition-colors">
                        wasilewski.sf@gmail.com
                      </a>
                    </div>
                    <p className="text-gray-400 text-sm mt-4">
                      This prototype demonstrates how AI agents can revolutionize the way we practice and improve our conversation skills through personalized, interactive training sessions.
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
                  <p>Created for ElevenLabs x a16z AI Agents Hackathon 2024</p>
                </div>
              </div>
            </footer>
          </main>
        </SignedOut>
      </div>
    </ClientOnly>
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
      className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
    >
      <h2 className="text-[#34495E] text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
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
      <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-[#27AE60]" />
      
      {/* Era badge */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#F39C12] text-white text-sm px-3 py-1 rounded-full">
        {era}
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-block p-3 rounded-full bg-[#ECF0F1] group-hover:bg-[#27AE60] transition-colors mb-4">
          <div className="text-[#2C3E50] group-hover:text-white transition-colors">
            {icon}
          </div>
        </div>
        
        <div className="text-sm text-[#F39C12] font-medium mb-2">
          {year}
        </div>
        
        <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
          {figure}
        </h3>
        
        <p className="text-gray-600 text-sm">
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
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-lg bg-[#ECF0F1] group-hover:bg-[#27AE60] transition-colors">
          <div className="text-[#2C3E50] group-hover:text-white transition-colors">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-[#2C3E50] ml-4 group-hover:text-[#27AE60] transition-colors">
          {title}
        </h3>
      </div>
      
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-2 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F39C12]" />
            </div>
            <span className="text-gray-600 text-sm">
              {point}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
} 