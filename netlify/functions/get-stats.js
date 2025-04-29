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
    // First, get the total count of records
    const { count: totalCount, error: countError } = await supabase
      .from("site_stats")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Error getting count:", countError);
      throw countError;
    }

    console.log(`Total records in database: ${totalCount}`);

    // Now get records with a larger limit for analysis
    // Use paging for very large datasets to avoid timeouts
    const PAGE_SIZE = 1000;
    let allData = [];
    let page = 0;
    
    // Only fetch data if we have records
    if (totalCount > 0) {
      while (page * PAGE_SIZE < totalCount && page < 10) { // Limit to 10 pages to prevent infinite loops
        const { data: pageData, error: pageError } = await supabase
          .from("site_stats")
          .select("*")
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
        
        if (pageError) {
          console.error(`Error fetching page ${page}:`, pageError);
          throw pageError;
        }
        
        if (pageData && pageData.length > 0) {
          allData = [...allData, ...pageData];
          page++;
        } else {
          break;
        }
      }
    }

    if (allData.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "No analysis data found" }),
      };
    }

    console.log(`Fetched ${allData.length} records for analysis`);

    // Process the data to extract statistics
    const stats = processDataForStats(allData);
    
    // Add the real total count from the database
    stats.totalSites = totalCount;
    stats.analyzedSites = allData.length;
    stats.lastUpdated = new Date().toISOString();

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
    analyzedSites: totalSites, // This will be overridden with actual count
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