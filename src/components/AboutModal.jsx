import React from 'react';
import { X, Heart, Lightbulb, Shield, Zap } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeInUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  About explainThis
                </h2>
                <p className="text-purple-100 text-sm">
                  Breaking the jargon cycle
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Story Section */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-2xl">👨‍🏫</span>
              My Story
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                Hi! I'm Jonel. I spent 10 years teaching preschoolers in Japan, 
                breaking down complex ideas into language a four-year-old could understand.
              </p>
              <p>
                Then I transitioned to tech. And I got frustrated.
              </p>
              <p>
                Not by coding—by the <strong>explanations</strong>. Every time I asked for help, 
                I got answers that used MORE jargon. "Just use middleware to handle the async 
                requests through your API endpoint."
              </p>
              <p className="italic text-purple-700 dark:text-purple-400">
                Cool. What's middleware? What's async? What's an API?
              </p>
              <p>
                I was stuck in a jargon loop. So I built explainThis.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              How It Works
            </h3>
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span><strong>Paste confusing text</strong> or ask a question about any technical concept</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span><strong>Pick your level</strong> from Beginner to Expert (no judgment!)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span><strong>Get a clear explanation</strong> with analogies, examples, and related concepts</span>
              </li>
            </ol>
          </section>

          {/* Understanding the Levels */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Understanding the Levels
            </h3>
            <div className="space-y-3">
              <LevelBadge 
                emoji="🌱" 
                name="Beginner" 
                description="You've literally never heard this term before. Explained like you're 5."
                color="purple"
              />
              <LevelBadge 
                emoji="📚" 
                name="Elementary" 
                description="You have context but need a clear, jargon-free explanation."
                color="blue"
              />
              <LevelBadge 
                emoji="🎓" 
                name="Intermediate" 
                description="You understand the basics and want more technical detail."
                color="green"
              />
              <LevelBadge 
                emoji="🎯" 
                name="Advanced" 
                description="You're comfortable with tech but need to understand THIS specific thing."
                color="yellow"
              />
              <LevelBadge 
                emoji="🔬" 
                name="Expert" 
                description="You want precise technical language and architectural trade-offs."
                color="orange"
              />
            </div>
          </section>

          {/* Privacy */}
          <section className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              Your Privacy Matters
            </h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <p>
                <strong>Everything stays in your browser.</strong> Your questions, explanations, 
                and saved library are stored locally on YOUR device—not on any server.
              </p>
              <p>
                When you ask a question, it goes directly to Google's Gemini AI. I never see it. 
                No tracking. No data collection. Just learning.
              </p>
            </div>
          </section>

          {/* Built With Love */}
          <section className="text-center py-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Built with
              </span>
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                for people learning tech
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Pursuit Fellowship Demo Day • October 29, 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const LevelBadge = ({ emoji, name, description, color }) => {
  const colorClasses = {
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
  };

  return (
    <div className={`flex gap-3 p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <span className="text-2xl flex-shrink-0">{emoji}</span>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AboutModal;