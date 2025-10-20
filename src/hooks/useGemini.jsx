import { useState } from 'react';
import { generatePrompt, parseResponse } from '../utils/geminiPrompts';

// Extract technical term from user input

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
        const upperWord = word.toUpperCase();
        if (acronyms.includes(upperWord)) {
          return upperWord;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

 // First, try to find "X in Y" pattern (e.g., "state management in Redux")
// Remove question words first, then look for pattern
let tempCleaned = userInput
  .replace(/^(what is|what are|what's|explain|tell me about|how does|how do|why does|why do|when|where|the)\s+/gi, '')
  .trim();

const inPattern = /([\w\s]+)\s+in\s+([\w.]+)/i;
const inMatch = tempCleaned.match(inPattern);
if (inMatch) {
  // Take first 2 words from the part before "in"
  const xPart = inMatch[1].trim().split(/\s+/).slice(0, 2).join(' ');
  return fixCapitalization(xPart);
}
  // Remove question words AND articles
let cleaned = userInput
  .replace(/^(what is|what are|what's|whats|explain|tell me about|how does|how do|why does|why do|when|where)\s+/gi, '')
  .replace(/^(the|a|an)\s+/gi, '') // Remove leading articles
  .replace(/\?/g, '')
  .trim();

  // If cleaned is empty or too short, use first meaningful words from original
  if (!cleaned || cleaned.length < 3) {
    const words = userInput.replace(/\?/g, '').trim().split(/\s+/);
    // Skip question words manually
    const skipWords = ['what', 'is', 'are', 'the', 'explain', 'tell', 'me', 'about', 'how', 'does', 'do'];
    const meaningfulWords = words.filter(w => !skipWords.includes(w.toLowerCase()));
    cleaned = meaningfulWords.slice(0, 3).join(' ');
  }

  // For short cleaned text (< 30 chars after cleaning)
  if (cleaned.length < 30) {
const words = cleaned.split(/\s+/).slice(0, 2).join(' ');
    return fixCapitalization(words);
  }
  
  // For longer text, look for technical patterns
  const technicalPatterns = [
    /\b(middleware|authentication|authorization|routing|database|server|client|backend|frontend|api|async|await)\b/i,
    /\b([A-Z][A-Za-z0-9/\-\+\.]+(?:\s+[A-Z][A-Za-z0-9/\-\+\.]*){0,2})\b/,
  ];
  
  for (const pattern of technicalPatterns) {
    const match = cleaned.match(pattern);
    if (match) {
      return fixCapitalization(match[1]);
    }
  }
  
  // Fallback: first 3 words
  return fixCapitalization(cleaned.split(/\s+/).slice(0, 3).join(' '));
}; //

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const explainConcept = async (userInput, level) => {
    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setError('API key is missing!');
      setIsLoading(false);
      return null;
    }
    
    try {
      const prompt = generatePrompt(userInput, level);
      
      // Use gemini-2.0-flash-exp (remove the extra colon)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
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
      const text = data.candidates[0].content.parts[0].text;
      const parsedExplanation = parseResponse(text);

      const explanation = {
        id: crypto.randomUUID(),
        concept: extractTechnicalTerm(userInput), // Extract clean title
        fullQuestion: userInput, // Store original
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