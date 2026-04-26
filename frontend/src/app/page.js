"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, User as UserIcon, Users, FileText, Download, 
  Globe, Link, Mail, ArrowRight, CheckCircle2, ChevronRight, 
  ChevronLeft, Plus, Trash2, Edit3, Save, X, Phone, MapPin, 
  Award, GraduationCap, Languages, LayoutGrid, Settings, Lock, 
  Camera, Upload, Calendar, Zap, BookOpen, Palette, Sparkles
} from "lucide-react";

const THEMES = {
  midnight: { name: "Midnight", class: "bg-midnight", color: "blue" },
  emerald: { name: "Emerald", class: "bg-emerald-theme", color: "emerald" },
  deepsea: { name: "Deep Sea", class: "bg-deepsea", color: "cyan" },
  slate: { name: "Dark Slate", class: "bg-slate-theme", color: "slate" },
  light: { name: "Crystal White", class: "bg-light-theme", color: "white" }
};

export default function BIMPortfolio() {
  const [activeTab, setActiveTab] = useState("cv");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("midnight");
  const fileInputRef = useRef(null);

  // Header State
  const [headerData, setHeaderData] = useState({
    name: "Nguyen Thanh Nhan",
    title: "Senior BIM Engineer & Coordinator",
    careerGoals: "Expert in digital construction workflows and BIM automation. Seeking to lead innovative structural engineering projects.",
    photo: null 
  });

  // Projects State
  const [personalProjects, setPersonalProjects] = useState([
    { title: "SONASEA VANDON HARBOR CITY", tool: "Revit / BIM Coordination", desc: "Large-scale hospitality and leisure complex. Structural coordination and clash detection for complex geometries.", year: "2023", location: "Quang Ninh, Vietnam", image: null },
    { title: "TIKTOK OFFICE - HCMC", tool: "Revit / Interior BIM", desc: "High-end interior BIM modeling for a tech giant's regional headquarters. Focused on detail coordination and MEP integration.", year: "2022", location: "Ho Chi Minh City", image: null }
  ]);

  const [teamProjects, setTeamProjects] = useState([]);

  // Secret mode check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") {
      setIsAdmin(true);
    }

    // Load from localStorage if available
    const savedPersonal = localStorage.getItem("personalProjects");
    if (savedPersonal) setPersonalProjects(JSON.parse(savedPersonal));
    
    const savedTeam = localStorage.getItem("teamProjects");
    if (savedTeam) setTeamProjects(JSON.parse(savedTeam));
  }, []);

  useEffect(() => {
    localStorage.setItem("personalProjects", JSON.stringify(personalProjects));
  }, [personalProjects]);

  useEffect(() => {
    localStorage.setItem("teamProjects", JSON.stringify(teamProjects));
  }, [teamProjects]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    setActiveTab("cv");
    
    setTimeout(() => {
      const element = document.querySelector('main');
      if (!element) return;

      const opt = {
        margin: [5, 5, 5, 5],
        filename: `${headerData.name.replace(/\s+/g, '_')}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          allowTaint: false,
          onclone: (clonedDoc) => {
            const el = clonedDoc.querySelector('main');
            if (el) {
              el.style.background = '#020617'; 
              const animatedBg = clonedDoc.querySelector('.bg-animated');
              if (animatedBg) animatedBg.style.backgroundImage = 'none';
              clonedDoc.querySelectorAll('.glass-dark').forEach(item => {
                item.style.backdropFilter = 'none';
                item.style.background = 'rgba(15, 23, 42, 0.8)';
              });
            }
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save()
          .catch(err => {
            console.error("PDF Export failed, falling back to print", err);
            window.print();
          });
      } else {
        window.print();
      }
    }, 800);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 selection:bg-blue-500/30 flex ${activeTab === 'cv' ? 'font-cv' : 'font-portfolio'} ${THEMES[currentTheme].class} ${currentTheme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
      
      {/* VERTICAL SIDEBAR */}
      <aside className={`w-20 md:w-24 border-r flex flex-col items-center py-8 gap-8 fixed h-screen z-50 transition-colors ${currentTheme === 'light' ? 'bg-white/80 border-slate-200 shadow-xl' : 'bg-slate-950/80 border-slate-800'}`}>
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 cursor-pointer">
          <Sparkles className="text-white" size={24} />
        </div>

        <nav className="flex flex-col gap-4">
          {[
            { id: "cv", icon: FileText, label: "CV" },
            { id: "personal", icon: UserIcon, label: "Projects" },
            { id: "team", icon: Users, label: "Team" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                  : currentTheme === 'light' ? "text-slate-400 hover:bg-slate-100 hover:text-slate-900" : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              <tab.icon size={activeTab === tab.id ? 22 : 20} />
              <span className={`text-[10px] mt-1 font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 px-2 py-0.5 rounded pointer-events-none whitespace-nowrap z-50 ${currentTheme === 'light' ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-800 text-white'}`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="sidebarActive"
                  className={`absolute -left-0 w-1 h-8 rounded-r-full ${currentTheme === 'light' ? 'bg-blue-600' : 'bg-white'}`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* THEME SWITCHER */}
        <div className="flex flex-col gap-3 mt-4">
          {Object.keys(THEMES).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => setCurrentTheme(themeKey)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                currentTheme === themeKey ? (currentTheme === 'light' ? "border-blue-600 scale-125" : "border-white scale-125") : "border-transparent opacity-50 hover:opacity-100"
              }`}
              style={{ 
                backgroundColor: themeKey === 'midnight' ? '#0f172a' : 
                                themeKey === 'emerald' ? '#064e3b' : 
                                themeKey === 'deepsea' ? '#164e63' : 
                                themeKey === 'slate' ? '#1e293b' : '#f8fafc'
              }}
              title={THEMES[themeKey].name}
            />
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 pb-4">
          <button onClick={handleExport} className="p-3 text-blue-400 hover:text-white hover:bg-blue-600/10 rounded-xl transition-all" title="Download PDF">
            <Download size={20} />
          </button>

          {isAdmin && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`p-3 rounded-xl transition-all ${isEditing ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-emerald-400 hover:bg-slate-800"}`}
              title={isEditing ? "Save Changes" : "Enter Edit Mode"}
            >
              {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
            </button>
          )}
          
          <button className="p-3 text-slate-500 hover:text-white transition-colors"><Mail size={20} /></button>
          <button className="p-3 text-slate-500 hover:text-white transition-colors"><Globe size={20} /></button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-20 md:ml-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          
          {/* Header Section */}
          <AnimatePresence>
            {activeTab === "cv" && (
              <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-dark rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                {/* Profile Photo */}
                <div className="relative group/photo">
                  <div className={`w-32 h-32 rounded-3xl overflow-hidden bg-slate-800 flex items-center justify-center relative z-10 border border-slate-700 shadow-xl ${isEditing ? 'cursor-pointer hover:border-blue-500 transition-colors' : ''}`} onClick={() => isEditing && fileInputRef.current.click()}>
                    {headerData.photo ? (
                      <img src={headerData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-slate-500">BIM</span>
                    )}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="text-white" size={24} />
                      </div>
                    )}
                  </div>
                  {isEditing && <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />}
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={headerData.name} 
                        onChange={(e) => setHeaderData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-3xl font-bold text-white focus:outline-none focus:border-blue-500"
                      />
                      <input 
                        type="text" 
                        value={headerData.title} 
                        onChange={(e) => setHeaderData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-xl font-medium text-blue-400 focus:outline-none focus:border-blue-500"
                      />
                      <textarea 
                        value={headerData.careerGoals} 
                        onChange={(e) => setHeaderData(prev => ({ ...prev, careerGoals: e.target.value }))}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-400 focus:outline-none focus:border-blue-500 min-h-[80px]"
                        placeholder="Career Goals..."
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-4xl font-bold mb-1">{headerData.name}</h1>
                      <h2 className="text-xl text-gradient font-bold mb-4">{headerData.title}</h2>
                      <p className="text-slate-400 text-sm max-w-2xl italic leading-relaxed border-l-2 border-blue-500/30 pl-4">
                        "{headerData.careerGoals}"
                      </p>
                    </>
                  )}
                </div>
                
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full no-print">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Admin Mode</span>
                  </div>
                )}
              </motion.header>
            )}
          </AnimatePresence>

          {/* Dynamic Content */}
          <div className="min-h-[700px]">
            <AnimatePresence mode="wait">
              {activeTab === "cv" && <CVTab key="cv" isEditing={isEditing} currentTheme={currentTheme} />}
              {activeTab === "personal" && (
                <PersonalPortfolioTab 
                  key="personal" 
                  activeTab={activeTab} 
                  headerData={headerData} 
                  projects={personalProjects} 
                  setProjects={setPersonalProjects}
                  isEditing={isEditing}
                  currentTheme={currentTheme}
                />
              )}
              {activeTab === "team" && (
                <TeamPortfolioTab 
                  key="team" 
                  projects={teamProjects}
                  setProjects={setTeamProjects}
                  isEditing={isEditing}
                  currentTheme={currentTheme}
                />
              )}
            </AnimatePresence>
          </div>

          <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-600 text-sm">
            <p>© 2026 BIM Portfolio Platform • Professional Excellence</p>
          </footer>

        </div>
      </main>
    </div>
  );
}

// --- CV TAB (EDITABLE) ---
function CVTab({ isEditing, currentTheme }) {
  const [data, setData] = useState({
    contact: { email: "nhan.bim@example.com", phone: "+84 123 456 789", location: "Binh Thanh District, HCM City", age: "1994" },
    software: ["Revit", "Dynamo", "Navisworks", "AutoCAD", "Python"],
    skills: ["BIM Coordination", "Visual Programming", "Project Management"],
    education: [{ degree: "Bachelor of Civil Engineering", school: "HCMUT", year: "2019" }],
    certificates: ["Autodesk Certified Professional", "BIM Manager Global Cert"],
    languages: ["Vietnamese (Native)", "English (Professional)"],
    experience: [
      { company: "Global BIM Solutions", time: "2022 - Present", details: "Leading team of 5, clash detection, automation script development." },
      { company: "BuildTech Engineering", time: "2019 - 2022", details: "Structural modeling and shop drawing extraction." }
    ]
  });

  const updateField = (category, value) => setData(prev => ({ ...prev, [category]: value }));
  const updateNestedField = (category, field, value) => {
    setData(prev => ({ ...prev, [category]: { ...prev[category], [field]: value } }));
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Section icon={Phone} title="CONTACT" isEditing={isEditing}>
            <div className="space-y-1.5">
              <ContactLine icon={Phone} label="Phone" value={data.contact.phone} isEditing={isEditing} onChange={(v) => updateNestedField('contact', 'phone', v)} currentTheme={currentTheme} />
              <ContactLine icon={Mail} label="Email" value={data.contact.email} isEditing={isEditing} onChange={(v) => updateNestedField('contact', 'email', v)} currentTheme={currentTheme} />
              <ContactLine icon={MapPin} label="Location" value={data.contact.location} isEditing={isEditing} onChange={(v) => updateNestedField('contact', 'location', v)} currentTheme={currentTheme} />
              <ContactLine icon={Calendar} label="Age" value={data.contact.age} isEditing={isEditing} onChange={(v) => updateNestedField('contact', 'age', v)} currentTheme={currentTheme} />
            </div>
          </Section>
          <Section icon={Zap} title="SKILLS" isEditing={isEditing}>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <h4 className="text-[9px] opacity-60 font-black mb-1.5 tracking-widest uppercase">Tools</h4>
                <EditableList items={data.software} isEditing={isEditing} onChange={(v) => updateField('software', v)} currentTheme={currentTheme} />
              </div>
              <div className="space-y-2">
                <h4 className="text-[9px] opacity-60 font-black mb-1.5 tracking-widest uppercase">Core</h4>
                <EditableList items={data.skills} isEditing={isEditing} onChange={(v) => updateField('skills', v)} currentTheme={currentTheme} />
              </div>
            </div>
          </Section>
          <Section icon={BookOpen} title="CREDENTIALS" isEditing={isEditing}>
            <div className="space-y-3">
              <div>
                <h4 className="text-[9px] opacity-60 font-black mb-1.5 tracking-widest uppercase">Education</h4>
                {data.education.map((e, i) => (
                  <div key={i} className="border-l-2 border-slate-700 pl-3 py-0 mb-1">
                    <EditableField value={e.degree} isEditing={isEditing} onChange={(v) => {
                      const newEdu = [...data.education];
                      newEdu[i].degree = v;
                      updateField('education', newEdu);
                    }} className="font-bold text-[11px] block" currentTheme={currentTheme} />
                    <EditableField value={e.school} isEditing={isEditing} onChange={(v) => {
                      const newEdu = [...data.education];
                      newEdu[i].school = v;
                      updateField('education', newEdu);
                    }} className="text-emerald-500 text-[10px] block" currentTheme={currentTheme} />
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800/50">
                <h4 className="text-[9px] opacity-60 font-black mb-1.5 tracking-widest uppercase">Certificates</h4>
                <EditableList items={data.certificates} isEditing={isEditing} onChange={(v) => updateField('certificates', v)} currentTheme={currentTheme} />
              </div>
            </div>
          </Section>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Section icon={Briefcase} title="WORK EXPERIENCE" isEditing={isEditing} large>
            <div className="space-y-8 relative border-l border-slate-800 pl-8 ml-2">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[2.3rem] top-1.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-slate-950" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                    <EditableField value={exp.company} isEditing={isEditing} onChange={(v) => {
                      const newExp = [...data.experience];
                      newExp[i].company = v;
                      updateField('experience', newExp);
                    }} className="text-2xl font-black block" currentTheme={currentTheme} />
                    <span className="text-xs font-black border px-3 py-1 rounded-full opacity-60">{exp.time}</span>
                  </div>
                  <div className={`mt-4 p-5 rounded-2xl border ${currentTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <p className="opacity-80 text-sm leading-relaxed whitespace-pre-wrap font-medium">{exp.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </motion.div>
  );
}

// --- PORTFOLIO COMPONENTS ---
function PersonalPortfolioTab({ activeTab, headerData, projects, setProjects, isEditing, currentTheme }) {
  const bookRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const projectFileInputRef = useRef(null);
  const [editingIndex, setEditingIndex] = useState(null);

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
    
    // We need to re-init if projects change and we are in the book view
    const timer = setTimeout(init, 1500);
    return () => {
      clearTimeout(timer);
      if (pageFlip) pageFlip.destroy();
    };
  }, [activeTab, projects.length]); // Re-init when project count changes

  const handleAddProject = () => {
    const newProject = {
      title: "NEW PROJECT TITLE",
      tool: "Software / Role",
      desc: "Project description goes here...",
      year: "2024",
      location: "City, Country",
      image: null
    };
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = (index) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
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
                 <div className="absolute -top-4 -right-12 w-48 h-48 bg-orange-400/90 rounded-full z-0" />
                 <div className="relative z-10">
                    <h1 className="portfolio-serif text-8xl font-medium text-slate-900 mb-2">Portfolio</h1>
                    <h2 className="text-xl font-black text-slate-900 uppercase">{headerData.name}</h2>
                 </div>
                 <div className="absolute top-0 -right-8 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl z-20">
                    {headerData.photo ? <img src={headerData.photo} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon size={48} />}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* INDEX PAGE */}
        <div className="page-wrapper">
          <div className="page-content p-12 text-slate-900">
            <h3 className="text-4xl font-black mb-16 tracking-tighter border-b border-slate-200 pb-4 uppercase">Project Index</h3>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-8">Project Name</h4>
                <ul className="space-y-6">
                  {projects.map((p, i) => (
                    <li key={i} className="text-xs font-black uppercase flex items-center justify-between group">
                      <span><span className="text-[8px] text-slate-300 mr-2">0{i+1}</span>{p.title}</span>
                      {isEditing && (
                        <button onClick={() => handleDeleteProject(i)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-8">Location</h4>
                <ul className="space-y-6">
                  {projects.map((p, i) => (
                    <li key={i} className="text-xs font-bold text-slate-400 uppercase h-4 flex items-center">{p.location}</li>
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
              <div className="h-[55%] bg-slate-100 flex items-center justify-center relative overflow-hidden group/img">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10rem] font-black text-white/40 tracking-tighter select-none">{project.title.charAt(0)}</span>
                )}
                
                <div className="absolute top-8 left-8 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase z-10">Case Study 0{index + 1}</div>
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity z-20">
                    <label className="bg-white text-slate-900 px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-xs">
                      <Camera size={16} /> Change Image
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
              <div className="p-10 relative">
                {isEditing ? (
                  <div className="space-y-4">
                    <input 
                      value={project.tool} 
                      onChange={(e) => updateProject(index, 'tool', e.target.value)}
                      className="text-[11px] font-black text-blue-600 uppercase tracking-widest block mb-1 bg-transparent border-b border-blue-200 w-full focus:outline-none"
                    />
                    <input 
                      value={project.title} 
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      className="text-3xl font-black tracking-tighter leading-[0.9] uppercase bg-transparent border-b border-slate-200 w-full focus:outline-none"
                    />
                    <textarea 
                      value={project.desc} 
                      onChange={(e) => updateProject(index, 'desc', e.target.value)}
                      className="text-[13px] font-medium text-slate-600 leading-relaxed bg-transparent border border-slate-100 rounded p-2 w-full focus:outline-none min-h-[100px]"
                    />
                    <div className="flex gap-4">
                      <input 
                        value={project.year} 
                        onChange={(e) => updateProject(index, 'year', e.target.value)}
                        placeholder="Year"
                        className="text-[10px] font-bold text-slate-400 bg-transparent border-b border-slate-200 focus:outline-none"
                      />
                      <input 
                        value={project.location} 
                        onChange={(e) => updateProject(index, 'location', e.target.value)}
                        placeholder="Location"
                        className="text-[10px] font-bold text-slate-400 bg-transparent border-b border-slate-200 focus:outline-none flex-1"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest block mb-4">{project.tool}</span>
                    <h3 className="text-4xl font-black tracking-tighter leading-[0.9] uppercase mb-4">{project.title}</h3>
                    <p className="text-[13px] font-medium text-slate-600 leading-relaxed mb-4">{project.desc}</p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project.location}</span>
                      <span className="text-[10px] font-black text-slate-300">{project.year}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 flex gap-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] items-center no-print">
        <ChevronLeft size={18} className="animate-pulse" /> Drag corners to flip <ChevronRight size={18} className="animate-pulse" />
      </div>
    </motion.div>
  );
}

function TeamPortfolioTab({ projects, setProjects, isEditing, currentTheme }) {
  const isLight = currentTheme === 'light';
  
  const handleAddProject = () => {
    const newProject = {
      title: "Collaborative BIM Coordination",
      team: "Structural Team A",
      role: "Lead Coordinator",
      desc: "Full-scale coordination for a 40-story residential tower.",
      impact: "Reduced clashes by 85% before construction phase.",
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
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tighter uppercase">Team Portfolio</h2>
          <p className="text-slate-400 font-medium max-w-lg">Showcase of collaborative excellence and high-impact team achievements.</p>
        </div>
        {isEditing && (
          <button 
            onClick={handleAddProject}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-600/20 transition-all font-bold"
          >
            <Plus size={20} /> Add Team Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className={`p-20 rounded-[3rem] text-center border-2 border-dashed ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-500">
            <Users size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">No Team Projects Yet</h3>
          <p className="text-slate-400">Click the button above to showcase your collaborative work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              layout
              className={`glass-dark rounded-[2.5rem] overflow-hidden border group relative card-hover ${isLight ? 'bg-white border-slate-200' : 'border-slate-800/50'}`}
            >
              <div className="h-64 bg-slate-800 relative overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 opacity-50">
                    <LayoutGrid size={48} className="text-slate-700 mb-4" />
                    <span className="text-slate-700 font-black uppercase tracking-widest text-[10px]">Project Visualization</span>
                  </div>
                )}
                
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg">{project.team}</div>
                </div>

                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <label className="p-3 bg-white text-slate-900 rounded-full cursor-pointer hover:scale-110 transition-transform">
                      <Camera size={20} />
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
                      <Trash2 size={20} />
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
                      className="text-2xl font-black uppercase bg-transparent border-b border-slate-700 w-full focus:outline-none"
                    />
                    <div className="flex gap-4">
                      <input 
                        value={project.team} 
                        onChange={(e) => updateProject(index, 'team', e.target.value)}
                        placeholder="Team Name"
                        className="text-xs font-bold text-blue-500 bg-transparent border-b border-slate-700 focus:outline-none flex-1"
                      />
                      <input 
                        value={project.role} 
                        onChange={(e) => updateProject(index, 'role', e.target.value)}
                        placeholder="Your Role"
                        className="text-xs font-bold text-emerald-500 bg-transparent border-b border-slate-700 focus:outline-none flex-1"
                      />
                    </div>
                    <textarea 
                      value={project.desc} 
                      onChange={(e) => updateProject(index, 'desc', e.target.value)}
                      className="text-sm text-slate-400 bg-transparent border border-slate-800 rounded-xl p-3 w-full focus:outline-none min-h-[80px]"
                    />
                    <input 
                      value={project.impact} 
                      onChange={(e) => updateProject(index, 'impact', e.target.value)}
                      placeholder="Impact / Key Achievement"
                      className="text-xs italic text-blue-400 bg-transparent border-b border-slate-700 w-full focus:outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black uppercase leading-none">{project.title}</h3>
                      <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[10px] font-bold border border-emerald-500/20 uppercase">{project.role}</div>
                    </div>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2">{project.desc}</p>
                    <div className={`p-4 rounded-2xl flex items-start gap-3 ${isLight ? 'bg-blue-50' : 'bg-blue-500/5 border border-blue-500/10'}`}>
                      <Sparkles size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-bold text-blue-400 leading-tight uppercase tracking-wide">Key Impact: {project.impact}</p>
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

// --- HELPERS ---
function Section({ icon: Icon, title, children, isEditing, large }) {
  return (
    <div className={`glass-dark rounded-3xl overflow-hidden border transition-all duration-500 ${large ? 'p-8' : 'p-6'} border-slate-800/50`}>
      <h3 className="text-lg font-black mb-6 flex items-center gap-4 tracking-tighter uppercase">
        <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 shadow-sm"><Icon size={18} className="text-blue-500" /></div>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ContactLine({ icon: Icon, value, isEditing, onChange, label, currentTheme }) {
  const isLight = currentTheme === 'light';
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/30 border-slate-700/50'}`}>
        <Icon size={14} className={isLight ? 'text-slate-600' : 'text-slate-400'} />
      </div>
      <div className="flex-1">
        {isEditing ? (
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`border rounded-lg px-2 py-0.5 text-xs w-full ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-300'}`} />
        ) : (
          <span className="text-[12px] font-medium truncate block">{value}</span>
        )}
      </div>
    </div>
  );
}

function EditableField({ value, isEditing, onChange, className, label, currentTheme }) {
  const isLight = currentTheme === 'light';
  if (!isEditing) return <span className={className}>{value}</span>;
  return (
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`border rounded-lg px-2 py-1 text-xs ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-300'} ${className}`} />
  );
}

function EditableList({ items, isEditing, onChange, currentTheme }) {
  const isLight = currentTheme === 'light';
  const addItem = () => onChange([...items, "New Item"]);
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));
  const updateItem = (i, v) => {
    const newItems = [...items];
    newItems[i] = v;
    onChange(newItems);
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-1 h-1 bg-blue-600 rounded-full" />
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <input type="text" value={item} onChange={(e) => updateItem(i, e.target.value)} className={`flex-1 border rounded-lg px-2 py-0.5 text-[10px] ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-300'}`} />
              <button onClick={() => removeItem(i)} className="p-1 text-red-500 no-print"><Trash2 size={12} /></button>
            </div>
          ) : (
            <span className="text-[12px] font-medium opacity-80">{item}</span>
          )}
        </div>
      ))}
      {isEditing && <button onClick={addItem} className="text-[8px] text-blue-500 font-black uppercase mt-2"><Plus size={10} /> Add Entry</button>}
    </div>
  );
}
