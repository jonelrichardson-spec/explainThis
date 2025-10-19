import { BookOpen, RefreshCw, FileText, Target, Link2, Save, Copy } from 'lucide-react';

const LEVEL_COLORS = {
  beginner: {
    primary: 'purple-600',
    light: 'purple-500',
    bg: 'purple-50',
    darkBg: 'purple-900/20',
    border: 'purple-200',
    darkBorder: 'purple-800'
  },
  elementary: {
    primary: 'blue-600',
    light: 'blue-500',
    bg: 'blue-50',
    darkBg: 'blue-900/20',
    border: 'blue-200',
    darkBorder: 'blue-800'
  },
  intermediate: {
    primary: 'green-600',
    light: 'green-500',
    bg: 'green-50',
    darkBg: 'green-900/20',
    border: 'green-200',
    darkBorder: 'green-800'
  },
  advanced: {
    primary: 'amber-600',
    light: 'amber-500',
    bg: 'amber-50',
    darkBg: 'amber-900/20',
    border: 'amber-200',
    darkBorder: 'amber-800'
  },
  expert: {
    primary: 'orange-600',
    light: 'orange-500',
    bg: 'orange-50',
    darkBg: 'orange-900/20',
    border: 'orange-200',
    darkBorder: 'orange-800'
  }
};

const LEVEL_EMOJIS = {
  beginner: '🌱',
  elementary: '📚',
  intermediate: '🎓',
  advanced: '🎯',
  expert: '🔬'
};

function ExplanationCard({ explanation, onSave, onRelatedClick }) {
  const colors = LEVEL_COLORS[explanation.level];
  const emoji = LEVEL_EMOJIS[explanation.level];

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
    alert('📋 Copied to clipboard!');
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                    rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 
                    overflow-hidden animate-fadeInUp">
      
      {/* Level Header */}
      <div className={`px-6 py-4 border-b-2 border-${colors.primary} 
                      bg-${colors.bg} dark:bg-${colors.darkBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {explanation.concept}
              </h2>
              <p className={`text-sm font-semibold text-${colors.primary} dark:text-${colors.light} capitalize`}>
                {explanation.level} Level
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
              className={`px-4 py-2 rounded-lg bg-${colors.primary} 
                       hover:bg-${colors.light} text-white font-semibold
                       transition-colors duration-200 flex items-center gap-2`}
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6 md:p-8 space-y-6">
        
        {/* Simple Explanation */}
        <Section
          icon={<BookOpen className={`w-5 h-5 text-${colors.primary}`} />}
          title="SIMPLE EXPLANATION"
          content={explanation.explanation.simple}
        />

        {/* Analogy */}
        <Section
          icon={<RefreshCw className={`w-5 h-5 text-${colors.primary}`} />}
          title="ANALOGY"
          content={explanation.explanation.analogy}
          bgGray
        />

        {/* Real-World Example */}
        <Section
          icon={<FileText className={`w-5 h-5 text-${colors.primary}`} />}
          title="REAL-WORLD EXAMPLE"
          content={explanation.explanation.example}
        />

        {/* Why This Matters */}
        <Section
          icon={<Target className={`w-5 h-5 text-${colors.primary}`} />}
          title="WHY THIS MATTERS"
          content={explanation.explanation.whyItMatters}
          bgGray
        />

        {/* Related Concepts */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className={`w-5 h-5 text-${colors.primary}`} />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Related Concepts
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {explanation.explanation.relatedConcepts.map((concept, idx) => (
              <button
                key={idx}
                onClick={() => onRelatedClick(concept)}
                className={`px-4 py-2 bg-${colors.bg} dark:bg-${colors.darkBg}
                         text-${colors.primary} dark:text-${colors.light}
                         rounded-full text-sm font-medium
                         hover:bg-${colors.primary} hover:text-white
                         dark:hover:bg-${colors.light} dark:hover:text-gray-900
                         transition-all duration-200 hover:scale-105`}
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
    <div className={`space-y-3 ${bgGray ? 'bg-gray-50/50 dark:bg-gray-800/50 -mx-6 md:-mx-8 px-6 md:px-8 py-6' : ''}`}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
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