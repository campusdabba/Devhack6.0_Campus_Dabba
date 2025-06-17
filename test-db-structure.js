// Simple test to check database structure
const { createClient } = require('@supabase/supabase-js');

// You'll need to add your Supabase URL and anon key here
// Or run this in the browser console where the client is already available

async function testDatabaseStructure() {
  console.log("=== DATABASE STRUCTURE TEST ===");
  
  try {
    // This should be run in browser console with access to the supabase client
    // Test 1: Check cooks table structure
    console.log("1. Testing cooks table...");
    const { data: cooksData, error: cooksError } = await supabase
      .from('cooks')
      .select('*')
      .limit(1);
    
    console.log("Cooks result:", { data: cooksData, error: cooksError });
    
    if (cooksData && cooksData.length > 0) {
      console.log("Cooks table columns:", Object.keys(cooksData[0]));
    }
    
    // Test 2: Check menu table structure  
    console.log("2. Testing dabba_menu table...");
    const { data: menuData, error: menuError } = await supabase
      .from('dabba_menu')
      .select('*')
      .limit(1);
    
    console.log("Menu result:", { data: menuData, error: menuError });
    
    if (menuData && menuData.length > 0) {
      console.log("Menu table columns:", Object.keys(menuData[0]));
    }
    
    // Test 3: Count records
    console.log("3. Counting records...");
    const { count: cooksCount } = await supabase
      .from('cooks')
      .select('*', { count: 'exact', head: true });
    
    const { count: menuCount } = await supabase
      .from('dabba_menu')
      .select('*', { count: 'exact', head: true });
    
    console.log("Record counts:", { cooks: cooksCount, menu: menuCount });
    
  } catch (error) {
    console.error("Test error:", error);
  }
}

console.log("Run testDatabaseStructure() in browser console");
