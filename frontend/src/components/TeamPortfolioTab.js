"use client";

import { motion } from "framer-motion";
import { Plus, Trash2, Camera, Users, LayoutGrid, Sparkles } from "lucide-react";

export default function TeamPortfolioTab({ projects, setProjects, isEditing, currentTheme }) {
  const isLight = currentTheme === 'light';
  
  const handleAddProject = () => {
    const newProject = {
      title: "COLLABORATIVE BIM PROJECT",
      team: "Team Name",
      role: "Lead Coordinator",
      desc: "Brief description of the collaboration and scope.",
      impact: "Measurable achievement (e.g., Reduced clashes by 80%).",
      image: null
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const removeProject = (index) => {
    if (window.confirm("Remove this team project?")) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className={`space-y-8 ${isLight ? 'font-body' : 'font-sans'}`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div className="space-y-2">
          <h2 className={`text-4xl font-black tracking-tighter uppercase leading-none ${isLight ? 'font-serif' : ''}`}>Team Portfolio</h2>
          <p className="text-slate-400 font-medium max-w-lg text-sm">Showcase of collaborative excellence and high-impact structural engineering achievements.</p>
        </div>
        {isEditing && (
          <button 
            onClick={handleAddProject}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-600/20 transition-all font-bold text-sm"
          >
            <Plus size={18} /> Add Team Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className={`p-20 rounded-[3rem] text-center border-2 border-dashed ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/30 border-slate-800'}`}>
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-bold mb-2">No Team Projects Listed</h3>
          <p className="text-slate-400 text-sm">Click the button above to showcase your collaborative coordination work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              layout
              className={`glass-dark rounded-[2.5rem] overflow-hidden border group relative card-hover ${isLight ? 'bg-white border-slate-200 shadow-lg' : 'border-slate-800/50'}`}
            >
              <div className="h-56 bg-slate-800 relative overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 opacity-50">
                    <LayoutGrid size={40} className="text-slate-700 mb-2" />
                    <span className="text-slate-700 font-black uppercase tracking-widest text-[8px]">Visualization Pending</span>
                  </div>
                )}
                
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-lg">{project.team}</div>
                </div>

                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <label className="p-3 bg-white text-slate-900 rounded-full cursor-pointer hover:scale-110 transition-transform">
                      <Camera size={18} />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => updateProject(index, 'image', reader.result);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                    <button onClick={() => removeProject(index)} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8">
                {isEditing ? (
                  <div className="space-y-4">
                    <input 
                      value={project.title} 
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      className="text-xl font-black uppercase bg-transparent border-b border-slate-700 w-full focus:outline-none"
                    />
                    <div className="flex gap-4">
                      <input 
                        value={project.team} 
                        onChange={(e) => updateProject(index, 'team', e.target.value)}
                        placeholder="Team Name"
                        className="text-[10px] font-bold text-blue-500 bg-transparent border-b border-slate-700 focus:outline-none flex-1"
                      />
                      <input 
                        value={project.role} 
                        onChange={(e) => updateProject(index, 'role', e.target.value)}
                        placeholder="Your Role"
                        className="text-[10px] font-bold text-emerald-500 bg-transparent border-b border-slate-700 focus:outline-none flex-1"
                      />
                    </div>
                    <textarea 
                      value={project.desc} 
                      onChange={(e) => updateProject(index, 'desc', e.target.value)}
                      className="text-xs text-slate-400 bg-transparent border border-slate-800 rounded-xl p-3 w-full focus:outline-none min-h-[80px]"
                    />
                    <input 
                      value={project.impact} 
                      onChange={(e) => updateProject(index, 'impact', e.target.value)}
                      placeholder="Key Impact / Achievement"
                      className="text-[10px] italic text-blue-400 bg-transparent border-b border-slate-700 w-full focus:outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h3 className="text-xl font-black uppercase leading-tight">{project.title}</h3>
                      <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[9px] font-bold border border-emerald-500/20 uppercase whitespace-nowrap">{project.role}</div>
                    </div>
                    <p className="text-slate-400 text-xs mb-6 leading-relaxed line-clamp-2">{project.desc}</p>
                    <div className={`p-4 rounded-2xl flex items-start gap-3 ${isLight ? 'bg-blue-50' : 'bg-blue-500/5 border border-blue-500/10'}`}>
                      <Sparkles size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className={`text-[10px] font-bold leading-tight uppercase tracking-wide ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>Key Impact: {project.impact}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
