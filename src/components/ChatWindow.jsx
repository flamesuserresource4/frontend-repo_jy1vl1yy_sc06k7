import { useEffect, useRef, useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

export default function ChatWindow({ apiBase, conversationId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const load = async () => {
    if (!conversationId) return
    const res = await fetch(`${apiBase}/api/conversations/${conversationId}/messages`)
    const data = await res.json()
    setMessages(data)
    setTimeout(scrollToBottom, 50)
  }

  useEffect(() => { load() }, [conversationId])

  const send = async () => {
    if (!input.trim() || !conversationId) return
    setLoading(true)
    try {
      // Send user msg and get assistant reply
      const res = await fetch(`${apiBase}/api/conversations/${conversationId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input })
      })
      const assistantMessage = await res.json()
      // reload full thread to include user+assistant entries
      await load()
      setInput('')
      setTimeout(scrollToBottom, 50)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 pt-20">Say hello to start the conversation.</div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
                {m.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow ${m.role === 'assistant' ? 'bg-white' : 'bg-blue-600 text-white'}`}>
                <div className="whitespace-pre-wrap break-words">{m.content}</div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t bg-white">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message…"
            className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg active:scale-[.98] disabled:opacity-60"
          >
            <Send size={16} /> Send
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">Try: "/help", "/summarize your text here", or "/todo buy milk eggs"</div>
      </div>
    </div>
  )
}
