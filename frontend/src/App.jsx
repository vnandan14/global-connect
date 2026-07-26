import { Briefcase, LogOut, MessageCircle, Newspaper, Search, UserRound, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "./pages/AuthPage";
import ChatPanel from "./pages/ChatPanel";
import FeedPage from "./pages/FeedPage";
import JobsPage from "./pages/JobsPage";
import NetworkPage from "./pages/NetworkPage";
import ProfilePage from "./pages/ProfilePage";
import { logout } from "./features/authSlice";
import { loadConnections, loadFeed, loadJobs } from "./features/socialSlice";
import { getSocket } from "./lib/socket";

const tabs = [
  { id: "feed", label: "Feed", icon: Newspaper },
  { id: "network", label: "Network", icon: UsersRound },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "profile", label: "Profile", icon: UserRound }
];

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    if (!user) return;
    dispatch(loadFeed());
    dispatch(loadConnections());
    dispatch(loadJobs());
    getSocket(user._id);
  }, [dispatch, user]);

  if (!user) return <AuthPage />;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <button className="flex items-center gap-3 text-left" onClick={() => setActiveTab("feed")}>
            <div className="grid h-10 w-10 place-items-center rounded-md bg-brand text-lg font-black text-white">GC</div>
            <div>
              <h1 className="text-lg font-black text-ink">Global Connect</h1>
              <p className="text-xs text-slate-500">Professional networking platform</p>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`btn px-3 py-2 ${activeTab === id ? "btn-primary" : "text-slate-600 hover:bg-slate-100"}`}
                onClick={() => setActiveTab(id)}
                title={label}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <button className="btn btn-soft" onClick={() => dispatch(logout())} title="Logout">
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-5 lg:grid-cols-[260px_1fr]">
        <aside className="panel h-fit p-4">
          <div className="h-20 rounded-md bg-[linear-gradient(135deg,#0f6b5f,#b8872d)]" />
          <div className="-mt-8 grid h-16 w-16 place-items-center rounded-md border-4 border-white bg-coral text-xl font-black text-white">
            {user.name?.slice(0, 1).toUpperCase()}
          </div>
          <h2 className="mt-3 text-lg font-black">{user.name}</h2>
          <p className="text-sm text-slate-600">{user.headline || "Global Connect member"}</p>
          <p className="mt-3 text-sm text-slate-500">{user.location || "Location not added"}</p>

          <div className="mt-4 grid gap-2 md:hidden">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} className={`btn justify-start ${activeTab === id ? "btn-primary" : "btn-soft"}`} onClick={() => setActiveTab(id)}>
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </aside>

        <section>
          {activeTab === "feed" && <FeedPage />}
          {activeTab === "network" && <NetworkPage />}
          {activeTab === "jobs" && <JobsPage />}
          {activeTab === "chat" && <ChatPanel />}
          {activeTab === "profile" && <ProfilePage />}
        </section>
      </main>
    </div>
  );
}
