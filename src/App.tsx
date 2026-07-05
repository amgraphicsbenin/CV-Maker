import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData, ThemeType, ColorPalette } from './types';
import { initialResumeData } from './defaultData';
import { CVPreview } from './components/CVPreview';
import { CVEditor } from './components/CVEditor';
import { AISuggestions } from './components/AISuggestions';
import { saveResume, loadResume, supabase } from './supabaseClient';
import { 
  Printer, 
  RotateCcw, 
  Download, 
  Upload, 
  Eye, 
  Edit3, 
  FileText,
  Palette,
  Layout,
  Check,
  FileDown,
  X,
  ExternalLink,
  Loader2,
  Cloud
} from 'lucide-react';

const getHashState = () => {
  try {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#state=')) {
      const base64 = decodeURIComponent(hash.substring(7));
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const jsonString = new TextDecoder().decode(bytes);
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.resumeData) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse hash state", e);
  }
  return null;
};

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const hashState = getHashState();
    if (hashState && hashState.resumeData) {
      return {
        ...initialResumeData,
        ...hashState.resumeData,
        contact: {
          ...initialResumeData.contact,
          ...(hashState.resumeData.contact || {})
        },
        skills: {
          ...initialResumeData.skills,
          ...(hashState.resumeData.skills || {})
        },
        experiences: hashState.resumeData.experiences || initialResumeData.experiences,
        education: hashState.resumeData.education || initialResumeData.education,
        certifications: hashState.resumeData.certifications || initialResumeData.certifications,
        languages: hashState.resumeData.languages || initialResumeData.languages,
        references: hashState.resumeData.references || initialResumeData.references,
        interests: hashState.resumeData.interests || initialResumeData.interests,
        signature: {
          ...initialResumeData.signature,
          ...(hashState.resumeData.signature || {})
        }
      };
    }

    const saved = localStorage.getItem('arnaldo_resume_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Robust fallback to prevent crashes if the user has an old localStorage state without the certifications section
        return {
          ...initialResumeData,
          ...parsed,
          contact: {
            ...initialResumeData.contact,
            ...(parsed.contact || {})
          },
          skills: {
            ...initialResumeData.skills,
            ...(parsed.skills || {})
          },
          experiences: parsed.experiences || initialResumeData.experiences,
          education: parsed.education || initialResumeData.education,
          certifications: parsed.certifications || initialResumeData.certifications,
          languages: parsed.languages || initialResumeData.languages,
          references: parsed.references || initialResumeData.references,
          interests: parsed.interests || initialResumeData.interests,
          signature: {
            ...initialResumeData.signature,
            ...(parsed.signature || {})
          }
        };
      } catch (e) {
        console.error("Failed to parse saved resume data, using default", e);
      }
    }
    return initialResumeData;
  });

  const [theme, setTheme] = useState<ThemeType>(() => {
    const hashState = getHashState();
    if (hashState && hashState.theme) {
      return hashState.theme;
    }
    return 'polish';
  });

  const [color, setColor] = useState<ColorPalette>(() => {
    const hashState = getHashState();
    if (hashState && hashState.color) {
      return hashState.color;
    }
    return 'blue';
  });
  const [viewMode, setViewMode] = useState<'split' | 'preview'>('split');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [importError, setImportError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [showIframeHelp, setShowIframeHelp] = useState<boolean>(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);

  const [cloudId, setCloudId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  });
  const [isSavingToCloud, setIsSavingToCloud] = useState<boolean>(false);
  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState<boolean>(false);

  // Load resume from Supabase on startup if id query parameter exists
  useEffect(() => {
    if (cloudId) {
      const fetchResume = async () => {
        setIsLoadingFromCloud(true);
        try {
          const data = await loadResume(cloudId);
          if (data) {
            setResumeData(data);
            showToast();
          } else {
            alert("Aucun CV trouvé avec cet identifiant.");
            setCloudId(null);
            const url = new URL(window.location.href);
            url.searchParams.delete('id');
            window.history.replaceState({}, '', url.toString());
          }
        } catch (err: any) {
          console.error("Failed to load resume from Supabase:", err);
          alert("Erreur lors du chargement du CV : " + err.message);
        } finally {
          setIsLoadingFromCloud(false);
        }
      };
      fetchResume();
    }
  }, [cloudId]);

  // Save changes to localStorage for continuous progress persistence
  useEffect(() => {
    localStorage.setItem('arnaldo_resume_data', JSON.stringify(resumeData));
  }, [resumeData]);

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser le CV avec les informations d'origine d'Arnaldo Koutomi ?")) {
      setResumeData(initialResumeData);
      localStorage.removeItem('arnaldo_resume_data');
      setTheme('polish');
      setColor('blue');
      setCloudId(null);
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.replaceState({}, '', url.toString());
      showToast();
    }
  };

  const handleSaveToCloud = async () => {
    setIsSavingToCloud(true);
    try {
      const id = await saveResume(cloudId, resumeData);
      setCloudId(id);
      
      const url = new URL(window.location.href);
      url.searchParams.set('id', id);
      window.history.replaceState({}, '', url.toString());
      
      await navigator.clipboard.writeText(url.toString());
      showToast();
      alert("Votre CV a été sauvegardé avec succès dans le Cloud !\n\nLe lien de partage a été copié dans votre presse-papiers :\n" + url.toString());
    } catch (err: any) {
      console.error("Failed to save resume to Supabase:", err);
      alert("Erreur lors de la sauvegarde sur Supabase : " + err.message);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  const showToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Helper to open the app in a new browser tab for clean layout printing
  const handleOpenInNewTab = () => {
    try {
      const stateToSave = {
        resumeData,
        theme,
        color
      };
      const jsonString = JSON.stringify(stateToSave);
      const utf8Bytes = new TextEncoder().encode(jsonString);
      const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
      const base64 = btoa(binaryString);
      
      const newUrl = `${window.location.origin}${window.location.pathname}#state=${encodeURIComponent(base64)}`;
      window.open(newUrl, '_blank');
    } catch (e) {
      console.error("Failed to serialize state for new tab, opening standard", e);
      window.open(window.location.href, '_blank');
    }
  };

  // High-fidelity PDF Download handler using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById('cv-preview-container');
    if (!element) {
      alert("Le conteneur du CV est introuvable.");
      return;
    }

    setIsDownloadingPDF(true);

    try {
      // Configure html2canvas to capture the full container beautifully with high device pixel ratio
      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution crisp text
        useCORS: true, // Handle images if any
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // Standard A4 width in pixels at 96 DPI
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('cv-preview-container');
          if (!clonedElement) return;

          // Find descendants in original and clone
          const origElements = element.querySelectorAll('*');
          const clonedElements = clonedElement.querySelectorAll('*');

          const origList = [element, ...Array.from(origElements)];
          const clonedList = [clonedElement, ...Array.from(clonedElements)];

          // Cache for converted oklch strings
          const conversionCache = new Map<string, string>();
          const tempEl = clonedDoc.createElement('div');
          tempEl.style.display = 'none';
          clonedDoc.body.appendChild(tempEl);

          // Convert OKLCH coordinates (L, C, H) to standard RGB/RGBA mathematically
          const oklchToRgb = (l: number, c: number, h: number, a: number = 1): string => {
            const hRad = (h * Math.PI) / 180;
            const a_ = c * Math.cos(hRad);
            const b_ = c * Math.sin(hRad);

            const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
            const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
            const s_ = l - 0.0894841775 * a_ - 1.2914855480 * b_;

            const lLinear = l_ * l_ * l_;
            const mLinear = m_ * m_ * m_;
            const sLinear = s_ * s_ * s_;

            const rLinear = +4.0767416621 * lLinear - 3.3077115913 * mLinear + 0.2309699292 * sLinear;
            const gLinear = -1.2684380046 * lLinear + 2.6097574011 * mLinear - 0.3413193965 * sLinear;
            const bLinear = -0.0041960863 * lLinear - 0.7034186147 * mLinear + 1.7076147010 * sLinear;

            const gamma = (x: number): number => {
              if (x <= 0.0031308) {
                return 12.92 * x;
              }
              return 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
            };

            const r = Math.max(0, Math.min(255, Math.round(gamma(rLinear) * 255)));
            const g = Math.max(0, Math.min(255, Math.round(gamma(gLinear) * 255)));
            const b = Math.max(0, Math.min(255, Math.round(gamma(bLinear) * 255)));

            if (a !== undefined && a !== 1) {
              return `rgba(${r}, ${g}, ${b}, ${a})`;
            }
            return `rgb(${r}, ${g}, ${b})`;
          };

          const parseAndConvertOklch = (oklchStr: string): string | null => {
            const match = oklchStr.match(/oklch\(([^)]+)\)/);
            if (!match) return null;

            const content = match[1].trim();
            const parts = content.split(/[\s/]+/).filter(Boolean);
            if (parts.length < 3) return null;

            const lStr = parts[0];
            let l = 0;
            if (lStr.endsWith('%')) {
              l = parseFloat(lStr) / 100;
            } else {
              l = parseFloat(lStr);
            }

            const cStr = parts[1];
            let c = 0;
            if (cStr.endsWith('%')) {
              c = (parseFloat(cStr) / 100) * 0.4;
            } else {
              c = parseFloat(cStr);
            }

            const hStr = parts[2];
            let h = 0;
            if (hStr.endsWith('deg')) {
              h = parseFloat(hStr);
            } else if (hStr.endsWith('rad')) {
              h = (parseFloat(hStr) * 180) / Math.PI;
            } else if (hStr.endsWith('turn')) {
              h = parseFloat(hStr) * 360;
            } else {
              h = parseFloat(hStr);
            }

            let alpha = 1;
            if (parts.length >= 4) {
              const aStr = parts[3];
              if (aStr.endsWith('%')) {
                const parsedAlpha = parseFloat(aStr) / 100;
                if (!isNaN(parsedAlpha)) alpha = parsedAlpha;
              } else {
                const parsedAlpha = parseFloat(aStr);
                if (!isNaN(parsedAlpha)) alpha = parsedAlpha;
              }
            }

            if (isNaN(l) || isNaN(c) || isNaN(h)) {
              return null;
            }

            return oklchToRgb(l, c, h, alpha);
          };

          const convertOklchColorsInText = (text: string): string => {
            if (!text || !text.includes('oklch')) return text;
            
            const oklchRegex = /oklch\([^)]+\)/g;
            return text.replace(oklchRegex, (match) => {
              if (conversionCache.has(match)) {
                return conversionCache.get(match)!;
              }
              
              try {
                const mathematicalConvert = parseAndConvertOklch(match);
                if (mathematicalConvert) {
                  conversionCache.set(match, mathematicalConvert);
                  return mathematicalConvert;
                }
              } catch (e) {
                console.warn("Mathematical color conversion failed:", e);
              }

              try {
                tempEl.style.color = '';
                tempEl.style.color = match;
                const computed = window.getComputedStyle(tempEl).color;
                if (computed && !computed.includes('oklch')) {
                  conversionCache.set(match, computed);
                  return computed;
                }
              } catch (e) {
                console.warn("Error converting color via getComputedStyle:", match, e);
              }
              
              if (match.includes('oklch(0.9') || match.includes('oklch(9') || match.includes('oklch(1 ')) {
                return 'rgb(248, 250, 252)';
              }
              if (match.includes('oklch(0.1') || match.includes('oklch(0.2') || match.includes('oklch(15%')) {
                return 'rgb(15, 23, 42)';
              }
              return 'rgb(100, 116, 139)';
            });
          };

          // Walk through both lists in parallel
          origList.forEach((origEl, idx) => {
            const cloneEl = clonedList[idx] as HTMLElement;
            if (!cloneEl || !origEl) return;

            const computed = window.getComputedStyle(origEl);

            // Apply essential properties as inline styles in standard formats
            const propertiesToSync = [
              'color',
              'backgroundColor',
              'borderColor',
              'borderLeftColor',
              'borderRightColor',
              'borderTopColor',
              'borderBottomColor',
              'fill',
              'stroke'
            ];

            propertiesToSync.forEach((prop) => {
              try {
                const val = computed[prop as any];
                if (val) {
                  if (val.includes('oklch') || val.includes('var(')) {
                    if (val.includes('oklch')) {
                      cloneEl.style[prop as any] = convertOklchColorsInText(val);
                    } else {
                      cloneEl.style[prop as any] = val;
                    }
                  } else {
                    cloneEl.style[prop as any] = val;
                  }
                }
              } catch (err) {
                // ignore
              }
            });
          });

          // Remove the temp element from cloned document
          if (tempEl.parentNode) {
            tempEl.parentNode.removeChild(tempEl);
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      // Standard A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 size
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Add pages if the resume is longer than 1 A4 page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const formattedName = (resumeData.contact.name || "Arnaldo_KOUTOMI").trim().replace(/\s+/g, '_');
      pdf.save(`CV_${formattedName}_${theme}.pdf`);
      showToast();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert("Une erreur s'est produite lors du téléchargement du PDF. Nous allons utiliser la boîte d'impression comme alternative.");
      handlePrint();
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Trigger print dialog of the browser
  const handlePrint = () => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      setShowIframeHelp(true);
    } else {
      try {
        window.print();
      } catch (err) {
        console.error("Print blocked or failed natively:", err);
        setShowIframeHelp(true);
      }
    }
  };

  // Export CV to structured JSON schema file using Blob to guarantee support within sandboxed iframes
  const handleExportJSON = () => {
    try {
      const jsonString = JSON.stringify(resumeData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = `CV_Arnaldo_Koutomi_${theme}_${color}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      
      // Complete asynchronous cleanup for stable file handler release
      setTimeout(() => {
        document.body.removeChild(downloadAnchor);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Standard Blob export failed, trying classic fallback:", err);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `CV_Arnaldo_Koutomi_${theme}_${color}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  // Import CV from structured JSON schema file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Basic validation of fields to ensure file integrity
        if (parsed.contact && parsed.experiences && parsed.education && parsed.skills) {
          const mergedData: ResumeData = {
            ...initialResumeData,
            ...parsed,
            contact: {
              ...initialResumeData.contact,
              ...(parsed.contact || {})
            },
            skills: {
              ...initialResumeData.skills,
              ...(parsed.skills || {})
            },
            experiences: parsed.experiences || initialResumeData.experiences,
            education: parsed.education || initialResumeData.education,
            certifications: parsed.certifications || initialResumeData.certifications,
            languages: parsed.languages || initialResumeData.languages,
            references: parsed.references || initialResumeData.references,
            interests: parsed.interests || initialResumeData.interests,
            signature: {
              ...initialResumeData.signature,
              ...(parsed.signature || {})
            }
          };
          setResumeData(mergedData);
          setImportError(null);
          showToast();
        } else {
          setImportError("Le format du fichier JSON importé est invalide ou incomplet.");
        }
      } catch (err) {
        setImportError("Erreur lors de la lecture du fichier JSON. Assurez-vous qu'il s'agit d'un fichier valide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased">
      {isLoadingFromCloud && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400 mb-3" />
          <p className="text-sm font-semibold">Chargement du CV depuis le Cloud...</p>
        </div>
      )}
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">Changements appliqués avec succès !</span>
        </div>
      )}

      {/* HEADER BAR (Visible in browser, hidden when printing via no-print class) */}
      <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-4 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg text-blue-400 border border-slate-700 shadow-sm">
              <FileText className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight uppercase flex items-center gap-2">
                Arnaldo KOUTOMI <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">CV Interactif</span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5">Visualisez, personnalisez et imprimez votre CV au format A4/PDF de façon optimale.</p>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Print Button */}
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Exporter PDF</span>
            </button>

            {/* Direct PDF Download Button */}
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 ${
                isDownloadingPDF 
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-950/10'
              }`}
              title="Générer et télécharger instantanément le fichier PDF du CV"
            >
              {isDownloadingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              <span>{isDownloadingPDF ? 'Génération...' : 'Télécharger PDF'}</span>
            </button>

            {/* Supabase Cloud Save Button */}
            <button 
              onClick={handleSaveToCloud}
              disabled={isSavingToCloud}
              title="Sauvegarder les données dans le Cloud Supabase et copier le lien"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors active:scale-95 animate-pulse-once"
            >
              {isSavingToCloud ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Cloud className="w-3.5 h-3.5" />
              )}
              <span>Sauvegarder Cloud</span>
            </button>

            {/* Export JSON Schema */}
            <button 
              onClick={handleExportJSON}
              title="Exporter les données du CV en format JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sauvegarder JSON</span>
            </button>

            {/* Import JSON Schema */}
            <label 
              title="Importer des données de CV à partir d'un fichier JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 shadow-sm transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Importer JSON</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportJSON} 
                className="hidden" 
              />
            </label>

            {/* Reset Button */}
            <button 
              onClick={handleReset}
              title="Réinitialiser avec les données originales de l'image"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900 text-slate-400 rounded-lg text-xs font-semibold border border-slate-700 shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-12 gap-6 items-stretch lg:h-[calc(100vh-65px)] lg:overflow-hidden overflow-y-auto">
        
        {/* Mobile View Toggle Tabs (Visible only below lg breakpoint) */}
        <div className="col-span-12 lg:hidden flex bg-slate-200/60 p-1.5 rounded-xl border border-slate-300/50 no-print">
          <button
            onClick={() => {
              setMobileTab('editor');
              setViewMode('split');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              mobileTab === 'editor' && viewMode !== 'preview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100/50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Éditeur (Modifier)</span>
          </button>
          <button
            onClick={() => {
              setMobileTab('preview');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              mobileTab === 'preview' || viewMode === 'preview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu (Rendu A4)</span>
          </button>
        </div>

        {/* LEFT COLUMN: CONTROL & EDIT CENTER (no-print) */}
        <section className={`col-span-12 lg:col-span-5 lg:h-full lg:max-h-full h-auto min-h-0 ${viewMode === 'preview' ? 'hidden' : mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'} flex-col gap-5 lg:overflow-y-auto pr-1 pb-10 no-print`}>
          
          {/* A. VISUAL STYLE CONTROLS CARD */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
              <Palette className="w-4 h-4 text-slate-400" />
              Configuration Visuelle
            </h2>

            {/* Theme Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Gabarit de mise en page</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'polish', name: 'Professional Polish ✨', desc: 'Design luxueux, ultra-soigné' },
                  { id: 'classic', name: 'L\'Original Épuré', desc: 'Structure traditionnelle d\'Arnaldo' },
                  { id: 'modern', name: 'Le Moderne', desc: 'Bannière et chronologie raffinées' },
                  { id: 'minimal', name: 'Le Minimaliste', desc: 'Simple, élégant, optimal ATS' },
                  { id: 'executive', name: 'L\'Exécutif', desc: 'Professionnel avec contrastes' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeType)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      theme === t.id 
                        ? 'border-blue-500 bg-blue-50/50 text-blue-900 shadow-xs' 
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs font-bold">{t.name}</p>
                    <p className="text-[9.5px] text-slate-500 mt-0.5 leading-tight">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Couleur d'accentuation</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'blue', name: 'Bleu Royal', class: 'bg-blue-600' },
                  { id: 'emerald', name: 'Émeraude', class: 'bg-emerald-600' },
                  { id: 'slate', name: 'Gris Ardoise', class: 'bg-slate-700' },
                  { id: 'amber', name: 'Ambre', class: 'bg-amber-600' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id as ColorPalette)}
                    className={`p-2 rounded-lg border flex items-center gap-1.5 text-left transition-all ${
                      color === c.id 
                        ? 'border-slate-800 bg-slate-50 shadow-xs ring-1 ring-slate-800' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${c.class} shrink-0`}></span>
                    <span className="text-[10px] font-bold text-slate-700">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Mode Selector */}
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200/50">
              <span className="text-[10.5px] font-bold text-slate-600">Mode d'affichage</span>
              <div className="flex gap-1 bg-white p-0.5 rounded border border-slate-200">
                <button
                  onClick={() => {
                    setViewMode('split');
                    setMobileTab('editor');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                    viewMode === 'split' 
                      ? 'bg-slate-800 text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Éditeur + CV</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('preview');
                    setMobileTab('preview');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                    viewMode === 'preview' 
                      ? 'bg-slate-800 text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Aperçu Seul</span>
                </button>
              </div>
            </div>
          </div>

          {/* B. IMPORT ERROR ALERT */}
          {importError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-lg text-xs space-y-1">
              <p className="font-bold">Erreur d'importation</p>
              <p className="text-red-600 leading-normal">{importError}</p>
            </div>
          )}

          {/* C. THE REALTIME EDITOR COMPONENT */}
          <CVEditor data={resumeData} onChange={setResumeData} />

          {/* D. AI INTELLIGENT ASSISTANCE COMPONENT */}
          <AISuggestions data={resumeData} />
        </section>

        {/* RIGHT COLUMN: HIGH-FIDELITY LIVE A4 PREVIEW */}
        <section 
          className={`col-span-12 ${
            viewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'
          } ${mobileTab === 'editor' && viewMode !== 'preview' ? 'hidden lg:flex' : 'flex'} lg:h-full lg:max-h-full h-auto min-h-0 flex flex-col items-center justify-start overflow-y-auto pb-20 px-2 lg:px-4 print-container-web`}
        >
          {/* Mode Switch Floating Banner (Preview mode only, to easily return to editing) */}
          {viewMode === 'preview' && (
            <div className="no-print bg-slate-950/90 text-white px-4 py-2.5 rounded-xl border border-slate-800 mb-5 shadow-lg flex items-center gap-3 animate-fade-in backdrop-blur-xs">
              <div className="text-xs">
                <p className="font-bold">Aperçu en Pleine Page</p>
                <p className="text-[10px] text-slate-400">Pour voir le résultat d'impression réel ou modifier des détails.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setViewMode('split');
                    setMobileTab('editor');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold border border-slate-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  Retourner à l'éditeur
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimer le PDF
                </button>
              </div>
            </div>
          )}

          {/* The A4 Canvas Wrapper */}
          <div className="w-full max-w-[210mm] shadow-2xl rounded-xl hover:shadow-slate-300/50 transition-shadow print-wrapper">
            <CVPreview data={resumeData} theme={theme} color={color} />
          </div>

          {/* Direct Print Instruction Alert */}
          <div className="no-print w-full max-w-[210mm] mt-4 p-3.5 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-blue-800 leading-relaxed flex items-start gap-2">
            <Printer className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
            <div>
              <p className="font-bold text-blue-900">Conseil pour l'impression / Exportation PDF :</p>
              <p className="text-blue-700 mt-0.5">
                Cliquez sur le bouton <strong className="font-semibold">"Imprimer / Exporter PDF"</strong> en haut. Dans la fenêtre d'impression de votre navigateur, configurez l'imprimante sur <strong className="font-semibold">"Enregistrer au format PDF"</strong>, réglez la taille du papier sur <strong className="font-semibold">A4</strong>, décochez "En-têtes et pieds de page" et cochez <strong className="font-semibold">"Graphismes d'arrière-plan"</strong> pour un rendu absolument parfait.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Print Help Modal for Iframe Context */}
      {showIframeHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-xs animate-fade-in no-print">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header / Top Right Close */}
            <button 
              onClick={() => setShowIframeHelp(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Banner */}
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
              <Printer className="w-6 h-6" />
            </div>

            {/* Title & Body */}
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Impression / Export PDF
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              L'application est actuellement affichée dans un <strong>espace de prévisualisation sécurisé (Iframe)</strong>. 
              Pour des raisons de sécurité, votre navigateur bloque l'impression directe et le téléchargement depuis cet espace.
            </p>

            {/* Instructions */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/50 space-y-2 mb-5">
              <div className="flex gap-2.5 items-start">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0 mt-0.5">1</span>
                <p className="text-[11px] text-slate-700 font-medium">
                  Cliquez sur le bouton ci-dessous pour ouvrir l'application dans un nouvel onglet indépendant.
                </p>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0 mt-0.5">2</span>
                <p className="text-[11px] text-slate-700 font-medium">
                  Dans cet onglet, cliquez sur <strong className="font-bold text-blue-600">"Imprimer / Exporter PDF"</strong> pour générer votre CV A4 parfait !
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleOpenInNewTab}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ouvrir dans un nouvel onglet
              </button>
              <button
                onClick={() => setShowIframeHelp(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
