import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {

  const { id, status } = req.body;

  await supabase
    .from('assessments')
    .update({ is_open: Number(status) === 1 })
    .eq('id', id);

  res.json({ success: true });
}
