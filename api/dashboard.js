import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  try {
    const { count: users } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true });

    const { count: topics } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true });

    const { count: questions } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    const { count: attempts } = await supabase
      .from('attempts')
      .select('*', { count: 'exact', head: true });

    res.json({ users, topics, questions, attempts });

  } catch {
    res.status(500).json({ success: false });
  }
}
