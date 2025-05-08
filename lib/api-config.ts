// API configuration
const API_CONFIG = {
    // Base URLs for the services
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050',
    AI_URL: process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:5001',
    
    // Endpoint paths
    endpoints: {
        // Backend endpoints
        predict: '/api/predict',
        careerDetails: '/api/career-details',
        chatbotRecommend: '/api/chatbot-recommend',
        universityRecommend: '/api/university-summary',
        careerRoadmap: '/api/career-roadmap',
        analyzeCareer: '/api/analyze-careers',
        chat: '/api/chat',
        
        // Direct AI endpoints (if needed)
        aiPredict: '/predict',
        aiChatbotRecommend: '/chatbot-recommend',
        aiAnalyzeCareer: '/analyze-careers'
    },
    
    // Helper function to get full URLs
    getBackendUrl: function(endpoint: string) {
        return `${this.BACKEND_URL}${endpoint}`;
    },
    
    getAiUrl: function(endpoint: string) {
        return `${this.AI_URL}${endpoint}`;
    }
};

export default API_CONFIG; 