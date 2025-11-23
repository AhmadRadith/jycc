import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    // console.log(apiKey);
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";

    const tools = [
      {
        googleSearch: {},
      },
    ];

    const config = {
      thinkingConfig: {
        includeThoughts: true,
      },
      tools,
    };

    const contents = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const result = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        res.write(text);
      }
    }
    res.end();
  } catch (error) {
    console.error("Error generating content:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.end();
    }
  }
}
