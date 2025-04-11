// RefreshPrompt.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';

const RefreshPrompt = ({ onRefresh, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-sm shadow-lg">
        <CardHeader className="bg-blue-100 dark:bg-blue-900/30 py-2">
          <CardTitle className="text-lg">New Updates Available</CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <p className="mb-3">New updates have been published. Refresh to view the latest content.</p>
          <div className="flex justify-between">
            <Button onClick={onDismiss}>
              Later
            </Button>
            <Button onClick={onRefresh}>
              Refresh Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefreshPrompt;
