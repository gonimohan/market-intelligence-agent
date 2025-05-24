import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-5">
          <div className="container mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Dashboard
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Recent Analysis Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-4">Recent Analysis</h2>
                {isLoading ? (
                  <div className="animate-pulse flex flex-col space-y-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-300">No recent analyses</p>
                    <Link 
                      to="/data-integration" 
                      className="inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      Start a new analysis →
                    </Link>
                  </div>
                )}
              </div>
              
              {/* API Status Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-4">API Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Google API</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Not Configured
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">News API</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Not Configured
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Alpha Vantage</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Not Configured
                    </span>
                  </div>
                  <Link 
                    to="/data-integration" 
                    className="inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    Configure API Keys →
                  </Link>
                </div>
              </div>
              
              {/* Quick Actions Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link 
                    to="/data-integration" 
                    className="block p-3 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    <span className="text-gray-700 dark:text-gray-200">Configure Data Sources</span>
                  </Link>
                  <Link 
                    to="/market-trends" 
                    className="block p-3 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    <span className="text-gray-700 dark:text-gray-200">Analyze Market Trends</span>
                  </Link>
                  <Link 
                    to="/competitor-analysis" 
                    className="block p-3 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    <span className="text-gray-700 dark:text-gray-200">Competitor Analysis</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-6">
              <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-2">
                Welcome, {user?.full_name || user?.email || 'User'}!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get started with Market Intelligence Agent by configuring your data sources and API keys.
                Once set up, you can analyze market trends, track competitors, and gain valuable insights.
              </p>
              <div className="flex space-x-4">
                <Link 
                  to="/data-integration" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Configure Data Sources
                </Link>
                <a 
                  href="https://github.com/yourusername/market-intelligence-agent" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
