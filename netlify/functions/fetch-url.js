const axios = require('axios');

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'OK'
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  // Get URL from query parameters
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'URL is required' })
    };
  }

  try {
    // Fetch the URL
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    // Return the response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        contents: response.data,
        status: {
          url: url,
          status: response.status,
          contentType: response.headers['content-type']
        }
      })
    };
  } catch (error) {
    console.error('Fetch error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Could not fetch URL',
        details: error.message
      })
    };
  }
};
