'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

type Message = {
  text: string;
  isUser: boolean;
};

export default function ChatbotPage() {
  const searchParams = useSearchParams();
  const [gpa, setGpa] = useState('');
  const [career, setCareer] = useState('Software Engineer');
  const [response, setResponse] = useState<any>(null);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));

  useEffect(() => {
    // Get career and GPA from URL if available
    const careerFromUrl = searchParams.get('career');
    const gpaFromUrl = searchParams.get('gpa');
    
    if (careerFromUrl) {
      setCareer(careerFromUrl);
    }
    
    if (gpaFromUrl) {
      setGpa(gpaFromUrl);
    }
    
    // Add welcome message
    if (careerFromUrl) {
      setMessages([
        {
          text: `Welcome! I can help you learn more about a career as a ${careerFromUrl}. What would you like to know?`,
          isUser: false
        }
      ]);
    }
  }, [searchParams]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    const res = await fetch('http://127.0.0.1:5000/api/chatbot-recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gpa, career }),
    });
    const result = await res.json();
    setResponse(result);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = { text: currentMessage, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    
    try {
      // Always send career and GPA with every message
      const res = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentMessage,
          career: career,  // Always send the career
          gpa: gpa,        // Always send the GPA
          session_id: sessionId
        }),
      });
      
      const result = await res.json();
      
      // Add bot response to chat
      if (result.response) {
        setMessages(prev => [...prev, { text: result.response, isUser: false }]);
      } else {
        setMessages(prev => [...prev, { 
          text: "Sorry, I couldn't process your request at this time.", 
          isUser: false 
        }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        text: "Sorry, there was an error communicating with the server.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">🎯 Career & University Recommender</h1>
      
      <div className="mb-4">
        <p className="text-xl">Selected Career: <span className="font-bold text-blue-400">{career}</span></p>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Get University Recommendations</h2>
        <label className="block mb-4">
          Enter your GPA (out of 100):
          <input
            type="number"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            className="block w-full p-2 rounded bg-gray-700 mt-2"
          />
        </label>

        <button 
          onClick={handleSubmit} 
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Get Recommendations
        </button>
      </div>

      {response && (
        <div className="mb-8 bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">🎓 Recommended Universities</h2>
          {response.recommended_universities.length > 0 ? (
            <ul className="space-y-2 mb-6">
              {response.recommended_universities.map((uni: any, idx: number) => (
                <li key={idx} className="bg-gray-700/50 p-3 rounded">
                  {uni.University_Name} <span className="text-blue-300">({uni.Rank_Tier})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 mb-6">No universities found matching your criteria.</p>
          )}

          <h2 className="text-2xl font-semibold mb-4">📚 Similar Careers</h2>
          {response.similar_careers.length > 0 ? (
            <ul className="space-y-2">
              {response.similar_careers.map((career: string, idx: number) => (
                <li key={idx} className="bg-gray-700/50 p-3 rounded">{career}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No similar careers found.</p>
          )}
        </div>
      )}

      {/* Chat Section */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">💬 Chat with Career Assistant</h2>
        
        <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center mt-32">
              Ask me anything about your career path!
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 p-3 rounded-lg ${
                      msg.isUser 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 p-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="flex">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-grow p-3 rounded-l-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !currentMessage.trim()}
            className="bg-blue-600 px-4 rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </section>
  );
}
