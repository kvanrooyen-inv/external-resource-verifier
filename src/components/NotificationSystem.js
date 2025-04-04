import React, { useState, useEffect } from 'react';
import { client } from '../lib/sanity.js';
import UpdateModal from './UpdateModal';

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
  
  useEffect(() => {
    const lastViewed = getLastViewedTimestamp();
    const now = new Date().toISOString();
    
    // Query for updates since last viewed timestamp
    const query = `*[_type == "update" && _updatedAt > $lastViewed] | order(releaseDate desc)`;
    
    client.fetch(query, { lastViewed })
      .then(updates => {
        if (updates.length > 0) {
          setNotifications(updates);
          setCurrentUpdateIndex(0); // Show the first update
        }
      })
      .catch(err => {
        console.error('Error fetching updates:', err);
      });
  }, []);
  
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
  
  return (
    <>
      {currentUpdateIndex !== null && notifications.length > 0 && (
        <UpdateModal 
          update={notifications[currentUpdateIndex]}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default NotificationSystem;
