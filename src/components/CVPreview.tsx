import React from 'react';
import { ResumeData, ThemeType, ColorPalette } from '../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Award, 
  Briefcase, 
  CheckCircle, 
  Sparkles, 
  User,
  Heart,
  BookOpen
} from 'lucide-react';

interface CVPreviewProps {
  data: ResumeData;
  theme: ThemeType;
  color: ColorPalette;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ data: rawData, theme, color }) => {
  if (!rawData || !rawData.contact) {
    return (
      <div className="w-full bg-white text-slate-500 rounded-lg p-8 text-center border border-slate-200 shadow-xs">
        Données du CV indisponibles ou en cours de chargement...
      </div>
    );
  }

  const data = {
    ...rawData,
    skills: {
      ...rawData.skills,
      expertise: (rawData.skills?.expertise || []).map(s => s.trim()).filter(s => s.length > 0),
      itTools: (rawData.skills?.itTools || []).map(s => s.trim()).filter(s => s.length > 0)
    },
    interests: (rawData.interests || []).map(s => s.trim()).filter(s => s.length > 0)
  };

  // Color configuration mapping
  const colors = {
    blue: {
      primary: 'text-slate-900',
      accent: 'text-blue-700',
      accentBg: 'bg-blue-50',
      accentBorder: 'border-blue-600',
      bullet: 'bg-blue-600',
      headerBg: 'bg-slate-50',
      tagBg: 'bg-blue-50 text-blue-800 border-blue-100',
      divider: 'border-blue-200'
    },
    emerald: {
      primary: 'text-slate-900',
      accent: 'text-emerald-700',
      accentBg: 'bg-emerald-50',
      accentBorder: 'border-emerald-600',
      bullet: 'bg-emerald-600',
      headerBg: 'bg-slate-50',
      tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      divider: 'border-emerald-200'
    },
    slate: {
      primary: 'text-slate-900',
      accent: 'text-slate-700',
      accentBg: 'bg-slate-100',
      accentBorder: 'border-slate-800',
      bullet: 'bg-slate-700',
      headerBg: 'bg-slate-50',
      tagBg: 'bg-slate-100 text-slate-800 border-slate-200',
      divider: 'border-slate-300'
    },
    amber: {
      primary: 'text-slate-900',
      accent: 'text-amber-800',
      accentBg: 'bg-amber-50',
      accentBorder: 'border-amber-700',
      bullet: 'bg-amber-700',
      headerBg: 'bg-amber-50/30',
      tagBg: 'bg-amber-50 text-amber-900 border-amber-100',
      divider: 'border-amber-200'
    }
  }[color];

  // Render photo or modern placeholder
  const renderPhoto = (customPlaceholderClass: string = '') => {
    if (data.contact.photoUrl) {
      return (
        <img 
          src={data.contact.photoUrl} 
          alt={data.contact.name} 
          className="w-28 h-32 md:w-32 md:h-36 object-cover rounded-lg shadow-sm border border-slate-200"
          referrerPolicy="no-referrer"
        />
      );
    }
    return (
      <div className={`w-28 h-32 md:w-32 md:h-36 flex flex-col items-center justify-center rounded-lg border-2 border-dashed ${colors.divider} bg-slate-50/50 text-slate-400 p-2 text-center ${customPlaceholderClass}`}>
        <User className="w-10 h-10 mb-1 text-slate-300" />
        <span className="text-[10px] font-medium leading-tight">Glissez ou ajoutez une photo</span>
      </div>
    );
  };

  // Renders the luxurious high-end Professional Polish theme
  const renderProfessionalPolishTheme = () => {
    return (
      <div className="flex flex-col h-full text-slate-800 text-[11px] leading-relaxed">
        {/* Header Block (Luxurious professional layout) */}
        <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-end shadow-xs -mx-8 -mt-8 mb-5">
          <div className="max-w-[55%]">
            <h1 className="font-display font-extrabold text-3xl tracking-tight text-slate-900 uppercase leading-none">
              {data.contact.name || "Arnaldo KOUTOMI"}
            </h1>
            <p className={`text-[12px] font-bold uppercase tracking-wider ${colors.accent} mt-2`}>
              {data.contact.title || "Conseiller Client & Assistant Administratif"}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-1 text-[10.5px] text-slate-500 font-medium text-right">
            {data.contact.phone && (
              <div className="flex items-center justify-end gap-1.5">
                <span>{data.contact.phone}</span>
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
            )}
            {data.contact.email && (
              <div className="flex items-center justify-end gap-1.5">
                <span className="truncate">{data.contact.email}</span>
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
            )}
            {data.contact.location && (
              <div className="flex items-center justify-end gap-1.5">
                <span>{data.contact.location}</span>
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
            )}
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-12 gap-5 flex-grow">
          {/* LEFT COLUMN - SIDEBAR */}
          <div className="col-span-4 flex flex-col space-y-4 pr-3 border-r border-slate-100">
            {/* Photo rendering */}
            <div className="flex justify-center mb-1 pl-0 -ml-[10px]">
              {renderPhoto('pl-[8px] -ml-[39px] mb-0 -mt-[11px] pt-[8px]')}
            </div>

            {/* SKILLS */}
            <div>
              <h2 className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b pb-0.5 border-slate-100">
                COMPÉTENCES & OUTILS
              </h2>
              {data.skills.itTools.length > 0 && (
                <div className="mb-2">
                  <p className="text-[8.5px] font-bold uppercase text-slate-400 tracking-wider mb-1">Outils Informatiques</p>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.itTools.map((tool, index) => (
                      <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[8.5px] font-semibold rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.expertise.length > 0 && (
                <div>
                  <p className="text-[8.5px] font-bold uppercase text-slate-400 tracking-wider mb-1">Expertises métiers</p>
                  <ul className="space-y-1 text-[9px] text-slate-600">
                    {data.skills.expertise.map((exp, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <CheckCircle className={`w-3 h-3 ${colors.accent} shrink-0 mt-0.5`} />
                        <span className="leading-tight">{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CERTIFICATIONS */}
            {data.certifications.length > 0 && (
              <div>
                <h2 className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b pb-0.5 border-slate-100">
                  CERTIFICATIONS
                </h2>
                <div className="space-y-2">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="text-[9px] avoid-page-break">
                      <p className="font-bold text-slate-800 leading-snug">{cert.title}</p>
                      <p className="text-slate-500 text-[8px]">{cert.issuer}</p>
                      <p className={`text-[8px] ${colors.accent} font-semibold uppercase mt-0.5`}>{cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LANGUES */}
            {data.languages.length > 0 && (
              <div>
                <h2 className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 border-b pb-0.5 border-slate-100">
                  LANGUES
                </h2>
                <div className="space-y-1">
                  {data.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center text-[9px]">
                      <span className="font-semibold text-slate-700">{lang.name}</span>
                      <span className="text-slate-500 text-[8px] italic bg-slate-50 px-1 py-0.5 rounded border border-slate-100/50">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INTERESTS */}
            {data.interests.length > 0 && (
              <div>
                <h2 className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b pb-0.5 border-slate-100">
                  CENTRES D'INTÉRÊT
                </h2>
                <div className="grid grid-cols-1 gap-1.5">
                  {data.interests.map((interest, index) => {
                    let IconComponent = Sparkles;
                    if (interest.toLowerCase().includes('massage') || interest.toLowerCase().includes('bien')) {
                      IconComponent = Heart;
                    } else if (interest.toLowerCase().includes('apprentissage') || interest.toLowerCase().includes('professionnel') || interest.toLowerCase().includes('lecture')) {
                      IconComponent = BookOpen;
                    } else if (interest.toLowerCase().includes('associatif') || interest.toLowerCase().includes('humaines')) {
                      IconComponent = User;
                    } else if (interest.toLowerCase().includes('randonnée') || interest.toLowerCase().includes('pédestre')) {
                      IconComponent = MapPin;
                    }
                    return (
                      <div key={index} className="flex items-center gap-2 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100/60">
                        <div className={`w-5 h-5 rounded bg-slate-100/80 flex items-center justify-center text-[10px] text-slate-500 shrink-0`}>
                          <IconComponent className="w-3 h-3" />
                        </div>
                        <span className="text-[8.5px] font-semibold text-slate-600 leading-tight">{interest}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - MAIN BODY */}
          <div className="col-span-8 flex flex-col space-y-4">
            {/* SUMMARY (PROFIL) */}
            {data.summary && (
              <div>
                <h2 className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 border-b pb-0.5 border-slate-100">
                  PROFIL PROFESSIONNEL
                </h2>
                <p className="text-slate-600 text-[10px] leading-relaxed text-justify italic whitespace-pre-line">
                  "{data.summary}"
                </p>
              </div>
            )}

            {/* EXPERIENCES (TIMELINE) */}
            <div>
              <h2 className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-3.5 border-b pb-0.5 border-slate-100">
                EXPÉRIENCE PROFESSIONNELLE
              </h2>
              <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="relative avoid-page-break">
                    {/* Timeline dot */}
                    <span className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${colors.bullet}`}></span>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-slate-900 text-[10.5px] uppercase tracking-wide">
                        {exp.role}
                      </h3>
                      <span className="text-[8px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>
                    <p className={`text-[9.5px] font-bold ${colors.accent} mb-1`}>
                      {exp.company} {exp.location ? `| ${exp.location}` : ''}
                    </p>
                    <ul className="space-y-0.5">
                      {exp.highlights.map((highlight, index) => (
                        <li key={index} className="text-slate-600 text-[9px] pl-2.5 relative flex items-start">
                          <span className="absolute left-0 top-1.5 w-1 h-1 rounded-full bg-slate-400"></span>
                          <span className="leading-relaxed text-justify">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* EDUCATION */}
            {data.education.length > 0 && (
              <div>
                <h2 className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b pb-0.5 border-slate-100">
                  FORMATION
                </h2>
                <div className="grid grid-cols-1 gap-2.5">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="text-[9.5px] flex justify-between items-start gap-4 avoid-page-break">
                      <div>
                        <h3 className="font-bold text-slate-900 leading-tight">
                          {edu.degree}
                        </h3>
                        <p className="text-slate-500 text-[8.5px] mt-0.5">
                          {edu.institution}
                        </p>
                      </div>
                      <span className={`text-[8.5px] font-bold ${colors.accent} uppercase whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded border border-slate-100/50`}>
                        {edu.period}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REFERENCES */}
            {data.references.length > 0 && (
              <div>
                <h2 className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b pb-0.5 border-slate-100">
                  GARANTIES & RÉFÉRENCES
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {data.references.map((ref) => (
                    <div key={ref.id} className="text-[9px] bg-slate-50/50 p-2 rounded-lg border border-slate-100 avoid-page-break">
                      <p className="font-bold text-slate-900">{ref.name}</p>
                      <p className="text-slate-500 text-[8px]">{ref.role} • <span className="font-semibold">{ref.company}</span></p>
                      <p className="text-slate-600 flex items-center gap-1 mt-0.5 font-mono text-[8px]">
                        <Phone className="w-2.5 h-2.5 text-slate-400" />
                        {ref.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LUXURIOUS STATUT ACTUEL & SIGNATURE FOOTER */}
            <div className="mt-auto flex justify-between items-center bg-slate-900 p-4 rounded-xl text-white avoid-page-break">
              <div className="max-w-[65%]">
                <p className="text-[8px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Certification & Engagement</p>
                <p className="text-[9px] font-medium italic text-slate-300 leading-tight">
                  "{data.signature.text}"
                </p>
                <p className="text-[7.5px] uppercase tracking-wider text-slate-400 mt-1 font-bold">
                  {data.signature.location}, {data.signature.date}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="text-center">
                  <p className="text-xs font-bold text-white">{data.experiences.length}</p>
                  <p className="text-[7.5px] uppercase text-slate-400 font-bold leading-none">Postes</p>
                </div>
                <div className="w-px h-5 bg-slate-700 self-center"></div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white">{data.certifications.length}</p>
                  <p className="text-[7.5px] uppercase text-slate-400 font-bold leading-none">Certs</p>
                </div>
                <div className="w-px h-5 bg-slate-700 self-center"></div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white">{data.languages.length}</p>
                  <p className="text-[7.5px] uppercase text-slate-400 font-bold leading-none">Langues</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renders the traditional layout based closely on Arnaldo's original CV structure
  const renderClassicTheme = () => {
    return (
      <div className="flex flex-col h-full text-slate-800 text-[11.5px] leading-relaxed">
        {/* Header Block */}
        <div className="flex justify-between items-start border-b pb-4 mb-4 border-slate-200">
          <div>
            <h1 className="font-display font-bold text-3xl tracking-tight text-slate-900 uppercase">
              {data.contact.name || "Arnaldo KOUTOMI"}
            </h1>
            <p className={`text-sm font-semibold tracking-wider uppercase mt-1 ${colors.accent}`}>
              {data.contact.title || "Conseiller Client & Assistant Administratif"}
            </p>
          </div>
          <div className="text-right space-y-1 text-slate-600">
            {data.contact.phone && (
              <div className="flex items-center justify-end gap-1.5">
                <span>{data.contact.phone}</span>
                <Phone className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
            {data.contact.email && (
              <div className="flex items-center justify-end gap-1.5">
                <span>{data.contact.email}</span>
                <Mail className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
            {data.contact.location && (
              <div className="flex items-center justify-end gap-1.5">
                <span>{data.contact.location}</span>
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-12 gap-6 flex-grow">
          {/* LEFT COLUMN (Résumé, Expériences, Références) */}
          <div className="col-span-8 flex flex-col pr-2 border-r border-slate-100">
            {/* RÉSUMÉ */}
            {data.summary && (
              <div className="mb-5">
                <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 mb-2 border-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  RÉSUMÉ
                </h2>
                <p className="text-slate-600 text-justify text-[11px] leading-relaxed italic whitespace-pre-line">
                  "{data.summary}"
                </p>
              </div>
            )}

            {/* EXPÉRIENCES */}
            <div className="mb-5 flex-grow">
              <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 mb-3 border-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                EXPÉRIENCE PROFESSIONNELLE
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-1 avoid-page-break">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-slate-900 uppercase text-[11.5px]">
                        {exp.role}
                      </h3>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${colors.accentBg} ${colors.accent} uppercase whitespace-nowrap`}>
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium text-[10.5px] mb-1.5">
                      {exp.company} {exp.location ? `| ${exp.location}` : ''}
                    </p>
                    <ul className="space-y-1">
                      {exp.highlights.map((highlight, index) => (
                        <li key={index} className="text-slate-600 text-[10.5px] pl-3 relative flex items-start gap-1">
                          <span className={`absolute left-0 top-[6px] w-1.5 h-1.5 rounded-full ${colors.bullet}`}></span>
                          <span className="text-justify leading-normal">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* RÉFÉRENCES */}
            {data.references.length > 0 && (
              <div className="mt-auto pt-3">
                <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 mb-2.5 border-slate-300">
                  RÉFÉRENCES
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {data.references.map((ref) => (
                    <div key={ref.id} className="text-[10.5px] avoid-page-break">
                      <p className="font-bold text-slate-900">{ref.name}</p>
                      <p className="text-slate-500">{ref.role} / <span className="font-semibold">{ref.company}</span></p>
                      <p className="text-slate-600 flex items-center gap-1 mt-0.5 font-mono text-[10px]">
                        <Phone className="w-2.5 h-2.5 text-slate-400" />
                        {ref.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (Photo, Formation, Certifications, Compétences, Langues) */}
          <div className="col-span-4 flex flex-col space-y-5">
            {/* Photo placeholder or image */}
            <div className="flex justify-center mb-1 no-print">
              {renderPhoto()}
            </div>

            {/* FORMATION */}
            {data.education.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 mb-2.5 border-slate-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  FORMATION
                </h2>
                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="text-[10px] avoid-page-break">
                      <h3 className="font-bold text-slate-900 leading-tight">
                        {edu.degree}
                      </h3>
                      <p className="text-slate-600 text-[10px] mt-0.5">
                        {edu.institution}
                      </p>
                      <p className={`text-[9.5px] font-semibold ${colors.accent} mt-0.5 uppercase`}>
                        {edu.period}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATIONS MICROSOFT/LINKEDIN LEARNING */}
            {data.certifications.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 mb-2.5 border-slate-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-500" />
                  CERTIFICATIONS
                </h2>
                <div className="space-y-2.5">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="text-[10.5px] bg-slate-50/80 p-1.5 rounded border border-slate-100 avoid-page-break">
                      <h3 className="font-bold text-slate-900 leading-tight">
                        {cert.title}
                      </h3>
                      <p className="text-slate-500 text-[9.5px]">
                        {cert.issuer}
                      </p>
                      <p className={`text-[9px] font-bold ${colors.accent} mt-0.5`}>
                        {cert.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMPÉTENCES */}
            <div>
              <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 mb-2.5 border-slate-300">
                COMPÉTENCES
              </h2>
              
              {/* Outils informatiques */}
              {data.skills.itTools.length > 0 && (
                <div className="mb-2.5">
                  <h3 className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Outils informatiques
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.itTools.map((tool, index) => (
                      <span key={index} className="text-[9.5px] px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Domaines d'expertise */}
              {data.skills.expertise.length > 0 && (
                <div>
                  <h3 className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Domaines d'expertise
                  </h3>
                  <ul className="space-y-1 text-[10px] text-slate-700">
                    {data.skills.expertise.map((exp, index) => (
                      <li key={index} className="flex items-start gap-1 pl-1">
                        <CheckCircle className={`w-3 h-3 ${colors.accent} shrink-0 mt-0.5`} />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* LANGUES */}
            {data.languages.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 mb-2 border-slate-300">
                  LANGUES
                </h2>
                <div className="space-y-1.5">
                  {data.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center text-[10.5px]">
                      <span className="font-bold text-slate-800">{lang.name}</span>
                      <span className="text-slate-500 text-[10px] italic">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTRES D'INTÉRÊT (Full width bottom block) */}
        {data.interests.length > 0 && (
          <div className="border-t pt-3 mt-4 border-slate-200">
            <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
              CENTRES D'INTÉRÊT
            </h2>
            <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1.5 text-[10.5px] text-slate-600">
              {data.interests.map((interest, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-slate-300">•</span>}
                  <span className="font-medium">{interest}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER & SIGNATURE */}
        <div className="border-t pt-3.5 mt-4 border-slate-200 flex justify-between items-end text-[10px] text-slate-500 avoid-page-break">
          <p className="italic max-w-[65%]">
            "{data.signature.text}"
          </p>
          <div className="text-right">
            <p className="font-bold uppercase tracking-wider text-slate-800 text-[9.5px]">
              {data.signature.location}, {data.signature.date}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Renders the modern single-column styled with beautiful timeline indicators
  const renderModernTheme = () => {
    return (
      <div className="flex flex-col h-full text-slate-800 text-[11.5px] leading-relaxed">
        {/* Elegant top banner */}
        <div className={`p-5 -mx-8 -mt-8 mb-5 ${colors.headerBg} border-b ${colors.divider} flex justify-between items-center`}>
          <div className="max-w-[70%]">
            <h1 className="font-display font-extrabold text-3xl tracking-tight text-slate-900">
              {data.contact.name || "Arnaldo KOUTOMI"}
            </h1>
            <p className={`text-sm font-semibold tracking-wide mt-1.5 ${colors.accent}`}>
              {data.contact.title || "Conseiller Client & Assistant Administratif"}
            </p>
            {data.summary && (
              <p className="text-slate-600 text-[10.5px] mt-2 italic text-justify whitespace-pre-line">
                "{data.summary}"
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-[10.5px] text-slate-600 space-y-1">
              <p className="flex items-center justify-end gap-1"><Phone className="w-3 h-3 text-slate-400" /> {data.contact.phone}</p>
              <p className="flex items-center justify-end gap-1"><Mail className="w-3 h-3 text-slate-400" /> {data.contact.email}</p>
              <p className="flex items-center justify-end gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {data.contact.location}</p>
            </div>
            <div className="no-print">
              {data.contact.photoUrl ? (
                <img src={data.contact.photoUrl} alt={data.contact.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className={`w-16 h-16 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400`}>
                  <User className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 flex-grow">
          {/* Main section (Experiences & References) */}
          <div className="col-span-8 space-y-5 pr-2">
            <div>
              <h2 className={`font-display font-bold text-xs uppercase tracking-wider ${colors.accent} mb-3 flex items-center gap-1.5`}>
                <Briefcase className="w-4 h-4" />
                Expériences Professionnelles
              </h2>
              <div className="relative border-l border-slate-200 pl-4 space-y-4 ml-2">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="relative avoid-page-break">
                    {/* Timeline dot */}
                    <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${colors.bullet}`}></span>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-[11.5px] uppercase">{exp.role}</h3>
                      <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">{exp.period}</span>
                    </div>
                    <p className={`text-[10.5px] font-medium ${colors.accent} mb-1`}>{exp.company} <span className="text-slate-400 font-normal">| {exp.location}</span></p>
                    <ul className="space-y-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-slate-600 text-[10.5px] pl-3 relative">
                          <span className="absolute left-0 top-[6px] w-1 h-1 bg-slate-400 rounded-full"></span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* References */}
            {data.references.length > 0 && (
              <div className="pt-2">
                <h2 className={`font-display font-bold text-xs uppercase tracking-wider ${colors.accent} mb-2.5`}>
                  Références Professionnelles
                </h2>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {data.references.map((ref) => (
                    <div key={ref.id} className="text-[10.5px] avoid-page-break">
                      <p className="font-bold text-slate-900">{ref.name}</p>
                      <p className="text-slate-500">{ref.role} • <span className="font-medium text-slate-700">{ref.company}</span></p>
                      <p className="text-slate-600 font-mono text-[9.5px] mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {ref.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Section */}
          <div className="col-span-4 space-y-4">
            {/* Formation */}
            <div>
              <h2 className={`font-display font-bold text-xs uppercase tracking-wider ${colors.accent} mb-2 flex items-center gap-1.5`}>
                <GraduationCap className="w-4 h-4" />
                Formations
              </h2>
              <div className="space-y-2">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="text-[10.5px] border-b border-slate-100 pb-1.5 last:border-0 last:pb-0 avoid-page-break">
                    <p className="font-bold text-slate-900 leading-tight">{edu.degree}</p>
                    <p className="text-slate-500 text-[9.5px]">{edu.institution}</p>
                    <p className={`text-[9px] font-semibold text-slate-400`}>{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <div>
                <h2 className={`font-display font-bold text-xs uppercase tracking-wider ${colors.accent} mb-2 flex items-center gap-1.5`}>
                  <Award className="w-4 h-4" />
                  Certifications
                </h2>
                <div className="space-y-1.5">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="text-[10px] p-1.5 bg-slate-50 rounded border border-slate-100 avoid-page-break">
                      <p className="font-bold text-slate-900 leading-snug">{cert.title}</p>
                      <p className="text-slate-500 text-[9px]">{cert.issuer}</p>
                      <p className={`text-[9px] font-bold ${colors.accent} mt-0.5`}>{cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div>
              <h2 className={`font-display font-bold text-xs uppercase tracking-wider ${colors.accent} mb-2`}>
                Compétences clés
              </h2>
              {data.skills.itTools.length > 0 && (
                <div className="mb-2">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">Outils Informatiques</p>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.itTools.map((t, idx) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.expertise.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">Expertise</p>
                  <ul className="space-y-1 text-[10px] text-slate-700">
                    {data.skills.expertise.map((exp, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.bullet} mt-1.5 shrink-0`}></span>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Langues */}
            {data.languages.length > 0 && (
              <div>
                <h2 className={`font-display font-bold text-xs uppercase tracking-wider ${colors.accent} mb-1.5`}>
                  Langues
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {data.languages.map((lang) => (
                    <div key={lang.id} className="bg-slate-50 p-1.5 rounded border border-slate-100 text-center">
                      <p className="font-bold text-slate-800 text-[10px]">{lang.name}</p>
                      <p className="text-slate-500 text-[9px] italic mt-0.5">{lang.level}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interests */}
        {data.interests.length > 0 && (
          <div className={`p-2.5 ${colors.headerBg} border border-slate-100 rounded-lg mt-4`}>
            <h3 className="font-display font-bold text-[10.5px] uppercase tracking-wider text-slate-800 mb-1.5">Centres d'intérêt</h3>
            <div className="flex flex-wrap gap-1.5">
              {data.interests.map((interest, idx) => (
                <span key={idx} className={`text-[9.5px] font-medium px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200/60 shadow-xs`}>
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-3 mt-4 border-slate-100 flex justify-between items-end text-[10px] text-slate-500 avoid-page-break">
          <p className="italic">"{data.signature.text}"</p>
          <p className="font-bold uppercase text-slate-700 text-[9px]">{data.signature.location}, {data.signature.date}</p>
        </div>
      </div>
    );
  };

  // Renders minimal, space-optimized ATS friendly layout
  const renderMinimalTheme = () => {
    return (
      <div className="flex flex-col h-full text-slate-800 text-[11px] leading-relaxed font-sans">
        {/* Name Header and basic contact block */}
        <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-slate-900 uppercase">
            {data.contact.name || "Arnaldo KOUTOMI"}
          </h1>
          <p className={`text-xs font-semibold tracking-wider uppercase mt-1 ${colors.accent}`}>
            {data.contact.title || "Conseiller Client & Assistant Administratif"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-slate-600 text-[10px] font-medium mt-2">
            <span>{data.contact.phone}</span>
            <span className="text-slate-300">|</span>
            <span>{data.contact.email}</span>
            <span className="text-slate-300">|</span>
            <span>{data.contact.location}</span>
          </div>
        </div>

        {/* Executive summary statement */}
        {data.summary && (
          <div className="mb-4">
            <p className="text-slate-700 text-justify italic text-[10.5px] whitespace-pre-line">
              "{data.summary}"
            </p>
          </div>
        )}

        <div className="grid grid-cols-12 gap-5 flex-grow">
          {/* Main timeline */}
          <div className="col-span-8 space-y-4">
            {/* Experience */}
            <div>
              <h2 className="font-display font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-2.5">
                Expérience Professionnelle
              </h2>
              <div className="space-y-3.5">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="avoid-page-break">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{exp.role}</span>
                      <span className="text-[10px] font-normal text-slate-500">{exp.period}</span>
                    </div>
                    <p className="text-slate-600 text-[10px] font-medium">{exp.company} — <span className="italic">{exp.location}</span></p>
                    <ul className="space-y-1 mt-1 text-slate-600">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="pl-3 relative text-[10px]">
                          <span className="absolute left-0 top-1.5 w-1 h-1 bg-slate-900 rounded-full"></span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* References */}
            {data.references.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-2">
                  Références
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {data.references.map((ref) => (
                    <div key={ref.id} className="text-[10px] avoid-page-break">
                      <p className="font-bold text-slate-900">{ref.name}</p>
                      <p className="text-slate-500 leading-snug">{ref.role} • {ref.company}</p>
                      <p className="text-slate-600 font-semibold">{ref.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar panel */}
          <div className="col-span-4 space-y-4">
            {/* Education */}
            <div>
              <h2 className="font-display font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-2">
                Formation
              </h2>
              <div className="space-y-2">
                {data.education.map((edu) => (
                  <div key={edu.id} className="text-[10px]">
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600 text-[9.5px]">{edu.institution}</p>
                    <p className="text-slate-400 text-[9px] font-semibold mt-0.5">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-2">
                  Certifications
                </h2>
                <div className="space-y-1.5">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="text-[9.5px] avoid-page-break">
                      <p className="font-bold text-slate-900">{cert.title}</p>
                      <p className="text-slate-500">{cert.issuer}</p>
                      <p className={`text-[9px] font-bold ${colors.accent}`}>{cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competences */}
            <div>
              <h2 className="font-display font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-2">
                Compétences
              </h2>
              <div className="space-y-2">
                {data.skills.itTools.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Outils</p>
                    <p className="text-[10px] text-slate-700 font-medium">{data.skills.itTools.join(', ')}</p>
                  </div>
                )}
                {data.skills.expertise.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expertises</p>
                    <ul className="space-y-0.5 text-[10px] text-slate-700">
                      {data.skills.expertise.map((e, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Langues */}
            {data.languages.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5">
                  Langues
                </h2>
                <div className="space-y-1 text-[10px]">
                  {data.languages.map((l) => (
                    <div key={l.id} className="flex justify-between font-medium">
                      <span>{l.name}</span>
                      <span className="text-slate-500 italic">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interests */}
        {data.interests.length > 0 && (
          <div className="border-t border-slate-300 pt-2.5 mt-3">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Centres d'intérêt</p>
            <p className="text-[10px] text-slate-600 leading-normal">
              {data.interests.join(' • ')}
            </p>
          </div>
        )}

        {/* Signature */}
        <div className="border-t border-slate-200 pt-3 mt-3.5 flex justify-between items-end text-[9.5px] text-slate-500 avoid-page-break">
          <p className="italic">"{data.signature.text}"</p>
          <p className="font-bold uppercase text-slate-700">{data.signature.location}, {data.signature.date}</p>
        </div>
      </div>
    );
  };

  // High-end structured executive theme
  const renderExecutiveTheme = () => {
    return (
      <div className="flex flex-col h-full text-slate-800 text-[11px] leading-relaxed">
        {/* Banner with dark accents */}
        <div className={`p-6 -mx-8 -mt-8 mb-6 bg-slate-900 text-white flex justify-between items-center`}>
          <div>
            <span className={`text-[10px] font-bold tracking-widest text-slate-300 uppercase px-2 py-0.5 rounded bg-white/10`}>
              PROFIL PROFESSIONNEL
            </span>
            <h1 className="font-display font-bold text-3xl tracking-tight text-white uppercase mt-1.5">
              {data.contact.name || "Arnaldo KOUTOMI"}
            </h1>
            <p className={`text-xs font-semibold tracking-wider text-slate-300 uppercase mt-1`}>
              {data.contact.title || "Conseiller Client & Assistant Administratif"}
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-200 space-y-1 font-medium bg-white/5 p-3 rounded border border-white/10">
            <p className="flex items-center justify-end gap-1"><Phone className="w-3 h-3 text-slate-400" /> {data.contact.phone}</p>
            <p className="flex items-center justify-end gap-1"><Mail className="w-3 h-3 text-slate-400" /> {data.contact.email}</p>
            <p className="flex items-center justify-end gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {data.contact.location}</p>
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-5 bg-slate-50 p-3 rounded-lg border-l-4 border-slate-700 italic text-slate-700 text-[10.5px] whitespace-pre-line">
            "{data.summary}"
          </div>
        )}

        {/* Core sections block */}
        <div className="grid grid-cols-12 gap-5 flex-grow">
          <div className="col-span-8 space-y-4">
            <div>
              <h2 className={`font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b-2 ${colors.accentBorder} pb-0.5 mb-3`}>
                Parcours Professionnel
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 avoid-page-break">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-slate-900 text-[11px] uppercase">{exp.role}</h3>
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase whitespace-nowrap`}>{exp.period}</span>
                    </div>
                    <p className={`text-[10px] font-semibold ${colors.accent} mb-1.5`}>{exp.company} | <span className="font-medium text-slate-400">{exp.location}</span></p>
                    <ul className="space-y-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-slate-600 text-[10px] pl-3 relative flex items-start gap-1">
                          <span className={`absolute left-0 top-[6px] w-1.5 h-1.5 bg-slate-800 rounded-full`}></span>
                          <span className="text-justify leading-normal">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* References */}
            {data.references.length > 0 && (
              <div>
                <h2 className={`font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b-2 ${colors.accentBorder} pb-0.5 mb-2.5`}>
                  Garanties & Références
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {data.references.map((ref) => (
                    <div key={ref.id} className="text-[10px] p-2 bg-slate-50 rounded border border-slate-200/50 avoid-page-break">
                      <p className="font-bold text-slate-900">{ref.name}</p>
                      <p className="text-slate-500 font-medium">{ref.role} — <span className="font-semibold">{ref.company}</span></p>
                      <p className="text-slate-600 font-mono text-[9px] mt-0.5 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 text-slate-400" /> {ref.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-4 space-y-4">
            {/* Formation */}
            <div>
              <h2 className={`font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b-2 ${colors.accentBorder} pb-0.5 mb-2`}>
                Parcours Académique
              </h2>
              <div className="space-y-2.5">
                {data.education.map((edu) => (
                  <div key={edu.id} className="text-[10px]">
                    <p className="font-bold text-slate-900 leading-tight">{edu.degree}</p>
                    <p className="text-slate-600 text-[9.5px] mt-0.5">{edu.institution}</p>
                    <p className="text-slate-400 text-[9px] font-bold uppercase">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <div>
                <h2 className={`font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b-2 ${colors.accentBorder} pb-0.5 mb-2`}>
                  Certifications Valides
                </h2>
                <div className="space-y-2">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="text-[10px] border-l-2 border-slate-700 pl-2 py-0.5 avoid-page-break">
                      <p className="font-bold text-slate-900 leading-tight">{cert.title}</p>
                      <p className="text-slate-500 text-[9px]">{cert.issuer}</p>
                      <p className={`text-[9px] font-bold ${colors.accent}`}>{cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competences */}
            <div>
              <h2 className={`font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b-2 ${colors.accentBorder} pb-0.5 mb-2`}>
                Expertises & Outils
              </h2>
              <div className="space-y-2 text-[10px]">
                {data.skills.itTools.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Systèmes et Logiciels</p>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.itTools.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {data.skills.expertise.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Savoir-Faire</p>
                    <ul className="space-y-1 text-slate-700">
                      {data.skills.expertise.map((exp, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <CheckCircle className="w-3 h-3 text-slate-600 mt-0.5 shrink-0" />
                          <span>{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Langues */}
            {data.languages.length > 0 && (
              <div>
                <h2 className={`font-display font-bold text-xs uppercase tracking-wider text-slate-900 border-b-2 ${colors.accentBorder} pb-0.5 mb-1.5`}>
                  Langues
                </h2>
                <div className="space-y-1">
                  {data.languages.map((l) => (
                    <div key={l.id} className="flex justify-between text-[10px] font-medium bg-slate-50 p-1 rounded border border-slate-100">
                      <span>{l.name}</span>
                      <span className="text-slate-500 italic text-[9.5px]">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interests */}
        {data.interests.length > 0 && (
          <div className="border-t border-slate-200 pt-2.5 mt-3">
            <h3 className="font-display font-bold text-[10px] uppercase tracking-wider text-slate-900 mb-1">Centres d'intérêt & Loisirs</h3>
            <p className="text-[10px] text-slate-600">
              {data.interests.join(' • ')}
            </p>
          </div>
        )}

        {/* Signature */}
        <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between items-end text-[9.5px] text-slate-500 avoid-page-break">
          <p className="italic">"{data.signature.text}"</p>
          <p className="font-bold uppercase text-slate-700">{data.signature.location}, {data.signature.date}</p>
        </div>
      </div>
    );
  };

  // Switch rendering based on selected template
  return (
    <div id="cv-preview-container" className={`w-full bg-white text-slate-800 print-area shadow-lg border border-slate-200 rounded-lg p-8 transition-all duration-300`}>
      {theme === 'polish' && renderProfessionalPolishTheme()}
      {theme === 'classic' && renderClassicTheme()}
      {theme === 'modern' && renderModernTheme()}
      {theme === 'minimal' && renderMinimalTheme()}
      {theme === 'executive' && renderExecutiveTheme()}
    </div>
  );
};
