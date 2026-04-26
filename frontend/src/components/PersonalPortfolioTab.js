"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Trash2, Camera, User as UserIcon, 
  ChevronRight, ChevronLeft, Image as ImageIcon,
  MapPin, Calendar, Info, Layers, X
} from "lucide-react";

export default function PersonalPortfolioTab({ headerData, setHeaderData, projects, setProjects, isEditing }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleAddProject = () => {
    const newProject = {
      title: "NEW BIM PROJECT",
      tool: "Software / Role",
      desc: "Detailed description of your contribution...",
      year: "2024",
      location: "Location",
      image: null,
      gallery: []
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const addImageToGallery = (index, base64) => {
    const newProjects = [...projects];
    if (!newProjects[index].gallery) newProjects[index].gallery = [];
    newProjects[index].gallery.push(base64);
    setProjects(newProjects);
  };

  const removeImageFromGallery = (projectIndex, imageIndex) => {
    const newProjects = [...projects];
    newProjects[projectIndex].gallery.splice(imageIndex, 1);
    setProjects(newProjects);
  };

  return (
    <div className="fixed inset-0 left-[80px] z-0 overflow-hidden bg-slate-950 text-white font-sans">
      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-50">
        <button onClick={() => scroll('left')} className="p-4 bg-slate-900/90 border border-slate-800 rounded-full hover:bg-blue-600 transition-all shadow-2xl active:scale-90">
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-50">
        <button onClick={() => scroll('right')} className="p-4 bg-slate-900/90 border border-slate-800 rounded-full hover:bg-blue-600 transition-all shadow-2xl active:scale-90">
          <ChevronRight size={24} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto h-full snap-x snap-mandatory hide-scrollbar w-full"
      >
        
        {/* 1. COVER PAGE */}
        <div className="min-w-full h-full snap-start flex-shrink-0 flex items-center justify-center p-12 md:p-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e293b,transparent)] opacity-50" />
           <div className="relative z-10 text-center lg:text-left flex-1 max-w-5xl space-y-10">
              <div className="space-y-4">
                <h1 className="text-9xl md:text-[14rem] font-black uppercase tracking-tighter leading-[0.7] text-white">Portfolio<span className="text-blue-600">.</span></h1>
                <div className="flex flex-col gap-2">
                  {isEditing ? (
                    <>
                      <input value={headerData.name} onChange={(e) => setHeaderData({...headerData, name: e.target.value})} className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-slate-200 bg-transparent border-b border-slate-800 focus:outline-none w-full" />
                      <input value={headerData.title} onChange={(e) => setHeaderData({...headerData, title: e.target.value})} className="text-slate-500 font-bold uppercase tracking-[0.4em] text-lg bg-transparent border-b border-slate-800 focus:outline-none w-full" />
                    </>
                  ) : (
                    <>
                      <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-slate-200">{headerData.name}</h2>
                      <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-lg">{headerData.title}</p>
                    </>
                  )}
                </div>
              </div>
              <button onClick={() => scroll('right')} className="px-12 py-5 bg-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all">Explore Works</button>
           </div>
           <div className="relative z-10 hidden lg:block group">
              <div className="w-[35rem] h-[35rem] rounded-[5rem] overflow-hidden border-[12px] border-slate-900 shadow-2xl relative bg-slate-900">
                 {headerData.photo ? <img src={headerData.photo} className="w-full h-full object-cover" /> : <UserIcon size={120} className="text-slate-800 m-auto h-full" />}
                 {isEditing && (
                    <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm">
                      <Camera size={48} className="text-white mb-4" />
                      <span className="text-white font-black uppercase text-xs tracking-widest">Change Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setHeaderData({...headerData, photo: reader.result});
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                 )}
              </div>
           </div>
        </div>

        {/* 2. PROJECT INDEX */}
        <div className="min-w-full h-full snap-start flex-shrink-0 bg-slate-950 p-12 md:p-24 flex flex-col lg:flex-row">
           <div className="hidden lg:flex flex-col justify-between py-12 pr-20 border-r border-slate-900 select-none">
              <h3 className="text-[140px] font-black uppercase leading-[0.7] opacity-5 tracking-tighter [writing-mode:vertical-lr] rotate-180">Summary</h3>
           </div>
           <div className="flex-1 lg:pl-20 overflow-y-auto hide-scrollbar space-y-16">
              <div className="flex justify-between items-end border-b border-slate-900 pb-12">
                 <h3 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none">Experience</h3>
                 {isEditing && (
                   <button onClick={handleAddProject} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase shadow-xl">Add Project</button>
                 )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                 <div className="space-y-6">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] block mb-8 opacity-50">Project Directory</span>
                    {projects.map((project, index) => (
                      <div key={index} onClick={() => scrollRef.current.scrollTo({ left: (index + 2) * scrollRef.current.clientWidth, behavior: 'smooth' })} className="group flex items-center justify-between p-6 rounded-3xl hover:bg-blue-600/10 border border-transparent hover:border-blue-500/20 transition-all cursor-pointer">
                         <div className="flex items-center gap-6">
                            <span className="text-xs font-black text-slate-700 italic group-hover:text-blue-500">{String(index + 1).padStart(2, '0')}</span>
                            <span className="text-2xl font-black uppercase tracking-tight text-slate-300 group-hover:text-white transition-colors">{project.title}</span>
                         </div>
                         <ChevronRight size={20} className="text-slate-800 group-hover:text-blue-500 transition-all" />
                      </div>
                    ))}
                 </div>
                 <div className="space-y-6 hidden md:block opacity-40">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] block mb-8">Location</span>
                    {projects.map((project, index) => (
                      <div key={index} className="p-6 flex items-center h-[5.5rem]">
                         <span className="text-base font-bold uppercase tracking-widest">{project.location}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* 3. PROJECT DETAIL PAGES - COMPACT SINGLE PAGE DESIGN */}
        {projects.map((project, index) => (
          <div key={index} className="min-w-full h-full snap-start flex-shrink-0 bg-slate-950 flex flex-col overflow-hidden">
            
            {/* Header Section (20% Height) */}
            <div className="h-[20%] w-full px-12 md:px-24 flex items-center justify-between border-b border-slate-900 bg-slate-950/50 backdrop-blur-sm shrink-0">
               <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black italic text-3xl shadow-xl shadow-blue-600/30 shrink-0">{String(index + 1).padStart(2, '0')}</div>
                  <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Role:</span>
                        {isEditing ? (
                           <input value={project.tool} onChange={(e) => updateProject(index, 'tool', e.target.value)} className="bg-transparent text-sm font-bold text-white uppercase focus:outline-none border-b border-slate-800" />
                        ) : (
                           <span className="text-sm font-bold text-white uppercase">{project.tool}</span>
                        )}
                     </div>
                     {isEditing ? (
                        <input value={project.title} onChange={(e) => updateProject(index, 'title', e.target.value)} className="text-4xl font-black uppercase tracking-tighter bg-transparent border-b border-slate-800 focus:outline-none w-[500px]" />
                     ) : (
                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white truncate max-w-4xl">{project.title}</h3>
                     )}
                  </div>
               </div>
               <div className="flex gap-8">
                  <div className="flex flex-col items-end">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Location</span>
                     <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                        <MapPin size={14} className="text-blue-500" />
                        {isEditing ? <input value={project.location} onChange={(e) => updateProject(index, 'location', e.target.value)} className="bg-transparent border-b border-slate-800 w-32 focus:outline-none" /> : project.location}
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Year</span>
                     <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                        <Calendar size={14} className="text-blue-500" />
                        {isEditing ? <input value={project.year} onChange={(e) => updateProject(index, 'year', e.target.value)} className="bg-transparent border-b border-slate-800 w-20 focus:outline-none" /> : project.year}
                     </div>
                  </div>
               </div>
            </div>

            {/* Content Section (80% Height) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
               
               {/* Left Side: Description + Competencies (40% Width) */}
               <div className="w-full md:w-[40%] flex flex-col p-12 md:p-20 border-r border-slate-900 bg-slate-950/20 overflow-y-auto hide-scrollbar shrink-0">
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] opacity-50"><Info size={16} className="text-blue-500"/> Project Narrative</div>
                        {isEditing ? (
                          <textarea value={project.desc} onChange={(e) => updateProject(index, 'desc', e.target.value)} className="w-full bg-slate-900/30 border border-slate-800 rounded-3xl p-6 text-sm text-slate-400 focus:outline-none min-h-[300px] leading-relaxed" />
                        ) : (
                          <p className="text-slate-400 text-xl leading-relaxed font-medium">{project.desc}</p>
                        )}
                     </div>

                     <div className="pt-10 border-t border-slate-900/50 space-y-6">
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] opacity-50"><Layers size={16} className="text-blue-500"/> Coordination Scope</div>
                        <div className="flex flex-wrap gap-2">
                           {["BIM COORDINATION", "STRUCTURAL MODELING", "CLASH DETECTION", "SHOP DRAWING"].map(tag => (
                              <span key={tag} className="text-[10px] font-bold text-slate-500 border border-slate-800 px-4 py-2 rounded-full uppercase tracking-tighter bg-slate-900/20">{tag}</span>
                           ))}
                        </div>
                     </div>

                     {isEditing && (
                        <button onClick={() => confirm("Delete project?") && setProjects(projects.filter((_, i) => i !== index))} className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 px-6 py-3 rounded-xl transition-all">
                           <Trash2 size={14} /> Remove Project
                        </button>
                     )}
                  </div>
               </div>

               {/* Right Side: Main Image + Gallery (60% Width) */}
               <div className="w-full md:w-[60%] flex flex-col p-8 md:p-12 gap-8 overflow-hidden bg-slate-900/10">
                  
                  {/* Main Render Area (Large) */}
                  <div className="flex-[3] relative bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl group shrink-0">
                     {project.image ? (
                        <img src={project.image} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
                           <ImageIcon size={80} />
                           <span className="text-[10px] font-black uppercase tracking-widest mt-4">Cinematic Project Visualization</span>
                        </div>
                     )}
                     {isEditing && (
                        <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all backdrop-blur-sm">
                           <Camera size={48} className="text-white mb-4" />
                           <span className="text-white font-black uppercase text-[10px] tracking-widest">Update Render</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                             const file = e.target.files[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => updateProject(index, 'image', reader.result);
                               reader.readAsDataURL(file);
                             }
                           }} />
                        </label>
                     )}
                  </div>

                  {/* Gallery Grid Area (Compact) */}
                  <div className="flex-1 flex flex-col gap-4 min-h-[150px] overflow-hidden shrink-0">
                     <div className="flex justify-between items-center px-4">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Integrated Gallery ({project.gallery?.length || 0})</span>
                     </div>
                     <div className="flex-1 overflow-y-auto hide-scrollbar px-2">
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pb-4">
                           {(project.gallery || []).map((img, imgIdx) => (
                             <div key={imgIdx} className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 group">
                               <img src={img} className="w-full h-full object-cover" />
                               {isEditing && (
                                 <button onClick={() => removeImageFromGallery(index, imgIdx)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                   <X size={10} />
                                 </button>
                               )}
                             </div>
                           ))}
                           {isEditing && (
                             <label className="aspect-video border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                               <Plus className="text-slate-700 group-hover:text-blue-500" size={20} />
                               <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                                  const files = Array.from(e.target.files);
                                  files.forEach(file => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => addImageToGallery(index, reader.result);
                                    reader.readAsDataURL(file);
                                  });
                               }} />
                             </label>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
