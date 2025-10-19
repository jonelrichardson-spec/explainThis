export const generatePrompt = (userInput, level) => {
  const levelGuidelines = {
    beginner: "extremely simple words, short sentences, use toys/food/animals as analogies, no technical jargon",
    elementary: "simple vocabulary, concrete examples from everyday life, explain cause-and-effect clearly, minimal jargon",
    intermediate: "clear explanations with some technical terms defined, real-world applications, connections to concepts they might know",
    advanced: "technical vocabulary with context, practical applications in development, architectural thinking, assume general tech knowledge",
    expert: "precise technical language, architectural trade-offs, performance implications, assume deep technical knowledge"
  };

  return `You are an expert educator explaining technical concepts to a ${level}-level student.

YOUR TASK: Explain the following technical concept in a complete, structured format.

CONCEPT TO EXPLAIN:
"""
${userInput}
"""

YOUR RESPONSE MUST FOLLOW THIS EXACT STRUCTURE:

## SIMPLE EXPLANATION
[2-3 paragraphs explaining the concept at ${level} level using ${levelGuidelines[level]}]

## ANALOGY
[Create ONE clear analogy comparing this to something from everyday life that a ${level} student would understand]

## REAL-WORLD EXAMPLE
[Provide a concrete, practical example of how this concept is used in real development]

## WHY THIS MATTERS
[Explain in 2-3 sentences why a developer needs to understand this concept and how it impacts their work]

## RELATED CONCEPTS
[List 3-5 related technical terms a learner should explore next, separated by commas]

CRITICAL RULES:
- Use ${level}-appropriate language throughout
- Be encouraging and clear, never condescending
- NO unexplained jargon - if you use a technical term, define it immediately
- Focus on understanding, not memorization
- Make complex ideas accessible without oversimplifying`;
};

export const parseResponse = (responseText) => {
  const sections = {
    simple: '',
    analogy: '',
    example: '',
    whyItMatters: '',
    relatedConcepts: []
  };

  // Split by section headers
  const simpleMatch = responseText.match(/## SIMPLE EXPLANATION\s*([\s\S]*?)(?=## |$)/i);
  const analogyMatch = responseText.match(/## ANALOGY\s*([\s\S]*?)(?=## |$)/i);
  const exampleMatch = responseText.match(/## REAL-WORLD EXAMPLE\s*([\s\S]*?)(?=## |$)/i);
  const whyMatch = responseText.match(/## WHY THIS MATTERS\s*([\s\S]*?)(?=## |$)/i);
  const relatedMatch = responseText.match(/## RELATED CONCEPTS\s*([\s\S]*?)(?=## |$)/i);

  if (simpleMatch) sections.simple = simpleMatch[1].trim();
  if (analogyMatch) sections.analogy = analogyMatch[1].trim();
  if (exampleMatch) sections.example = exampleMatch[1].trim();
  if (whyMatch) sections.whyItMatters = whyMatch[1].trim();
  
  if (relatedMatch) {
    const relatedText = relatedMatch[1].trim();
    // Split by commas and clean up
    sections.relatedConcepts = relatedText
      .split(',')
      .map(term => term.trim())
      .filter(term => term.length > 0)
      .slice(0, 5); // Max 5 concepts
  }

  return sections;
};