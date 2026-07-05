import React from 'react';
import { ResumeData } from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Lightbulb, 
  Award, 
  Sparkles,
  FileText
} from 'lucide-react';

interface AISuggestionsProps {
  data: ResumeData;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ data }) => {
  // Local ATS assessment logic based on CV contents
  const evaluateATS = () => {
    let score = 50;
    const items: { text: string; positive: boolean; points: number }[] = [];

    // Check contact info
    if (data.contact.phone && data.contact.email && data.contact.location) {
      score += 15;
      items.push({ text: "Coordonnées complètes (Téléphone, Email, Ville)", positive: true, points: 15 });
    } else {
      items.push({ text: "Certaines coordonnées sont manquantes (recommandé pour l'ATS)", positive: false, points: 0 });
    }

    // Check profile summary length and keywords
    if (data.summary.length > 50) {
      score += 10;
      const hasKeywords = ["accueil", "écoute", "client", "communication", "expérience"].some(kw => 
        data.summary.toLowerCase().includes(kw)
      );
      if (hasKeywords) {
        score += 5;
        items.push({ text: "Résumé accrocheur avec des mots-clés de relation client", positive: true, points: 15 });
      } else {
        items.push({ text: "Résumé de profil présent mais optimisable avec des mots-clés", positive: true, points: 10 });
      }
    }

    // Check Concentrix Experience Update
    const concentrixExp = data.experiences.find(e => e.company.toLowerCase().includes('concentrix'));
    if (concentrixExp) {
      if (concentrixExp.period.includes('Juillet 2026') || concentrixExp.period.includes('2026')) {
        score += 10;
        items.push({ text: "Expérience CONCENTRIX mise à jour jusqu'en Juillet 2026", positive: true, points: 10 });
      } else {
        items.push({ text: "Pensez à bien indiquer la fin de votre contrat chez Concentrix en 2026", positive: false, points: 0 });
      }
    }

    // Check Certifications
    if (data.certifications.length >= 3) {
      score += 15;
      items.push({ text: "3 certifications Microsoft/LinkedIn Learning ajoutées", positive: true, points: 15 });
    } else if (data.certifications.length > 0) {
      score += 5;
      items.push({ text: "Certifications présentes, mais continuez d'en ajouter", positive: true, points: 5 });
    } else {
      items.push({ text: "Aucune certification listée (recommandé pour valider vos compétences)", positive: false, points: 0 });
    }

    // Check Skills list
    if (data.skills.itTools.length >= 2 && data.skills.expertise.length >= 3) {
      score += 10;
      items.push({ text: "Compétences équilibrées (outils bureautiques et domaines d'expertise)", positive: true, points: 10 });
    } else {
      items.push({ text: "Pensez à détailler vos outils (Word, Excel) et expertises d'accueil", positive: false, points: 0 });
    }

    // Check Interests
    const hasRelax = data.interests.some(i => i.toLowerCase().includes('massage') || i.toLowerCase().includes('relax'));
    const hasLearning = data.interests.some(i => i.toLowerCase().includes('apprentissage') || i.toLowerCase().includes('perfectionnement'));
    if (hasRelax && hasLearning) {
      score += 5;
      items.push({ text: "Centres d'intérêt personnalisés (Massage, Perfectionnement professionnel)", positive: true, points: 5 });
    }

    return {
      score: Math.min(score, 100),
      items: items.sort((a, b) => (b.positive ? 1 : 0) - (a.positive ? 1 : 0))
    };
  };

  const { score, items } = evaluateATS();

  // Helper for progress bar color
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (s >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getProgressColor = (s: number) => {
    if (s >= 85) return 'bg-emerald-600';
    if (s >= 70) return 'bg-blue-600';
    return 'bg-amber-500';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-5 no-print">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h2 className="text-sm font-bold text-slate-800">Analyse de CV & Score ATS</h2>
      </div>

      {/* ATS score gauge */}
      <div className={`p-4 rounded-xl border ${getScoreColor(score)} flex items-center gap-4`}>
        <div className="relative flex items-center justify-center w-16 h-16 shrink-0 bg-white rounded-full border shadow-xs">
          <span className="text-xl font-black">{score}%</span>
        </div>
        <div className="flex-grow space-y-1">
          <p className="text-xs font-bold text-slate-800">Optimisation du CV</p>
          <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
            <div className={`h-full ${getProgressColor(score)} transition-all duration-500`} style={{ width: `${score}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            {score >= 85 
              ? "Excellent ! Votre CV est parfaitement structuré, à jour, et contient toutes les nouvelles compétences requises par les employeurs."
              : "Très bon début ! Intégrez toutes les certifications et l'expérience Concentrix mise à jour pour maximiser vos chances."}
          </p>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Points de contrôle</p>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[10.5px]">
              {item.positive ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <span className={item.positive ? "text-slate-600" : "text-slate-500 font-medium"}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Resume Advice Cards */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <span>Conseils de Recruteur</span>
        </div>

        <div className="space-y-2 text-[10.5px]">
          <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100/50">
            <p className="font-bold text-blue-900 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Valoriser les Certifications
            </p>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Les certifications Microsoft/LinkedIn d'avril à juillet 2026 sont d'une importance capitale. Elles démontrent votre rigueur, votre proactivité et votre apprentissage continu. Lors d'un entretien, insistez sur la manière dont vous appliquez ces concepts (communication active, outils de secrétariat).
            </p>
          </div>

          <div className="p-3 bg-purple-50/40 rounded-lg border border-purple-100/50">
            <p className="font-bold text-purple-900 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Cohérence temporelle
            </p>
            <p className="text-slate-600 mt-1 leading-relaxed">
              En prolongeant l'expérience Concentrix jusqu'en juillet 2026, vous affichez une stabilité professionnelle remarquable de 2 ans, ce qui plaît énormément aux recruteurs en service client et secrétariat de direction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
