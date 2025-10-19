import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

function TextInput({ value, onChange, maxWords = 2000 }) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > maxWords;
  const isNearLimit = wordCount > maxWords * 0.9; // 90% of limit

  const getCounterColor = () => {
    if (isOverLimit) return 'text-red-500';
    if (isNearLimit) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-2">
      <label 
        htmlFor="concept-input" 
        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        Paste confusing tech text:
      </label>
      
      <div className="relative">
        <textarea
          id="concept-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., What is an API?"
          className="w-full min-h-[180px] px-4 py-3 rounded-lg
                   border-2 border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-800
                   text-base text-gray-900 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:border-purple-500 dark:focus:border-purple-400
                   focus:ring-4 focus:ring-purple-500/10
                   transition-all duration-200 resize-y"
          aria-describedby="word-count"
        />
        
        {/* Word Counter */}
        <div 
          id="word-count"
          className="absolute bottom-3 right-3 text-sm font-medium"
        >
          <span className={getCounterColor()}>
            {wordCount.toLocaleString()} / {maxWords.toLocaleString()} words
          </span>
          {wordCount <= maxWords && <span className="text-green-500 ml-1">✓</span>}
          {isOverLimit && <span className="text-red-500 ml-1">✗</span>}
        </div>
      </div>

      {/* Warning message when over limit */}
      {isOverLimit && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 
                      border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <strong>This text is long ({wordCount.toLocaleString()} words).</strong> 
            <br />
            For better results, paste just the confusing section. 
            Recommended max: {maxWords.toLocaleString()} words.
          </div>
        </div>
      )}
    </div>
  );
}

export default TextInput;