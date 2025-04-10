// functions/get-report.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // Extract report ID from the path
    const pathSegments = event.path.split('/');
    const reportId = pathSegments[pathSegments.length - 1];
    
    // Query Supabase for the report
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('report_id', reportId)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Report not found' })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: data.url,
        detectedLibraries: data.detected_libraries,
        detectedAlerts: data.detected_alerts || [],
        osName: data.os_name
      })
    };
  } catch (error) {
    console.error('Error retrieving report:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve report' })
    };
  }
};
