import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

const CompetitorAnalysisPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [competitorData, setCompetitorData] = useState<any[]>([]);

  const handleAddCompetitor = () => {
    if (newCompetitor && !competitors.includes(newCompetitor)) {
      setCompetitors([...competitors, newCompetitor]);
      setNewCompetitor('');
    }
  };

  const handleRemoveCompetitor = (competitor: string) => {
    setCompetitors(competitors.filter(c => c !== competitor));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (competitors.length === 0) return;
    
    setIsLoading(true);
    setAnalysisStarted(true);
    
    // Simulate API call
    setTimeout(() => {
      setCompetitorData([
        {
          name: competitors[0] || 'Competitor A',
          market_share: 28,
          growth_rate: 15,
          strengths: ['Strong brand recognition', 'Innovative product features', 'Large customer base'],
          weaknesses: ['Higher pricing', 'Limited international presence', 'Customer support issues'],
          key_products: ['Product X', 'Product Y', 'Product Z'],
          target_segments: ['Enterprise', 'Mid-market'],
          recent_news: [
            'Launched new AI-powered feature in Q1 2025',
            'Expanded operations to European market',
            'Acquired smaller competitor for $50M'
          ]
        },
        {
          name: competitors[1] || 'Competitor B',
          market_share: 22,
          growth_rate: 18,
          strengths: ['Competitive pricing', 'Strong customer support', 'Rapid feature development'],
          weaknesses: ['Less brand recognition', 'Limited product range', 'Smaller R&D budget'],
          key_products: ['Solution A', 'Solution B'],
          target_segments: ['SMB', 'Mid-market'],
          recent_news: [
            'Raised $75M in Series C funding',
            'Partnered with major technology provider',
            'Reported 40% YoY revenue growth'
          ]
        },
        {
          name: competitors[2] || 'Competitor C',
          market_share: 18,
          growth_rate: 22,
          strengths: ['Low-cost leader', 'Simple user interface', 'Strong partner ecosystem'],
          weaknesses: ['Feature limitations', 'Less robust security', 'Limited enterprise capabilities'],
          key_products: ['Basic Suite', 'Premium Suite'],
          target_segments: ['SMB', 'Startups'],
          recent_news: [
            'Introduced freemium model',
            'Expanded team by 35%',
            'Launched new mobile application'
          ]
        }
      ].slice(0, Math.max(1, competitors.length)));
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
              Competitor Analysis
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-4">Analyze Competitors</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Enter your competitors and select your industry to analyze competitive landscape.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Industry
                  </label>
                  <select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Competitors
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCompetitor}
                      onChange={(e) => setNewCompetitor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter competitor name"
                    />
                    <button
                      type="button"
                      onClick={handleAddCompetitor}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {competitors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {competitors.map((competitor, index) => (
                      <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{competitor}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCompetitor(competitor)}
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || competitors.length === 0}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Competitors'}
                  </button>
                </div>
              </form>
            </div>
            
            {analysisStarted && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-700 dark:text-white">
                    Competitor Analysis Results
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Industry: {industry}
                  </p>
                </div>
                
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      <span className="ml-3 text-gray-600 dark:text-gray-300">Analyzing competitors...</span>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Market Share Comparison */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Market Share Comparison</h3>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <div className="flex items-end h-64 space-x-8">
                            {competitorData.map((competitor, index) => (
                              <div key={index} className="flex flex-col items-center flex-1">
                                <div 
                                  className="w-full bg-indigo-600 rounded-t-md" 
                                  style={{ height: `${competitor.market_share * 2}px` }}
                                ></div>
                                <div className="mt-2 text-center">
                                  <div className="font-medium text-gray-700 dark:text-gray-300">{competitor.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{competitor.market_share}%</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Detailed Competitor Analysis */}
                      {competitorData.map((competitor, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">{competitor.name}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Metrics</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Market Share:</span>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{competitor.market_share}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Growth Rate:</span>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{competitor.growth_rate}% YoY</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Target Segments:</span>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{competitor.target_segments.join(', ')}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Products</h4>
                              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                                {competitor.key_products.map((product: string, i: number) => (
                                  <li key={i}>{product}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Strengths</h4>
                              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                                {competitor.strengths.map((strength: string, i: number) => (
                                  <li key={i}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weaknesses</h4>
                              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                                {competitor.weaknesses.map((weakness: string, i: number) => (
                                  <li key={i}>{weakness}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent News</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                              {competitor.recent_news.map((news: string, i: number) => (
                                <li key={i}>{news}</li>
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

export default CompetitorAnalysisPage;
