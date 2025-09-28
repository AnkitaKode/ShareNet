// Data Migration Utility
// This script helps migrate data from localStorage to the backend database

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Get all items from localStorage
 */
export const getLocalStorageItems = () => {
  try {
    const items = JSON.parse(localStorage.getItem('shareNetItems') || '[]');
    console.log(`Found ${items.length} items in localStorage`);
    return items;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Transform frontend item format to backend format
 */
const transformItemForBackend = (item) => {
  return {
    name: item.name,
    description: item.description,
    pricePerDay: parseFloat(item.pricePerDay) || 0,
    imageUrl: item.imageUrl,
    isAvailable: item.available !== false, // Default to true if not specified
    availableUntil: null, // Can be set later
    latitude: 0, // Default coordinates
    longitude: 0,
    // Note: owner will need to be handled separately as it requires User entity
  };
};

/**
 * Upload a single item to the backend
 */
const uploadItemToBackend = async (item) => {
  try {
    const transformedItem = transformItemForBackend(item);
    
    const response = await fetch(`${API_BASE_URL}/items/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedItem)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error uploading item "${item.name}":`, error);
    throw error;
  }
};

/**
 * Migrate items from localStorage to database (excluding last N items)
 */
export const migrateItemsToDatabase = async (excludeLastN = 3) => {
  const localItems = getLocalStorageItems();
  
  if (localItems.length === 0) {
    console.log('No items found in localStorage to migrate');
    return { success: true, migrated: 0, errors: [] };
  }

  // Sort items by creation date (oldest first) and exclude the last N items
  const sortedItems = localItems.sort((a, b) => 
    new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );
  
  const itemsToMigrate = sortedItems.slice(0, -excludeLastN);
  
  console.log(`Migrating ${itemsToMigrate.length} items (excluding last ${excludeLastN})`);
  
  const results = {
    success: true,
    migrated: 0,
    errors: [],
    migratedItems: []
  };

  for (const item of itemsToMigrate) {
    try {
      console.log(`Migrating item: ${item.name}`);
      const result = await uploadItemToBackend(item);
      
      if (result.success) {
        results.migrated++;
        results.migratedItems.push({
          originalId: item.id,
          name: item.name,
          backendId: result.item?.id
        });
        console.log(`✅ Successfully migrated: ${item.name}`);
      } else {
        results.errors.push({
          item: item.name,
          error: result.message || 'Unknown error'
        });
        console.log(`❌ Failed to migrate: ${item.name} - ${result.message}`);
      }
    } catch (error) {
      results.errors.push({
        item: item.name,
        error: error.message
      });
      console.log(`❌ Error migrating: ${item.name} - ${error.message}`);
    }
    
    // Add a small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  if (results.errors.length > 0) {
    results.success = false;
  }

  console.log(`Migration completed: ${results.migrated} items migrated, ${results.errors.length} errors`);
  return results;
};

/**
 * Check if backend is available
 */
export const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/available`);
    return response.ok;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};

/**
 * Get items from backend database
 */
export const getBackendItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/available`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const items = await response.json();
    return items;
  } catch (error) {
    console.error('Error fetching items from backend:', error);
    return [];
  }
};

/**
 * Display migration summary
 */
export const displayMigrationSummary = (results) => {
  console.log('\n=== MIGRATION SUMMARY ===');
  console.log(`Status: ${results.success ? '✅ SUCCESS' : '❌ PARTIAL SUCCESS'}`);
  console.log(`Items migrated: ${results.migrated}`);
  console.log(`Errors: ${results.errors.length}`);
  
  if (results.migratedItems.length > 0) {
    console.log('\nMigrated items:');
    results.migratedItems.forEach(item => {
      console.log(`  • ${item.name} (ID: ${item.originalId} → ${item.backendId})`);
    });
  }
  
  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(error => {
      console.log(`  • ${error.item}: ${error.error}`);
    });
  }
  
  console.log('========================\n');
};
