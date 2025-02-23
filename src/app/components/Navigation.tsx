'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, BookOpen, Zap, Settings, Plus, Search } from 'lucide-react';
import { UserButton, useAuth } from '@clerk/nextjs';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const menuItems = [
    { name: 'Home', href: isSignedIn ? '/dashboard' : '/', icon: Home },
    { name: 'My Courses', href: '/courses', icon: BookOpen },
    { name: 'Browse Courses', href: '/courses/browse', icon: Search },
    { name: 'Quick Training', href: '/quick-training', icon: Zap },
    { name: 'Custom Situation', href: '/custom', icon: Plus },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-40 px-4">
        <div className="max-w-6xl mx-auto h-full flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 text-neutral hover:text-neutral-dark focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <Link href={isSignedIn ? '/dashboard' : '/'} className="text-xl font-semibold text-neutral-dark">
              Oratoria
            </Link>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-neutral-dark">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-neutral hover:text-neutral-dark focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>

          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-2 text-neutral hover:text-primary hover:bg-neutral-light rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
} 