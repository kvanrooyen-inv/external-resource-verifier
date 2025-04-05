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
  // Removed lastCheckTime since it's not being used

  // Function to check for updates - wrapped in useCallback to prevent infinite loops
  const checkForUpdate = useCallback(() => {
    const lastViewed = getLastViewedTimestamp();

    // Query for updates since last viewed timestamp
    const query = `*[_type == "update" && _updatedAt > $lastViewed] | order(releaseDate desc)`;

    client.fetch(query, {lastViewed})
      .then(updates => {
        // Removed the now and setLastCheckTime calls

        // If we have updates and the app is already showing content
        if (updates.length > 0) {
          if (notifications.length > 0) {
            // Compare with existing notifications to see if there are new ones
            const newUpdateIds = updates.map(update => update._id);
            const existingUpdateIds = notifications.map(notification => notification._id);

            // Check if there are any new updates
            const hasNewUpdates = newUpdateIds.some(id => !existingUpdateIds.includes(id));

            if (hasNewUpdates) {
              // New updates available, prompt for refresh
              setNeedsRefresh(true);
            }
          } else {
            // First load, just show updates.
            setNotifications(updates);
            setCurrentUpdateIndex(0); // Show the first update
          }
        }
      })
      .catch(err => {
        console.error('Error fetching updates: ', err);
      });
  }, [notifications]); // Added notifications as a dependency

  // Initial check on component mount.
  useEffect(() => {
    checkForUpdate();

    // Set up periodic checking for new updates.
    const intervalId = setInterval(() => {
      checkForUpdate();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [checkForUpdate]); // Added checkForUpdate as a dependency

  const handleCloseModal = () => {
    if (currentUpdateIndex < notifications.length - 1) {
      // Show next update
      setCurrentUpdateIndex(currentUpdateIndex + 1);
    } else {
      // All updates have been viewed
      setCurrentUpdateIndex(null);
      
      // Update the timestamp after viewing all updates
      const now = new Date().toISOString();
      setLastViewedTimestamp(now);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  }
  
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
