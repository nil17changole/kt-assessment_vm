import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  try {

    const [users, topics, questions, attempts] = await Promise.all([
      supabase.from('employees').select('*', { count: 'exact', head: true }),
      supabase.from('topics').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
      supabase.from('attempts').select('*', { count: 'exact', head: true }),
    ]);

    res.json({
      users: users.count || 0,
      topics: topics.count || 0,
      questions: questions.count || 0,
      attempts: attempts.count || 0
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
