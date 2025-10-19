import { Info, Sun, Moon, Lightbulb } from 'lucide-react';

function Header({ darkMode, toggleDarkMode, onAboutClick }) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              explainThis 💡
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Tech explained in plain language
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAboutClick}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                     text-gray-600 dark:text-gray-300
                     hover:bg-gray-200 dark:hover:bg-gray-600
                     transition-colors duration-200"
            aria-label="About explainThis"
          >
            <Info className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700
                     text-gray-600 dark:text-gray-300
                     hover:bg-gray-200 dark:hover:bg-gray-600
                     transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;