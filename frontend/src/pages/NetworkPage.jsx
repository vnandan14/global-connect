import { Check, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptRequest, loadConnections, searchPeople, sendRequest } from "../features/socialSlice";

export default function NetworkPage() {
  const dispatch = useDispatch();
  const { people, connections, requests } = useSelector((state) => state.social);
  const [q, setQ] = useState("");

  function search(event) {
    event.preventDefault();
    dispatch(searchPeople(q));
  }

  return (
    <div className="grid gap-4">
      <form className="panel flex gap-2 p-4" onSubmit={search}>
        <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, headline, or skill" />
        <button className="btn btn-primary" title="Search">
          <Search size={18} />
        </button>
      </form>

      <section className="panel p-4">
        <h2 className="mb-3 text-lg font-black">Connection Requests</h2>
        <UserGrid
          users={requests}
          empty="No pending requests"
          action={(person) => (
            <button className="btn btn-primary" onClick={() => dispatch(acceptRequest(person._id)).then(() => dispatch(loadConnections()))}>
              <Check size={18} />
              Accept
            </button>
          )}
        />
      </section>

      <section className="panel p-4">
        <h2 className="mb-3 text-lg font-black">People</h2>
        <UserGrid
          users={people}
          empty="Search for professionals to connect with"
          action={(person) => (
            <button className="btn btn-soft" onClick={() => dispatch(sendRequest(person._id))}>
              <UserPlus size={18} />
              Connect
            </button>
          )}
        />
      </section>

      <section className="panel p-4">
        <h2 className="mb-3 text-lg font-black">My Connections</h2>
        <UserGrid users={connections} empty="Accepted connections will appear here" />
      </section>
    </div>
  );
}

function UserGrid({ users, empty, action }) {
  if (!users?.length) return <p className="text-sm text-slate-500">{empty}</p>;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {users.map((person) => (
        <article className="rounded-md border border-line p-3" key={person._id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-black">{person.name}</h3>
              <p className="text-sm text-slate-500">{person.headline || "Professional"}</p>
              <p className="mt-1 text-xs text-slate-500">{person.skills?.slice(0, 4).join(", ")}</p>
            </div>
            {action?.(person)}
          </div>
        </article>
      ))}
    </div>
  );
}
