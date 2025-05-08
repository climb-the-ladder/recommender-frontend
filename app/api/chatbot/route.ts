import { NextRequest, NextResponse } from 'next/server';
import { generateMockResponse } from './mock';

// API endpoint to handle chat requests
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, career, gpa, subject_grades, session_id } = body;

    // Validation
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log(`Calling backend API at: ${apiUrl}/api/chat`);
    console.log('Request payload:', JSON.stringify({
      message,
      career,
      gpa,
      subject_grades,
      session_id,
    }));

    // Call the backend API
    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          career,
          gpa,
          subject_grades,
          session_id,
        }),
      });

      if (!response.ok) {
        console.error(`Backend API error: ${response.status}`);
        // Use mock response generator as fallback
        const mockResponse = generateMockResponse({
          message,
          career,
          gpa,
          subject_grades
        });
        
        return NextResponse.json({
          response: mockResponse,
          isMock: true
        }, { status: 200 });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      // Use mock response generator as fallback
      const mockResponse = generateMockResponse({
        message,
        career,
        gpa,
        subject_grades
      });
      
      return NextResponse.json({
        response: mockResponse,
        isMock: true
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Error in chatbot API route:', error);
    // Use default mock response
    return NextResponse.json({
      response: "I can help you with your career and university questions. What would you like to know?",
      isMock: true
    }, { status: 200 });
  }
} 