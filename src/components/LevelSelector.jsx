import { Check } from 'lucide-react';

function LevelSelector({ selectedLevel, onSelectLevel }) {
  const levels = [
    { 
      id: 'beginner', 
      label: 'Beginner', 
      emoji: '🌱', 
      color: 'purple',
      description: 'Like explaining to a 5 year-old'
    },
    { 
      id: 'elementary', 
      label: 'Elementary', 
      emoji: '📚', 
      color: 'blue',
      description: 'Clear, no prior knowledge'
    },
    { 
      id: 'intermediate', 
      label: 'Intermediate', 
      emoji: '🎓', 
      color: 'green',
      description: 'Moderate detail'
    },
    { 
      id: 'advanced', 
      label: 'Advanced', 
      emoji: '🎯', 
      color: 'amber',
      description: 'Technical but accessible'
    },
    { 
      id: 'expert', 
      label: 'Expert', 
      emoji: '🔬', 
      color: 'orange',
      description: 'Deep technical precision'
    },
  ];

  const getColorClasses = (color, isSelected) => {
    const colors = {
      purple: isSelected 
        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500 ring-offset-2' 
        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600',
      blue: isSelected
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-offset-2'
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600',
      green: isSelected
        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500 ring-offset-2'
        : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600',
      amber: isSelected
        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-500 ring-offset-2'
        : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600',
      orange: isSelected
        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 ring-2 ring-orange-500 ring-offset-2'
        : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600',
    };
    return colors[color];
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Choose your level:
      </label>
      
      {/* Desktop: All visible in a row */}
      <div className="hidden md:flex gap-3">
        {levels.map((level) => {
          const isSelected = selectedLevel === level.id;
          return (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className={`flex-1 min-h-[100px] rounded-xl border-2 
                       flex flex-col items-center justify-center gap-2
                       transition-all duration-200
                       hover:-translate-y-1 hover:shadow-lg
                       ${getColorClasses(level.color, isSelected)}`}
              aria-pressed={isSelected}
            >
              <span className="text-3xl">{level.emoji}</span>
              <span className={`text-sm font-semibold ${
                isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {level.label}
              </span>
              {isSelected && (
                <Check className="w-4 h-4 text-current" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {levels.map((level) => {
          const isSelected = selectedLevel === level.id;
          return (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className={`flex-shrink-0 w-[140px] min-h-[120px] rounded-xl border-2 
                       flex flex-col items-center justify-center gap-2
                       snap-center transition-all duration-200
                       ${getColorClasses(level.color, isSelected)}`}
              aria-pressed={isSelected}
            >
              <span className="text-3xl">{level.emoji}</span>
              <span className={`text-sm font-semibold ${
                isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {level.label}
              </span>
              {isSelected && (
                <Check className="w-4 h-4 text-current" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Mobile scroll hint */}
      <p className="md:hidden text-center text-xs text-gray-400 dark:text-gray-500">
        ← swipe for more →
      </p>
    </div>
  );
}

export default LevelSelector;