import React from 'react';

// Loading fallback for lazy-loaded apps
export const AppLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px] bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">Loading app...</p>
    </div>
  </div>
);

// Error boundary for failed app loads
export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[200px] bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <p className="text-red-500 text-sm mb-2">Failed to load app</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
