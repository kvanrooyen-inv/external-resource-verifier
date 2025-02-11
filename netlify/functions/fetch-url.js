exports.handler = async (event) => {
  // Dynamically import node-fetch
  const {default: fetch} = await import(`node-fetch`);
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing URL parameter' }),
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatbile; MyApp/1.0; https://external-resource-checker.netlify.app)'
      }
    });

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
