"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Trash2, Camera, User as UserIcon } from "lucide-react";

export default function PersonalPortfolioTab({ activeTab, headerData, projects, setProjects, isEditing, currentTheme }) {
  const bookRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let pageFlip = null;
    const init = () => {
      if (typeof window !== 'undefined' && window.StPageFlip && bookRef.current && !pageFlip) {
        const pages = document.querySelectorAll(".page-wrapper");
        if (pages.length > 0) {
          const bookEl = document.getElementById('book');
          if (bookEl) bookEl.style.display = 'block';
          pageFlip = new window.StPageFlip(bookRef.current, {
            width: 450, height: 600, size: "fixed", showCover: true, usePortrait: false, startPage: 0
          });
          pageFlip.loadFromHTML(pages);
          setIsInitialized(true);
          window.dispatchEvent(new Event('resize'));
        }
      }
    };
    
    const timer = setTimeout(init, 1000);
    return () => {
      clearTimeout(timer);
      if (pageFlip) pageFlip.destroy();
    };
  }, [activeTab, projects.length]);

  const handleAddProject = () => {
    const newProject = {
      title: "NEW PROJECT",
      tool: "Software / Role",
      desc: "Project description...",
      year: "2024",
      location: "City, Country",
      image: null
    };
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = (index) => {
    if (window.confirm("Delete this project?")) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="book-container min-h-[750px] flex flex-col items-center pt-12 relative">
      
      {isEditing && (
        <div className="absolute top-0 right-0 z-30 flex gap-2">
          <button 
            onClick={handleAddProject}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus size={18} /> Add Project
          </button>
        </div>
      )}

      <div id="book" ref={bookRef} className={`shadow-2xl ${isInitialized ? 'initialized' : ''}`}>
        {/* COVER PAGE */}
        <div className="page-wrapper" data-density="hard">
          <div className="page-content p-12 flex flex-row items-center relative border-r border-slate-200">
            <div className="absolute left-8 top-12 bottom-12 w-px bg-slate-900 flex flex-col justify-between py-2">
              <span className="portfolio-serif text-[10px] font-bold text-slate-900 absolute -top-4">2024</span>
              <div className="w-2 h-[1px] bg-slate-900" /><div className="w-2 h-[1px] bg-slate-900 absolute bottom-0" />
              <span className="portfolio-serif text-[10px] font-bold text-slate-900 absolute -bottom-4">2019</span>
            </div>
            <div className="flex-1 flex flex-col items-center text-center pl-12">
              <div className="relative mb-6">
                 <div className="absolute -top-4 -right-12 w-48 h-48 bg-blue-500/20 rounded-full z-0" />
                 <div className="relative z-10">
                    <h1 className="portfolio-serif text-7xl font-medium text-slate-900 mb-2">Portfolio</h1>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">{headerData.name}</h2>
                 </div>
                 <div className="absolute top-0 -right-8 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl z-20">
                    {headerData.photo ? <img src={headerData.photo} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon size={48} className="text-slate-200" />}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* INDEX PAGE */}
        <div className="page-wrapper">
          <div className="page-content p-12 text-slate-900">
            <h3 className="text-3xl font-black mb-12 tracking-tighter border-b border-slate-200 pb-4 uppercase">Project Index</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-[9px] font-black text-slate-400 uppercase mb-6 tracking-widest">Selected Works</h4>
                <ul className="space-y-4">
                  {projects.map((p, i) => (
                    <li key={i} className="text-[10px] font-black uppercase flex items-center justify-between group">
                      <span className="truncate mr-2"><span className="text-[8px] text-slate-300 mr-2">{String(i+1).padStart(2, '0')}</span>{p.title}</span>
                      {isEditing && (
                        <button onClick={() => handleDeleteProject(i)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity shrink-0">
                          <Trash2 size={10} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[9px] font-black text-slate-400 uppercase mb-6 tracking-widest">Location / Year</h4>
                <ul className="space-y-4">
                  {projects.map((p, i) => (
                    <li key={i} className="text-[10px] font-bold text-slate-400 uppercase h-4 flex items-center truncate">
                      {p.location} • {p.year}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECT PAGES */}
        {projects.map((project, index) => (
          <div className="page-wrapper" key={index}>
            <div className="page-content p-0 text-slate-900">
              <div className="h-[50%] bg-slate-100 flex items-center justify-center relative overflow-hidden group/img">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-20">
                     <span className="text-[8rem] font-black tracking-tighter leading-none">{project.title.charAt(0)}</span>
                     <span className="text-[10px] font-bold uppercase tracking-widest mt-[-20px]">Visualization Pending</span>
                  </div>
                )}
                
                <div className="absolute top-6 left-6 bg-slate-900 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase z-10">Case 0{index + 1}</div>
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity z-20">
                    <label className="bg-white text-slate-900 px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-xs shadow-xl">
                      <Camera size={14} /> Upload Image
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => updateProject(index, 'image', reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col h-[50%]">
                {isEditing ? (
                  <div className="space-y-3 flex-1">
                    <input 
                      value={project.tool} 
                      onChange={(e) => updateProject(index, 'tool', e.target.value)}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest block bg-transparent border-b border-blue-100 w-full focus:outline-none"
                    />
                    <input 
                      value={project.title} 
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      className="text-2xl font-black tracking-tighter leading-tight uppercase bg-transparent border-b border-slate-100 w-full focus:outline-none"
                    />
                    <textarea 
                      value={project.desc} 
                      onChange={(e) => updateProject(index, 'desc', e.target.value)}
                      className="text-[11px] font-medium text-slate-600 leading-relaxed bg-slate-50/50 border border-slate-100 rounded p-2 w-full focus:outline-none flex-1 resize-none"
                    />
                    <div className="flex gap-4">
                      <input 
                        value={project.year} 
                        onChange={(e) => updateProject(index, 'year', e.target.value)}
                        placeholder="Year"
                        className="text-[9px] font-bold text-slate-400 bg-transparent border-b border-slate-100 focus:outline-none w-16"
                      />
                      <input 
                        value={project.location} 
                        onChange={(e) => updateProject(index, 'location', e.target.value)}
                        placeholder="Location"
                        className="text-[9px] font-bold text-slate-400 bg-transparent border-b border-slate-100 focus:outline-none flex-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">{project.tool}</span>
                    <h3 className="text-3xl font-black tracking-tighter leading-[0.9] uppercase mb-4">{project.title}</h3>
                    <p className="text-[12px] font-medium text-slate-600 leading-relaxed mb-6 flex-1 overflow-auto custom-scrollbar">{project.desc}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{project.location}</span>
                      <span className="text-[9px] font-black text-slate-300">{project.year}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-8 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] items-center no-print opacity-50">
        <ChevronLeft size={16} className="animate-pulse" /> Drag corners to flip <ChevronRight size={16} className="animate-pulse" />
      </div>
    </motion.div>
  );
}
