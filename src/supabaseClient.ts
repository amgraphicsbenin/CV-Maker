import { createClient } from '@supabase/supabase-js';
import { ResumeData } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are placeholders
const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '';

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function saveResume(id: string | null, data: ResumeData): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré. Veuillez définir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env.");
  }

  const payload = {
    data,
    updated_at: new Date().toISOString()
  };

  if (id) {
    const { error } = await supabase
      .from('resumes')
      .update(payload)
      .eq('id', id);

    if (error) throw error;
    return id;
  } else {
    const { data: insertedData, error } = await supabase
      .from('resumes')
      .insert(payload)
      .select('id')
      .single();

    if (error) throw error;
    if (!insertedData) throw new Error("Aucune donnée retournée après l'insertion");
    return insertedData.id;
  }
}

export async function loadResume(id: string): Promise<ResumeData | null> {
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré. Veuillez définir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env.");
  }

  const { data, error } = await supabase
    .from('resumes')
    .select('data')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? (data.data as ResumeData) : null;
}
