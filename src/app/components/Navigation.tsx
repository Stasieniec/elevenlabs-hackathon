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

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <Link
      href={item.href}
      className="flex items-center space-x-3 px-4 py-3 text-neutral hover:text-neutral-dark hover:bg-gray-100 rounded-lg transition-colors"
      onClick={() => setIsOpen(false)}
    >
      <item.icon size={20} />
      <span>{item.name}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 p-2 text-neutral hover:text-neutral-dark focus:outline-none md:hidden z-50 bg-white rounded-lg shadow-sm"
      >
        <Menu size={24} />
      </button>

      {/* Overlay - only show on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Close Button */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <Link href={isSignedIn ? '/dashboard' : '/'} className="text-2xl font-bold text-neutral-dark">
              Oratoria
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-neutral hover:text-neutral-dark focus:outline-none md:hidden"
            >
              <X size={24} />
            </button>
          </div>

          {/* Profile Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-dark">Profile</span>
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Navigation */}
          <nav className="mt-8 space-y-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                {renderMenuItem(item)}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}