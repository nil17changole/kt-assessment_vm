import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  const { action, payload } = req.body;

  try {
    if (action === "assign") {
      const { employee_id, topic_id, duration, is_open } = payload;

      const { error } = await supabase.from('assessments').insert([
        { employee_id, topic_id, duration, is_open }
      ]);

      return res.json({ success: !error });
    }

    if (action === "getAssignments") {
      const { data } = await supabase
        .from('assessments')
        .select('*');

      return res.json({ success: true, data });
    }

    if (action === "toggle") {
      const { id, is_open } = payload;

      const { error } = await supabase
        .from('assessments')
        .update({ is_open })
        .eq('id', id);

      return res.json({ success: !error });
    }

    return res.json({ success: false });

  } catch (err) {
    return res.status(500).json({ success: false });
  }
}
