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
  }

  function chatbotReply(q) {
    const question = q.toLowerCase();

    if (question.includes("fever"))
      return "For fever: rest, drink fluids, and consult a doctor if it lasts more than 2 days.";

    if (question.includes("ambulance"))
      return "Emergency ambulance number: 108";

    if (question.includes("vaccine"))
      return "Please check your nearest health center for vaccination schedules.";

    if (question.includes("help"))
      return "You can register using the form above and volunteers will contact you.";

    return "Sorry, I can answer only basic health FAQs right now.";
  }

  function handleChat() {
    setChatReply(chatbotReply(chatInput));
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Healthcare Support Helper</h1>

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

      {/* CHATBOT */}
      <div style={{ marginTop: 40 }}>
        <h3>FAQ Chatbot</h3>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask health question..."
        />
        <button onClick={handleChat}>Ask</button>

        {chatReply && <p><b>Bot:</b> {chatReply}</p>}
      </div>
    </div>
  );
}
