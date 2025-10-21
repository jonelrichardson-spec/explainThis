import { BookOpen, RefreshCw, FileText, Target, Link2, Save, Copy } from 'lucide-react';

const LEVEL_STYLES = {
  beginner: {
    borderColor: '#9333ea',
    bgColor: '#f3e8ff',
    darkBgColor: 'rgba(147, 51, 234, 0.2)',
    textColor: '#9333ea',
    lightTextColor: '#a855f7',
    buttonBg: '#f3e8ff',
    buttonHoverBg: '#9333ea',
    emoji: '🌱'
  },
  elementary: {
    borderColor: '#2563eb',
    bgColor: '#dbeafe',
    darkBgColor: 'rgba(37, 99, 235, 0.2)',
    textColor: '#2563eb',
    lightTextColor: '#3b82f6',
    buttonBg: '#dbeafe',
    buttonHoverBg: '#2563eb',
    emoji: '📚'
  },
  intermediate: {
    borderColor: '#059669',
    bgColor: '#d1fae5',
    darkBgColor: 'rgba(5, 150, 105, 0.2)',
    textColor: '#059669',
    lightTextColor: '#10b981',
    buttonBg: '#d1fae5',
    buttonHoverBg: '#059669',
    emoji: '🎓'
  },
  advanced: {
    borderColor: '#db2777',
    bgColor: '#fce7f3',
    darkBgColor: 'rgba(219, 39, 119, 0.2)',
    textColor: '#db2777',
    lightTextColor: '#ec4899',
    buttonBg: '#fce7f3',
    buttonHoverBg: '#db2777',
    emoji: '🎯'
  },
  expert: {
    borderColor: '#f59e0b',
    bgColor: '#fef3c7',
    darkBgColor: 'rgba(245, 158, 11, 0.2)',
    textColor: '#f59e0b',
    lightTextColor: '#fbbf24',
    buttonBg: '#fef3c7',
    buttonHoverBg: '#f59e0b',
    emoji: '🔬'
  }
};

function ExplanationCard({ explanation, onSave, onCopy, onRelatedClick }) {
  const styles = LEVEL_STYLES[explanation.level];

  const handleCopy = () => {
    const text = `
💡 ${explanation.concept}
Level: ${explanation.level}

📖 SIMPLE EXPLANATION
${explanation.explanation.simple}

🔄 ANALOGY
${explanation.explanation.analogy}

📝 REAL-WORLD EXAMPLE
${explanation.explanation.example}

🎯 WHY THIS MATTERS
${explanation.explanation.whyItMatters}

🔗 RELATED CONCEPTS
${explanation.explanation.relatedConcepts.join(', ')}
    `.trim();
    
    navigator.clipboard.writeText(text);
    
    // Call the onCopy prop to show toast
    if (onCopy) {
      onCopy();
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                    rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 
                    overflow-hidden animate-fadeInUp max-w-7xl mx-auto">
      
      {/* Level Header */}
      <div 
        className="px-6 py-4 border-b-2"
        style={{
          borderColor: styles.borderColor,
          backgroundColor: styles.bgColor
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{styles.emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {explanation.concept}
              </h2>
              <p 
                className="text-sm font-semibold capitalize"
                style={{ color: styles.textColor }}
              >
                {explanation.level}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 
                       hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-colors duration-200"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              onClick={onSave}
              className="px-4 py-2 rounded-lg text-white font-semibold
                       transition-all duration-200 flex items-center gap-2 hover:opacity-90"
              style={{ backgroundColor: styles.buttonHoverBg }}
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Content - Two Column Layout on Desktop */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            {/* Simple Explanation */}
            <Section
              icon={<BookOpen className="w-5 h-5" style={{ color: styles.textColor }} />}
              title="SIMPLE EXPLANATION"
              content={explanation.explanation.simple}
            />

            {/* Analogy */}
            <Section
              icon={<RefreshCw className="w-5 h-5" style={{ color: styles.textColor }} />}
              title="ANALOGY"
              content={explanation.explanation.analogy}
              bgGray
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Real-World Example */}
            <Section
              icon={<FileText className="w-5 h-5" style={{ color: styles.textColor }} />}
              title="REAL-WORLD EXAMPLE"
              content={explanation.explanation.example}
            />

            {/* Why This Matters */}
            <Section
              icon={<Target className="w-5 h-5" style={{ color: styles.textColor }} />}
              title="WHY THIS MATTERS"
              content={explanation.explanation.whyItMatters}
              bgGray
            />
          </div>
        </div>

        {/* Related Concepts - Full Width at Bottom */}
        <div className="space-y-3 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5" style={{ color: styles.textColor }} />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Related Concepts
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {explanation.explanation.relatedConcepts.map((concept, idx) => (
              <button
                key={idx}
                onClick={() => onRelatedClick(concept)}
                className="px-4 py-2 rounded-full text-sm font-medium
                         transition-all duration-200 hover:scale-105 hover:text-white"
                style={{
                  backgroundColor: styles.buttonBg,
                  color: styles.textColor
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.buttonHoverBg;
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.buttonBg;
                  e.target.style.color = styles.textColor;
                }}
              >
                {concept}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, content, bgGray }) {
  return (
    <div className={`space-y-3 p-5 rounded-xl border-[3px] ${
      bgGray 
        ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600' 
        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
    }`}>
      <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-300 dark:border-gray-600">
        {icon}
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
          {title}
        </h3>
      </div>
      <div className="max-w-prose">
        <p className="text-base font-medium leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}

export default ExplanationCard;