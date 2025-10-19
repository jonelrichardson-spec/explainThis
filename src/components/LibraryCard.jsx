import { Trash2, BookOpen } from 'lucide-react';

const LEVEL_EMOJIS = {
  beginner: '🌱',
  elementary: '📚',
  intermediate: '🎓',
  advanced: '🎯',
  expert: '🔬'
};

function LibraryCard({ explanation, onView, onDelete }) {
  const emoji = LEVEL_EMOJIS[explanation.level];
  const date = new Date(explanation.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 
                    hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1">
            <span className="text-2xl mt-0.5">{emoji}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-1 truncate">
                {explanation.concept}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="capitalize font-medium">{explanation.level}</span>
                <span>•</span>
                <span>{date}</span>
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

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                     bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                     font-medium transition-colors duration-200"
          >
            <BookOpen className="w-4 h-4" />
            View
          </button>
          
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LibraryCard;