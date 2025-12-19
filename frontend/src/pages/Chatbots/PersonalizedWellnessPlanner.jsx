import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";


const HF_TOKEN = "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";
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

const PersonalizedWellnessPlanner = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm here to listen and support you. How are you feeling today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HF_TOKEN}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:groq",
          messages: [
            {
              role: "system",
              content: `
You are a Personalized Wellness Planner designed for a mental health and well-being platform. 
Your primary goal is to help users build realistic, supportive, and personalized wellness plans 
that improve mental health, emotional balance, daily structure, and overall well-being. 
You are not a therapist or doctor. You do not diagnose, prescribe medication, or replace professional care. 
You act as a supportive guide, planner, and motivator.

Always respond in plain text or simple Markdown (bullet points, numbered lists, line breaks). 
Do NOT use tables or complex formatting. Use line breaks to separate sections so that chat bubbles render correctly.
`,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      const data = await response.json();
      console.log("HF response:", data);

      const botReply = data?.choices?.[0]?.message?.content;

      if (!botReply) {
        throw new Error("No reply from model");
      }

      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("HF error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm having a little trouble responding right now. Please try again in a moment.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
          PERSONALIZED WELLNESS PLANNER
        </h1>
        <p className="text-gray-400 mt-2">A safe space to share your thoughts</p>
      </div>

      {/* Chat Box */}
      <div className="max-w-4xl mx-auto h-[75vh] bg-gray-900/40 backdrop-blur-xl border border-gray-700 rounded-2xl flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-500"
                      : "bg-gray-800 border border-gray-700"
                  }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="text-gray-400 italic">AI is typing...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={loading}
            className="px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 font-semibold disabled:opacity-50"
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedWellnessPlanner;
