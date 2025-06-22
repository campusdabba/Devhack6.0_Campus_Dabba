require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API connection...');
    console.log('API Key (first 10 chars):', process.env.NEXT_PUBLIC_GEMINI_API_KEY?.substring(0, 10) + '...');
    
    const prompt = "Hello! Please respond with just 'Gemini API is working correctly' to confirm the connection.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Success! Gemini API Response:', text);
    return true;
  } catch (error) {
    console.error('❌ Error testing Gemini API:', error.message);
    return false;
  }
}

testGeminiAPI();
