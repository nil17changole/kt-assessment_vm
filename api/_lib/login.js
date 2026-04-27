import { supabase } from './_lib/supabase';

export default async function handler(req, res) {
  const { employee_id, password } = req.body;

  const { data } = await supabase
    .from('employees')
    .select('*')
    .eq('employee_id', employee_id)
    .single();

  if (!data || data.password !== password) {
    return res.json({ success: false });
  }

  res.json({ success: true, role: data.role });
}