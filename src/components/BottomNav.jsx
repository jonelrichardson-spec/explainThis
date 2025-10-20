import { Home, BookOpen, BarChart3, Compass } from 'lucide-react';

function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200
                ${isActive 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;