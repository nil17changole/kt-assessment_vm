import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  const { action, payload } = req.body;

  try {
    if (action === "getTopics") {
      const { data } = await supabase.from('topics').select('*');
      return res.json({ success: true, data });
    }

    if (action === "addTopic") {
      const { topic_name } = payload;

      const { error } = await supabase
        .from('topics')
        .insert([{ topic_name }]);

      return res.json({ success: !error });
    }

    return res.json({ success: false });

  } catch (err) {
    return res.status(500).json({ success: false });
  }
}
