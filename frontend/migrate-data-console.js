// Data Migration Console Script
// Copy and paste this script into your browser console on localhost:3001
// This will migrate localStorage data to the backend database (excluding last 3 items)

(async function migrateData() {
  console.log('🚀 Starting data migration...');
  
  // Check if we're on the right domain
  if (!window.location.href.includes('localhost:3001') && !window.location.href.includes('localhost:3002')) {
    console.error('❌ Please run this script on localhost:3001 or localhost:3002');
    return;
  }
  
  // Get items from localStorage
  const localItems = JSON.parse(localStorage.getItem('shareNetItems') || '[]');
  console.log(`📦 Found ${localItems.length} items in localStorage`);
  
  if (localItems.length === 0) {
    console.log('ℹ️ No items found to migrate');
    return;
  }
  
  // Sort by creation date and exclude last 3
  const sortedItems = localItems.sort((a, b) => 
    new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );
  
  const itemsToMigrate = sortedItems.slice(0, -3);
  console.log(`📋 Will migrate ${itemsToMigrate.length} items (excluding last 3)`);
  
  if (itemsToMigrate.length === 0) {
    console.log('ℹ️ No items to migrate after excluding last 3');
    return;
  }
  
  // Check backend connection
  try {
    const testResponse = await fetch('http://localhost:8080/api/items/available');
    if (!testResponse.ok) {
      throw new Error('Backend not responding');
    }
    console.log('✅ Backend connection successful');
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('💡 Make sure your Spring Boot backend is running on port 8080');
    return;
  }
  
  // Migration results
  const results = {
    total: itemsToMigrate.length,
    success: 0,
    failed: 0,
    errors: []
  };
  
  console.log('🔄 Starting migration...');
  
  // Migrate each item
  for (let i = 0; i < itemsToMigrate.length; i++) {
    const item = itemsToMigrate[i];
    
    try {
      console.log(`📤 Migrating ${i + 1}/${itemsToMigrate.length}: ${item.name}`);
      
      // Transform item for backend
      const backendItem = {
        name: item.name,
        description: item.description,
        pricePerDay: parseFloat(item.pricePerDay) || 0,
        imageUrl: item.imageUrl,
        isAvailable: item.available !== false,
        availableUntil: null,
        latitude: 0,
        longitude: 0
      };
      
      const response = await fetch('http://localhost:8080/api/items/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendItem)
      });
      
      if (response.ok) {
        const result = await response.json();
        results.success++;
        console.log(`✅ Success: ${item.name} (ID: ${result.item?.id})`);
      } else {
        const errorText = await response.text();
        results.failed++;
        results.errors.push(`${item.name}: ${response.status} ${errorText}`);
        console.log(`❌ Failed: ${item.name} - ${response.status} ${errorText}`);
      }
    } catch (error) {
      results.failed++;
      results.errors.push(`${item.name}: ${error.message}`);
      console.log(`❌ Error: ${item.name} - ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Display final results
  console.log('\n📊 MIGRATION SUMMARY');
  console.log('===================');
  console.log(`Total items: ${results.total}`);
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success rate: ${((results.success / results.total) * 100).toFixed(1)}%`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    results.errors.forEach(error => console.log(`  • ${error}`));
  }
  
  if (results.success > 0) {
    console.log(`\n🎉 Migration completed! ${results.success} items successfully added to database.`);
    console.log('💡 You can now verify the data in your backend database.');
  }
  
  return results;
})();

// Instructions:
// 1. Make sure your Spring Boot backend is running on port 8080
// 2. Open your ShareNet frontend on localhost:3001 or localhost:3002
// 3. Open browser developer tools (F12)
// 4. Go to Console tab
// 5. Copy and paste this entire script
// 6. Press Enter to run
// 7. Watch the migration progress in the console
