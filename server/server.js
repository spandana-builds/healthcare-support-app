import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ---------- CONFIG ---------- */

const SYSTEM_PROMPT =
  "You are a healthcare NGO support assistant. " +
  "Give short, safe, non-diagnostic advice. " +
  "Always suggest consulting a medical professional for serious symptoms.";

/* ---------- FALLBACK ---------- */

function fallbackReply(q) {
  const text = String(q).toLowerCase();

  if (text.includes("fever"))
    return "For fever: rest, fluids, consult doctor if >2 days.";

  if (text.includes("ambulance"))
    return "Emergency ambulance number in India: 108.";

  if (text.includes("vaccine"))
    return "Contact nearest health center for vaccination schedule.";

  return "Please submit the support form and a volunteer will contact you.";
}

/* ---------- CHAT ENDPOINT ---------- */

app.post("/api/chat", async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).json({ reply: "Message required" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.log("⚠️ No API key — fallback mode");
      return res.json({ reply: fallbackReply(userInput) });
    }

    const payload = {
      model: "llama3.2-vision:latest",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userInput },
      ],
      temperature: 0.5,
    };

    const { data } = await axios.post(
      "https://chat.ivislabs.in/api/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    let content =
      data?.choices?.[0]?.message?.content ||
      fallbackReply(userInput);

    if (Array.isArray(content)) {
      content = content.join("\n");
    }

    const clean = String(content).replace(/<[^>]*>/g, "").trim();

    res.json({ reply: clean });

  } catch (err) {
    console.log("⚠️ External AI failed → fallback:", err.message);
    res.json({ reply: fallbackReply(userInput) });
  }
});

/* ---------- HEALTH CHECK ---------- */

app.get("/", (req, res) => {
  res.send("External AI Healthcare API running");
});

/* ---------- START ---------- */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
