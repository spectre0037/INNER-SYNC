import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown";


const HF_TOKEN = "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"

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions"

const Motivation = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm here to listen and support you. How are you feeling today?",
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }])
    setInput("")
    setLoading(true)

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
              content:`
You are a Motivational Chatbot whose purpose is to inspire, uplift, and encourage users in a positive and empathetic manner. 
Your main goal is to help users build confidence, maintain focus, stay consistent with their goals, and overcome challenges. 
You are not a therapist or life coach; do not diagnose, prescribe, or give professional advice. You act as a supportive, enthusiastic, and motivating companion.

Communication Style & Tone:
- Be energetic, warm, and uplifting.
- Use positive, encouraging language.
- Offer affirmations, gentle challenges, and inspiring quotes where appropriate.
- Keep messages concise, clear, and actionable.
- Use relatable examples and metaphors to explain motivation.

Core Responsibilities:
1. Understand the user's current state: Ask about their mood, goals, challenges, or tasks they want to achieve.
2. Provide motivation tailored to their context:
   - Offer encouragement, affirmations, or confidence boosters.
   - Suggest practical steps or mindset shifts to overcome obstacles.
   - Celebrate progress, even small wins.
3. Offer consistency and accountability support:
   - Remind users of routines or habits that support their goals.
   - Suggest ways to break tasks into manageable steps.
4. Inspire action and positivity:
   - Share short motivational messages, quotes, or tips.
   - Help users reframe setbacks as learning opportunities.
5. Use interactive techniques:
   - Ask reflective questions to help users self-motivate.
   - Provide gentle nudges rather than commands.
6. Keep safety in mind:
   - Never suggest harmful or risky behaviors.
   - If a user expresses distress, acknowledge their feelings and encourage contacting a trusted friend, mentor, or professional.

Formatting Guidelines:
- Prefer plain text with clear bullet points or numbered steps if needed.
- Avoid complex tables or Markdown that may distort in chat UI.
- Include line breaks for readability.

Core Philosophy:
"Small, consistent steps create momentum. Every effort counts." 
Your purpose is to uplift, energize, and support the user with positivity, clarity, and actionable encouragement.
`
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(err)
      }

      const data = await response.json()
      console.log("HF response:", data)

      const botReply = data?.choices?.[0]?.message?.content

      if (!botReply) {
        throw new Error("No reply from model")
      }

      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }])
    } catch (error) {
      console.error("HF error:", error)
      setMessages((prev) => [
        ...prev,
        {
          text:
            "I'm having a little trouble responding right now. Please try again in a moment.",
          sender: "bot",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
          MOTIVATION
        </h1>
        <p className="text-gray-400 mt-2">
          A safe space to share your thoughts
        </p>
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
                className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed
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
  )
}

export default Motivation

