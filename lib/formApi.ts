import { supabase } from './supabaseClient';

// Types
export interface Form {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  schema: any;
  created_at?: string;
  updated_at?: string;
  share_id?: string;
}

// Save or update a form
export async function saveForm(form: Form) {
  if (form.id) {
    // Update
    return supabase.from('forms').update({
      ...form,
      updated_at: new Date().toISOString(),
    }).eq('id', form.id);
  } else {
    // Create
    return supabase.from('forms').insert([{
      ...form,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_id: crypto.randomUUID(),
    }]);
  }
}

// Get a form by id or share_id
export async function getForm({ id, share_id }: { id?: string; share_id?: string }) {
  if (id) {
    return supabase.from('forms').select('*').eq('id', id).single();
  }
  if (share_id) {
    return supabase.from('forms').select('*').eq('share_id', share_id).single();
  }
}

// Delete a form
export async function deleteForm(id: string) {
  return supabase.from('forms').delete().eq('id', id);
}

// Submit a response
export async function submitResponse(form_id: string, data: any) {
  return supabase.from('responses').insert([{
    form_id,
    data,
    submitted_at: new Date().toISOString(),
  }]);
}

// Get responses for a form
export async function getResponses(form_id: string) {
  return supabase.from('responses').select('*').eq('form_id', form_id);
}

// Log analytics event
export async function logAnalytics(form_id: string, event: string, meta: any = {}) {
  return supabase.from('analytics').insert([{
    form_id,
    event,
    meta,
    created_at: new Date().toISOString(),
  }]);
}

// Get analytics for a form
export async function getAnalytics(form_id: string) {
  return supabase.from('analytics').select('*').eq('form_id', form_id);
} 