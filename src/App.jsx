import { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TextInput from './components/TextInput';
import LevelSelector from './components/LevelSelector';
import ExplainButton from './components/ExplainButton';
import LoadingState from './components/LoadingState';
import { useGemini } from './hooks/useGemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Test function to find working model
async function testModels() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  console.log('🔍 Testing models...');
  console.log('API Key present:', !!apiKey);
  
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
      const result = await model.generateContent('Say hello');
      const response = result.response.text();
      console.log(`✅ ${modelName} WORKS!`);
      return modelName;
    } catch (err) {
      console.log(`❌ ${modelName} failed`);
    }
  }
  console.log('No models worked ❌');
  return null;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [inputText, setInputText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('elementary');
  const [currentExplanation, setCurrentExplanation] = useState(null);

  const { explainConcept, isLoading, error } = useGemini();

  // Test models on page load
  useEffect(() => {
    testModels();
  }, []);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('explainThis_darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('explainThis_darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAboutClick = () => {
    alert('About modal - to be implemented!');
  };

  const handleExplain = async () => {
    console.log('Explaining:', inputText, 'at level:', selectedLevel);
    const explanation = await explainConcept(inputText, selectedLevel);
    console.log('Got explanation:', explanation);
    if (explanation) {
      setCurrentExplanation(explanation);
    }
  };

  const isInputEmpty = !inputText.trim();
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > 2000;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        onAboutClick={handleAboutClick}
      />
      
      <main className="pb-20 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'home' && (
            <div className="space-y-6">
              <TextInput 
                value={inputText}
                onChange={setInputText}
              />
              
              <LevelSelector
                selectedLevel={selectedLevel}
                onSelectLevel={setSelectedLevel}
              />
              
             <ExplainButton
  onClick={handleExplain}
  disabled={isInputEmpty || isOverLimit}
  isLoading={isLoading}
/>

{/* Add this test button */}
<button
  onClick={async () => {
    const workingModel = await testModels();
    alert(`Working model: ${workingModel || 'None found'}`);
  }}
  className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
>
  🔍 Test Which Model Works
</button>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200">
                    ❌ Error: {error}
                  </p>
                </div>
              )}

              {isLoading && <LoadingState />}

              {currentExplanation && !isLoading && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    💡 {currentExplanation.concept}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentExplanation.level} level
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        📖 SIMPLE EXPLANATION
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {currentExplanation.explanation.simple}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        🔄 ANALOGY
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {currentExplanation.explanation.analogy}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        📝 REAL-WORLD EXAMPLE
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {currentExplanation.explanation.example}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        🎯 WHY THIS MATTERS
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {currentExplanation.explanation.whyItMatters}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        🔗 RELATED CONCEPTS
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentExplanation.explanation.relatedConcepts.map((concept, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 
                                     text-purple-700 dark:text-purple-300 rounded-full text-sm"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'library' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                📚 Library Page
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Saved concepts will go here
              </p>
            </div>
          )}
          
          {activeTab === 'progress' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                📊 Progress Page
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Learning stats will go here
              </p>
            </div>
          )}
        </div>
      </main>
  
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;