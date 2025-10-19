import { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('explainThis_darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode to document
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
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                🏠 Home Page
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Main explainer will go here
              </p>
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