'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, BookOpen, Zap, Settings, PlusCircle, Search } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'My Courses', href: '/courses', icon: BookOpen },
    { name: 'Browse Courses', href: '/courses/browse', icon: Search },
    { name: 'Quick Training', href: '/quick-training', icon: Zap },
    { name: 'Custom Situation', href: '/custom', icon: PlusCircle },
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
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="text-xl font-semibold text-[#2C3E50]">
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
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold text-[#2C3E50]">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#27AE60] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
} 