import ProtectedPageProviders from '../providers';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedPageProviders>{children}</ProtectedPageProviders>;
} 