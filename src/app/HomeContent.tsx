'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import VideoPlayer from './components/VideoPlayer';

// Separate the scroll button into its own client component
function ScrollButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center animate-bounce cursor-pointer group mx-auto"
    >
      <span className="text-[#34495E] mb-2 group-hover:text-[#27AE60] transition-colors">
        Learn More
      </span>
      <ChevronDown className="w-6 h-6 text-[#27AE60]" />
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
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
    >
      <h2 className="text-xl font-semibold text-[#2C3E50] group-hover:text-[#27AE60] transition-colors mb-2">
        {title}
      </h2>
      <p className="text-[#34495E]">{description}</p>
    </Link>
  );
}

export default function HomeContent() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleScroll = useCallback(() => {
    const element = document.getElementById('transform-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToVideo = useCallback(() => {
    const element = document.getElementById('video-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
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
            <h1 className="text-[#2C3E50] text-2xl font-bold">Oratoria</h1>
            <SignInButton mode="modal">
              <button className="bg-[#27AE60] text-white px-5 py-1.5 rounded-lg hover:bg-[#27AE60]/90 transition-colors text-base font-semibold">
                Sign In
              </button>
            </SignInButton>
          </div>
        </nav>

        <main>
          {/* Hero Section */}
          <section className="relative min-h-screen bg-[#ECF0F1] pt-16 flex flex-col">
            {/* Background gradient circles */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#27AE60]/10 to-[#27AE60]/5 blur-2xl" />
              <div className="absolute top-40 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-[#F39C12]/10 to-[#F39C12]/5 blur-2xl" />
              <div className="absolute bottom-20 left-1/3 w-56 h-56 rounded-full bg-gradient-to-r from-[#27AE60]/10 to-[#27AE60]/5 blur-2xl" />
            </div>
            
            {/* Main content - centered vertically and horizontally */}
            <div className="flex-grow flex items-center">
              <div className="container relative mx-auto px-4">
                <div className="max-w-5xl mx-auto text-center">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-[#2C3E50]">
                    Master the Art of <span className="text-[#27AE60]">Conversation</span>
                  </h1>
                  <p className="text-xl md:text-2xl mb-12 text-[#34495E]">
                    Train like the ancient sophists, powered by modern AI
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    <SignInButton mode="modal">
                      <button className="w-full h-full bg-[#27AE60] text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-[#27AE60]/90 transition-all transform hover:scale-105 inline-flex flex-col items-center justify-center gap-2 shadow-lg">
                        <span>Start Your Journey</span>
                        <span className="text-sm opacity-90">Sign up and try it yourself</span>
                      </button>
                    </SignInButton>
                    
                    <button 
                      onClick={scrollToVideo}
                      className="w-full h-full bg-[#F39C12] text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-[#F39C12]/90 transition-all transform hover:scale-105 inline-flex flex-col items-center justify-center gap-2 shadow-lg"
                    >
                      <span>See Trailer</span>
                      <span className="text-sm opacity-90">Watch our over-the-top AI-generated masterpiece</span>
                    </button>

                    <Link 
                      href="https://github.com/wasil-dilawari/elevenlabs-hackathon"
                      target="_blank"
                      className="w-full h-full bg-[#34495E] text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-[#34495E]/90 transition-all transform hover:scale-105 inline-flex flex-col items-center justify-center gap-2 shadow-lg"
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
              </div>
            </div>
          </section>
        </main>
      </SignedOut>
    </div>
  );
} 