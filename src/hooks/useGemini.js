import { useState } from 'react';
import { generatePrompt, parseResponse } from '../utils/geminiPrompts';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const explainConcept = async (userInput, level) => {
    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Debug logging
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length);
    console.log('🔑 API Key starts with:', apiKey?.substring(0, 10));
    
    if (!apiKey) {
      setError('API key is missing! Check Netlify environment variables.');
      setIsLoading(false);
      return null;
    }
    
    try {
      const prompt = generatePrompt(userInput, level);
      
      console.log('📡 Calling Gemini API...');
      
      // Use gemini-2.5-flash
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error Response:', errorData);
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Success! Response received');
      
      const text = data.candidates[0].content.parts[0].text;
      const parsedExplanation = parseResponse(text);

      const explanation = {
        id: crypto.randomUUID(),
        concept: userInput,
        level: level,
        timestamp: new Date().toISOString(),
        explanation: parsedExplanation,
        category: 'General',
        saved: false
      };

      setIsLoading(false);
      return explanation;

    } catch (err) {
      console.error('❌ Gemini API Error:', err);
      setError(err.message || 'Failed to generate explanation');
      setIsLoading(false);
      return null;
    }
  };

  return {
    explainConcept,
    isLoading,
    error
  };
};