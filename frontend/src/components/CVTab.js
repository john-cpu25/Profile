"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Calendar, Zap, BookOpen, Briefcase, Plus, Trash2, X } from "lucide-react";
import { Section, ContactLine, EditableField, EditableList } from "./PortfolioComponents";

export default function CVTab({ isEditing, currentTheme, data, updateField }) {
  const updateNestedField = (category, field, value) => {
    updateField(category, { ...data[category], [field]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className={currentTheme === 'light' ? 'font-serif' : ''}
    >
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
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <h4 className="text-[9px] opacity-60 font-black mb-1.5 tracking-widest uppercase">Software & Tools</h4>
                <EditableList items={data.software} isEditing={isEditing} onChange={(v) => updateField('software', v)} currentTheme={currentTheme} />
              </div>
              <div className="space-y-2">
                <h4 className="text-[9px] opacity-60 font-black mb-1.5 tracking-widest uppercase">Expertise</h4>
                <EditableList items={data.skills} isEditing={isEditing} onChange={(v) => updateField('skills', v)} currentTheme={currentTheme} />
              </div>
            </div>
          </Section>

          <Section icon={BookOpen} title="CREDENTIALS" isEditing={isEditing}>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="text-[9px] opacity-60 font-black tracking-widest uppercase">Education</h4>
                  {isEditing && (
                    <button onClick={() => updateField('education', [...data.education, { degree: "New Degree", school: "New School", major: "Major" }])} className="text-[8px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest no-print">Add New</button>
                  )}
                </div>
                {data.education.map((e, i) => (
                  <div key={i} className="border-l-2 border-blue-500 pl-3 py-0 mb-3 relative group">
                    {isEditing && (
                      <button 
                        onClick={() => updateField('education', data.education.filter((_, idx) => idx !== i))}
                        className="absolute -right-2 top-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print"
                      >
                        <X size={12} />
                      </button>
                    )}
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
                    <EditableField value={e.major} isEditing={isEditing} onChange={(v) => {
                      const newEdu = [...data.education];
                      newEdu[i].major = v;
                      updateField('education', newEdu);
                    }} className="text-[9px] opacity-50 uppercase font-bold block" currentTheme={currentTheme} />
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800/50">
                <h4 className="text-[9px] opacity-60 font-black mb-1.5 tracking-widest uppercase">Languages</h4>
                <EditableList items={data.languages} isEditing={isEditing} onChange={(v) => updateField('languages', v)} currentTheme={currentTheme} />
              </div>
            </div>
          </Section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Section icon={Briefcase} title="WORK EXPERIENCE" isEditing={isEditing} large>
            <div className="flex justify-end mb-4">
               {isEditing && (
                 <button onClick={() => updateField('experience', [{ company: "New Company", time: "2024 - PRESENT", role: "Role", details: "Details..." }, ...data.experience])} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 no-print">
                   <Plus size={14} /> Add Experience
                 </button>
               )}
            </div>
            <div className="space-y-8 relative border-l border-slate-800 pl-8 ml-2">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[2.3rem] top-1.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-slate-950 shadow-lg shadow-blue-500/20" />
                  
                  {isEditing && (
                    <button 
                      onClick={() => updateField('experience', data.experience.filter((_, idx) => idx !== i))}
                      className="absolute -right-2 -top-2 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 rounded-full border border-slate-800 shadow-xl z-10 no-print"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-2 gap-2">
                    <div>
                      <EditableField value={exp.company} isEditing={isEditing} onChange={(v) => {
                        const newExp = [...data.experience];
                        newExp[i].company = v;
                        updateField('experience', newExp);
                      }} className="text-2xl font-black block leading-none" currentTheme={currentTheme} />
                      <EditableField value={exp.role} isEditing={isEditing} onChange={(v) => {
                        const newExp = [...data.experience];
                        newExp[i].role = v;
                        updateField('experience', newExp);
                      }} className="text-sm font-bold text-blue-400 mt-1 block" currentTheme={currentTheme} />
                    </div>
                    {isEditing ? (
                      <input 
                        value={exp.time} 
                        onChange={(e) => {
                          const newExp = [...data.experience];
                          newExp[i].time = e.target.value;
                          updateField('experience', newExp);
                        }} 
                        className="text-[10px] font-black border border-slate-700 px-3 py-1 rounded-full bg-slate-900/50 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <span className="text-[10px] font-black border border-slate-700 px-3 py-1 rounded-full opacity-60 bg-slate-900/50">{exp.time}</span>
                    )}
                  </div>
                  <div className={`mt-4 p-5 rounded-2xl border ${currentTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800/50 backdrop-blur-sm'}`}>
                    <EditableField 
                      value={exp.details} 
                      isEditing={isEditing} 
                      type="textarea"
                      onChange={(v) => {
                        const newExp = [...data.experience];
                        newExp[i].details = v;
                        updateField('experience', newExp);
                      }} 
                      className="opacity-80 text-sm leading-relaxed whitespace-pre-wrap font-medium" 
                      currentTheme={currentTheme} 
                    />
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
