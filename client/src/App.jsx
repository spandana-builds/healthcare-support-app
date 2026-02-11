import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    symptoms: "",
    contact: "",
    volunteer: false,
  });

  const [summary, setSummary] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const text = `Patient ${form.name} (Age ${form.age}) reports "${form.symptoms}". 
Contact: ${form.contact}. 
Volunteer support: ${form.volunteer ? "Requested" : "Not requested"}.`;

    setSummary(text);

    // ✅ automation feature — save last case
    localStorage.setItem("lastPatient", text);
  }

  async function handleChat() {
    if (!chatInput) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: chatInput }),
      });

      const data = await res.json();
      setChatReply(data.reply || "No response");
    } catch {
      setChatReply("Error connecting to AI server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Healthcare Support Helper</h1>

      <p>
        This tool helps NGOs quickly collect patient support requests
        and provide instant AI-based guidance.
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="age"
          type="number"
          min="0"
          placeholder="Age"
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="symptoms"
          placeholder="Symptoms"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="contact"
          placeholder="Contact Number"
          pattern="[0-9]{10}"
          title="Enter 10 digit number"
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>
          <input
            type="checkbox"
            name="volunteer"
            onChange={handleChange}
          />
          Need volunteer help
        </label>

        <br /><br />
        <button type="submit">Submit</button>
      </form>

      {/* SUMMARY */}
      {summary && (
        <div style={{ marginTop: 20 }}>
          <h3>Auto Summary</h3>
          <p>{summary}</p>
        </div>
      )}

      {/* AI CHATBOT */}
      <div style={{ marginTop: 40 }}>
        <h3>AI Health FAQ Chatbot</h3>

        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask a health question..."
        />

        <button onClick={handleChat}>Ask AI</button>

        {loading && <p>Thinking...</p>}
        {chatReply && <p><b>AI:</b> {chatReply}</p>}
      </div>
    </div>
  );
}
