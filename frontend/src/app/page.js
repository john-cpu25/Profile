"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, User as UserIcon, Users, FileText, Download, 
  Globe, Mail, Camera, Save, Edit3, Sparkles, LogIn, LogOut, Loader2
} from "lucide-react";

// Components
import CVTab from "@/components/CVTab";
import PersonalPortfolioTab from "@/components/PersonalPortfolioTab";
import TeamPortfolioTab from "@/components/TeamPortfolioTab";
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { profileApi, projectApi } from "@/lib/api";

const THEMES = {
  midnight: { name: "Midnight", class: "bg-midnight", color: "blue" },
  emerald: { name: "Emerald", class: "bg-emerald-theme", color: "emerald" },
  deepsea: { name: "Deep Sea", class: "bg-deepsea", color: "cyan" },
  slate: { name: "Dark Slate", class: "bg-slate-theme", color: "slate" },
  light: { name: "Crystal White", class: "bg-light-theme", color: "white" }
};

const INITIAL_PROJECTS = [
  { title: "SONASEA VANDON HARBOR CITY", tool: "Revit / BIM Coordination", desc: "Large-scale hospitality complex. Team leader coordinates the team. Perform 3d Rebar model. Coordinate structural conflict testing.", year: "2022", location: "Quang Ninh, Vietnam", image: null },
  { title: "SYDNEY METRO CITY & SOUTHWEST", tool: "Revit / 3D Rebar", desc: "Major infrastructure project in Australia. Team leader coordinates the team. Perform 3d Rebar model and shopdrawing. Coordinate structural conflict testing.", year: "2020", location: "Australia", image: null },
  { title: "THE KING'S SCHOOL, VATTANACVILLE", tool: "Revit / Structure", desc: "Educational facility. Participate in building the model structure. Coordinate structural conflict testing.", year: "2022", location: "Cambodia", image: null },
  { title: "RINGWOOD-BEDFORD ROAD BRIDGE", tool: "Revit / Rebar Modeling", desc: "Infrastructure project. Team leader coordinates the team. Perform 3d Rebar model. Coordinate structural conflict testing.", year: "2023", location: "Australia", image: null },
  { title: "TIKTOK OFFICE - HCMC", tool: "Revit / Interior BIM", desc: "High-end interior BIM modeling. Focused on detail coordination and MEP integration. MEP model & Point cloud.", year: "2022", location: "Ho Chi Minh City", image: null },
  { title: "MINH LONG VILLA", tool: "Revit / Technical Design", desc: "Luxury residential project. Team leader coordinates the team. Participate in technical design and drawings.", year: "2024", location: "Binh Duong, Vietnam", image: null },
  { title: "LEGO FACTORY", tool: "BIM Coordination / MEP", desc: "Large industrial facility. Model Fire protection & HVAC. Coordinate & Clash test.", year: "2023", location: "Binh Duong, Vietnam", image: null },
  { title: "HONGKONG INTERNATIONAL AIRPORT", tool: "As-built BIM / Point Cloud", desc: "Airport expansion. Team leader. Models Asbuilt for Arc - Str. Point cloud processing.", year: "2021", location: "Hong Kong", image: null }
];

const INITIAL_CV_DATA = {
  contact: { email: "nguyenthanhnhan2508@gmail.com", phone: "(+84) 0347.510.779", location: "Q.Binh Thanh, HCM", age: "1994" },
  software: ["Revit Structure", "Revit Architecture", "Dynamo", "Navisworks", "Etabs", "Sap", "Safe", "Autocad", "Recap", "CSI Detail"],
  skills: ["BIM Coordination", "3D Rebar Modeling", "Clash Detection", "Structural Design", "Automation"],
  education: [{ degree: "Kỹ sư xây dựng (Structural Engineer)", school: "Đại học Kiến Trúc TP.HCM", year: "2019", major: "Xây dựng dân dụng và công nghiệp" }],
  certificates: ["Autodesk Certified Professional", "BIM Manager Global Cert"],
  languages: ["Vietnamese (Native)", "English (TOEIC 450)"],
  experience: [
    { company: "IBIM CO.,LTD", time: "2019 - PRESENT", role: "Senior BIM Engineer & Coordinator", details: "Leading team coordinates the team. Participate in technical design and drawings. Perform 3d Rebar model and shodrawing. Coordinate structural conflict testing. Projects: Sydney Metro, Sonasea Van Don, King's School, etc." },
    { company: "ATLAS INDUSTRIES", time: "2018 - 2019", role: "Structural Engineer (Outsource)", details: "Participate in building the model structure. Report structural calculation. Check computing model with architecture." }
  ]
};

export default function BIMPortfolio() {
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("cv");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("midnight");
  const [syncing, setSyncing] = useState(false);
  const fileInputRef = useRef(null);

  // Central State
  const [headerData, setHeaderData] = useState({
    name: "Nguyen Thanh Nhan",
    title: "Senior BIM Engineer & Coordinator",
    careerGoals: "Apply experience and actively learn specialized knowledge and professional skills to contribute to further development of the company. Expert in digital construction workflows and BIM automation.",
    photo: null 
  });
  const [cvData, setCvData] = useState(INITIAL_CV_DATA);
  const [personalProjects, setPersonalProjects] = useState(INITIAL_PROJECTS);
  const [teamProjects, setTeamProjects] = useState([]);

  // Load data from API or LocalStorage
  useEffect(() => {
    if (user) {
      loadDataFromApi();
    } else {
      loadDataFromLocalStorage();
    }
  }, [user]);

  const loadDataFromApi = async () => {
    try {
      const profile = await profileApi.getMe();
      if (profile) {
        setHeaderData({
          name: user.full_name || "Nguyen Thanh Nhan",
          title: profile.title || "Senior BIM Engineer & Coordinator",
          careerGoals: profile.career_goals || INITIAL_CV_DATA.careerGoals,
          photo: profile.photo
        });
        setCvData({
          contact: { 
            email: profile.email || INITIAL_CV_DATA.contact.email, 
            phone: profile.phone || INITIAL_CV_DATA.contact.phone, 
            location: profile.location || INITIAL_CV_DATA.contact.location, 
            age: profile.age || INITIAL_CV_DATA.contact.age 
          },
          software: JSON.parse(profile.software || "[]"),
          skills: JSON.parse(profile.skills || "[]"),
          education: JSON.parse(profile.education || "[]"),
          experience: JSON.parse(profile.experience || "[]"),
          languages: JSON.parse(profile.languages || "[]"),
          certificates: JSON.parse(profile.certificates || "[]")
        });
      }

      const projects = await projectApi.getProjects();
      if (projects && projects.length > 0) {
        setPersonalProjects(projects.filter(p => !p.is_team_project).map(mapProjectFromApi));
        setTeamProjects(projects.filter(p => p.is_team_project).map(mapProjectFromApi));
      }
    } catch (err) {
      console.error("Failed to load from API", err);
      loadDataFromLocalStorage();
    }
  };

  const loadDataFromLocalStorage = () => {
    const savedPersonal = localStorage.getItem("personalProjects");
    if (savedPersonal) setPersonalProjects(JSON.parse(savedPersonal));
    const savedTeam = localStorage.getItem("teamProjects");
    if (savedTeam) setTeamProjects(JSON.parse(savedTeam));
    const savedHeader = localStorage.getItem("headerData");
    if (savedHeader) setHeaderData(JSON.parse(savedHeader));
    const savedCv = localStorage.getItem("cvData");
    if (savedCv) setCvData(JSON.parse(savedCv));
  };

  const mapProjectFromApi = (p) => ({
    title: p.title,
    tool: p.tools_used,
    desc: p.description,
    year: p.timeline,
    location: p.scope,
    image: p.media?.[0]?.file_url || null
  });

  const handleSave = async () => {
    if (!user) {
      localStorage.setItem("personalProjects", JSON.stringify(personalProjects));
      localStorage.setItem("teamProjects", JSON.stringify(teamProjects));
      localStorage.setItem("headerData", JSON.stringify(headerData));
      localStorage.setItem("cvData", JSON.stringify(cvData));
      setIsEditing(false);
      alert("Saved locally! Login to sync with the cloud.");
      return;
    }

    setSyncing(true);
    try {
      await profileApi.updateMe({
        title: headerData.title,
        phone: cvData.contact.phone,
        email: cvData.contact.email,
        location: cvData.contact.location,
        age: cvData.contact.age,
        career_goals: headerData.careerGoals,
        photo: headerData.photo,
        software: JSON.stringify(cvData.software),
        skills: JSON.stringify(cvData.skills),
        education: JSON.stringify(cvData.education),
        experience: JSON.stringify(cvData.experience),
        languages: JSON.stringify(cvData.languages),
        certificates: JSON.stringify(cvData.certificates)
      });
      
      // Note: Full project sync logic would involve complex diffing. 
      // For now, we just save the profile.
      setIsEditing(false);
    } catch (err) {
      console.error("Sync failed", err);
      alert("Failed to sync with cloud. Changes saved locally.");
    }
    setSyncing(false);
  };

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
      if (!element || !window.html2pdf) {
        window.print();
        return;
      }
      const opt = {
        margin: [5, 5, 5, 5],
        filename: `${headerData.name.replace(/\s+/g, '_')}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().set(opt).from(element).save();
    }, 500);
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className={`min-h-screen transition-all duration-500 selection:bg-blue-500/30 flex ${activeTab === 'cv' ? 'font-cv' : 'font-portfolio'} ${THEMES[currentTheme].class} ${currentTheme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* SIDEBAR */}
      <aside className={`w-20 md:w-24 border-r flex flex-col items-center py-8 gap-8 fixed h-screen z-50 transition-colors ${currentTheme === 'light' ? 'bg-white/80 border-slate-200 shadow-xl' : 'bg-slate-950/80 border-slate-800 backdrop-blur-md'}`}>
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
          <Sparkles className="text-white" size={24} />
        </div>

        <nav className="flex flex-col gap-4">
          {[
            { id: "cv", icon: FileText, label: "CV" },
            { id: "personal", icon: UserIcon, label: "Works" },
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
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-3 mt-4">
          {Object.keys(THEMES).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => setCurrentTheme(themeKey)}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                currentTheme === themeKey ? (currentTheme === 'light' ? "border-blue-600 scale-125" : "border-white scale-125") : "border-transparent opacity-40 hover:opacity-100"
              }`}
              style={{ backgroundColor: themeKey === 'midnight' ? '#0f172a' : themeKey === 'emerald' ? '#064e3b' : themeKey === 'deepsea' ? '#164e63' : themeKey === 'slate' ? '#1e293b' : '#f8fafc' }}
            />
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 pb-4">
          <button onClick={handleExport} className="p-3 text-slate-500 hover:text-blue-500 transition-all" title="Download PDF"><Download size={20} /></button>

          {user ? (
            <>
              <button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className={`p-3 rounded-xl transition-all ${isEditing ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-slate-500 hover:text-emerald-400 hover:bg-slate-800"}`}
                disabled={syncing}
              >
                {syncing ? <Loader2 className="animate-spin" size={20} /> : (isEditing ? <Save size={20} /> : <Edit3 size={20} />)}
              </button>
              <button onClick={logout} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Logout"><LogOut size={20} /></button>
            </>
          ) : (
             <button onClick={() => setIsLoginOpen(true)} className="p-3 text-slate-500 hover:text-blue-500 transition-all" title="Admin Login"><LogIn size={20} /></button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-20 md:ml-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          
          <AnimatePresence>
            {activeTab === "cv" && (
              <motion.header 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="glass-dark rounded-[2.5rem] p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl border-slate-800/50"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative group/photo">
                  <div className={`w-36 h-36 md:w-44 md:h-44 rounded-[2rem] overflow-hidden bg-slate-800 flex items-center justify-center relative z-10 border-2 border-slate-700/50 shadow-2xl ${isEditing ? 'cursor-pointer hover:border-blue-500 transition-all' : ''}`} onClick={() => isEditing && fileInputRef.current.click()}>
                    {headerData.photo ? <img src={headerData.photo} alt="Profile" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center"><span className="text-4xl font-black text-slate-600">BIM</span></div>}
                    {isEditing && <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity"><Camera className="text-white" size={32} /></div>}
                  </div>
                  {isEditing && <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />}
                </div>

                <div className="flex-1 text-center md:text-left z-10 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input value={headerData.name} onChange={(e) => setHeaderData(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-3 text-4xl font-black text-white focus:outline-none focus:border-blue-500" />
                      <input value={headerData.title} onChange={(e) => setHeaderData(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-3 text-xl font-bold text-blue-400 focus:outline-none focus:border-blue-500" />
                      <textarea value={headerData.careerGoals} onChange={(e) => setHeaderData(prev => ({ ...prev, careerGoals: e.target.value }))} className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-3 text-sm text-slate-400 focus:outline-none focus:border-blue-500 min-h-[100px] resize-none" />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">{headerData.name}</h1>
                      <h2 className="text-xl md:text-2xl text-gradient font-black uppercase tracking-widest">{headerData.title}</h2>
                      <p className="text-slate-400 text-sm md:text-base max-w-3xl italic leading-relaxed pl-6 border-l-2 border-blue-500/30">"{headerData.careerGoals}"</p>
                    </>
                  )}
                </div>
                {user && <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full no-print"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Logged In as {user.username}</span></div>}
              </motion.header>
            )}
          </AnimatePresence>

          <div className="min-h-[700px]">
            <AnimatePresence mode="wait">
              {activeTab === "cv" && <CVTab key="cv" isEditing={isEditing} currentTheme={currentTheme} data={cvData} updateField={(cat, val) => setCvData(prev => ({ ...prev, [cat]: val }))} />}
              {activeTab === "personal" && <PersonalPortfolioTab key="personal" activeTab={activeTab} headerData={headerData} projects={personalProjects} setProjects={setPersonalProjects} isEditing={isEditing} currentTheme={currentTheme} />}
              {activeTab === "team" && <TeamPortfolioTab key="team" projects={teamProjects} setProjects={setTeamProjects} isEditing={isEditing} currentTheme={currentTheme} />}
            </AnimatePresence>
          </div>

          <footer className="mt-20 pt-10 border-t border-slate-800/50 text-center space-y-2">
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">BIM Portfolio Platform • Professional Excellence</p>
            <p className="text-slate-700 text-[9px] font-medium uppercase tracking-widest">© 2026 Developed for Nguyen Thanh Nhan</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
