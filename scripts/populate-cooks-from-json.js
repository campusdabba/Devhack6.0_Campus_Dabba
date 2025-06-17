const fs = require('fs');
const path = require('path');

// Read the cooks.json file
const cooksData = JSON.parse(fs.readFileSync('./cooks.json', 'utf8'));

console.log('-- Populate cooks table with all data from cooks.json');
console.log('-- Total cooks to insert:', cooksData.length);
console.log('');

console.log('INSERT INTO cooks (');
console.log('  id, email, first_name, last_name, phone, profile_image,');
console.log('  description, rating, created_at, address, cuisine_type,');
console.log('  is_available, total_orders');
console.log(') VALUES');

const values = cooksData.map((cook, index) => {
  const address = JSON.stringify(cook.address || {});
  const rating = parseFloat(cook.rating) || 0;
  const totalOrders = parseInt(cook.total_orders) || parseInt(cook.totalorders) || 0;
  const isAvailable = cook.is_available !== undefined ? cook.is_available : cook.isAvailable;
  const cuisineType = cook.cuisine_type || cook.cuisineType || 'other';
  
  // Escape single quotes in strings
  const escapeString = (str) => str ? str.replace(/'/g, "''") : '';
  
  return `(
    '${cook.id}',
    '${escapeString(cook.email)}',
    '${escapeString(cook.first_name)}',
    '${escapeString(cook.last_name)}',
    '${escapeString(cook.phone)}',
    '${escapeString(cook.profile_image)}',
    '${escapeString(cook.description)}',
    ${rating},
    '${cook.created_at}',
    '${address.replace(/'/g, "''")}',
    '${escapeString(cuisineType)}',
    ${isAvailable},
    ${totalOrders}
  )`;
}).join(',\n');

console.log(values);
console.log(';');
console.log('');
console.log('-- Verify the insert');
console.log('SELECT id, email, first_name, last_name, cuisine_type, is_available FROM cooks ORDER BY created_at;');
