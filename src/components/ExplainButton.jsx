import { Lightbulb } from 'lucide-react';

function ExplainButton({ onClick, disabled, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full py-4 px-6 rounded-lg
               bg-gradient-to-r from-purple-600 to-blue-600
               text-white font-semibold text-base
               hover:from-purple-700 hover:to-blue-700
               hover:-translate-y-0.5 hover:shadow-xl
               active:translate-y-0
               disabled:from-gray-300 disabled:to-gray-400
               disabled:cursor-not-allowed
               disabled:transform-none disabled:shadow-none
               transition-all duration-200
               flex items-center justify-center gap-2"
      aria-label="Explain this concept"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          Explaining...
        </>
      ) : (
        <>
          <Lightbulb className="w-5 h-5" />
          Explain This 💡
        </>
      )}
    </button>
  );
}

export default ExplainButton;