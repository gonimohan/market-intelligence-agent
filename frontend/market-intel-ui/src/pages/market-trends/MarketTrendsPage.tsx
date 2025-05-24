import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

const MarketTrendsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [marketDomain, setMarketDomain] = useState('Technology');
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [trends, setTrends] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAnalysisStarted(true);
    
    // Simulate API call
    setTimeout(() => {
      setTrends([
        {
          trend_name: "AI Integration in SaaS",
          description: "Increasing adoption of AI capabilities in SaaS products, enabling automated workflows, predictive analytics, and personalized user experiences.",
          supporting_evidence: ["Microsoft's integration of GPT-4 across product suite", "Salesforce Einstein AI adoption up 45% YoY", "73% of SaaS startups now include AI features"],
          estimated_impact: "High",
          timeframe: "Short-term",
          confidence_score: 0.89
        },
        {
          trend_name: "Vertical SaaS Specialization",
          description: "Growth of industry-specific SaaS solutions tailored to unique workflows and compliance requirements of particular sectors.",
          supporting_evidence: ["Healthcare SaaS funding increased 35% in 2024", "Industry-specific solutions showing 2.3x retention rates", "Vertical SaaS commanding 20% premium on valuations"],
          estimated_impact: "Medium",
          timeframe: "Medium-term",
          confidence_score: 0.76
        },
        {
          trend_name: "API-First Development",
          description: "Shift towards API-first architecture enabling better integrations, composable applications, and ecosystem development.",
          supporting_evidence: ["Twilio reports 40% growth in API consumption", "Stripe's API-first approach driving fintech innovation", "78% of enterprises prioritizing API strategy"],
          estimated_impact: "High",
          timeframe: "Medium-term",
          confidence_score: 0.82
        },
        {
          trend_name: "Low-Code/No-Code Platforms",
          description: "Expansion of platforms enabling non-technical users to build applications, automate workflows, and customize solutions.",
          supporting_evidence: ["Gartner predicts 65% of app development via low-code by 2026", "Bubble.io reports 300% user growth", "Enterprise adoption up 41% since 2023"],
          estimated_impact: "Medium",
          timeframe: "Short-term",
          confidence_score: 0.78
        }
      ]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-5">
          <div className="container mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Market Trends
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-4">Analyze Market Trends</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Enter a query and select a market domain to analyze current trends and patterns.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Query
                  </label>
                  <input
                    id="query"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Emerging trends in SaaS business models"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="market-domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Market Domain
                  </label>
                  <select
                    id="market-domain"
                    value={marketDomain}
                    onChange={(e) => setMarketDomain(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Energy">Energy</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !query}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Trends'}
                  </button>
                </div>
              </form>
            </div>
            
            {analysisStarted && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-700 dark:text-white">
                    Analysis Results: {query}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Market Domain: {marketDomain}
                  </p>
                </div>
                
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      <span className="ml-3 text-gray-600 dark:text-gray-300">Analyzing market trends...</span>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {trends.map((trend, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">{trend.trend_name}</h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                trend.estimated_impact === 'High' 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                  : trend.estimated_impact === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {trend.estimated_impact} Impact
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                trend.timeframe === 'Short-term' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                  : trend.timeframe === 'Medium-term'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {trend.timeframe}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{trend.description}</p>
                          
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supporting Evidence:</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                              {trend.supporting_evidence.map((evidence: string, i: number) => (
                                <li key={i}>{evidence}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Confidence Score:</span>
                            <div className="ml-2 w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className="bg-indigo-600 h-2.5 rounded-full" 
                                style={{ width: `${trend.confidence_score * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                              {Math.round(trend.confidence_score * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketTrendsPage;
