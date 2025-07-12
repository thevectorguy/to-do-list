import { CheckCircle2, Clock, AlertCircle, BarChart3, TrendingUp, Zap, Target, Calendar } from 'lucide-react';

export default function DashboardLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-success-500 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-warning-500 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-lg w-full mx-auto px-6 relative z-10">
        {/* Main Loading Animation */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            {/* Outer rotating rings */}
            <div className="w-24 h-24 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>
            <div className="absolute inset-2 w-16 h-16 border-3 border-primary-100 rounded-full animate-spin-slow border-b-primary-500"></div>
            
            {/* Inner pulsing elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-600 rounded-full animate-pulse"></div>
            </div>
            
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute -top-1 left-1/2 w-2 h-2 bg-primary-400 rounded-full transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 -right-1 w-2 h-2 bg-success-400 rounded-full transform -translate-y-1/2"></div>
              <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-warning-400 rounded-full transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 -left-1 w-2 h-2 bg-danger-400 rounded-full transform -translate-y-1/2"></div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-3 animate-fade-in">Loading Dashboard</h2>
          <p className="text-gray-600 text-lg animate-fade-in">Preparing your productivity workspace...</p>
        </div>

        {/* Animated Feature Preview Cards */}
        <div className="space-y-4 mb-8">
          {/* Tasks Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-5 animate-slide-up hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center animate-float">
                  <CheckCircle2 className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                  </div>
                  <div className="w-8 h-3 bg-primary-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full w-24 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-5 animate-slide-up hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center animate-float" style={{animationDelay: '0.5s'}}>
                  <BarChart3 className="h-6 w-6 text-success-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-28 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" style={{animationDelay: '0.3s'}}></div>
                  </div>
                  <div className="w-6 h-3 bg-success-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full w-20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" style={{animationDelay: '0.8s'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-5 animate-slide-up hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
                  <TrendingUp className="h-6 w-6 text-warning-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-36 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" style={{animationDelay: '0.6s'}}></div>
                  </div>
                  <div className="w-10 h-3 bg-warning-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full w-16 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" style={{animationDelay: '1.1s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Loading Progress */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Loading Progress</span>
            <span className="text-sm text-gray-500">Setting up...</span>
          </div>
          
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden relative">
            <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 h-full rounded-full animate-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Zap className="h-4 w-4 text-primary-500 animate-pulse" />
              <span>Initializing</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="h-4 w-4 text-success-500 animate-pulse" style={{animationDelay: '0.5s'}} />
              <span>Loading Data</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-warning-500 animate-pulse" style={{animationDelay: '1s'}} />
              <span>Syncing</span>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-success-400 rounded-full animate-ping opacity-40" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-warning-400 rounded-full animate-ping opacity-50" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-danger-400 rounded-full animate-ping opacity-30" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>
    </div>
  );
}