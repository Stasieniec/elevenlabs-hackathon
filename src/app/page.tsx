import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import HomeContent from './HomeContent';

export default async function Home() {
  const session = await auth();
  
  if (session.userId) {
    redirect('/courses');
  }

  return <HomeContent />;
} 