import os
import json
import chromadb
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

# Import necessary libraries for LLM integration
from langchain.llms import GoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_community.utilities import GoogleSearchAPIWrapper
from langchain_community.utilities.alpha_vantage import AlphaVantageAPIWrapper
from langchain_community.utilities.newsapi import NewsApiAPIWrapper
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import GoogleGenerativeAIEmbeddings
from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain_community.retrievers import BM25Retriever

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("market_intelligence_agent.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("MarketIntelligenceAgent")

class EnhancedMarketIntelligenceAgent:
    """
    Enhanced Market Intelligence Agent with improved architecture for real-time usage.
    
    This agent collects, analyzes, and provides insights on market intelligence
    using a combination of search tools, LLM processing, and structured analysis.
    """
    
    def __init__(
        self,
        google_api_key: Optional[str] = None,
        newsapi_key: Optional[str] = None,
        alpha_vantage_key: Optional[str] = None,
        tavily_api_key: Optional[str] = None,
        cache_dir: str = "./cache",
        state_dir: str = "./state"
    ):
        """
        Initialize the Market Intelligence Agent with API keys and configuration.
        
        Args:
            google_api_key: API key for Google services (Search and Gemini)
            newsapi_key: API key for News API
            alpha_vantage_key: API key for Alpha Vantage financial data
            tavily_api_key: API key for Tavily search
            cache_dir: Directory to store cache data
            state_dir: Directory to store state data
        """
        self.google_api_key = google_api_key
        self.newsapi_key = newsapi_key
        self.alpha_vantage_key = alpha_vantage_key
        self.tavily_api_key = tavily_api_key
        
        # Create directories if they don't exist
        os.makedirs(cache_dir, exist_ok=True)
        os.makedirs(state_dir, exist_ok=True)
        
        self.cache_dir = cache_dir
        self.state_dir = state_dir
        
        # Initialize tools and components
        self._initialize_components()
        
        # State management
        self.current_state_id = None
        self.states = {}
        
        logger.info("Market Intelligence Agent initialized successfully")
    
    def _initialize_components(self):
        """Initialize all components and tools based on available API keys."""
        # Initialize LLM
        if self.google_api_key:
            self.llm = GoogleGenerativeAI(
                model="gemini-pro",
                google_api_key=self.google_api_key,
                temperature=0.2,
                top_p=0.95,
                max_output_tokens=4096
            )
            
            # Initialize embeddings
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=self.google_api_key
            )
        else:
            logger.warning("Google API key not provided. LLM functionality will be limited.")
            # Use a mock LLM for demonstration
            self.llm = self._mock_llm()
            self.embeddings = self._mock_embeddings()
        
        # Initialize search tools
        self.search_tools = []
        
        if self.google_api_key:
            try:
                self.google_search = GoogleSearchAPIWrapper(
                    google_api_key=self.google_api_key,
                    google_cse_id=os.getenv("GOOGLE_CSE_ID", "")
                )
                self.search_tools.append(("google", self.google_search))
                logger.info("Google Search initialized")
            except Exception as e:
                logger.error(f"Failed to initialize Google Search: {str(e)}")
        
        if self.tavily_api_key:
            try:
                self.tavily_search = TavilySearchResults(
                    api_key=self.tavily_api_key,
                    max_results=5
                )
                self.search_tools.append(("tavily", self.tavily_search))
                logger.info("Tavily Search initialized")
            except Exception as e:
                logger.error(f"Failed to initialize Tavily Search: {str(e)}")
        
        if self.newsapi_key:
            try:
                self.news_api = NewsApiAPIWrapper(
                    newsapi_key=self.newsapi_key
                )
                self.search_tools.append(("news", self.news_api))
                logger.info("News API initialized")
            except Exception as e:
                logger.error(f"Failed to initialize News API: {str(e)}")
        
        if self.alpha_vantage_key:
            try:
                self.alpha_vantage = AlphaVantageAPIWrapper(
                    alpha_vantage_api_key=self.alpha_vantage_key
                )
                self.search_tools.append(("alpha_vantage", self.alpha_vantage))
                logger.info("Alpha Vantage initialized")
            except Exception as e:
                logger.error(f"Failed to initialize Alpha Vantage: {str(e)}")
        
        # Initialize text splitter for document processing
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        # Initialize ChromaDB client
        self.chroma_client = chromadb.PersistentClient(path=f"{self.cache_dir}/chroma")
        
        # Initialize prompt templates
        self._initialize_prompts()
    
    def _initialize_prompts(self):
        """Initialize prompt templates for different tasks."""
        # Market trends analysis prompt
        self.market_trends_prompt = PromptTemplate(
            input_variables=["query", "market_domain", "search_results"],
            template="""
            You are a market intelligence expert analyzing trends and patterns.
            
            QUERY: {query}
            MARKET DOMAIN: {market_domain}
            
            Based on the following search results, identify the key market trends, 
            opportunities, and potential risks. Provide a comprehensive analysis 
            with supporting evidence.
            
            SEARCH RESULTS:
            {search_results}
            
            Your analysis should include:
            1. Key market trends with supporting evidence and confidence scores
            2. Market opportunities with potential impact and implementation difficulty
            3. Potential risks and mitigation strategies
            
            Format your response as a structured JSON with the following schema:
            {{
                "trends": [
                    {{
                        "trend_name": "Name of the trend",
                        "description": "Detailed description",
                        "supporting_evidence": ["Evidence 1", "Evidence 2"],
                        "estimated_impact": "High/Medium/Low",
                        "timeframe": "Short-term/Medium-term/Long-term",
                        "confidence_score": 0.XX
                    }}
                ],
                "opportunities": [
                    {{
                        "title": "Opportunity title",
                        "description": "Detailed description",
                        "potential_impact": "High/Medium/Low",
                        "implementation_difficulty": "High/Medium/Low",
                        "recommended_actions": ["Action 1", "Action 2"]
                    }}
                ],
                "risks": [
                    {{
                        "title": "Risk title",
                        "description": "Detailed description",
                        "severity": "High/Medium/Low",
                        "likelihood": "High/Medium/Low",
                        "mitigation_strategies": ["Strategy 1", "Strategy 2"]
                    }}
                ]
            }}
            """
        )
        
        # Specific question answering prompt
        self.specific_question_prompt = PromptTemplate(
            input_variables=["question", "context"],
            template="""
            You are a market intelligence expert answering specific questions based on previous analysis.
            
            QUESTION: {question}
            
            Use the following context from previous analysis to answer the question:
            
            CONTEXT:
            {context}
            
            Provide a comprehensive answer with supporting evidence. If the context doesn't contain 
            enough information to answer the question confidently, acknowledge the limitations.
            
            Format your response as a structured JSON with the following schema:
            {{
                "answer": "Your detailed answer",
                "sources": ["Source 1", "Source 2"],
                "confidence": 0.XX
            }}
            """
        )
    
    def _mock_llm(self):
        """Create a mock LLM for demonstration purposes."""
        class MockLLM:
            def invoke(self, prompt):
                return json.dumps({
                    "trends": [
                        {
                            "trend_name": "AI Integration in SaaS",
                            "description": "Increasing adoption of AI capabilities in SaaS products.",
                            "supporting_evidence": ["Microsoft's integration of GPT-4", "Salesforce Einstein AI adoption up 45% YoY"],
                            "estimated_impact": "High",
                            "timeframe": "Short-term",
                            "confidence_score": 0.89
                        }
                    ],
                    "opportunities": [
                        {
                            "title": "AI-Powered Customer Support",
                            "description": "Implementing AI chatbots for customer support.",
                            "potential_impact": "High",
                            "implementation_difficulty": "Medium",
                            "recommended_actions": ["Evaluate AI chatbot providers", "Start with simple use cases"]
                        }
                    ],
                    "risks": [
                        {
                            "title": "Increasing Competition",
                            "description": "New entrants with AI-first approaches may disrupt established players.",
                            "severity": "Medium",
                            "likelihood": "High",
                            "mitigation_strategies": ["Accelerate AI adoption", "Focus on unique value proposition"]
                        }
                    ]
                })
        
        return MockLLM()
    
    def _mock_embeddings(self):
        """Create mock embeddings for demonstration purposes."""
        class MockEmbeddings:
            def embed_documents(self, texts):
                return [[0.1] * 768 for _ in texts]
            
            def embed_query(self, text):
                return [0.1] * 768
        
        return MockEmbeddings()
    
    def _search(self, query: str, market_domain: str) -> List[str]:
        """
        Perform search across all available search tools.
        
        Args:
            query: The search query
            market_domain: The market domain to focus on
            
        Returns:
            List of search results as strings
        """
        combined_query = f"{query} {market_domain} market trends analysis"
        results = []
        
        for tool_name, tool in self.search_tools:
            try:
                if tool_name == "google":
                    tool_results = tool.results(combined_query, num_results=5)
                    results.extend([f"[Google] {r['title']}: {r['snippet']}" for r in tool_results])
                
                elif tool_name == "tavily":
                    tool_results = tool.invoke({"query": combined_query})
                    results.extend([f"[Tavily] {r['title']}: {r['content']}" for r in tool_results])
                
                elif tool_name == "news":
                    tool_results = tool.run(combined_query)
                    results.append(f"[News] {tool_results}")
                
                elif tool_name == "alpha_vantage":
                    if "finance" in market_domain.lower() or "stock" in market_domain.lower():
                        tool_results = tool.run(combined_query)
                        results.append(f"[AlphaVantage] {tool_results}")
            
            except Exception as e:
                logger.error(f"Error with {tool_name} search: {str(e)}")
        
        logger.info(f"Collected {len(results)} search results")
        return results
    
    def _store_state(self, state_id: str, data: Dict[str, Any]):
        """
        Store state data for future reference.
        
        Args:
            state_id: Unique identifier for the state
            data: State data to store
        """
        self.states[state_id] = data
        
        # Save to disk
        state_path = os.path.join(self.state_dir, f"{state_id}.json")
        with open(state_path, "w") as f:
            json.dump(data, f)
        
        logger.info(f"State saved with ID: {state_id}")
    
    def _load_state(self, state_id: str) -> Dict[str, Any]:
        """
        Load state data from storage.
        
        Args:
            state_id: Unique identifier for the state
            
        Returns:
            State data
        """
        # Check memory cache first
        if state_id in self.states:
            return self.states[state_id]
        
        # Load from disk
        state_path = os.path.join(self.state_dir, f"{state_id}.json")
        try:
            with open(state_path, "r") as f:
                data = json.load(f)
                self.states[state_id] = data
                return data
        except FileNotFoundError:
            logger.error(f"State not found: {state_id}")
            raise ValueError(f"State not found: {state_id}")
    
    def process_query(self, query: str, market_domain: str) -> Dict[str, Any]:
        """
        Process a market intelligence query.
        
        Args:
            query: The user's query
            market_domain: The market domain to focus on
            
        Returns:
            Analysis results
        """
        logger.info(f"Processing query: {query} for domain: {market_domain}")
        
        # Generate a unique state ID
        state_id = f"query_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        self.current_state_id = state_id
        
        # Perform search
        search_results = self._search(query, market_domain)
        
        # Create a vector store for the search results
        documents = self.text_splitter.create_documents(search_results)
        
        # Store documents in ChromaDB
        collection_name = f"collection_{state_id}"
        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory=f"{self.cache_dir}/chroma",
            collection_name=collection_name
        )
        
        # Create hybrid retriever (vector + BM25)
        bm25_retriever = BM25Retriever.from_documents(documents)
        bm25_retriever.k = 5
        
        vector_retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 5}
        )
        
        # Analyze the search results
        search_results_text = "\n\n".join(search_results)
        
        market_trends_chain = LLMChain(
            llm=self.llm,
            prompt=self.market_trends_prompt
        )
        
        try:
            analysis_result = market_trends_chain.invoke({
                "query": query,
                "market_domain": market_domain,
                "search_results": search_results_text
            })
            
            # Parse the result
            if isinstance(analysis_result, str):
                # Extract JSON from string if needed
                if "{" in analysis_result:
                    json_str = analysis_result[analysis_result.find("{"):analysis_result.rfind("}")+1]
                    result = json.loads(json_str)
                else:
                    result = {"error": "Failed to parse result", "raw_result": analysis_result}
            else:
                result = analysis_result
            
            # Store the state
            state_data = {
                "query": query,
                "market_domain": market_domain,
                "search_results": search_results,
                "analysis_result": result,
                "timestamp": datetime.now().isoformat()
            }
            self._store_state(state_id, state_data)
            
            # Add state_id to the result
            result["state_id"] = state_id
            
            logger.info(f"Query processed successfully, state_id: {state_id}")
            return result
            
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            return {
                "error": f"Failed to process query: {str(e)}",
                "state_id": state_id
            }
    
    def answer_specific_question(self, question: str, state_id: str) -> Dict[str, Any]:
        """
        Answer a specific question based on previous analysis.
        
        Args:
            question: The specific question to answer
            state_id: The state ID of the previous analysis
            
        Returns:
            Answer to the question
        """
        logger.info(f"Answering specific question: {question} using state: {state_id}")
        
        try:
            # Load the state
            state_data = self._load_state(state_id)
            
            # Create context from the state data
            context = json.dumps(state_data["analysis_result"], indent=2)
            
            # Create the question answering chain
            qa_chain = LLMChain(
                llm=self.llm,
                prompt=self.specific_question_prompt
            )
            
            # Get the answer
            answer_result = qa_chain.invoke({
                "question": question,
                "context": context
            })
            
            # Parse the result
            if isinstance(answer_result, str):
                # Extract JSON from string if needed
                if "{" in answer_result:
                    json_str = answer_result[answer_result.find("{"):answer_result.rfind("}")+1]
                    result = json.loads(json_str)
                else:
                    result = {"error": "Failed to parse result", "raw_result": answer_result}
            else:
                result = answer_result
            
            logger.info(f"Question answered successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error answering question: {str(e)}")
            return {
                "error": f"Failed to answer question: {str(e)}"
            }
