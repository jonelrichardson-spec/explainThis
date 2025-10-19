import { useState } from 'react';
import { generatePrompt, parseResponse } from '../utils/geminiPrompts';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const explainConcept = async (userInput, level) => {
    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    try {
      const prompt = generatePrompt(userInput, level);
      
      console.log('Calling Gemini API...');
      
      // Use gemini-2.5-flash - the model that exists in your account
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
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Success! Response received');
      
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
      console.error('Gemini API Error:', err);
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