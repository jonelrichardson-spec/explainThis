import { useState } from 'react';
import { ChevronRight, Lightbulb, ArrowLeft } from 'lucide-react';
import { exploreCategories } from '../data/exploreConcepts';
import LevelSelector from './LevelSelector';
import LoadingState from './LoadingState';
import ExplanationCard from './ExplanationCard';

const ExplorePage = ({ 
  onExplainConcept, 
  currentExplanation, 
  isLoading, 
  onSave,
  onCopy,
  onRelatedClick,
  onBack 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('elementary');

  const handleConceptClick = (concept) => {
    setSelectedConcept(concept);
  };

  const handleExplain = () => {
    if (selectedConcept) {
      onExplainConcept(selectedConcept, selectedLevel);
    }
  };

  const handleBackToCategories = () => {
    setSelectedConcept(null);
    setSelectedCategory(null);
    onBack();
  };

  const getCategoryColorClasses = (color) => {
    const colors = {
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      cyan: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
    };
    return colors[color] || colors.purple;
  };

  // Show explanation if it exists
  if (currentExplanation && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <button
          onClick={handleBackToCategories}
          className="mb-6 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </button>

        <ExplanationCard
          explanation={currentExplanation}
          onSave={onSave}
          onCopy={onCopy}
          onRelatedClick={onRelatedClick}
        />
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🔍 Explore Tech Concepts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse curated technical concepts and learn at your own pace
        </p>
      </div>

      {/* Category Selection */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exploreCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`bg-gradient-to-br ${getCategoryColorClasses(category.color)} 
                       text-white rounded-xl p-6 text-left
                       hover:shadow-lg hover:-translate-y-1
                       transition-all duration-200 group`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/80 text-sm">
                    {category.concepts.length} concepts
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Concept Selection */}
      {selectedCategory && !selectedConcept && (
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-6 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2"
          >
            ← Back to Categories
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selectedCategory.icon}</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {selectedCategory.name}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Select a concept to learn more
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedCategory.concepts.map((concept, idx) => (
                <button
                  key={idx}
                  onClick={() => handleConceptClick(concept)}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-700 
                           hover:bg-gray-100 dark:hover:bg-gray-600
                           border-2 border-gray-200 dark:border-gray-600
                           hover:border-purple-500 dark:hover:border-purple-500
                           rounded-lg font-medium text-gray-900 dark:text-gray-100
                           transition-all duration-200 hover:scale-105"
                >
                  {concept}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Level Selection & Explain */}
      {selectedConcept && (
        <div>
          <button
            onClick={() => setSelectedConcept(null)}
            className="mb-6 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2"
          >
            ← Back to {selectedCategory.name}
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {selectedConcept}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your learning level
              </p>
            </div>

            <div className="mb-6">
              <LevelSelector
                selectedLevel={selectedLevel}
                onSelectLevel={setSelectedLevel}
              />
            </div>

            <button
              onClick={handleExplain}
              className="w-full py-4 px-6 rounded-lg
                       bg-gradient-to-r from-purple-600 to-blue-600
                       hover:from-purple-700 hover:to-blue-700
                       text-white font-semibold text-lg
                       transition-all duration-200 hover:shadow-xl hover:-translate-y-1
                       flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              Explain This 💡
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;