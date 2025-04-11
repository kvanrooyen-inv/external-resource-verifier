import React, { useState, useEffect, useCallback } from 'react';
import { client } from '../lib/sanity.js';
import UpdateModal from './UpdateModal';
import RefreshPrompt from './RefreshPrompt.js';

// Helper to get/set last viewed timestamp from localStorage
const getLastViewedTimestamp = () => {
  return localStorage.getItem('lastViewedTimestamp') || '0';
};

const setLastViewedTimestamp = (timestamp) => {
  localStorage.setItem('lastViewedTimestamp', timestamp);
};

// Main notification system component
const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Function to check for updates - wrapped in useCallback to prevent infinite loops
  const checkForUpdate = useCallback(() => {
    const lastViewed = getLastViewedTimestamp();

    // Query for the most recent update, including _updatedAt
    const query = `*[_type == "update"] | order(releaseDate desc)[0] {
      _id,
      _updatedAt,
      title,
      updateDescription,
      releaseDate,
      importance
    }`;

    client.fetch(query)
      .then(latestUpdate => {
        if (!latestUpdate) return; // No updates available
        
        if (!initialLoadComplete) {
          // Compare full timestamps for more granular detection
          const lastViewedTimestamp = new Date(lastViewed).getTime();
          const updateTimestamp = new Date(latestUpdate._updatedAt).getTime();
          
          if (updateTimestamp > lastViewedTimestamp) {
            setNotifications([latestUpdate]);
            setCurrentUpdateIndex(0); // Show the update
          }
          setInitialLoadComplete(true);
        } else {
          // After initial load, check if there's a new update since last viewed
          if (notifications.length > 0) {
            const currentUpdateTimestamp = new Date(notifications[0]._updatedAt).getTime();
            const newUpdateTimestamp = new Date(latestUpdate._updatedAt).getTime();
            
            // Show refresh prompt if update is newer than what we're currently showing
            if (newUpdateTimestamp > currentUpdateTimestamp) {
              setNeedsRefresh(true);
            }
          } else if (latestUpdate) {
            // If we somehow don't have notifications yet but there is an update
            const lastViewedTimestamp = new Date(lastViewed).getTime();
            const updateTimestamp = new Date(latestUpdate._updatedAt).getTime();
            
            if (updateTimestamp > lastViewedTimestamp) {
              setNeedsRefresh(true);
            }
          }
        }
      })
      .catch(err => {
        console.error('Error fetching updates: ', err);
      });
  }, [notifications, initialLoadComplete]);

  // Initial check on component mount
  useEffect(() => {
    checkForUpdate();

    // Set up periodic checking for new updates
    const intervalId = setInterval(() => {
      checkForUpdate();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [checkForUpdate]);

  const handleCloseModal = () => {
    // All updates have been viewed
    setCurrentUpdateIndex(null);
    
    // Update the timestamp after viewing
    const now = new Date().toISOString();
    setLastViewedTimestamp(now);
  };

  const handleRefresh = () => {
    window.location.reload();
  };
  
  return (
    <>
      {currentUpdateIndex !== null && notifications.length > 0 && (
        <UpdateModal 
          update={notifications[currentUpdateIndex]}
          onClose={handleCloseModal}
        />
      )}

      {needsRefresh && (
        <RefreshPrompt
          onRefresh={handleRefresh}
          onDismiss={() => setNeedsRefresh(false)}
        />
      )}
    </>
  );
};

export default NotificationSystem;
