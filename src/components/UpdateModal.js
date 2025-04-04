import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { format } from 'date-fns';

const UpdateModal = ({ update, onClose }) => {
  if (!update) return null;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Determine background color based on importance
  const getImportanceClass = () => {
    switch (update.importance) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg">
        <Card className="w-full">
          <CardHeader className={`rounded-t-xl ${getImportanceClass()}`}>
            <div className="flex justify-between items-center">
              <CardTitle>{update.title}</CardTitle>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Released: {formatDate(update.releaseDate)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 whitespace-pre-wrap">
              {update.updateDescription}
            </div>
            <div className="flex justify-end">
              <Button onClick={onClose}>
                Got it
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateModal;
