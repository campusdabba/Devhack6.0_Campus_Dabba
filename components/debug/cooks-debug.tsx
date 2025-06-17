"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function CooksDebug() {
  const [cooks, setCooks] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        // Test basic cooks query
        console.log("=== COOKS DEBUG ===");
        console.log("Fetching cooks...");
        const { data: cooksData, error: cooksError } = await supabase
          .from('cooks')
          .select('*');
        
        console.log("Cooks data:", cooksData);
        console.log("Cooks error:", cooksError);
        console.log("Cooks count:", cooksData?.length || 0);
        
        if (cooksError) {
          setError(`Cooks error: ${cooksError.message}`);
          return;
        }
        
        setCooks(cooksData || []);
        
        // Test menu items query
        console.log("=== MENU DEBUG ===");
        console.log("Fetching menu items...");
        const { data: menuData, error: menuError } = await supabase
          .from('dabba_menu')
          .select('*');
        
        console.log("Menu data:", menuData);
        console.log("Menu error:", menuError);
        console.log("Menu count:", menuData?.length || 0);
        
        if (menuError) {
          setError(`Menu error: ${menuError.message}`);
          return;
        }
        
        setMenuItems(menuData || []);
        
        // Extract unique cook_ids from menu items
        const uniqueCookIds = [...new Set(menuData?.map(item => item.cook_id).filter(Boolean))];
        console.log("=== COOK ID ANALYSIS ===");
        console.log("Unique cook_ids from menu:", uniqueCookIds);
        console.log("Cook IDs count:", uniqueCookIds.length);
        
        // Check if any of these cook_ids exist in cooks table
        if (uniqueCookIds.length > 0) {
          console.log("Checking if cook_ids exist in cooks table...");
          const { data: cookCheck, error: cookCheckError } = await supabase
            .from('cooks')
            .select('id')
            .in('id', uniqueCookIds);
          
          console.log("Cook ID check result:", cookCheck);
          console.log("Cook ID check error:", cookCheckError);
          
          // Also try with different column names
          const { data: cookCheck2, error: cookCheckError2 } = await supabase
            .from('cooks')
            .select('cook_id')
            .in('cook_id', uniqueCookIds);
          
          console.log("Cook ID check (cook_id column):", cookCheck2);
          console.log("Cook ID check error (cook_id column):", cookCheckError2);
        }
        
      } catch (err: any) {
        console.error("Debug error:", err);
        setError(`Debug error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading debug info...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 space-y-4 bg-yellow-50 border border-yellow-200 rounded">
      <h2 className="text-xl font-bold text-yellow-800">🐛 DEBUG INFO</h2>
      
      <div>
        <h3 className="text-lg font-bold">Cooks ({cooks.length})</h3>
        {cooks.length > 0 && (
          <div className="text-sm">
            <p><strong>Sample cook IDs:</strong> {cooks.slice(0, 3).map(c => c.id || c.cook_id).join(', ')}</p>
            <p><strong>Sample cook columns:</strong> {cooks.length > 0 ? Object.keys(cooks[0]).join(', ') : 'N/A'}</p>
          </div>
        )}
        <pre className="text-xs bg-gray-100 p-2 rounded max-h-40 overflow-auto">
          {JSON.stringify(cooks, null, 2)}
        </pre>
      </div>
      
      <div>
        <h3 className="text-lg font-bold">Menu Items ({menuItems.length})</h3>
        {menuItems.length > 0 && (
          <div className="text-sm">
            <p><strong>Unique cook_ids in menu:</strong> {[...new Set(menuItems.map(item => item.cook_id).filter(Boolean))].slice(0, 5).join(', ')}</p>
            <p><strong>Menu items with null cook_id:</strong> {menuItems.filter(item => !item.cook_id).length}</p>
          </div>
        )}
        <pre className="text-xs bg-gray-100 p-2 rounded max-h-40 overflow-auto">
          {JSON.stringify(menuItems.slice(0, 5), null, 2)}
        </pre>
      </div>
    </div>
  );
}
