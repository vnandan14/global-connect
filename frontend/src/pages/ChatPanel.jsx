import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../lib/api";
import { getSocket } from "../lib/socket";

export default function ChatPanel() {
  const { user } = useSelector((state) => state.auth);
  const { connections } = useSelector((state) => state.social);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const socket = getSocket(user._id);
    socket.on("message:new", (message) => {
      setMessages((current) => [...current, message]);
    });

    return () => socket.off("message:new");
  }, [user._id]);

  useEffect(() => {
    if (!active) return;
    api.get(`/messages/${active._id}`).then(({ data }) => setMessages(data));
  }, [active]);

  async function send(event) {
    event.preventDefault();
    if (!active || !content.trim()) return;
    const { data } = await api.post("/messages", { receiverId: active._id, content });
    setMessages((current) => [...current, data]);
    setContent("");
  }

  return (
    <div className="panel grid min-h-[560px] md:grid-cols-[260px_1fr]">
      <aside className="border-b border-line p-4 md:border-b-0 md:border-r">
        <h2 className="mb-3 text-lg font-black">Messages</h2>
        <div className="grid gap-2">
          {connections.map((person) => (
            <button key={person._id} className={`rounded-md p-3 text-left ${active?._id === person._id ? "bg-brand text-white" : "bg-slate-100"}`} onClick={() => setActive(person)}>
              <span className="block font-black">{person.name}</span>
              <span className="block text-xs opacity-75">{person.headline || "Connection"}</span>
            </button>
          ))}
          {!connections.length && <p className="text-sm text-slate-500">Accept a connection to start chatting.</p>}
        </div>
      </aside>

      <section className="flex min-h-[420px] flex-col">
        <div className="border-b border-line p-4">
          <h3 className="font-black">{active ? active.name : "Select a connection"}</h3>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => {
            const mine = String(message.senderId) === String(user._id);
            return (
              <div className={`flex ${mine ? "justify-end" : "justify-start"}`} key={message._id}>
                <p className={`max-w-[75%] rounded-md px-3 py-2 ${mine ? "bg-brand text-white" : "bg-slate-100"}`}>{message.content}</p>
              </div>
            );
          })}
        </div>

        <form className="flex gap-2 border-t border-line p-4" onSubmit={send}>
          <input className="field" value={content} onChange={(e) => setContent(e.target.value)} placeholder={active ? "Type a message" : "Choose a connection first"} disabled={!active} />
          <button className="btn btn-primary" disabled={!active} title="Send">
            <Send size={18} />
          </button>
        </form>
      </section>
    </div>
  );
}
