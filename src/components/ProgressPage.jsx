import React, { useMemo } from 'react';
import { TrendingUp, BookOpen, Target, Calendar, Award, BarChart3 } from 'lucide-react';

const ProgressPage = ({ library = [] }) => {
  const stats = useMemo(() => {
    if (!library.length) {
      return {
        totalConcepts: 0,
        byLevel: {},
        savedCount: 0,
        favoriteLevel: null,
        recentActivity: []
      };
    }

    // Count concepts by level
    const byLevel = library.reduce((acc, item) => {
      acc[item.level] = (acc[item.level] || 0) + 1;
      return acc;
    }, {});

    // Find favorite level (most used)
    const favoriteLevel = Object.entries(byLevel).sort((a, b) => b[1] - a[1])[0]?.[0];

    // Get recent activity (last 10)
    const recentActivity = [...library]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    return {
      totalConcepts: library.length,
      byLevel,
      savedCount: library.filter(item => item.saved).length,
      favoriteLevel,
      recentActivity
    };
  }, [library]);

 const levelConfig = {
  beginner: { emoji: '🌱', color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-500' },
  elementary: { emoji: '📚', color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-500' },
  intermediate: { emoji: '🎓', color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-500' },
  advanced: { emoji: '🎯', color: 'pink', bgColor: 'bg-pink-50', textColor: 'text-pink-700', borderColor: 'border-pink-500' },  // ← CHANGED
  expert: { emoji: '🔬', color: 'amber', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-500' }  // ← CHANGED
};

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const maxLevelCount = Math.max(...Object.values(stats.byLevel), 1);
const getBarColor = (color) => {
  const colors = {
    purple: { from: '#a78bfa', to: '#7c3aed' },
    blue: { from: '#60a5fa', to: '#2563eb' },
    green: { from: '#34d399', to: '#059669' },
    pink: { from: '#f9a8d4', to: '#db2777' },    // ← CHANGED from yellow
    amber: { from: '#fbbf24', to: '#f59e0b' }     // ← CHANGED from orange
  };
  return colors[color];
};

  if (!library.length) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Start Your Learning Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Explain your first concept to see your progress stats appear here!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Track concepts explored, favorite levels, and your learning journey over time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Your Learning Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your journey through technical concepts
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Concepts Explored"
          value={stats.totalConcepts}
          color="purple"
        />
        <MetricCard
          icon={<Target className="w-6 h-6" />}
          label="Saved to Library"
          value={stats.savedCount}
          subtitle={`${Math.round((stats.savedCount / stats.totalConcepts) * 100)}%`}
          color="blue"
        />
        <MetricCard
          icon={<Award className="w-6 h-6" />}
          label="Favorite Level"
          value={stats.favoriteLevel ? levelConfig[stats.favoriteLevel].emoji : '—'}
          subtitle={stats.favoriteLevel || 'None yet'}
          color="green"
        />
      </div>

      {/* Level Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Learning by Level
          </h2>
        </div>

        <div className="space-y-4">
          {Object.entries(levelConfig).map(([level, config]) => {
            const count = stats.byLevel[level] || 0;
            const barWidth = stats.totalConcepts > 0 ? (count / maxLevelCount) * 100 : 0;

            return (
              <div key={level} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{config.emoji}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {level}
                    </span>
                  </div>
                  <span className={`font-semibold ${config.textColor} min-w-[2rem] text-right`}>
                    {count}
                  </span>
                </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
  <div
    className="h-full rounded-full transition-all duration-500"
    style={{ 
      width: `${barWidth}%`,
      background: `linear-gradient(to right, ${getBarColor(config.color).from}, ${getBarColor(config.color).to})`
    }}
  />
</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Recent Activity
          </h2>
        </div>

        <div className="space-y-3">
          {stats.recentActivity.map((item) => {
            const config = levelConfig[item.level];
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className={`w-10 h-10 ${config.bgColor} dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xl">{config.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.concept}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium ${config.textColor}`}>
                      {item.level}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Keep Learning!
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
              You've explored <strong>{stats.totalConcepts}</strong> concept{stats.totalConcepts !== 1 ? 's' : ''} so far. 
              {stats.favoriteLevel && ` You seem to prefer ${stats.favoriteLevel} level explanations.`}
              {stats.savedCount < stats.totalConcepts && ` Consider saving more concepts to your library for future reference!`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, subtitle, color }) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default ProgressPage;