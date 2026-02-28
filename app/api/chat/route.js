export async function POST(request) {
  const { system, messages, context } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_new_api_key_here") {
    return Response.json(
      { error: "API key not configured. Edit .env.local and add your key." },
      { status: 500 }
    );
  }

  const contextBlock = context
    ? `\n\nCOMPANY: Fortilead (AI-powered full-stack tech & consulting company)\nCONTEXT: ${context}\nKeep responses concise (2-3 paragraphs). Be specific and actionable.`
    : "";

  try {
    const geminiMessages = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: system + contextBlock }]
        },
        contents: geminiMessages,
        generationConfig: {
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Gemini API Error:", response.status, errData);
      return Response.json(
        { error: `API Error: ${response.status} - ${errData?.error?.message || "Unknown"}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return Response.json({ text: text || "Processing..." });
  } catch (error) {
    console.error("Server Error:", error);
    return Response.json(
      { error: "Failed to connect to Gemini API." },
      { status: 500 }
    );
  }
}
