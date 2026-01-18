import React, { useEffect, useState } from 'react';

// Simple client-side router
export const useParams = () => {
  const [params, setParams] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/profile\/(.+)/);
    if (match) {
      setParams({ authorName: match[1] });
    }
  }, []);

  return params;
};

interface RouterProps {
  children: React.ReactNode;
}

export const Router: React.FC<RouterProps> = ({ children }) => {
  const [, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return <>{children}</>;
};
