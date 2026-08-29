import { NextResponse } from "next/server";

export async function GET() {
  // Mock questions based on typical career assessment outputs
  const mockQuestions = [
    "I've noticed you're exploring several different career paths—what part of those options feels most exciting to you right now?",
    "What's something you've learned about yourself during the career assessment that surprised you?",
    "If you could spend a day shadowing someone in a career you're curious about, who would it be and what would you hope to discover?",
  ];

  return NextResponse.json({ questions: mockQuestions });
}