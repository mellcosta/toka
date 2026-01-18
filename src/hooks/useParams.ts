import { useEffect, useState } from 'react';

// Get current route params
const getRouteParams = (): { [key: string]: string } => {
  const path = window.location.pathname;
  const match = path.match(/\/profile\/(.+)/);
  if (match) {
    return { authorName: match[1] };
  }
  return {};
};

// Simple client-side router hook
export const useParams = () => {
  const [params, setParams] = useState<{ [key: string]: string }>(getRouteParams);

  useEffect(() => {
    const handlePopState = () => {
      setParams(getRouteParams());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return params;
};
