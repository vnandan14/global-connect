import { Briefcase, Search, Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyJob, createJob, loadJobs } from "../features/socialSlice";

export default function JobsPage() {
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.social);
  const [q, setQ] = useState("");
  const [job, setJob] = useState({ title: "", company: "", location: "", skills: "", description: "" });

  function update(key, value) {
    setJob((current) => ({ ...current, [key]: value }));
  }

  function postJob(event) {
    event.preventDefault();
    dispatch(
      createJob({
        ...job,
        skills: job.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      })
    );
    setJob({ title: "", company: "", location: "", skills: "", description: "" });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <form className="panel h-fit p-4" onSubmit={postJob}>
        <h2 className="mb-3 text-lg font-black">Post a Job</h2>
        <input className="field mb-3" value={job.title} onChange={(e) => update("title", e.target.value)} placeholder="Job title" required />
        <input className="field mb-3" value={job.company} onChange={(e) => update("company", e.target.value)} placeholder="Company" required />
        <input className="field mb-3" value={job.location} onChange={(e) => update("location", e.target.value)} placeholder="Location" />
        <input className="field mb-3" value={job.skills} onChange={(e) => update("skills", e.target.value)} placeholder="Skills: React, Node, MongoDB" />
        <textarea className="field mb-3 min-h-28 resize-none" value={job.description} onChange={(e) => update("description", e.target.value)} placeholder="Job description" required />
        <button className="btn btn-primary w-full">
          <Briefcase size={18} />
          Publish Job
        </button>
      </form>

      <section className="grid gap-4">
        <form className="panel flex gap-2 p-4" onSubmit={(e) => { e.preventDefault(); dispatch(loadJobs(q)); }}>
          <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs by title, company, skill, or location" />
          <button className="btn btn-primary" title="Search jobs">
            <Search size={18} />
          </button>
        </form>

        {jobs.map((item) => (
          <article className="panel p-4" key={item._id}>
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="text-sm font-bold text-slate-600">{item.company} - {item.location}</p>
                <p className="mt-3 leading-7 text-slate-700">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.skills?.map((skill) => (
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600" key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
              <button className="btn btn-soft h-fit" onClick={() => dispatch(applyJob(item._id))}>
                <Send size={18} />
                Apply
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
