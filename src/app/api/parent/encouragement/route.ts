import { NextResponse } from "next/server";

type MentorOutput = {
  message: string;
  source: "parent" | "mentor";
};

export async function POST() {
  const source: "parent" | "mentor" = "parent";

  // Simulate the AI Mentor (Encouragement Layer) prompt logic:
  // - If parentNote present: rephrase warmly, connect it to recentActivity, don't repeat verbatim
  // - If parentNote absent: generate a genuine 1-2 sentence encouragement tied to recentActivity
  // - Sound like a mentor, not a parent or a bot. Never mention being AI-generated.

  // Since we have a parentNote, we rephrase it connect to activity
  const recentActivity = "completed a career assessment module";

  // Rephrase the parent's message warmly, connecting to recent activity
  const outputMessage = `That's great that you ${recentActivity}! Thanks for your encouraging note — it means a lot to know you're supporting my journey.`;

  return NextResponse.json<MentorOutput>({
    message: outputMessage,
    source,
  });
}