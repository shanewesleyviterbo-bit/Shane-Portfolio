import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import {
  Terminal, Cpu, Database, Network, FolderKanban,
  Plus, X, ExternalLink, Layers, CheckCircle, Command, Sparkles
} from 'lucide-react';

const SHANE_DEFAULT_WORKS = [
  {
    id: 1,
    title: 'Automated Campus Resource & Reservation Portal',
    category: 'Web_App',
    tools: 'PHP • MySQL • Tailwind CSS',
    description: 'End-to-end transaction and inventory tracking platform built to streamline student requests and administrative reporting.',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 2,
    title: 'Multi-Branch OSPF & VLAN Enterprise Topology',
    category: 'Infrastructure',
    tools: 'Cisco Packet Tracer • CLI',
    description: 'Configured dynamic routing, DHCP snooping, and inter-VLAN security policies across simulated campus departments.',
    image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 3,
    title: 'RESTful API & Relational Schema Engine',
    category: 'Backend',
    tools: 'Node.js • Express • SQLite',
    description: 'Structured backend service handling authentication tokens, normalized relational tables, and JSON data endpoints.',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function App() {
  const [works, setWorks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [formError, setFormError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const [newEntry, setNewEntry] = useState({
    title: '',
    category: 'Web_App',
    tools: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    loadPortfolioData();
  }, []);

  async function loadPortfolioData() {
    setLoading(true);

    if (!supabase) {
      setWorks(SHANE_DEFAULT_WORKS);
      setConnectionStatus('offline');
      setConnectionError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWorks(data?.length ? data : SHANE_DEFAULT_WORKS);
      setConnectionStatus('connected');
      setConnectionError('');
    } catch (error) {
      setWorks(SHANE_DEFAULT_WORKS);
      setConnectionStatus('offline');
      setConnectionError(error instanceof Error ? error.message : 'Could not load projects from Supabase.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProject(e) {
    e.preventDefault();
    if (!supabase) {
      setFormError('Supabase is not configured. Add the required VITE_SUPABASE_* values to .env.');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      const { error } = await supabase.from('portfolio_items').insert([newEntry]);
      if (error) throw error;
      setShowAddForm(false);
      setNewEntry({ title: '', category: 'Web_App', tools: '', description: '', image_url: '' });
      await loadPortfolioData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not save this project to Supabase.');
    } finally {
      setSaving(false);
    }
  }

  const displayedWorks = selectedCategory === 'All'
    ? works
    : works.filter((w) => w.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black flex flex-col lg:flex-row">
      
      {/* LEFT FIXED SIDEBAR (COMPLETELY DIFFERENT LAYOUT STRUCTURE) */}
      <aside className="lg:w-80 xl:w-96 lg:h-screen lg:sticky lg:top-0 bg-[#111114] border-b lg:border-b-0 lg:border-r border-zinc-800/80 p-8 flex flex-col justify-between z-30">
        <div className="space-y-8">
          {/* BADGE & INITIALS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-black font-black flex items-center justify-center text-base shadow-lg shadow-amber-500/20">
                SWV
              </div>
              <div>
                <span className="block text-xs font-mono text-amber-400 uppercase tracking-wider">
                  System_Architect
                </span>
                <span className="text-[11px] font-mono text-zinc-500">ID: BSIT-3B-SMP</span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border ${
              connectionStatus === 'connected'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                connectionStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              {connectionStatus === 'connecting' ? 'CONNECTING' : connectionStatus.toUpperCase()}
            </span>
          </div>

          {/* NAME & BIO */}
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Shane Wesley <br />
              <span className="text-amber-500">B. Viterbo</span>
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Information Technology specialist focused on backend logic, database engineering, and resilient network infrastructure.
            </p>
          </div>

          {/* SIDEBAR NAVIGATION LINKS */}
          <nav className="hidden lg:flex flex-col space-y-2 pt-2 font-mono text-xs">
            <a href="#overview" className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-zinc-900/90 text-amber-400 border border-zinc-800">
              <span>01 // Overview_Bento</span>
              <span>&rarr;</span>
            </a>
            <a href="#deployments" className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-white transition">
              <span>02 // Project_Deployments</span>
              <span>&rarr;</span>
            </a>
          </nav>

          {/* CORE COMPETENCIES PILLS */}
          <div className="space-y-2.5 pt-2">
            <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
              Technical_Arsenal
            </p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['React.js', 'PHP / Laravel', 'MySQL', 'Supabase', 'Cisco Routing', 'Linux CLI', 'Git'].map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTON IN SIDEBAR */}
        <div className="pt-8 mt-8 border-t border-zinc-800/80 space-y-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <Plus className="w-4 h-4" /> Push_New_Project
          </button>
          <p className="text-[11px] font-mono text-center text-zinc-500">
            {connectionStatus === 'connected' ? 'Supabase connected' : 'Using local sample projects'}
          </p>
          {connectionError && (
            <p role="status" className="text-[11px] font-mono text-amber-400 text-center">
              {connectionError}
            </p>
          )}
        </div>
      </aside>

      {/* RIGHT MAIN SCROLLABLE WORKSPACE */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 max-w-6xl mx-auto w-full space-y-14">
        
        {/* BENTO METRICS & SYSTEM OVERVIEW */}
        <section id="overview" className="space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs text-amber-500 uppercase tracking-widest">
            <Command className="w-4 h-4" />
            <span>Workspace_Telemetry</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#131317] border border-zinc-800/90 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 mb-4">
                <span className="font-mono text-xs">PRIMARY_FOCUS</span>
                <Database className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Systems &amp; Databases</p>
                <p className="text-xs text-zinc-400 mt-1">Full-stack CRUD &amp; SQL architecture</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#131317] border border-zinc-800/90 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 mb-4">
                <span className="font-mono text-xs">NETWORK_LABS</span>
                <Network className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Routing &amp; Security</p>
                <p className="text-xs text-zinc-400 mt-1">VLANs, ACLs, Packet Analysis</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/15 to-[#131317] border border-amber-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-400 mb-4">
                <span className="font-mono text-xs">DB_RECORDS</span>
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{works.length} Active</p>
                <p className="text-xs text-amber-200/70 mt-1">
                  {connectionStatus === 'connected' ? 'Supabase PostgreSQL' : 'Sample projects (not synced)'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HORIZONTAL PROJECT FEED (DIFFERENT FROM 3-COLUMN CARDS) */}
        <section id="deployments" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-2xl font-bold text-white">Deployed Systems &amp; Labs</h2>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Click any build entry to inspect technical documentation &amp; preview
              </p>
            </div>

            {/* FILTER PILLS */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {[
                { id: 'All', label: 'All' },
                { id: 'Web_App', label: 'Web Apps' },
                { id: 'Infrastructure', label: 'Networking' },
                { id: 'Backend', label: 'Backend/API' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* LIST OF HORIZONTAL PROJECT ROWS */}
          {loading ? (
            <div className="p-12 rounded-xl bg-[#131317] border border-zinc-800 text-center font-mono text-xs text-zinc-400">
              INITIALIZING_DATA_STREAM...
            </div>
          ) : (
            <div className="space-y-4">
              {displayedWorks.map((project, idx) => (
                <div
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  className="group cursor-pointer rounded-xl bg-[#131317] border border-zinc-800/90 hover:border-amber-500/70 p-4 sm:p-5 transition flex flex-col md:flex-row gap-6 items-center"
                >
                  {/* THUMBNAIL */}
                  <div className="w-full md:w-64 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-800">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {project.category}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">
                        BUILD_#0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition flex items-center justify-between">
                      <span>{project.title}</span>
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 shrink-0" />
                    </h3>

                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between font-mono text-xs text-zinc-300">
                      <span className="text-zinc-500">
                        Environment: <strong className="text-zinc-300 font-normal">{project.tools}</strong>
                      </span>
                      <span className="text-amber-500 group-hover:translate-x-1 transition-transform">
                        Inspect &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* INSPECTOR MODAL */}
      {activeProject && (
        <div
          onClick={() => setActiveProject(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131317] border border-amber-500/50 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl"
          >
            <div className="bg-black aspect-video max-h-[50vh] w-full flex items-center justify-center border-b border-zinc-800">
              <img
                src={activeProject.image_url}
                alt={activeProject.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-amber-500 text-black font-bold">
                  {activeProject.category}
                </span>
                <button
                  onClick={() => setActiveProject(null)}
                  className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-white">{activeProject.title}</h3>
              <p className="text-xs font-mono text-amber-400">
                STACK_USED // {activeProject.tools}
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {activeProject.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PROJECT MODAL */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131317] border border-zinc-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
              <h3 className="font-mono text-sm font-bold text-amber-400 uppercase">
                + Add_Deployment_Record
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-sm">
              <div>
                <label className="block font-mono text-xs text-zinc-400 mb-1">Project Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Campus Reservation System"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1">Domain / Category</label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                    className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Web_App">Web App</option>
                    <option value="Infrastructure">Networking</option>
                    <option value="Backend">Backend / API</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1">Tech Stack</label>
                  <input
                    required
                    type="text"
                    placeholder="PHP, MySQL, React"
                    value={newEntry.tools}
                    onChange={(e) => setNewEntry({ ...newEntry, tools: e.target.value })}
                    className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-zinc-400 mb-1">Preview Image URL</label>
                <input
                  required
                  type="url"
                  placeholder="https://..."
                  value={newEntry.image_url}
                  onChange={(e) => setNewEntry({ ...newEntry, image_url: e.target.value })}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-zinc-400 mb-1">Technical Summary</label>
                <textarea
                  rows="3"
                  placeholder="Describe system modules, database design, or network setup..."
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-white focus:border-amber-500 outline-none"
                />
              </div>

              {formError && (
                <p role="alert" className="text-xs text-red-400">{formError}</p>
              )}

              <button
                disabled={saving}
                type="submit"
                className="w-full rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold uppercase text-xs py-3.5 transition cursor-pointer"
              >
                {saving ? 'Writing to Database...' : 'Save Project Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}