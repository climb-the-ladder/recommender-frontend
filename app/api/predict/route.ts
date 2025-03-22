import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received data:', data);

    // Hard-code the backend URL for server-side requests in the Docker container
    // This is safer than relying on environment variables that might not be available
    const backendUrl = "http://backend:5002/recommend";
    
    console.log('Using backend URL:', backendUrl);

    // Forward the request to the backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('Backend error:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.error || 'Backend service error' },
        { status: response.status }
      );
    }

    // Return the response from the backend
    const result = await response.json();
    console.log('Backend response:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
