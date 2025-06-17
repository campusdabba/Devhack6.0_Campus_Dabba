"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function DatabaseTest() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      const supabase = createClient();
      const testResults: any = {};

      try {
        // Test 1: Get table information
        console.log("=== RUNNING DATABASE TESTS ===");
        
        // Test basic cooks query
        console.log("Test 1: Basic cooks query");
        const cooksTest1 = await supabase.from('cooks').select('*').limit(1);
        testResults.cooksBasic = { data: cooksTest1.data, error: cooksTest1.error?.message };
        console.log("Basic cooks test:", cooksTest1);

        // Test with specific cook IDs from menu
        console.log("Test 2: Query specific cook IDs");
        const cookIds = ['3d5f7b5e-efa9-4866-837f-8aca850b4f8a', 'bb6c98f6-9c20-4358-bbfb-1f2929f7ffb9'];
        const cooksTest2 = await supabase.from('cooks').select('*').in('id', cookIds);
        testResults.cooksSpecific = { data: cooksTest2.data, error: cooksTest2.error?.message };
        console.log("Specific cook IDs test:", cooksTest2);

        // Test with cook_id column instead
        console.log("Test 3: Query with cook_id column");
        const cooksTest3 = await supabase.from('cooks').select('*').in('cook_id', cookIds);
        testResults.cooksCookId = { data: cooksTest3.data, error: cooksTest3.error?.message };
        console.log("Cook ID column test:", cooksTest3);

        // Test table existence and count
        console.log("Test 4: Count total records");
        const cooksCount = await supabase.from('cooks').select('*', { count: 'exact', head: true });
        testResults.cooksCount = { count: cooksCount.count, error: cooksCount.error?.message };
        console.log("Cooks count test:", cooksCount);

        // Test menu items
        console.log("Test 5: Menu items");
        const menuTest = await supabase.from('dabba_menu').select('*').limit(5);
        testResults.menu = { data: menuTest.data, error: menuTest.error?.message };
        console.log("Menu test:", menuTest);

        setResults(testResults);
      } catch (error: any) {
        console.error("Test error:", error);
        setResults({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  if (loading) {
    return <div className="p-4">Running database tests...</div>;
  }

  return (
    <div className="p-4 space-y-4 bg-blue-50 border border-blue-200 rounded">
      <h3 className="text-lg font-bold text-blue-800">🔍 DATABASE TESTS</h3>
      
      <div className="space-y-2">
        <div>
          <h4 className="font-semibold">1. Basic Cooks Query:</h4>
          <pre className="text-xs bg-white p-2 rounded">{JSON.stringify(results.cooksBasic, null, 2)}</pre>
        </div>
        
        <div>
          <h4 className="font-semibold">2. Specific Cook IDs (id column):</h4>
          <pre className="text-xs bg-white p-2 rounded">{JSON.stringify(results.cooksSpecific, null, 2)}</pre>
        </div>
        
        <div>
          <h4 className="font-semibold">3. Specific Cook IDs (cook_id column):</h4>
          <pre className="text-xs bg-white p-2 rounded">{JSON.stringify(results.cooksCookId, null, 2)}</pre>
        </div>
        
        <div>
          <h4 className="font-semibold">4. Cooks Count:</h4>
          <pre className="text-xs bg-white p-2 rounded">{JSON.stringify(results.cooksCount, null, 2)}</pre>
        </div>
        
        <div>
          <h4 className="font-semibold">5. Menu Items Sample:</h4>
          <pre className="text-xs bg-white p-2 rounded max-h-32 overflow-auto">{JSON.stringify(results.menu, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
