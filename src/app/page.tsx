'use client';

import React from 'react';
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
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
    </div>
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