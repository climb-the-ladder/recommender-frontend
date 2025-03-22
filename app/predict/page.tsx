// pages/predict.jsx
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Slider } from "@/components/ui/slider"; // shadcn/ui Slider
import { Switch } from "@/components/ui/switch"; // Your custom Switch component
import { cn } from "@/lib/utils"; // shadcn utility for className merging

interface FormData {
  education: string;
  skills: string[];
  interests: string[];
  personality_type: string; 
  experience_level: string;
  gpa: string;
  extracurriculars: string;
  internships: string;
  projects: string;
  leadership: string;
  fieldCourses: string;
  research: string;
  coding: number;
  communication: number;
  problemSolving: number;
  teamwork: number;
  analytical: number;
  presentation: number;
  networking: number;
  certifications: string;
  [key: string]: string | number | string[]; // Index signature
}

interface PredictionResponse {
  recommended_career?: string;
  career?: string;
  confidence?: number;
}

export default function PredictForm() {
  const [formData, setFormData] = useState<FormData>({
    education: "Bachelors",
    skills: ["Python", "Data Analysis"],
    interests: ["Machine Learning", "AI"],
    personality_type: "Analytical",
    experience_level: "Entry Level",
    gpa: "",
    extracurriculars: "",
    internships: "",
    projects: "",
    leadership: "",
    fieldCourses: "",
    research: "",
    coding: 3,
    communication: 3,
    problemSolving: 3,
    teamwork: 3,
    analytical: 3,
    presentation: 3,
    networking: 3,
    certifications: "",
  });
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [detailedMode, setDetailedMode] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({ ...formData, [name]: value[0] });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Submitting form data:', formData);
      
      // Create a simplified payload that matches what the backend expects
      const payload = {
        education: formData.education,
        skills: formData.skills,
        interests: formData.interests,
        personality_type: formData.personality_type,
        experience_level: formData.experience_level,
        detailed: detailedMode
      };
      
      console.log('Sending payload to backend:', payload);
      
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to get prediction');
      }
      
      const result = await response.json();
      console.log('Prediction result:', result);
      setPredictions(result);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
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
            {[
              { label: "GPA (0-5)", name: "gpa", step: "0.1", max: "5" },
              { label: "Extracurricular Activities", name: "extracurriculars" },
              { label: "Internships", name: "internships" },
              { label: "Projects", name: "projects" },
              { label: "Leadership Positions", name: "leadership" },
              { label: "Field-Specific Courses", name: "fieldCourses" },
              { label: "Research Experiences", name: "research" },
              { label: "Industry Certifications", name: "certifications" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type="number"
                  step={field.step || "1"}
                  min="0"
                  max={field.max || undefined}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-gray-900/50 text-white border border-gray-700/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-900"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">
              Rate Your Skills (1-5)
            </h3>
            {[
              { label: "Coding", name: "coding" },
              { label: "Communication", name: "communication" },
              { label: "Problem Solving", name: "problemSolving" },
              { label: "Teamwork", name: "teamwork" },
              { label: "Analytical", name: "analytical" },
              { label: "Presentation", name: "presentation" },
              { label: "Networking", name: "networking" },
            ].map((skill) => (
              <div key={skill.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  {skill.label} Skills
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[formData[skill.name] as number]}
                    onValueChange={(value) =>
                      handleSliderChange(skill.name, value)
                    }
                    min={1}
                    max={5}
                    step={1}
                    className={cn("w-full", "text-blue-500")}
                  />
                  <span className="text-gray-300 text-sm w-8 text-center">
                    {formData[skill.name]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Mode Toggle */}
          <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
            <label
              htmlFor="detailed-mode"
              className="text-sm font-medium text-gray-200"
            >
              Detailed Prediction Mode
            </label>
            <Switch
              id="detailed-mode"
              checked={detailedMode}
              onCheckedChange={setDetailedMode}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Predict My Career"}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Predictions */}
        {predictions && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-white text-center mb-6">
              Your Career Prediction
            </h3>
            <div className="p-6 rounded-lg bg-gray-900/70 border border-gray-700/50 shadow-lg">
              <h4 className="text-xl font-medium text-white">
                <span className="text-blue-400">
                  {predictions.recommended_career || predictions.career}
                </span>
              </h4>
              {predictions.confidence && (
                <p className="text-gray-300 mt-2">
                  Confidence: {predictions.confidence}%
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
