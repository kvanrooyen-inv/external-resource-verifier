const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing URL parameter' }),
    };
  }

  try {
    const response = await fetch(url);

    // Get the response text
    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        // Allow your site (or all origins) to access this resource:
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (error) {
    console.error('Error fetching URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching the URL' }),
    };
  }
};
