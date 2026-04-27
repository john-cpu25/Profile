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
  { title: "SONASEA VANDON HARBOR CITY", tool: "Revit / BIM Coordination", desc: "Large-scale hospitality complex. Team leader coordinates the team. Perform 3d Rebar model. Coordinate structural conflict testing.", year: "2022", location: "Quang Ninh, Vietnam", image: null, gallery: [] },
  { title: "SYDNEY METRO CITY & SOUTHWEST", tool: "Revit / 3D Rebar", desc: "Major infrastructure project in Australia. Team leader coordinates the team. Perform 3d Rebar model and shopdrawing. Coordinate structural conflict testing.", year: "2020", location: "Australia", image: null, gallery: [] },
  { title: "THE KING'S SCHOOL, VATTANACVILLE", tool: "Revit / Structure", desc: "Educational facility. Participate in building the model structure. Coordinate structural conflict testing.", year: "2022", location: "Cambodia", image: null, gallery: [] },
  { title: "RINGWOOD-BEDFORD ROAD BRIDGE", tool: "Revit / Rebar Modeling", desc: "Infrastructure project. Team leader coordinates the team. Perform 3d Rebar model. Coordinate structural conflict testing.", year: "2023", location: "Australia", image: null, gallery: [] },
  { title: "TIKTOK OFFICE - HCMC", tool: "Revit / Interior BIM", desc: "High-end interior BIM modeling. Focused on detail coordination and MEP integration. MEP model & Point cloud.", year: "2022", location: "Ho Chi Minh City", image: null, gallery: [] },
  { title: "MINH LONG VILLA", tool: "Revit / Technical Design", desc: "Luxury residential project. Team leader coordinates the team. Participate in technical design and drawings.", year: "2024", location: "Binh Duong, Vietnam", image: null, gallery: [] },
  { title: "LEGO FACTORY", tool: "BIM Coordination / MEP", desc: "Large industrial facility. Model Fire protection & HVAC. Coordinate & Clash test.", year: "2023", location: "Binh Duong, Vietnam", image: null, gallery: [] },
  { title: "HONGKONG INTERNATIONAL AIRPORT", tool: "As-built BIM / Point Cloud", desc: "Airport expansion. Team leader. Models Asbuilt for Arc - Str. Point cloud processing.", year: "2021", location: "Hong Kong", image: null, gallery: [] }
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
  const [isExporting, setIsExporting] = useState(false);
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
        const newHeaderData = {
          name: user.full_name || "Nguyen Thanh Nhan",
          title: profile.title || "Senior BIM Engineer & Coordinator",
          careerGoals: profile.career_goals || INITIAL_CV_DATA.careerGoals,
          photo: profile.photo
        };
        setHeaderData(newHeaderData);
        localStorage.setItem("headerData", JSON.stringify(newHeaderData));

        const newCvData = {
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
        };
        setCvData(newCvData);
        localStorage.setItem("cvData", JSON.stringify(newCvData));
      }

      const projects = await projectApi.getProjects();
      if (projects && projects.length > 0) {
        const pProjects = projects.filter(p => !p.is_team_project).map(mapProjectFromApi);
        const tProjects = projects.filter(p => p.is_team_project).map(mapProjectFromApi);
        setPersonalProjects(pProjects);
        setTeamProjects(tProjects);
        localStorage.setItem("personalProjects", JSON.stringify(pProjects));
        localStorage.setItem("teamProjects", JSON.stringify(tProjects));
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
    // ALWAYS save to local storage so the public (logged out) view is updated instantly on this browser
    localStorage.setItem("personalProjects", JSON.stringify(personalProjects));
    localStorage.setItem("teamProjects", JSON.stringify(teamProjects));
    localStorage.setItem("headerData", JSON.stringify(headerData));
    localStorage.setItem("cvData", JSON.stringify(cvData));

    if (!user) {
      setIsEditing(false);
      alert("Saved locally! Login to sync with the cloud.");
      return;
    }

    setSyncing(true);
    try {
      // 1. Save Profile
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
      
      // 2. Save Projects (Simple strategy: delete and recreate for now)
      // Note: In a real app, we'd use IDs and PUT/DELETE. 
      // For this BIM portfolio, we'll recreate to ensure everything matches the UI perfectly.
      const allProjects = [
        ...personalProjects.map(p => ({ ...p, is_team_project: false })),
        ...teamProjects.map(p => ({ ...p, is_team_project: true }))
      ];

      for (const p of allProjects) {
        await projectApi.createProject({
          title: p.title,
          role: p.role || p.tool, // Map tool to role if role is missing
          scope: p.location,
          tools_used: p.tool,
          timeline: p.year,
          description: p.desc,
          is_team_project: p.is_team_project
        });
      }

      setIsEditing(false);
      alert("Successfully synced with cloud!");
    } catch (err) {
      console.error("Sync failed", err);
      alert("Failed to sync with cloud. Check backend logs.");
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

  /**
   * Giải pháp "System-Level Interception": Đánh chặn toàn bộ yêu cầu lấy style của trình duyệt
   * Đảm bảo html2canvas không bao giờ nhìn thấy mã màu oklch/oklab
   */
  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    // Lưu lại hàm gốc để khôi phục sau
    const originalGetPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;

    try {
      const element = document.getElementById('cv-content');
      if (!element) throw new Error('Không tìm thấy nội dung CV');

      // Helper: Convert màu sắc sang RGB (Dùng Canvas để trình duyệt tự giải mã)
      const toRgb = (color) => {
        if (!color || color === 'transparent' || color === 'none') return color;
        if (color.includes('gradient') || color.includes('url')) return color;
        try {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
          return a === 255 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${(a/255).toFixed(2)})`;
        } catch (e) { return color; }
      };

      // --- BƯỚC 1: ĐÁNH CHẶN HỆ THỐNG ---
      // Ghi đè prototype để trả về RGB cho bất kỳ yêu cầu nào chứa oklch/oklab
      CSSStyleDeclaration.prototype.getPropertyValue = function(prop) {
        const val = originalGetPropertyValue.call(this, prop);
        if (typeof val === 'string' && (val.includes('oklch') || val.includes('lab') || val.includes('oklab'))) {
          return val.replace(/(oklch|lab|oklab)\([^)]+\)/g, (match) => toRgb(match));
        }
        return val;
      };

      // --- BƯỚC 2: CHUẨN BỊ BẢN CLONE VỚI STYLE INLINE ---
      const clone = element.cloneNode(true);
      
      // Danh sách các thuộc tính Layout & Hiển thị quan trọng
      const propsToCapture = [
        'display', 'position', 'flex-direction', 'align-items', 'justify-content',
        'width', 'height', 'padding', 'margin', 'font-size', 'font-weight', 'font-family',
        'line-height', 'text-align', 'border-radius', 'background-color', 'color',
        'border-width', 'border-style', 'border-color', 'fill', 'stroke', 'gap'
      ];

      const allElements = [clone, ...clone.querySelectorAll('*')];
      allElements.forEach(el => {
        if (el.nodeType !== 1) return;
        
        const cs = window.getComputedStyle(el);
        const inlineStyles = {};
        
        propsToCapture.forEach(prop => {
          // getPropertyValue lúc này đã được chúng ta patch ở trên
          inlineStyles[prop] = cs.getPropertyValue(prop);
        });

        // Áp dụng inline style và xóa sạch Class/ID để cô lập hoàn toàn
        el.removeAttribute('class');
        Object.keys(inlineStyles).forEach(key => {
          el.style.setProperty(key, inlineStyles[key], 'important');
        });

        // Xử lý background-image (gradients)
        const bgImg = cs.getPropertyValue('background-image');
        if (bgImg && bgImg !== 'none') {
           el.style.setProperty('background-image', bgImg, 'important');
        }

        // Loại bỏ các hiệu ứng không tương thích
        el.style.setProperty('backdrop-filter', 'none', 'important');
        el.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
        el.style.setProperty('box-shadow', 'none', 'important');
        el.style.setProperty('animation', 'none', 'important');
        el.style.setProperty('transition', 'none', 'important');
      });

      // --- BƯỚC 3: CÁCH LY TUYỆT ĐỐI (PURGE CSS) ---
      const container = document.createElement('div');
      container.style.cssText = 'position: absolute; left: -9999px; top: 0; width: 210mm; background: white;';
      
      // Xóa bỏ các nút bấm và thành phần rác
      clone.querySelectorAll('.no-print, button, input').forEach(el => el.remove());
      clone.style.cssText = 'width: 210mm; margin: 0; padding: 0; background: white;';
      
      container.appendChild(clone);
      document.body.appendChild(container);

      // Đợi font và ảnh
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 800));

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `CV_Profile_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 3, 
          useCORS: true, 
          logging: false, 
          backgroundColor: '#ffffff',
          // onclone cực kỳ quan trọng để dọn dẹp CSS lần cuối
          onclone: (clonedDoc) => {
            clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach(s => s.remove());
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
      };

      // Thực thi và lưu file
      await window.html2pdf().set(opt).from(clone).save();

      // --- BƯỚC 4: DỌN DẸP VÀ KHÔI PHỤC ---
      document.body.removeChild(container);
      alert('✅ Bản in PDF đã được tải xuống thành công!');

    } catch (error) {
      console.error('PDF Export Error:', error);
      alert(`❌ Lỗi xuất PDF: ${error.message}`);
    } finally {
      // KHÔI PHỤC HÀM HỆ THỐNG NGAY LẬP TỨC
      CSSStyleDeclaration.prototype.getPropertyValue = originalGetPropertyValue;
      setIsExporting(false);
    }
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className={`h-screen w-full overflow-hidden transition-all duration-500 selection:bg-blue-500/30 flex ${activeTab === 'cv' ? 'font-cv' : 'font-portfolio'} ${THEMES[currentTheme].class} ${currentTheme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* SIDEBAR */}
      <aside className={`w-20 md:w-24 border-r flex flex-col items-center py-8 gap-8 fixed h-screen z-50 transition-colors ${currentTheme === 'light' ? 'bg-white/80 border-slate-200 shadow-xl' : 'bg-slate-950/80 border-slate-800 backdrop-blur-md'}`}>
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
          <Sparkles className="text-white" size={24} />
        </div>

        <nav className="flex flex-col gap-4">
          {[
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

        {/* Sidebar Actions (Bottom) */}
        <div className="mt-auto flex flex-col gap-3 pb-8 w-full px-3">
          
          {/* EDIT BUTTON: ONLY appears when logged in and is placed ABOVE Export */}
          {user && (
            <button 
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`w-full py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group shadow-lg ${
                isEditing 
                  ? "bg-emerald-600 text-white shadow-emerald-600/30" 
                  : currentTheme === 'light' ? "bg-slate-100 text-slate-900 hover:bg-emerald-500 hover:text-white" : "bg-slate-900 text-slate-300 hover:bg-emerald-600 hover:text-white"
              }`}
              disabled={syncing}
            >
              {syncing ? <Loader2 className="animate-spin" size={20} /> : (isEditing ? <Save size={20} className="group-hover:scale-110 transition-transform" /> : <Edit3 size={20} className="group-hover:scale-110 transition-transform" />)}
              <span className="text-[8px] font-black uppercase tracking-tighter">{isEditing ? "Save" : "Edit"}</span>
            </button>
          )}

          {/* EXPORT BUTTON: Always visible */}
          <button 
            onClick={handleExport} 
            className={`w-full py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group ${currentTheme === 'light' ? 'hover:bg-blue-50 text-slate-400 hover:text-blue-600' : 'hover:bg-blue-500/10 text-slate-500 hover:text-blue-400'}`}
            title="Download PDF"
          >
            <Download size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase tracking-tighter">Export</span>
          </button>

          {/* LOGIN / LOGOUT BUTTON: Toggles based on auth state */}
          {user ? (
            <button 
              onClick={logout} 
              className={`w-full py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group ${currentTheme === 'light' ? 'bg-slate-100 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-slate-900 text-red-400 hover:bg-red-600 hover:text-white'}`}
              title="Logout"
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Logout</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsLoginOpen(true)} 
              className={`w-full py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group ${currentTheme === 'light' ? 'bg-slate-100 text-slate-900 hover:bg-blue-600 hover:text-white' : 'bg-slate-900 text-slate-300 hover:bg-blue-600 hover:text-white'}`}
              title="Admin Login"
            >
              <LogIn size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Login</span>
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-20 md:ml-24 h-full overflow-y-auto custom-scrollbar">
        <div id="cv-content" className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          
          <div className="min-h-[700px]">
            <AnimatePresence mode="wait">
              {activeTab === "personal" && <PersonalPortfolioTab key="personal" activeTab={activeTab} headerData={headerData} setHeaderData={setHeaderData} projects={personalProjects} setProjects={setPersonalProjects} isEditing={isEditing} currentTheme={currentTheme} />}
              {activeTab === "team" && <TeamPortfolioTab key="team" projects={teamProjects} setProjects={setTeamProjects} isEditing={isEditing} currentTheme={currentTheme} />}
            </AnimatePresence>
          </div>


        </div>
      </main>
    </div>
  );
}
