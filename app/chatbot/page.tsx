'use client';
import { useState } from 'react';

export default function ChatbotPage() {
  const [gpa, setGpa] = useState('');
  const [career, setCareer] = useState('Software Engineer'); // Example: Pass predicted career dynamically if needed
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async () => {
    const res = await fetch('http://127.0.0.1:5000/api/chatbot-recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gpa, career }),
    });
    const result = await res.json();
    setResponse(result);
  };

  return (
    <section className="min-h-screen bg-gray-900 p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">🎯 Career & University Recommender</h1>

      <label className="block mb-4">
        Enter your GPA (out of 100):
        <input
          type="number"
          value={gpa}
          onChange={(e) => setGpa(e.target.value)}
          className="block p-2 rounded bg-gray-800 mt-2"
        />
      </label>

      <button onClick={handleSubmit} className="bg-blue-600 px-4 py-2 rounded">
        Get Recommendations
      </button>

      {response && (
        <div className="mt-8">
          <h2 className="text-2xl mb-4">🎓 Recommended Universities:</h2>
          {response.recommended_universities.map((uni: any, idx: number) => (
            <p key={idx}>- {uni.University_Name} ({uni.Rank_Tier})</p>
          ))}

          <h2 className="text-2xl mt-6 mb-4">📚 Similar Careers:</h2>
          {response.similar_careers.map((career: string, idx: number) => (
            <p key={idx}>- {career}</p>
          ))}
        </div>
      )}
    </section>
  );
}
