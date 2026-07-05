export interface ContactInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  photoUrl: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Reference {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: {
    itTools: string[];
    expertise: string[];
  };
  languages: Language[];
  interests: string[];
  references: Reference[];
  signature: {
    text: string;
    location: string;
    date: string;
  };
}

export type ThemeType = 'classic' | 'modern' | 'minimal' | 'executive' | 'polish';
export type ColorPalette = 'blue' | 'emerald' | 'slate' | 'amber';
