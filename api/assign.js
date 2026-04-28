import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {

  const { emp, topic, duration, open } = req.body;

  const { error } = await supabase
    .from('assessments')
    .insert([{
      employee_id: emp,
      topic_id: Number(topic),
      duration: Number(duration),
      is_open: Number(open) === 1
    }]);

  if (error) return res.json({ success: false });

  res.json({ success: true });
}
