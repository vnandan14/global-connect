import { Save } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: user.name || "",
    headline: user.headline || "",
    location: user.location || "",
    bio: user.bio || "",
    skills: user.skills?.join(", ") || ""
  });

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    dispatch(updateProfile({ ...form, skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean) }));
  }

  return (
    <form className="panel p-4" onSubmit={submit}>
      <h2 className="mb-4 text-xl font-black">Edit Profile</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-bold">
          Name
          <input className="field mt-1" value={form.name} onChange={(e) => update("name", e.target.value)} />
        </label>
        <label className="text-sm font-bold">
          Headline
          <input className="field mt-1" value={form.headline} onChange={(e) => update("headline", e.target.value)} />
        </label>
        <label className="text-sm font-bold">
          Location
          <input className="field mt-1" value={form.location} onChange={(e) => update("location", e.target.value)} />
        </label>
        <label className="text-sm font-bold">
          Skills
          <input className="field mt-1" value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="React, Node, MongoDB" />
        </label>
      </div>
      <label className="mt-3 block text-sm font-bold">
        Bio
        <textarea className="field mt-1 min-h-32 resize-none" value={form.bio} onChange={(e) => update("bio", e.target.value)} />
      </label>
      <button className="btn btn-primary mt-4">
        <Save size={18} />
        Save Profile
      </button>
    </form>
  );
}
