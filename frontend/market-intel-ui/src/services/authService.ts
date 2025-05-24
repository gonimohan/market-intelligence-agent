import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    email: string;
    full_name?: string;
  };
}

export interface User {
  email: string;
  full_name?: string;
}

export interface ApiKeys {
  google_api_key?: string;
  newsapi_key?: string;
  alpha_vantage_key?: string;
  tavily_api_key?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Simulate user data in response since our backend doesn't return it with token
    return {
      ...response.data,
      user: {
        email,
      },
    };
  },
  
  async register(email: string, password: string, fullName?: string): Promise<User> {
    const response = await api.post('/users', {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },
  
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  async forgotPassword(email: string): Promise<void> {
    await api.post('/reset-password', { email });
  },
};

export const apiKeyService = {
  async getApiKeys(): Promise<ApiKeys> {
    const response = await api.get('/api-keys');
    return response.data;
  },
  
  async setApiKeys(apiKeys: ApiKeys): Promise<void> {
    await api.post('/api-keys', apiKeys);
  },
};

export interface MarketIntelligenceQuery {
  query: string;
  market_domain: string;
}

export interface SpecificQuestion {
  question: string;
  state_id: string;
}

export const marketIntelligenceService = {
  async processQuery(query: MarketIntelligenceQuery): Promise<any> {
    const response = await api.post('/market-intelligence', query);
    return response.data;
  },
  
  async answerQuestion(question: SpecificQuestion): Promise<any> {
    const response = await api.post('/specific-question', question);
    return response.data;
  },
};

export default api;
