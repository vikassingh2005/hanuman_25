import React, { useEffect, useState } from 'react';
import '../styles/responsive.css';

// Breakpoints that match our CSS media queries
const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
};

// Hook to get current viewport size
export const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    
    window.addEventListener("resize", handleWindowResize);
    
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  // Return viewport size and boolean helpers for breakpoints
  return {
    width,
    height,
    isMobile: width < breakpoints.sm,
    isTablet: width >= breakpoints.sm && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    breakpoints
  };
};

// Responsive wrapper component
const ResponsiveWrapper = ({ children, className = '', ...props }) => {
  const viewport = useViewport();
  
  return (
    <div className={`container ${className}`} {...props} data-viewport={viewport.width < breakpoints.sm ? 'mobile' : viewport.width < breakpoints.lg ? 'tablet' : 'desktop'}>
      {typeof children === 'function' ? children(viewport) : children}
    </div>
  );
};

export default ResponsiveWrapper;