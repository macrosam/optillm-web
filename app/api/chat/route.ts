import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const baseUrl = "https://optillm.onrender.com/v1";


const model = "gpt-4o-mini";

({
  : process.env.OPENAI_DUMMY_KEY || "dummy",
  baseURL: baseUrl,
});

(req: NextRequest) 
    const { messages } = await req.json();

    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ reply: content });
  } catch (err: any) {
    console.error("OptiLLM proxy error:", err);
    return new NextResponse(
      JSON.stringify({
        error: "OptiLLM proxy failed",
        detail: String(err?.message || err),
      }),
      { status: 500 }
    );
  }
}
