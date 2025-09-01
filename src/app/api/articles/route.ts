// src/app/api/articles/route.ts
import { NextResponse } from 'next/server';

// This is a mock implementation.
// In a real application, you would fetch this from a database.
const articles = [];

export async function GET() {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(articles);
}
