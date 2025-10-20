import { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TextInput from './components/TextInput';
import LevelSelector from './components/LevelSelector';
import ExplainButton from './components/ExplainButton';
import LoadingState from './components/LoadingState';
import ExplanationCard from './components/ExplanationCard';
import Toast from './components/Toast';
import { useGemini } from './hooks/useGemini.jsx';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GoogleGenerativeAI } from '@google/generative-ai';
import LibraryCard from './components/LibraryCard';
import EmptyState from './components/EmptyState';
import ProgressPage from './components/ProgressPage';
import AboutModal from './components/AboutModal';
import { Trash2 } from 'lucide-react';

// Function to normalize library data
function normalizeLibraryData() {
  const library = localStorage.getItem('explainThis_library');
  if (!library) return;
  
  try {
    const data = JSON.parse(library);
    const normalized = data.map(item => ({
      ...item,
      level: item.level.toLowerCase()
    }));
    localStorage.setItem('explainThis_library', JSON.stringify(normalized));
    console.log('✅ Library data normalized!');
  } catch (err) {
    console.error('Failed to normalize library:', err);
  }
}

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
   const [selectedCards, setSelectedCards] = useState([]);
const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
const [librarySearch, setLibrarySearch] = useState('');
  const { explainConcept, isLoading, error } = useGemini();
const [librarySort, setLibrarySort] = useState('newest'); // newest, oldest, a-z, z-a
  // Test models on page load
  useEffect(() => {
    testModels();
  }, []);

  // Run once on app load to fix data
  useEffect(() => {
    normalizeLibraryData();
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
    console.log('About clicked! Opening modal...');
    setShowAboutModal(true);
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
    setLibrary([updatedExplanation, ...library]);
    setCurrentExplanation(updatedExplanation);
    setToast({ message: '✅ Saved to Library!', type: 'success' });
  };

  const handleDeleteFromLibrary = (id) => {
    if (confirm('Are you sure you want to delete this from your library?')) {
      setLibrary(library.filter(item => item.id !== id));
      setToast({ message: '🗑️ Deleted from library', type: 'info' });
    }
  };

  const handleViewFromLibrary = (explanation) => {
    setCurrentExplanation(explanation);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  <div>
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            📚 My Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {library.length} saved {library.length === 1 ? 'concept' : 'concepts'}
            {isSelectionMode && selectedCards.length > 0 && (
              <span className="ml-2 text-purple-600 dark:text-purple-400 font-semibold">
                • {selectedCards.length} selected
              </span>
            )}
          </p>
        </div>

        {/* Selection Mode Toggle & Bulk Actions */}
        {library.length > 0 && (
          <div className="flex items-center gap-3">
            {isSelectionMode ? (
              <>
                <button
                  onClick={() => {
                    setSelectedCards([]);
                    setIsSelectionMode(false);
                  }}
                  className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                           text-gray-700 dark:text-gray-300 font-medium
                           hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                
                {selectedCards.length > 0 && (
                  <>
                    <button
                      onClick={() => setSelectedCards(library.map(item => item.id))}
                      className="px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30
                               text-purple-700 dark:text-purple-300 font-medium
                               hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      Select All
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${selectedCards.length} selected concept${selectedCards.length !== 1 ? 's' : ''}?`)) {
                          setLibrary(library.filter(item => !selectedCards.includes(item.id)));
                          setSelectedCards([]);
                          setIsSelectionMode(false);
                          setToast({ message: `🗑️ Deleted ${selectedCards.length} concept${selectedCards.length !== 1 ? 's' : ''}`, type: 'info' });
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium
                               hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete ({selectedCards.length})
                    </button>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsSelectionMode(true)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800
                         text-gray-700 dark:text-gray-300 font-medium
                         hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Select Multiple
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search and Sort */}
      {library.length > 0 && !isSelectionMode && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              placeholder="Search concepts..."
              className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-colors"
            />
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Sort:
            </label>
            <select
              value={librarySort}
              onChange={(e) => setLibrarySort(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       text-sm font-medium cursor-pointer
                       hover:border-purple-400 dark:hover:border-purple-500
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">A → Z</option>
              <option value="z-a">Z → A</option>
            </select>
          </div>
        </div>
      )}
    </div>

    {library.length === 0 ? (
      <EmptyState
        icon="📚"
        title="No saved concepts yet"
        description="Save explanations to your library to review them later. Click the Save button on any explanation to add it here."
      />
    ) : (
      <>
        {/* Results count */}
        {librarySearch && !isSelectionMode && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {[...library].filter((explanation) => {
              const searchLower = librarySearch.toLowerCase();
              return (
                explanation.concept.toLowerCase().includes(searchLower) ||
                explanation.explanation.simple.toLowerCase().includes(searchLower) ||
                explanation.level.toLowerCase().includes(searchLower)
              );
            }).length} result{[...library].filter((explanation) => {
              const searchLower = librarySearch.toLowerCase();
              return (
                explanation.concept.toLowerCase().includes(searchLower) ||
                explanation.explanation.simple.toLowerCase().includes(searchLower) ||
                explanation.level.toLowerCase().includes(searchLower)
              );
            }).length !== 1 ? 's' : ''} found
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...library]
            .filter((explanation) => {
              if (!librarySearch) return true;
              const searchLower = librarySearch.toLowerCase();
              return (
                explanation.concept.toLowerCase().includes(searchLower) ||
                explanation.explanation.simple.toLowerCase().includes(searchLower) ||
                explanation.level.toLowerCase().includes(searchLower)
              );
            })
            .sort((a, b) => {
              switch (librarySort) {
                case 'newest':
                  return new Date(b.timestamp) - new Date(a.timestamp);
                case 'oldest':
                  return new Date(a.timestamp) - new Date(b.timestamp);
                case 'a-z':
                  return a.concept.localeCompare(b.concept);
                case 'z-a':
                  return b.concept.localeCompare(a.concept);
                default:
                  return 0;
              }
            })
            .map((explanation) => (
              <LibraryCard
                key={explanation.id}
                explanation={explanation}
                isSelectionMode={isSelectionMode}
                isSelected={selectedCards.includes(explanation.id)}
                onSelect={() => {
                  if (selectedCards.includes(explanation.id)) {
                    setSelectedCards(selectedCards.filter(id => id !== explanation.id));
                  } else {
                    setSelectedCards([...selectedCards, explanation.id]);
                  }
                }}
                onView={() => !isSelectionMode && handleViewFromLibrary(explanation)}
                onDelete={() => !isSelectionMode && handleDeleteFromLibrary(explanation.id)}
              />
            ))}
        </div>

        {/* No results message */}
        {librarySearch && [...library].filter((explanation) => {
          const searchLower = librarySearch.toLowerCase();
          return (
            explanation.concept.toLowerCase().includes(searchLower) ||
            explanation.explanation.simple.toLowerCase().includes(searchLower) ||
            explanation.level.toLowerCase().includes(searchLower)
          );
        }).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No concepts found for "{librarySearch}"
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Try a different search term
            </p>
          </div>
        )}
      </>
    )}
  </div>
)}

{activeTab === 'progress' && (
  <ProgressPage library={library} />
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

      {/* About Modal */}
      <AboutModal 
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </div>
  );
}

export default App;