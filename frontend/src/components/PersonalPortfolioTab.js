"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Trash2, Camera, User as UserIcon, 
  ChevronRight, ChevronLeft, Image as ImageIcon,
  MapPin, Calendar, Info, Layers, X
} from "lucide-react";

export default function PersonalPortfolioTab({ headerData, setHeaderData, projects, setProjects, isEditing, currentTheme }) {
  const scrollRef = useRef(null);

  const [selectedIndices, setSelectedIndices] = useState([]);

  const toggleSelect = (e, index) => {
    e.stopPropagation();
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleDeleteSelected = () => {
    console.log("Attempting to delete indices:", selectedIndices);
    const newProjects = projects.filter((_, index) => !selectedIndices.includes(index));
    console.log("Old projects count:", projects.length, "New count:", newProjects.length);
    setProjects(newProjects);
    setSelectedIndices([]);
  };

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

  const themeClass = currentTheme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white';
  const glassClass = currentTheme === 'light' ? 'bg-white/40 backdrop-blur-md' : 'bg-slate-950/40 backdrop-blur-md';

  return (
    <div className={`fixed top-0 bottom-0 right-0 left-[80px] md:left-[96px] z-0 overflow-hidden font-sans flex flex-col transition-all duration-700 ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
       {/* THEME BACKGROUND OVERLAY */}
       <div className={`absolute inset-0 z-[-1] opacity-100 transition-all duration-700 ${currentTheme === 'midnight' ? 'bg-midnight' : currentTheme === 'emerald' ? 'bg-emerald-theme' : currentTheme === 'deepsea' ? 'bg-deepsea' : currentTheme === 'slate' ? 'bg-slate-theme' : 'bg-light-theme'}`} />
      {/* Navigation Controls (Moved to Bottom Right Pill) */}
      <div className={`absolute bottom-10 right-10 z-50 flex items-center p-1.5 rounded-[2rem] border shadow-2xl transition-all duration-500 ${currentTheme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-slate-950/80 border-slate-800'} backdrop-blur-md`}>
        <button onClick={() => scroll('left')} className={`p-4 rounded-full transition-all active:scale-95 ${currentTheme === 'light' ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-white'}`}>
          <ChevronLeft size={24} />
        </button>
        <div className={`w-[1px] h-8 mx-2 ${currentTheme === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}></div>
        <button onClick={() => scroll('right')} className={`p-4 rounded-full transition-all active:scale-95 ${currentTheme === 'light' ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-white'}`}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto h-full snap-x snap-mandatory hide-scrollbar w-full"
      >
        
        {/* 1. COVER PAGE */}
        <div className="w-full h-full snap-start flex-shrink-0 flex items-center justify-center p-12 md:p-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e293b,transparent)] opacity-50" />
           <div className="relative z-10 text-center lg:text-left flex-1 max-w-5xl space-y-10">
              <div className="space-y-4">
                <h1 className={`text-8xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Portfolio<span className="text-blue-600">.</span></h1>
                <div className="flex flex-col gap-2">
                  {isEditing ? (
                    <>
                      <input value={headerData.name} onChange={(e) => setHeaderData({...headerData, name: e.target.value})} className={`text-4xl md:text-6xl font-bold uppercase tracking-widest bg-transparent border-b border-slate-800 focus:outline-none w-full ${currentTheme === 'light' ? 'text-slate-800' : 'text-slate-200'}`} />
                      <input value={headerData.title} onChange={(e) => setHeaderData({...headerData, title: e.target.value})} className="text-slate-500 font-bold uppercase tracking-[0.4em] text-lg bg-transparent border-b border-slate-800 focus:outline-none w-full" />
                    </>
                  ) : (
                    <>
                      <h2 className={`text-4xl md:text-6xl font-bold uppercase tracking-widest ${currentTheme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{headerData.name}</h2>
                      <p className={`font-bold uppercase tracking-[0.4em] text-lg ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-500'}`}>{headerData.title}</p>
                    </>
                  )}
                </div>
              </div>
           </div>
           <div className="relative z-10 hidden lg:block group ml-20">
              <div className="w-[28rem] h-[28rem] rounded-[4rem] overflow-hidden border-[12px] border-slate-900 shadow-2xl relative bg-slate-900">
                 {headerData.photo ? (
                    <img 
                      src={headerData.photo} 
                      className="w-full h-full object-cover transition-all" 
                      style={{ objectPosition: `50% ${headerData.photoPosition !== undefined ? headerData.photoPosition : 50}%` }}
                    />
                 ) : (
                    <UserIcon size={120} className="text-slate-800 m-auto h-full" />
                 )}
                 
                 {isEditing && (
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity backdrop-blur-sm gap-8">
                      {/* Upload Button */}
                      <label className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform mt-6">
                        <Camera size={40} className="text-white mb-3" />
                        <span className="text-white font-black uppercase text-xs tracking-widest bg-blue-600 px-4 py-2 rounded-full shadow-lg">Change Photo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setHeaderData({...headerData, photo: reader.result, photoPosition: 50});
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>

                      {/* Position Slider */}
                      {headerData.photo && (
                        <div className="flex flex-col items-center gap-3 w-3/4 bg-slate-900/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest opacity-80">Vertical Align</span>
                          <input 
                            type="range" 
                            min="0" max="100" 
                            value={headerData.photoPosition !== undefined ? headerData.photoPosition : 50} 
                            onChange={(e) => setHeaderData({...headerData, photoPosition: e.target.value})}
                            className="w-full accent-blue-500 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* 2. PROJECT INDEX */}
        <div className={`w-full h-full snap-start flex-shrink-0 p-12 md:p-24 flex flex-col lg:flex-row ${currentTheme === 'light' ? 'bg-white/20' : 'bg-transparent'}`}>
            {/* LARGE VERTICAL TEXT */}
            <div className="hidden lg:flex w-32 shrink-0 relative items-center justify-center z-10 overflow-hidden">
               <h2 className={`text-[8rem] font-black tracking-tighter uppercase -rotate-90 whitespace-nowrap select-none ${currentTheme === 'light' ? 'text-slate-300' : 'text-slate-800/40'}`}>
                 Project
               </h2>
            </div>
            
            {/* TIMELINE COLUMN */}
            <div className={`hidden lg:flex w-24 flex-col items-center justify-between py-[4.5rem] shrink-0 z-10 ${currentTheme === 'light' ? 'text-slate-900' : 'text-slate-300'}`}>
               {isEditing ? (
                  <input value={headerData.timelineStart || '2026'} onChange={(e) => setHeaderData({...headerData, timelineStart: e.target.value})} className="text-2xl font-black bg-transparent w-16 text-center focus:outline-none" />
               ) : (
                  <span className="text-2xl font-black">{headerData.timelineStart || '2026'}</span>
               )}
               <div className={`flex-1 w-[1px] my-4 ${currentTheme === 'light' ? 'bg-slate-400' : 'bg-slate-700'}`}></div>
               {isEditing ? (
                  <input value={headerData.timelineEnd || '2019'} onChange={(e) => setHeaderData({...headerData, timelineEnd: e.target.value})} className="text-2xl font-black bg-transparent w-16 text-center focus:outline-none" />
               ) : (
                  <span className="text-2xl font-black">{headerData.timelineEnd || '2019'}</span>
               )}
            </div>
            <div className="flex-1 lg:pl-20 pr-10 overflow-y-auto hide-scrollbar space-y-16">
              {/* STICKY HEADER */}
              <div className={`sticky top-4 z-30 pt-10 pb-8 border border-r-0 transition-all duration-500 rounded-l-[3rem] px-10 -mr-10 pr-20 mb-8 ${currentTheme === 'light' ? 'bg-[#f5f2ed]/80 border-slate-300' : 'bg-slate-950/95 border-slate-900'} backdrop-blur-md shadow-xl`}>
                 <div className="flex justify-between items-end">
                     <h3 className={`text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Experience</h3>
                    {isEditing && (
                      <div className="flex gap-4">
                        {selectedIndices.length > 0 && (
                          <button onClick={handleDeleteSelected} className="bg-red-600/20 text-red-500 border border-red-500/30 px-6 py-4 rounded-xl font-black text-xs uppercase shadow-xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
                            <Trash2 size={16} /> Delete ({selectedIndices.length})
                          </button>
                        )}
                        <button onClick={handleAddProject} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase shadow-xl mr-4 hover:scale-105 transition-transform active:scale-95">Add Project</button>
                      </div>
                    )}
                 </div>
              </div>

              <div className="w-full">
                 {/* Header Row */}
                 <div className="mb-6 px-4">
                    <span className="text-lg font-black text-blue-500 uppercase opacity-70">Project Directory</span>
                 </div>

                 {/* 2-Column Grid */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
                 {projects.map((project, index) => (
                    <div 
                      key={index} 
                      onClick={() => scrollRef.current.scrollTo({ left: (index + 2) * scrollRef.current.clientWidth, behavior: 'smooth' })} 
                      className={`group flex items-center justify-between py-3 px-5 rounded-[1.5rem] border transition-all cursor-pointer ${selectedIndices.includes(index) ? 'bg-red-500/10 border-red-500/30' : 'hover:bg-blue-600/10 border-transparent hover:border-blue-500/20 bg-slate-900/5'}`}
                    >
                       <div className="flex items-center gap-4 overflow-hidden">
                          {isEditing && (
                            <div 
                              onClick={(e) => toggleSelect(e, index)}
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${selectedIndices.includes(index) ? 'bg-red-500 border-red-500 text-white' : 'border-slate-700 bg-slate-900 hover:border-red-500/50'}`}
                            >
                              {selectedIndices.includes(index) && <X size={12} />}
                            </div>
                          )}
                          <span className="text-xs font-black text-slate-400 italic group-hover:text-blue-500 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                          <div className="flex flex-col overflow-hidden min-w-0">
                             <span className={`text-lg md:text-xl font-black uppercase tracking-tight transition-colors truncate ${currentTheme === 'light' ? 'text-slate-800 group-hover:text-blue-600' : 'text-slate-300 group-hover:text-white'}`}>{project.title}</span>
                             <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest truncate ${currentTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{project.location}</span>
                          </div>
                       </div>
                       
                       {/* Arrow */}
                       <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-500 transition-all shrink-0 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 ml-2" />
                    </div>
                 ))}
                 </div>
              </div>
           </div>
        </div>

        {/* 3. PROJECT DETAIL PAGES - COMPACT SINGLE PAGE DESIGN */}
        {projects.map((project, index) => (
          <div key={index} className="w-full h-full snap-start flex-shrink-0 flex flex-col overflow-hidden relative">
            
            {/* Header Section (Flexible Height) */}
            <div className={`min-h-[160px] w-full px-12 md:px-24 flex items-center justify-between border-b transition-colors duration-500 shrink-0 ${currentTheme === 'light' ? 'bg-[#f5f2ed]/60 border-slate-300' : 'bg-slate-950/40 border-slate-900'} backdrop-blur-sm`}>
               <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black italic text-3xl shadow-xl shadow-blue-600/30 shrink-0">{String(index + 1).padStart(2, '0')}</div>
                  <div className="flex flex-col gap-1">

                      <div className={`px-10 py-6 rounded-3xl border shadow-2xl transition-all duration-500 ${currentTheme === 'light' ? 'bg-[#f5f2ed] border-slate-300' : 'bg-slate-950/95 border-slate-900'}`}>
                         {isEditing ? (
                            <input value={project.title} onChange={(e) => updateProject(index, 'title', e.target.value)} className={`text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight bg-transparent focus:outline-none w-full ${currentTheme === 'light' ? 'text-slate-900' : 'text-slate-300'}`} />
                         ) : (
                            <h3 className={`text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight max-w-5xl ${currentTheme === 'light' ? 'text-slate-900' : 'text-slate-300'}`}>{project.title}</h3>
                         )}
                      </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-12">
                   {/* QUICK RETURN TO INDEX */}
                   <button 
                      onClick={() => scrollRef.current.scrollTo({ left: scrollRef.current.clientWidth, behavior: 'smooth' })}
                      className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group shadow-xl shrink-0"
                   >
                      <Layers size={14} className="group-hover:rotate-12 transition-transform" />
                      Back to Index
                   </button>

                   <div className="flex gap-8 shrink-0">
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
            </div>

            {/* Content Section (80% Height) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
               
               {/* Left Side: Description + Competencies (25% Width) */}
               <div className="w-full md:w-[25%] flex flex-col p-10 border-r border-slate-900 bg-slate-950/20 overflow-y-auto hide-scrollbar shrink-0">
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border font-black uppercase tracking-widest text-[11px] shadow-sm transition-colors ${currentTheme === 'light' ? 'bg-[#f5f2ed] border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                           <Info size={16} className="text-blue-600"/> Project Narrative
                        </div>
                        {isEditing ? (
                          <textarea value={project.desc} onChange={(e) => updateProject(index, 'desc', e.target.value)} className="w-full bg-slate-900/30 border border-slate-800 rounded-3xl p-6 text-sm text-slate-400 focus:outline-none min-h-[300px] leading-relaxed" />
                        ) : (
                          <p className="text-slate-400 text-xl leading-relaxed font-medium">{project.desc}</p>
                        )}
                     </div>

                     <div className="pt-10 border-t border-slate-900/50 space-y-6">
                        <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border font-black uppercase tracking-widest text-[11px] shadow-sm transition-colors ${currentTheme === 'light' ? 'bg-[#f5f2ed] border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                           <Layers size={16} className="text-blue-600"/> Coordination Scope
                        </div>
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

               {/* Right Side: 5-Image Grid (75% Width) */}
               <div className="w-full md:w-[75%] flex flex-col p-8 md:p-12 gap-8 overflow-hidden bg-slate-900/10">
                  
                  {/* 5-Image Grid System */}
                  <div className="grid grid-cols-3 grid-rows-2 gap-6 flex-1 min-h-0">
                     {/* 1. Large Vertical Image (Left) */}
                     <div className={`row-span-2 rounded-[2.5rem] overflow-hidden border transition-all duration-500 relative group ${project.image ? 'bg-slate-900' : (currentTheme === 'light' ? 'bg-black/5 border-slate-300 border-dashed' : 'bg-slate-900/40 border-slate-800')} shadow-2xl`}>
                        {project.image ? (
                           <img src={project.image} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center opacity-20"><ImageIcon size={48} /></div>
                        )}
                        {isEditing && (
                           <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm">
                              <Plus className="text-white mb-2" size={32} />
                              <span className="text-[10px] font-bold text-white uppercase">Main View</span>
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

                      {/* 2-5. Grid Images (Right) */}
                      {[0, 1, 2, 3].map(gi => (
                          <div key={gi} className={`rounded-[2rem] overflow-hidden border transition-all duration-500 relative group ${project.gallery && project.gallery[gi] ? 'bg-slate-900' : (currentTheme === 'light' ? 'bg-black/5 border-slate-300 border-dashed' : 'bg-slate-900/40 border-slate-800')} shadow-xl`}>
                            {project.gallery && project.gallery[gi] ? (
                               <img src={project.gallery[gi]} className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center opacity-10"><ImageIcon size={32} /></div>
                            )}
                            {isEditing && (
                               <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm">
                                  <Plus className="text-white mb-1" size={24} />
                                  <span className="text-[8px] font-bold text-white uppercase">Add Image</span>
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                     const file = e.target.files[0];
                                     if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                           const newGallery = [...(project.gallery || [])];
                                           newGallery[gi] = reader.result;
                                           updateProject(index, 'gallery', newGallery);
                                        };
                                        reader.readAsDataURL(file);
                                     }
                                  }} />
                               </label>
                            )}
                         </div>
                      ))}
                   </div>
                </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
