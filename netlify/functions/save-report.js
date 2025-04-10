// functions/save-report.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    
    // Generate a unique ID for the report
    const reportId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    
    // Store the report in Supabase
    const { error } = await supabase
      .from('reports')
      .insert({
        report_id: reportId,
        url: data.url,
        detected_libraries: data.detectedLibraries,
        detected_alerts: data.detectedAlerts,
        os_name: data.osName
      });
    
    if (error) throw error;
    
    // Create the share URL
    const shareUrl = `${process.env.URL || 'https://external-resource-checker.netlify.app/'}/report/${reportId}`;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        reportId,
        shareUrl
      })
    };
  } catch (error) {
    console.error('Error saving report:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save report' })
    };
  }
};
