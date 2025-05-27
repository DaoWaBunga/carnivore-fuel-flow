
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveLayout = ({ children, className = "" }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${className} ${isMobile ? 'pb-20' : ''}`}>
      {children}
    </div>
  );
};
