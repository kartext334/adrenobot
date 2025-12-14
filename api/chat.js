import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sen yardımcı bir asistansın." },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({
      message: completion.choices[0].message.content,
    });
   } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI error" });
  }
}
