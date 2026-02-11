import { useState } from "react";
import "./App.css";

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

    const text = `Patient ${form.name} (Age ${form.age}) reports "${form.symptoms}". Contact: ${form.contact}. Volunteer support: ${form.volunteer ? "Requested" : "Not requested"}.`;

    setSummary(text);
    localStorage.setItem("lastPatient", text);
  }

  async function handleChat() {
    if (!chatInput) return;

    try {
      setLoading(true); 
      
      //http://localhost:5000/api/chat

      const res = await fetch("https://healthcare-support-app.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const lastSaved = localStorage.getItem("lastPatient");

  return (
    <div className="container">

      <h1 className="title">Healthcare Support Helper</h1>
      <p className="subtitle">NGO support intake + AI FAQ assistant</p>

      {/* INFO BANNER */}
      <div style={{
        background: "#e8f6f6",
        padding: "6px 10px",
        borderRadius: 6,
        marginBottom: 8,
        fontSize: 12
      }}>
        AI-assisted NGO healthcare intake + FAQ assistant
      </div>

      {/* TWO COLUMN GRID */}
      <div className="twoCol">

        {/* LEFT COLUMN */}
        <div>

          <div className="card">
            <h3>Patient Support Form</h3>

            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Name" onChange={handleChange} required />
              <br />

              <input name="age" type="number" min="0" placeholder="Age" onChange={handleChange} required />
              <br />

              <textarea name="symptoms" placeholder="Symptoms" onChange={handleChange} required />
              <br />

              <input
                name="contact"
                placeholder="Contact Number"
                pattern="[0-9]{10}"
                title="Enter 10 digit number"
                onChange={handleChange}
                required
              />
              <br />

              <label className="checkRow">
                  <input
                    type="checkbox"
                    name="volunteer"
                    onChange={handleChange}
                  />
                  Need volunteer help
                </label>

              

              <br />
              <button type="submit">Submit</button>
            </form>
          </div>

          {summary && (
            <div className="card summaryBox">
              <h3>Auto Summary</h3>
              <p>{summary}</p>
            </div>
          )}

          

        </div>

        {/* RIGHT COLUMN — CHATBOT */}
        <div className="card">
          <h3>AI Health FAQ Chatbot</h3>

          <div className="chatRow">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a health question..."
            />
            <button onClick={handleChat}>Ask</button>
          </div>

          {loading && <p>Thinking...</p>}

          {chatReply && (
            <div className="aiReply">
              <b>AI:</b> {chatReply}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
