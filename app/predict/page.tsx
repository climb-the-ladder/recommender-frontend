// pages/predict.jsx
"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider"; // shadcn/ui Slider
import { Switch } from "@/components/ui/switch"; // Your custom Switch component
import { cn } from "@/lib/utils"; // shadcn utility for className merging

export default function PredictForm() {
  const [formData, setFormData] = useState({
    math_score: "",
    history_score: "",
    physics_score: "",
    chemistry_score: "",
    biology_score: "",
    english_score: "",
    geography_score: ""
  });
  
  const [predictions, setPredictions] = useState(null);
  const [detailedMode, setDetailedMode] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (name, value) => {
    setFormData({ ...formData, [name]: value[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),  // Send only the cleaned subject scores
    });    
    const result = await response.json();
    setPredictions(result);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-16 px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-gray-700/50">
        <h2 className="text-4xl font-bold text-white text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Discover Your Career Path
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Numeric Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
            [
              { label: "Math Score", name: "math_score" },
              { label: "History Score", name: "history_score" },
              { label: "Physics Score", name: "physics_score" },
              { label: "Chemistry Score", name: "chemistry_score" },
              { label: "Biology Score", name: "biology_score" },
              { label: "English Score", name: "english_score" },
              { label: "Geography Score", name: "geography_score" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type="number"
                  min="0"
                  max="100"
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-gray-900/50 text-white border border-gray-700/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-900"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Predict My Career
          </button>
        </form>

        {/* Predictions */}
        {predictions && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-white text-center mb-6">
              Your Predicted Career
            </h3>
            <p className="text-white text-center text-xl">
              {predictions.career}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
