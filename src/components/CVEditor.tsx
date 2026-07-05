import React, { useState } from 'react';
import { ResumeData, Experience, Education, Certification, Language, Reference } from '../types';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Settings, 
  Heart, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Globe,
  FileSignature,
  Camera
} from 'lucide-react';

interface CVEditorProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const CVEditor: React.FC<CVEditorProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<string>('contact');

  // Handle nested contact updates
  const handleContactChange = (field: string, value: string) => {
    onChange({
      ...data,
      contact: {
        ...data.contact,
        [field]: value
      }
    });
  };

  // Profile image upload handler (reads image as base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...data,
          contact: {
            ...data.contact,
            photoUrl: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onChange({
      ...data,
      contact: {
        ...data.contact,
        photoUrl: ""
      }
    });
  };

  // Helper toggle function for accordion
  const toggleTab = (tabName: string) => {
    setActiveTab(activeTab === tabName ? '' : tabName);
  };

  // Experience Handlers
  const handleExperienceChange = (id: string, field: keyof Experience, value: any) => {
    const updated = data.experiences.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange({ ...data, experiences: updated });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      role: "Nouveau poste",
      company: "Entreprise / Organisation",
      location: "Ville, Pays",
      period: "Mois AAAA - Mois AAAA",
      highlights: ["Accomplissement ou tâche importante"]
    };
    onChange({ ...data, experiences: [...data.experiences, newExp] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experiences: data.experiences.filter(exp => exp.id !== id) });
  };

  const handleHighlightChange = (expId: string, idx: number, val: string) => {
    const updated = data.experiences.map(exp => {
      if (exp.id === expId) {
        const newHighlights = [...exp.highlights];
        newHighlights[idx] = val;
        return { ...exp, highlights: newHighlights };
      }
      return exp;
    });
    onChange({ ...data, experiences: updated });
  };

  const addHighlight = (expId: string) => {
    const updated = data.experiences.map(exp => {
      if (exp.id === expId) {
        return { ...exp, highlights: [...exp.highlights, "Nouveau point d'expérience"] };
      }
      return exp;
    });
    onChange({ ...data, experiences: updated });
  };

  const removeHighlight = (expId: string, idx: number) => {
    const updated = data.experiences.map(exp => {
      if (exp.id === expId) {
        return { ...exp, highlights: exp.highlights.filter((_, i) => i !== idx) };
      }
      return exp;
    });
    onChange({ ...data, experiences: updated });
  };

  // Education Handlers
  const handleEducationChange = (id: string, field: keyof Education, value: string) => {
    const updated = data.education.map(edu => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onChange({ ...data, education: updated });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: "Nouveau Diplôme / Certification",
      institution: "Université / École / Institution",
      period: "Année"
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  // Certifications Handlers
  const handleCertChange = (id: string, field: keyof Certification, value: string) => {
    const updated = data.certifications.map(cert => {
      if (cert.id === id) {
        return { ...cert, [field]: value };
      }
      return cert;
    });
    onChange({ ...data, certifications: updated });
  };

  const addCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      title: "Nouvelle certification",
      issuer: "Microsoft / LinkedIn Learning / Autre",
      date: "Mois AAAA"
    };
    onChange({ ...data, certifications: [...data.certifications, newCert] });
  };

  const removeCert = (id: string) => {
    onChange({ ...data, certifications: data.certifications.filter(cert => cert.id !== id) });
  };

  // Language Handlers
  const handleLanguageChange = (id: string, field: keyof Language, value: string) => {
    const updated = data.languages.map(l => {
      if (l.id === id) {
        return { ...l, [field]: value };
      }
      return l;
    });
    onChange({ ...data, languages: updated });
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      name: "Nouvelle langue",
      level: "Niveau intermédiaire / Excellent"
    };
    onChange({ ...data, languages: [...data.languages, newLang] });
  };

  const removeLanguage = (id: string) => {
    onChange({ ...data, languages: data.languages.filter(l => l.id !== id) });
  };

  // References Handlers
  const handleReferenceChange = (id: string, field: keyof Reference, value: string) => {
    const updated = data.references.map(r => {
      if (r.id === id) {
        return { ...r, [field]: value };
      }
      return r;
    });
    onChange({ ...data, references: updated });
  };

  const addReference = () => {
    const newRef: Reference = {
      id: `ref-${Date.now()}`,
      name: "Nom complet du référent",
      role: "Poste occupé",
      company: "Nom de l'entreprise",
      phone: "(229) 00 00 00 00"
    };
    onChange({ ...data, references: [...data.references, newRef] });
  };

  const removeReference = (id: string) => {
    onChange({ ...data, references: data.references.filter(r => r.id !== id) });
  };

  return (
    <div className="space-y-4 no-print select-none">
      {/* 1. CONTACT ACCORDION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => toggleTab('contact')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-slate-500" />
            <span>Coordonnées & Titre</span>
          </div>
          {activeTab === 'contact' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {activeTab === 'contact' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Nom Complet</label>
                <input 
                  type="text" 
                  value={data.contact.name}
                  onChange={(e) => handleContactChange('name', e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Titre Professionnel</label>
                <input 
                  type="text" 
                  value={data.contact.title}
                  onChange={(e) => handleContactChange('title', e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Téléphone</label>
                <input 
                  type="text" 
                  value={data.contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  value={data.contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Adresse</label>
                <input 
                  type="text" 
                  value={data.contact.location}
                  onChange={(e) => handleContactChange('location', e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Photo de Profil</label>
              <div className="flex items-center gap-3 bg-white p-2.5 rounded border border-slate-200">
                {data.contact.photoUrl ? (
                  <div className="relative">
                    <img src={data.contact.photoUrl} alt="Aperçu" className="w-12 h-14 object-cover rounded border border-slate-300" />
                    <button 
                      type="button" 
                      onClick={removePhoto}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 shadow-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-14 bg-slate-100 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <Camera className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-grow">
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="profile-upload"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label 
                    htmlFor="profile-upload"
                    className="inline-block px-3 py-1.5 bg-slate-800 text-white rounded text-[10px] font-semibold cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    Choisir un fichier image
                  </label>
                  <p className="text-[9px] text-slate-400 mt-1">Sera sauvegardé localement.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. SUMMARY ACCORDION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => toggleTab('summary')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Résumé de profil</span>
          </div>
          {activeTab === 'summary' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {activeTab === 'summary' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/40">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Accroche de présentation</label>
            <textarea 
              rows={4}
              value={data.summary}
              onChange={(e) => onChange({ ...data, summary: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Décrivez votre projet professionnel en quelques lignes..."
            />
          </div>
        )}
      </div>

      {/* 3. EXPERIENCES ACCORDION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => toggleTab('experiences')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 text-slate-500" />
            <span>Expériences Professionnelles</span>
          </div>
          {activeTab === 'experiences' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {activeTab === 'experiences' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-4">
            {data.experiences.map((exp, index) => (
              <div key={exp.id} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2.5 relative">
                <button 
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-slate-100"
                  title="Supprimer ce poste"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <p className="text-[10px] font-bold text-blue-600">Poste {index + 1}</p>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase">Intitulé du poste</label>
                    <input 
                      type="text"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase">Entreprise</label>
                    <input 
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase">Lieu</label>
                    <input 
                      type="text"
                      value={exp.location}
                      onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase">Période</label>
                    <input 
                      type="text"
                      value={exp.period}
                      onChange={(e) => handleExperienceChange(exp.id, 'period', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50/30"
                      placeholder="Ex: Août 2024 - Juillet 2026"
                    />
                  </div>
                </div>

                {/* Highlights list within experience */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Points forts / Tâches</label>
                    <button 
                      type="button" 
                      onClick={() => addHighlight(exp.id)}
                      className="text-[9px] text-blue-600 font-semibold flex items-center gap-0.5 hover:underline"
                    >
                      <Plus className="w-2.5 h-2.5" /> Ajouter une tâche
                    </button>
                  </div>
                  {exp.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-xs shrink-0">•</span>
                      <input 
                        type="text"
                        value={highlight}
                        onChange={(e) => handleHighlightChange(exp.id, hIdx, e.target.value)}
                        className="w-full text-xs p-1 border border-slate-200 rounded bg-slate-50/30"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeHighlight(exp.id, hIdx)}
                        className="text-slate-400 hover:text-red-500"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addExperience}
              className="w-full py-2 border border-dashed border-blue-300 text-blue-600 text-xs font-semibold rounded hover:bg-blue-50/50 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter un poste
            </button>
          </div>
        )}
      </div>

      {/* 4. FORMATIONS ACCORDION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => toggleTab('education')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-slate-500" />
            <span>Formations</span>
          </div>
          {activeTab === 'education' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {activeTab === 'education' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-3.5">
            {data.education.map((edu, index) => (
              <div key={edu.id} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 relative">
                <button 
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-slate-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] font-bold text-slate-400">Formation {index + 1}</p>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase">Diplôme / Certificat</label>
                  <input 
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                    className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase">Institution / École</label>
                    <input 
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase">Période</label>
                    <input 
                      type="text"
                      value={edu.period}
                      onChange={(e) => handleEducationChange(edu.id, 'period', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50/30"
                      placeholder="Ex: 2014, Octobre 2025"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addEducation}
              className="w-full py-2 border border-dashed border-blue-300 text-blue-600 text-xs font-semibold rounded hover:bg-blue-50/50 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter une formation
            </button>
          </div>
        )}
      </div>

      {/* 5. CERTIFICATIONS ACCORDION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => toggleTab('certifications')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-slate-500" />
            <span>Certifications (Microsoft & LinkedIn)</span>
          </div>
          {activeTab === 'certifications' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {activeTab === 'certifications' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-3.5">
            {data.certifications.map((cert, index) => (
              <div key={cert.id} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 relative">
                <button 
                  type="button"
                  onClick={() => removeCert(cert.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-slate-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] font-bold text-slate-400">Certification {index + 1}</p>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase">Intitulé de la Certification</label>
                  <input 
                    type="text"
                    value={cert.title}
                    onChange={(e) => handleCertChange(cert.id, 'title', e.target.value)}
                    className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase">Émetteur</label>
                    <input 
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => handleCertChange(cert.id, 'issuer', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase">Date d'obtention</label>
                    <input 
                      type="text"
                      value={cert.date}
                      onChange={(e) => handleCertChange(cert.id, 'date', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50/30"
                      placeholder="Ex: Avril 2026, Juillet 2026"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addCert}
              className="w-full py-2 border border-dashed border-blue-300 text-blue-600 text-xs font-semibold rounded hover:bg-blue-50/50 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter une certification
            </button>
          </div>
        )}
      </div>

      {/* 6. COMPETENCES ET LANGUES ACCORDION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => toggleTab('skills')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-slate-500" />
            <span>Compétences & Langues</span>
          </div>
          {activeTab === 'skills' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {activeTab === 'skills' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-4">
            {/* Outils informatiques */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Outils Informatiques (Séparés par virgule)</label>
              <input 
                type="text" 
                value={data.skills.itTools.join(', ')}
                onChange={(e) => {
                  const tools = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                  onChange({
                    ...data,
                    skills: {
                      ...data.skills,
                      itTools: tools
                    }
                  });
                }}
                className="w-full text-xs p-2 border border-slate-200 rounded bg-white"
                placeholder="Ex: Microsoft Word, Excel"
              />
            </div>

            {/* Domaines d'expertise */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Domaines d'Expertise (Un par ligne)</label>
              <textarea 
                rows={4}
                value={data.skills.expertise.join('\n')}
                onChange={(e) => {
                  const exp = e.target.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
                  onChange({
                    ...data,
                    skills: {
                      ...data.skills,
                      expertise: exp
                    }
                  });
                }}
                className="w-full text-xs p-2 border border-slate-200 rounded bg-white"
                placeholder="Ex: Secrétariat & Accueil"
              />
            </div>

            {/* Langues */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Langues maîtrisées</label>
                <button 
                  type="button" 
                  onClick={addLanguage}
                  className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 hover:underline"
                >
                  <Plus className="w-2.5 h-2.5" /> Ajouter
                </button>
              </div>

              {data.languages.map((l) => (
                <div key={l.id} className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded">
                  <input 
                    type="text" 
                    value={l.name}
                    placeholder="Langue"
                    onChange={(e) => handleLanguageChange(l.id, 'name', e.target.value)}
                    className="w-1/2 text-xs p-1 border border-slate-100 rounded"
                  />
                  <input 
                    type="text" 
                    value={l.level}
                    placeholder="Niveau (Ex: Excellent)"
                    onChange={(e) => handleLanguageChange(l.id, 'level', e.target.value)}
                    className="w-1/2 text-xs p-1 border border-slate-100 rounded"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeLanguage(l.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 7. CENTRES D'INTERET ACCORDION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => toggleTab('interests')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Heart className="w-4 h-4 text-slate-500" />
            <span>Centres d'intérêt</span>
          </div>
          {activeTab === 'interests' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {activeTab === 'interests' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/40">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Centres d'intérêt (Séparés par virgule)</label>
            <textarea 
              rows={3}
              value={data.interests.join(', ')}
              onChange={(e) => {
                const arr = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                onChange({ ...data, interests: arr });
              }}
              className="w-full text-xs p-2.5 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Ex: Lecture, Voyages, Cinéma..."
            />
            <p className="text-[9.5px] text-slate-400 mt-1">Séparez chaque centre d'intérêt par une virgule pour générer des puces élégantes.</p>
          </div>
        )}
      </div>

      {/* 8. REFERENCES & SIGNATURE ACCORDION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => toggleTab('references')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FileSignature className="w-4 h-4 text-slate-500" />
            <span>Références & Signature</span>
          </div>
          {activeTab === 'references' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {activeTab === 'references' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Personnes de référence</label>
                <button 
                  type="button" 
                  onClick={addReference}
                  className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 hover:underline"
                >
                  <Plus className="w-2.5 h-2.5" /> Ajouter
                </button>
              </div>

              {data.references.map((ref) => (
                <div key={ref.id} className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-2 relative">
                  <button 
                    type="button" 
                    onClick={() => removeReference(ref.id)}
                    className="absolute top-1.5 right-1.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={ref.name}
                      placeholder="Nom complet"
                      onChange={(e) => handleReferenceChange(ref.id, 'name', e.target.value)}
                      className="text-xs p-1 border border-slate-100 rounded"
                    />
                    <input 
                      type="text" 
                      value={ref.phone}
                      placeholder="Téléphone (Ex: (229)...)"
                      onChange={(e) => handleReferenceChange(ref.id, 'phone', e.target.value)}
                      className="text-xs p-1 border border-slate-100 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={ref.role}
                      placeholder="Rôle / Fonction"
                      onChange={(e) => handleReferenceChange(ref.id, 'role', e.target.value)}
                      className="text-xs p-1 border border-slate-100 rounded"
                    />
                    <input 
                      type="text" 
                      value={ref.company}
                      placeholder="Organisation / Entreprise"
                      onChange={(e) => handleReferenceChange(ref.id, 'company', e.target.value)}
                      className="text-xs p-1 border border-slate-100 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Block */}
            <div className="border-t border-slate-200 pt-3 space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Mention de Certification & Signature</label>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Phrase de certification d'honneur</label>
                <input 
                  type="text"
                  value={data.signature.text}
                  onChange={(e) => onChange({
                    ...data,
                    signature: { ...data.signature, text: e.target.value }
                  })}
                  className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Fait à (Lieu)</label>
                  <input 
                    type="text"
                    value={data.signature.location}
                    onChange={(e) => onChange({
                      ...data,
                      signature: { ...data.signature, location: e.target.value }
                    })}
                    className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Le (Date)</label>
                  <input 
                    type="text"
                    value={data.signature.date}
                    onChange={(e) => onChange({
                      ...data,
                      signature: { ...data.signature, date: e.target.value }
                    })}
                    className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
