import { NextRequest, NextResponse } from "next/server";
import { 
  run,
  InputGuardrailTripwireTriggered, 
  OutputGuardrailTripwireTriggered 
} from "@openai/agents";
import { receptionAgent } from "@/agents/Reception";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { message } = await req.json();
  
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (text: string) => controller.enqueue(encoder.encode(text));

      try {
        // 1. Get the raw result stream
        const result = await run(receptionAgent, message, { stream: true });
       
        // 2. Convert it to a simple text stream
        // This helper handles all the complex event parsing for you
        const textStream = result.toTextStream();

        // 3. Iterate over simple string chunks
        for await (const textChunk of textStream) {
          send(textChunk);
        }

        controller.close();

      } catch (err) {
        console.error("AGENT STREAM ERROR:", err);
        // ... (Keep your existing error handling code here) ...
        
        // Example safe fallback:
        if (err instanceof InputGuardrailTripwireTriggered) {
             send(" I cannot answer that query due to safety guidelines.");
        }
        else if( err instanceof OutputGuardrailTripwireTriggered) {
             send(" The response was blocked due to safety guidelines.");
        }
        else {
             send(" An error occurred.");
        }
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}