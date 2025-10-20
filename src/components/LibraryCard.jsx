import { Trash2, BookOpen, Check } from 'lucide-react';

const LEVEL_STYLES = {
  beginner: {
    emoji: '🌱',
    color: '#9333ea',
    bgColor: '#f3e8ff',
    darkBgColor: 'rgba(147, 51, 234, 0.2)'
  },
  elementary: {
    emoji: '📚',
    color: '#2563eb',
    bgColor: '#dbeafe',
    darkBgColor: 'rgba(37, 99, 235, 0.2)'
  },
  intermediate: {
    emoji: '🎓',
    color: '#059669',
    bgColor: '#d1fae5',
    darkBgColor: 'rgba(5, 150, 105, 0.2)'
  },
  advanced: {
    emoji: '🎯',
    color: '#db2777',
    bgColor: '#fce7f3',
    darkBgColor: 'rgba(219, 39, 119, 0.2)'
  },
  expert: {
    emoji: '🔬',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    darkBgColor: 'rgba(245, 158, 11, 0.2)'
  }
};

function LibraryCard({ explanation, isSelectionMode, isSelected, onSelect, onView, onDelete }) {
  const styles = LEVEL_STYLES[explanation.level];
  const date = new Date(explanation.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCardClick = () => {
    if (isSelectionMode) {
      onSelect();
    } else {
      onView();
    }
  };

 return (
  <div 
    onClick={handleCardClick}
    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 
                hover:shadow-lg transition-all duration-200 overflow-hidden relative
                ${isSelectionMode ? 'cursor-pointer hover:scale-[1.02]' : ''}
                ${isSelected 
                  ? 'ring-4 ring-purple-500 border-purple-500 bg-purple-50/50 dark:bg-purple-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:-translate-y-1'}`}
  >
    
    {/* Selection Indicator - Full Card Overlay */}
    {isSelectionMode && isSelected && (
      <div className="absolute top-3 right-3 z-10">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-5 h-5 text-white" />
        </div>
      </div>
    )}  
      {/* Header */}
      <div 
        className="p-4 border-b-2"
        style={{
          borderColor: styles.color,
          backgroundColor: styles.bgColor
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1">
            <span className="text-2xl mt-0.5">{styles.emoji}</span>
            <div className="flex-1 min-w-0">
             <h3 
  className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-1"
  title={explanation.concept} // Full title on hover
>
  {explanation.concept.length > 40 
    ? `${explanation.concept.substring(0, 40)}...` 
    : explanation.concept}
</h3>
  <div className="flex items-center gap-2 text-sm">
                <span 
                  className="capitalize font-medium"
                  style={{ color: styles.color }}
                >
                  {explanation.level}
                </span>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span className="text-gray-500 dark:text-gray-400">{date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {explanation.explanation.simple.substring(0, 150)}...
        </p>

        {/* Actions - Only show when NOT in selection mode */}
        {!isSelectionMode && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                       text-white rounded-lg font-medium transition-colors duration-200"
              style={{ backgroundColor: styles.color }}
            >
              <BookOpen className="w-4 h-4" />
              View
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LibraryCard;