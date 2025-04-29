// functions/get-stats.js
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    // Get all records from site_stats table
    const { data, error } = await supabase.from("dev_test").select("*");

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "No analysis data found" }),
      };
    }

    // Process the data to extract statistics
    const stats = processDataForStats(data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(stats),
    };
  } catch (error) {
    console.error("Error retrieving stats:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to retrieve statistics" }),
    };
  }
};

// Helper function to process data into statistics
function processDataForStats(data) {
  // Initialize counters and collections
  const libraryCount = {};
  let sitesWithAlerts = 0;
  let sitesWithFormValidation = 0;
  let sitesWithAria = 0;
  const totalSites = data.length;

  // Process each record
  data.forEach((record) => {
    // Count libraries
    if (record.detected_libraries) {
      // Handle both string and already parsed objects
      const libraries =
        typeof record.detected_libraries === "string"
          ? JSON.parse(record.detected_libraries)
          : record.detected_libraries;

      if (Array.isArray(libraries)) {
        libraries.forEach((lib) => {
          if (lib.name) {
            libraryCount[lib.name] = (libraryCount[lib.name] || 0) + 1;
          }
        });
      }
    }

    // Count sites with alerts
    if (record.detected_alerts) {
      // Handle both string and already parsed objects
      const alerts =
        typeof record.detected_alerts === "string"
          ? JSON.parse(record.detected_alerts)
          : record.detected_alerts;

      if (Array.isArray(alerts) && alerts.length > 0) {
        sitesWithAlerts++;
      }
    }

    if (record.detected_form_validation) {
      // Handle both string and already parsed objects
      const formValidation =
        typeof record.detected_form_validation === "string"
          ? JSON.parse(record.detected_form_validation)
          : record.detected_form_validation;

      if (Array.isArray(formValidation) && formValidation.length > 0) {
        sitesWithFormValidation++;
      }
    }

    if (record.detected_aria_attributes) {
      // Handle both string and already parsed objects
      const ariaLabels =
        typeof record.detected_aria_attributes === "string"
          ? JSON.parse(record.detected_aria_attributes)
          : record.detected_aria_attributes;

      if (Array.isArray(ariaLabels) && ariaLabels.length > 0) {
        sitesWithAria++;
      }
    }
  });

  // Sort libraries by popularity
  const topLibraries = Object.entries(libraryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / totalSites) * 100).toFixed(1),
    }));

  return {
    totalSites,
    topLibraries,
    alertStats: {
      sitesWithAlerts,
      percentageWithAlerts: ((sitesWithAlerts / totalSites) * 100).toFixed(1),
    },
    formValidationStats: {
      sitesWithValidation: sitesWithFormValidation,
      percentageWithValidation: (
        (sitesWithFormValidation / totalSites) *
        100
      ).toFixed(1),
    },
    ariaStats: {
      sitesWithAria,
      percentageWithAria: ((sitesWithAria / totalSites) * 100).toFixed(1),
    },
  };
}
