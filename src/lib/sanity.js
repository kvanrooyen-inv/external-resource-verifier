import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2025-01-01', // use current date in YYYY-MM-DD format
});

// Helper function to get all libraries
export async function getLibraries() {
  return client.fetch(`*[_type == "library"] | order(order asc)`);
}
