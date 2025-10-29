"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
  userId: string;
  clinicName?: string;
}

export function ClientLayout({ children, userId, clinicName }: ClientLayoutProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on an authenticated route that should show sidebar
  const showSidebar = !pathname.startsWith('/auth') && 
                     pathname !== '/' && 
                     !pathname.startsWith('/api') &&
                     !pathname.startsWith('/_next');

  // Check if mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userId={userId} clinicName={clinicName} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Add padding to account for mobile header when sidebar is closed */}
        <div className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}