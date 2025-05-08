// Mock responses for the chatbot when the backend is unavailable

interface MockRequestData {
  message: string;
  career?: string;
  gpa?: number;
  subject_grades?: Record<string, number>;
}

// Example university data for mock responses
const topUniversities = [
  { name: "Stanford University", tier: "Top 1" },
  { name: "Harvard University", tier: "Top 5" },
  { name: "MIT", tier: "Top 5" },
  { name: "UC Berkeley", tier: "Top 15" },
  { name: "Yale University", tier: "Top 25" },
  { name: "Carnegie Mellon University", tier: "Top 15" },
  { name: "Princeton University", tier: "Top 5" },
];

// Example similar careers data for mock responses
const similarCareers: Record<string, string[]> = {
  "Software Engineer": ["Full Stack Developer", "Backend Developer", "Frontend Developer", "DevOps Engineer", "Machine Learning Engineer"],
  "Doctor": ["Surgeon", "Dentist", "Pharmacist", "Psychiatrist", "Physician Assistant"],
  "Lawyer": ["Corporate Lawyer", "Legal Analyst", "Paralegal", "Judge", "Mediator"],
  "Teacher": ["Professor", "Tutor", "Curriculum Developer", "Education Consultant", "Special Education Teacher"],
  "Scientist": ["Research Scientist", "Data Scientist", "Environmental Scientist", "Chemist", "Biologist"],
};

export function generateMockResponse(data: MockRequestData): string {
  const { message, career, gpa, subject_grades } = data;
  const lowercaseMessage = message.toLowerCase();
  
  // Check if query is about universities
  if (lowercaseMessage.includes("university") || 
      lowercaseMessage.includes("college") || 
      lowercaseMessage.includes("recommend")) {
    return generateUniversityResponse(career, gpa);
  }
  
  // Check if query is about similar careers
  if (lowercaseMessage.includes("similar") || 
      lowercaseMessage.includes("alternative") || 
      lowercaseMessage.includes("other career")) {
    return generateSimilarCareersResponse(career);
  }
  
  // Check if query is about career details
  if ((career && lowercaseMessage.includes("about")) || 
      lowercaseMessage.includes("detail") || 
      lowercaseMessage.includes("tell me more")) {
    return generateCareerDetailsResponse(career);
  }
  
  // Check if query is about grades
  if (lowercaseMessage.includes("grade") || 
      lowercaseMessage.includes("gpa") || 
      lowercaseMessage.includes("score")) {
    return generateGradesResponse(gpa, subject_grades);
  }
  
  // Generic response about the user's chosen career
  if (career) {
    return `A career as a ${career} can be very rewarding. I can help you explore university options, similar careers, or provide more details about this field. What would you like to know?`;
  }
  
  // Default response
  return "I'm here to help with your career exploration and university planning. I can provide information about universities, career options, or answer questions about your academic profile. What would you like to know more about?";
}

function generateUniversityResponse(career?: string, gpa?: number): string {
  if (!career || !gpa) {
    return "To recommend universities, I need to know your GPA and career interest. Could you provide that information?";
  }
  
  // Filter universities based on GPA
  const matchingUniversities = topUniversities.slice(0, 3 + Math.floor(Math.random() * 2));
  
  let response = `Based on your interest in ${career} and GPA of ${gpa}/100, here are some university recommendations:\n\n`;
  
  matchingUniversities.forEach((uni, index) => {
    response += `${index + 1}. ${uni.name} (${uni.tier})\n`;
  });
  
  response += `\nThese universities have strong programs in fields related to ${career}. Would you like more specific information about any of these universities?`;
  
  return response;
}

function generateSimilarCareersResponse(career?: string): string {
  if (!career) {
    return "To suggest similar careers, I need to know what career you're interested in. Could you tell me which career field you'd like to explore?";
  }
  
  const matchingCareers = similarCareers[career] || 
    ["Related Profession 1", "Related Profession 2", "Related Profession 3", "Related Profession 4", "Related Profession 5"];
  
  return `Careers similar to ${career} include: ${matchingCareers.join(", ")}. Would you like more details about any of these alternatives?`;
}

function generateCareerDetailsResponse(career?: string): string {
  if (!career) {
    return "Which career would you like to know more about?";
  }
  
  return `A career as a ${career} typically requires specialized education and training. Professionals in this field generally need strong analytical skills, problem-solving abilities, and excellent communication. The job outlook for ${career}s is positive, with growing demand in many regions. Would you like to know about the educational requirements, typical work environment, or salary expectations for this career?`;
}

function generateGradesResponse(gpa?: number, subject_grades?: Record<string, number>): string {
  if (!gpa) {
    return "I don't have information about your grades. Could you share your GPA and any specific subject grades?";
  }
  
  let response = `Your overall GPA is ${gpa}/100`;
  
  if (subject_grades && Object.keys(subject_grades).length > 0) {
    response += ". Here are your subject grades:\n\n";
    
    for (const [subject, grade] of Object.entries(subject_grades)) {
      response += `- ${subject}: ${grade}/100\n`;
    }
    
    response += "\nBased on these grades, I can recommend suitable career paths or universities. Would you like some recommendations?";
  } else {
    response += ". If you share your specific subject grades, I can provide more tailored recommendations for your academic strengths.";
  }
  
  return response;
} 