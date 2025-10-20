import { useState } from 'react';
import { generatePrompt, parseResponse } from '../utils/geminiPrompts';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
const extractTechnicalTerm = (userInput) => {
  // Common tech acronyms that should stay uppercase
  const acronyms = ['API', 'APIs', 'HTML', 'CSS', 'JS', 'SQL', 'REST', 'HTTP', 'HTTPS', 
                    'URL', 'JSON', 'XML', 'AJAX', 'DOM', 'CLI', 'GUI', 'SDK', 'IDE',
                    'AWS', 'GCP', 'CDN', 'DNS', 'VPN', 'SSH', 'FTP', 'TCP', 'IP',
                    'UI', 'UX', 'CI', 'CD', 'NPM', 'JWT', 'OAuth'];
  
 const fixCapitalization = (term) => {
  return term
    .split(/\s+/)
    .map(word => {
      // Check if word is an acronym (case-insensitive)
      const upperWord = word.toUpperCase();
      if (acronyms.includes(upperWord)) {
        return upperWord;
      }
      // Normal title case
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

// If input is very short (< 30 chars), just use it as-is
if (userInput.length < 30) {
  const cleaned = userInput
    .replace(/^(what is|what are|explain|tell me about|how does|how do|why|when|where)\s+/gi, '')
    .replace(/\?/g, '')
    .trim();
  
  const words = cleaned.split(/\s+/).slice(0, 3).join(' ');
  return fixCapitalization(words);
}

// For longer text, look for technical patterns
const technicalPatterns = [
  // "about X", "called X"
  /(?:about|called)\s+([A-Za-z0-9/\-\+\.]+(?:\s+[A-Za-z0-9/\-\+\.]*){0,2})/i,
  // Technical terms (capitalized or has special chars)
  /\b([A-Z][A-Za-z0-9/\-\+\.]+(?:\s+[A-Z][A-Za-z0-9/\-\+\.]*){0,2})\b/,
  // Common tech terms (lowercase)
  /\b(api|apis|html|css|javascript|react|python|database|server|middleware|async|await|npm|git|json|sql|rest)\b/i
];

for (const pattern of technicalPatterns) {
  const match = userInput.match(pattern);
  if (match) {
    return fixCapitalization(match[1]);
  }
}

// Fallback: use first capitalized word or first 3 words
const words = userInput.split(/\s+/);
const capitalizedWord = words.find(w => /^[A-Z]/.test(w));

if (capitalizedWord) {
  return fixCapitalization(capitalizedWord);
}

// Last resort: first 3 words
return fixCapitalization(words.slice(0, 3).join(' '));
};
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
  concept: extractTechnicalTerm(userInput), // ← CHANGED: use extracted term
  fullQuestion: userInput, // ← NEW: store original question
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