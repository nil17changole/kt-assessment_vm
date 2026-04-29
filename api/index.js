import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  const { action } = req.query;

  try {

    // ================= USERS =================
    if (action === "get_users") {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (action === "add_user") {
      const { emp_id, name, password, role } = req.body;

      const { error } = await supabase.from("users").insert([
        { emp_id, name, password, role }
      ]);

      if (error) throw error;
      return res.status(200).json({ message: "User added" });
    }

    // ================= TOPICS =================
    // ================= TOPICS =================
// ================= TOPICS =================
if (action === "topics") {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;

  return res.status(200).json(data);
}

if (action === "add_topic") {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  const { error } = await supabase
    .from("topics")
    .insert([{ name: topic }]);  // ✅ FIXED

  if (error) throw error;

  return res.status(200).json({ message: "Topic added" });
}

    // ================= QUESTIONS UPLOAD =================
    if (action === "upload_questions") {
      const { topic, questions } = req.body;

      if (!topic || !questions || !questions.length) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      // Step 1: get topic_id from topics table
      const { data: topicData, error: topicError } = await supabase
        .from("topics")
        .select("id")
        .eq("topic", topic)
        .single();

      if (topicError || !topicData) {
        return res.status(400).json({ error: "Topic not found" });
      }

      const topic_id = topicData.id;

      // Step 2: prepare payload
      const payload = questions.map(q => ({
        topic_id,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option
      }));

      const { error } = await supabase.from("questions").insert(payload);

      if (error) throw error;

      return res.status(200).json({ message: "Uploaded successfully" });
    }

    // ================= DASHBOARD =================
    if (action === "dashboard") {
      const users = await supabase.from("users").select("*", { count: "exact", head: true });
      const topics = await supabase.from("topics").select("*", { count: "exact", head: true });
      const questions = await supabase.from("questions").select("*", { count: "exact", head: true });
      const attempts = await supabase.from("results").select("*", { count: "exact", head: true });

      return res.status(200).json({
        users: users.count || 0,
        topics: topics.count || 0,
        questions: questions.count || 0,
        attempts: attempts.count || 0
      });
    }

    // ================= ASSESSMENT =================
    if (action === "get_assessment") {
      const { topic } = req.query;

      if (!topic) {
        return res.status(400).json({ error: "Topic required" });
      }

      // Get topic_id
      const { data: topicData, error: topicError } = await supabase
        .from("topics")
        .select("id")
        .eq("topic", topic)
        .single();

      if (topicError || !topicData) {
        return res.status(400).json({ error: "Topic not found" });
      }

      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("topic_id", topicData.id);

      if (error) throw error;

      return res.status(200).json({
        topic,
        duration: 30,
        questions: data
      });
    }

    // ================= SUBMIT =================
    if (action === "submit") {
      const { answers, questions } = req.body;

      if (!answers || !questions) {
        return res.status(400).json({ error: "Invalid submission" });
      }

      let score = 0;

      questions.forEach((q, i) => {
        if (answers[i] === q.correct_option) score++;
      });

      score = (score / questions.length) * 100;

      await supabase.from("results").insert([{ score }]);

      return res.status(200).json({ score });
    }

    // ================= DEFAULT =================
    return res.status(400).json({ error: "Invalid action" });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
