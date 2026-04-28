import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {

  const { action } = req.query;

  try {

    // ================= USERS =================
    if (action === "get_users") {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      return res.json(data);
    }

    if (action === "add_user") {
      const { emp_id, name, password, role } = req.body;

      const { error } = await supabase.from("users").insert([
        { emp_id, name, password, role }
      ]);

      if (error) throw error;
      return res.json({ message: "User added" });
    }

    // ================= TOPICS =================
    if (action === "get_topics") {
      const { data, error } = await supabase.from("topics").select("*");
      if (error) throw error;
      return res.json(data);
    }

    if (action === "add_topic") {
      const { topic } = req.body;

      const { error } = await supabase.from("topics").insert([{ topic }]);
      if (error) throw error;

      return res.json({ message: "Topic added" });
    }

    // ================= QUESTIONS UPLOAD =================
    if (action === "upload_questions") {
  try {
    console.log("BODY:", req.body);

    const { topic, questions } = req.body;

    if (!topic || !questions || !questions.length) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const payload = questions.map(q => ({
      topic,
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer
    }));

    const { error } = await supabase.from("questions").insert(payload);

    if (error) throw error;

    return res.json({ message: "Uploaded successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

    // ================= DASHBOARD =================
    if (action === "dashboard") {
      const users = await supabase.from("users").select("*", { count: "exact", head: true });
      const topics = await supabase.from("topics").select("*", { count: "exact", head: true });
      const questions = await supabase.from("questions").select("*", { count: "exact", head: true });
      const attempts = await supabase.from("results").select("*", { count: "exact", head: true });

      return res.json({
        users: users.count,
        topics: topics.count,
        questions: questions.count,
        attempts: attempts.count
      });
    }

    // ================= ASSESSMENT =================
    if (action === "get_assessment") {
      const { topic } = req.query;

      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("topic", topic);

      if (error) throw error;

      return res.json({
        topic,
        duration: 30,
        questions: data
      });
    }

    // ================= SUBMIT =================
    if (action === "submit") {
      const { answers, questions } = req.body;

      let score = 0;

      questions.forEach((q, i) => {
        if (answers[i] === q.correct_answer) score++;
      });

      score = (score / questions.length) * 100;

      await supabase.from("results").insert([{ score }]);

      return res.json({ score });
    }

    // ================= DEFAULT =================
    return res.status(400).json({ error: "Invalid action" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
