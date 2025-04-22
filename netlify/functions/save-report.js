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

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    
    if (!data.url) {
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ error: 'URL is required' }) 
      };
    }

    // Make sure we store the actual data objects/arrays
    const recordData = {
      url: data.url,
      detected_libraries: data.detectedLibraries || [],
      detected_alerts: data.detectedAlerts || [],
      detected_lazy_loading: data.detectedLazyLoading || [],
      detected_form_validation: data.detectedFormValidation && data.detectedFormValidation.forms ? 
        data.detectedFormValidation.forms : [],
      detected_aria_attributes: data.detectedAriaLabels || [],
      os_name: data.osName || 'Unknown',
      created_at: new Date().toISOString()
    };
    
    // Store the analysis data in Supabase
    const { data: insertedData, error } = await supabase
      .from('site_stats')
      .insert(recordData)
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: insertedData?.[0]?.id || null,
        dataSummary: {
          libraries: recordData.detected_libraries.length,
          alerts: recordData.detected_alerts.length,
          lazyLoading: recordData.detected_lazy_loading.length,
          formValidation: recordData.detected_form_validation.length,
          ariaAttributes: recordData.detected_aria_attributes.length
        }
      })
    };
  } catch (error) {
    console.error('Error saving data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to save analysis data' })
    };
  }
};