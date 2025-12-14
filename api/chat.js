import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const {
      promptContent,
      systemContent,
      previousChat
    } = req.body;

    const messages = [];

    if (systemContent) {
      messages.push({
        role: "system",
        content: systemContent,
      });
    }

    if (previousChat) {
      messages.push({
        role: "assistant",
        content: previousChat,
      });
    }

    messages.push({
      role: "user",
      content: promptContent,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    res.status(200).json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({
      error: "AI yanıt üretilemedi",
    });
  }
}
