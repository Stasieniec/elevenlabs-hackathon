'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, BookOpen, Zap, Settings, Plus, Search } from 'lucide-react';
import { UserButton, useAuth } from '@clerk/nextjs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Tooltip } from '@/app/components/Tooltip';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const supabase = useSupabaseAuth();
  const [hasApiKeys, setHasApiKeys] = useState(false);

  useEffect(() => {
    const checkApiKeys = async () => {
      if (!isSignedIn || !supabase) return;

      try {
        const { data } = await supabase
          .from('user_api_keys')
          .select('elevenlabs_api_key_encrypted, fal_ai_api_key_encrypted')
          .maybeSingle();

        setHasApiKeys(
          !!data?.elevenlabs_api_key_encrypted && 
          !!data?.fal_ai_api_key_encrypted
        );
      } catch (err) {
        console.error('Error checking API keys:', err);
        setHasApiKeys(false);
      }
    };

    checkApiKeys();
  }, [isSignedIn, supabase]);

  const menuItems = [
    { name: 'Home', href: isSignedIn ? '/dashboard' : '/', icon: Home, requiresKeys: false },
    { name: 'My Courses', href: '/courses', icon: BookOpen, requiresKeys: true },
    { name: 'Browse Courses', href: '/courses/browse', icon: Search, requiresKeys: true },
    { name: 'Quick Training', href: '/quick-training', icon: Zap, requiresKeys: true },
    { name: 'Custom Situation', href: '/custom', icon: Plus, requiresKeys: true },
    { name: 'Settings', href: '/settings', icon: Settings, requiresKeys: false },
  ];

  const renderMenuItem = (item: typeof menuItems[0]) => {
    if (item.requiresKeys && !hasApiKeys) {
      return (
        <Tooltip content="Please set up your API keys in Settings first">
          <span className="flex items-center space-x-3 px-4 py-3 text-gray-400 cursor-not-allowed">
            <item.icon size={20} />
            <span>{item.name}</span>
          </span>
        </Tooltip>
      );
    }

    return (
      <Link
        href={item.href}
        className="flex items-center space-x-3 px-4 py-3 text-neutral hover:text-neutral-dark hover:bg-gray-100 rounded-lg transition-colors"
        onClick={() => setIsOpen(false)}
      >
        <item.icon size={20} />
        <span>{item.name}</span>
      </Link>
    );
  };

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