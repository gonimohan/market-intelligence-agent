import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

const CustomerInsightsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState('All Segments');
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAnalysisStarted(true);
    
    // Simulate API call
    setTimeout(() => {
      setInsights([
        {
          title: "Customer Satisfaction Trends",
          description: "Analysis of customer satisfaction scores across different product lines and customer segments.",
          sentiment_score: 0.72,
          key_findings: [
            "Overall satisfaction increased 12% YoY",
            "Enterprise customers show highest satisfaction (85%)",
            "Support response time is the top factor affecting satisfaction",
            "Mobile app experience received lowest scores (68%)"
          ],
          recommendations: [
            "Improve mobile app user experience",
            "Reduce support response time for SMB segment",
            "Expand self-service knowledge base"
          ]
        },
        {
          title: "Feature Usage Patterns",
          description: "Analysis of which features are most used and valued by different customer segments.",
          sentiment_score: 0.65,
          key_findings: [
            "Data visualization features have highest engagement (78%)",
            "Advanced analytics features underutilized by SMB segment (23%)",
            "Integration capabilities highly valued by enterprise customers",
            "Mobile features usage growing 35% YoY"
          ],
          recommendations: [
            "Simplify advanced analytics for SMB users",
            "Expand integration capabilities for enterprise segment",
            "Prioritize mobile feature development"
          ]
        },
        {
          title: "Churn Risk Analysis",
          description: "Identification of customer segments at highest risk of churn and contributing factors.",
          sentiment_score: 0.48,
          key_findings: [
            "SMB segment shows highest churn risk (18%)",
            "Price sensitivity is primary factor for SMB churn",
            "Feature gaps driving enterprise churn (8%)",
            "First 90 days critical for new customer retention"
          ],
          recommendations: [
            "Develop tiered pricing for SMB segment",
            "Implement enhanced onboarding for new customers",
            "Create early warning system for churn risk indicators",
            "Establish customer success program for high-value accounts"
          ]
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
              Customer Insights
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-4">Analyze Customer Feedback</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Enter a query and select a customer segment to analyze sentiment and extract actionable insights.
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
                    placeholder="e.g., What do customers think about our new features?"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="segment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer Segment
                  </label>
                  <select
                    id="segment"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="All Segments">All Segments</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Mid-Market">Mid-Market</option>
                    <option value="SMB">SMB</option>
                    <option value="Startups">Startups</option>
                  </select>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !query}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Feedback'}
                  </button>
                </div>
              </form>
            </div>
            
            {analysisStarted && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-700 dark:text-white">
                    Customer Insights: {query}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Segment: {segment}
                  </p>
                </div>
                
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      <span className="ml-3 text-gray-600 dark:text-gray-300">Analyzing customer feedback...</span>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Overall Sentiment */}
                      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Overall Sentiment</h3>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                            <div 
                              className={`h-4 rounded-full ${
                                insights.length > 0 && insights.reduce((acc, curr) => acc + curr.sentiment_score, 0) / insights.length > 0.7
                                  ? 'bg-green-500'
                                  : insights.length > 0 && insights.reduce((acc, curr) => acc + curr.sentiment_score, 0) / insights.length > 0.4
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${insights.length > 0 ? (insights.reduce((acc, curr) => acc + curr.sentiment_score, 0) / insights.length) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                            {insights.length > 0 ? Math.round((insights.reduce((acc, curr) => acc + curr.sentiment_score, 0) / insights.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Negative</span>
                          <span>Neutral</span>
                          <span>Positive</span>
                        </div>
                      </div>
                      
                      {/* Detailed Insights */}
                      {insights.map((insight, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">{insight.title}</h3>
                            <div className={`px-3 py-1 rounded-full text-sm ${
                              insight.sentiment_score > 0.7
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : insight.sentiment_score > 0.4
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {insight.sentiment_score > 0.7
                                ? 'Positive'
                                : insight.sentiment_score > 0.4
                                  ? 'Neutral'
                                  : 'Negative'
                              }
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{insight.description}</p>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Findings:</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                              {insight.key_findings.map((finding: string, i: number) => (
                                <li key={i}>{finding}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations:</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                              {insight.recommendations.map((recommendation: string, i: number) => (
                                <li key={i}>{recommendation}</li>
                              ))}
                            </ul>
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

export default CustomerInsightsPage;
