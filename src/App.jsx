import { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TextInput from './components/TextInput';
import LevelSelector from './components/LevelSelector';
import ExplainButton from './components/ExplainButton';
import LoadingState from './components/LoadingState';
import ExplanationCard from './components/ExplanationCard';
import Toast from './components/Toast';
import { useGemini } from './hooks/useGemini';
import { useLocalStorage } from './hooks/useLocalStorage';
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
  const [library, setLibrary] = useLocalStorage('explainThis_library', []);
  const [toast, setToast] = useState(null);

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

  const handleSave = () => {
    // Check if already saved
    const alreadySaved = library.some(item => item.id === currentExplanation.id);
    
    if (alreadySaved) {
      setToast({ message: 'Already saved to library!', type: 'info' });
      return;
    }

    // Add to library
  const updatedExplanation = { ...currentExplanation, saved: true };
  setLibrary([updatedExplanation, ...library]); // Add to beginning
  setCurrentExplanation(updatedExplanation);
  setToast({ message: '✅ Saved to Library!', type: 'success' });
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

            {/* Test button - can remove later */}
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
              <ExplanationCard
                explanation={currentExplanation}
                onSave={handleSave}
                onRelatedClick={(concept) => {
                  setInputText(concept);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
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
    
    {/* Toast notifications */}
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}
  </div>
);
}

export default App;