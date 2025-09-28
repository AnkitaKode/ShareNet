import React, { useState, useEffect } from 'react';
import StarsBackground from '../components/StarsBackground';
import { toast } from 'sonner';

const DataMigrationPage = () => {
  const [localItems, setLocalItems] = useState([]);
  const [migrationStatus, setMigrationStatus] = useState('idle');
  const [results, setResults] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    loadLocalItems();
    checkBackendConnection();
  }, []);

  const loadLocalItems = () => {
    try {
      const items = JSON.parse(localStorage.getItem('shareNetItems') || '[]');
      setLocalItems(items);
    } catch (error) {
      console.error('Error loading local items:', error);
      toast.error('Failed to load local items');
    }
  };

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/items/available');
      setBackendConnected(response.ok);
    } catch (error) {
      setBackendConnected(false);
    }
  };

  const migrateData = async () => {
    if (!backendConnected) {
      toast.error('Backend is not connected. Please start the backend server.');
      return;
    }

    setMigrationStatus('migrating');
    
    // Sort items by creation date and exclude last 3
    const sortedItems = [...localItems].sort((a, b) => 
      new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );
    
    const itemsToMigrate = sortedItems.slice(0, -3);
    
    const migrationResults = {
      total: itemsToMigrate.length,
      success: 0,
      failed: 0,
      errors: []
    };

    for (const item of itemsToMigrate) {
      try {
        const backendItem = {
          name: item.name,
          description: item.description,
          pricePerDay: parseFloat(item.pricePerDay) || 0,
          imageUrl: item.imageUrl,
          isAvailable: true,
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
          migrationResults.success++;
          toast.success(`Migrated: ${item.name}`);
        } else {
          migrationResults.failed++;
          migrationResults.errors.push(`${item.name}: ${response.statusText}`);
        }
      } catch (error) {
        migrationResults.failed++;
        migrationResults.errors.push(`${item.name}: ${error.message}`);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setResults(migrationResults);
    setMigrationStatus('completed');
    
    if (migrationResults.success > 0) {
      toast.success(`Migration completed! ${migrationResults.success} items migrated.`);
    }
  };

  return (
    <div className="min-h-screen relative">
      <StarsBackground />
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Data Migration</h1>
          <p className="text-gray-300">Migrate localStorage data to database (excluding last 3 items)</p>
        </div>

        {/* Connection Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Connection Status</h2>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-white">
              Backend: {backendConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Local Data Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Local Data Summary</h2>
          <p className="text-gray-300 mb-2">Total items in localStorage: {localItems.length}</p>
          <p className="text-gray-300 mb-4">Items to migrate (excluding last 3): {Math.max(0, localItems.length - 3)}</p>
          
          {localItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Items to migrate:</h3>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {localItems.slice(0, -3).map((item, index) => (
                  <div key={item.id} className="text-sm text-gray-300 bg-white/5 rounded p-2">
                    {index + 1}. {item.name} - {item.category}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Migration Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Migration Controls</h2>
          
          <button
            onClick={migrateData}
            disabled={!backendConnected || migrationStatus === 'migrating' || localItems.length <= 3}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {migrationStatus === 'migrating' ? 'Migrating...' : 'Start Migration'}
          </button>
          
          {!backendConnected && (
            <p className="text-red-400 text-sm mt-2">Please start the backend server first</p>
          )}
          
          {localItems.length <= 3 && (
            <p className="text-yellow-400 text-sm mt-2">Need more than 3 items to migrate</p>
          )}
        </div>

        {/* Migration Results */}
        {results && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Migration Results</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{results.total}</div>
                <div className="text-sm text-gray-300">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{results.success}</div>
                <div className="text-sm text-gray-300">Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{results.failed}</div>
                <div className="text-sm text-gray-300">Failed</div>
              </div>
            </div>
            
            {results.errors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Errors:</h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {results.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-300 bg-red-500/10 rounded p-2">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataMigrationPage;
