function LoadingState() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            💭 Explaining...
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This usually takes 3-5 seconds
          </p>
        </div>

        <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingState;