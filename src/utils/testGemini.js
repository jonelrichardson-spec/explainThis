import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function listAvailableModels() {
  try {
    console.log('🔍 Checking available models...');
    console.log('API Key (first 10 chars):', apiKey?.substring(0, 10));
    
    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash'
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = result.response.text();
        console.log(`✅ ${modelName} WORKS!`, response.substring(0, 50));
        return modelName; // Return the first working model
      } catch (err) {
        console.log(`❌ ${modelName} failed:`, err.message);
      }
    }
    
    console.log('❌ No models worked');
    return null;
  } catch (err) {
    console.error('Error testing models:', err);
    return null;
  }
}