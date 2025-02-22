'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  libraryId: string;
  title: string;
}

export default function VideoPlayer({ videoId, libraryId, title }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-[#2C3E50]/5">
      <div className="relative w-full h-full">
        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2C3E50]/5 backdrop-blur-sm">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F39C12] text-white animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Bunny.net player */}
        <div className="relative w-full h-0 pb-[56.25%]">
          <iframe 
            src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
            title={title}
          />
        </div>
      </div>
    </div>
  );
} 