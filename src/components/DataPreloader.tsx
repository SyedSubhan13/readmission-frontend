import { useEffect } from 'react';
import { loadSampleDataForTesting, getSettings } from '@/services/modelService';

/**
 * Component that preloads data in the background.
 * This component doesn't render anything visible - it just triggers data loading.
 */
export function DataPreloader() {
  useEffect(() => {
    const preloadData = async () => {
      try {
        const settings = getSettings();
        console.log('Preloading data in the background...');
        
        // Start loading sample data in the background
        if (settings.useSampleData) {
          await loadSampleDataForTesting();
          console.log('Sample data preloaded successfully');
        }
      } catch (error) {
        console.warn('Error preloading data:', error);
        // Don't show any error to the user since this happens in the background
      }
    };

    // Add a small delay to ensure this doesn't block initial rendering
    const timer = setTimeout(() => {
      preloadData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything
  return null;
} 