import { chunkTextIntoTokens, generateRestaurantInsightsById } from "@/lib/ai";

export const POST = async (request: Request) => {
  try {
    let body = {};
    const contentType = request.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        const text = await request.text();

        if (text.trim()) {
          body = JSON.parse(text);
        }
      } catch (jsonError) {
        console.warn("Failed to parse JSON body:", jsonError);
      }
    }

    const { id } = body as {
      id: string;
    };

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate AI insights based on restaurant ID
    const insights = await generateRestaurantInsightsById(id);

    // Create a readable stream
    const encoder = new TextEncoder();
    const chunks = chunkTextIntoTokens(insights);

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const isComplete = i === chunks.length - 1;

          // Send chunk as Server-Sent Events format
          const data = JSON.stringify({
            chunk,
            isComplete,
            timestamp: Date.now(),
          });

          controller.enqueue(encoder.encode(`data: ${data}\n\n`));

          // Add delay for realistic streaming
          if (!isComplete) {
            await new Promise((resolve) =>
              setTimeout(resolve, Math.floor(Math.random() * 100) + 50),
            );
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error in suggest API:", error);

    return new Response(
      JSON.stringify({ error: "Failed to generate suggestions" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

export const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
