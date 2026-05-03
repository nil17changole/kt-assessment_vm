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

    if (action === "delete_user") {
      const { emp_id } = req.body;

      const { error } = await supabase
        .from("users")
        .delete()
        .eq("emp_id", emp_id);

      if (error) throw error;

      return res.status(200).json({ message: "User deleted" });
    }

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

      const { error } = await supabase
        .from("topics")
        .insert([{ topic_name: topic }]);

      if (error) throw error;

      return res.status(200).json({ message: "Topic added" });
    }

    // ================= QUESTIONS =================
    if (action === "upload_questions") {
      const { topic, questions } = req.body;

      const { data: topicData } = await supabase
        .from("topics")
        .select("id")
        .eq("topic_name", topic)
        .single();

      if (!topicData) {
        return res.status(400).json({ error: "Topic not found" });
      }

      const payload = questions.map(q => ({
        topic_id: topicData.id,
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

    if (action === "get_questions") {
      const { topic_id } = req.body;

      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("topic_id", topic_id);

      if (error) throw error;

      return res.status(200).json(data);
    }

    if (action === "delete_question") {
      const { id } = req.body;

      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return res.status(200).json({ message: "Deleted" });
    }

    // ================= EMPLOYEES =================
    if (action === "get_employees") {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "EMPLOYEE");

      if (error) throw error;

      return res.status(200).json(data);
    }

    // ================= ADMIN TOPICS =================
    if (action === "get_admin_topics") {
      const { data, error } = await supabase
        .from("topics")
        .select("*");

      if (error) throw error;

      return res.status(200).json(data);
    }

    // ================= ASSIGN =================
    if (action === "assign") {
      const { employee_id, topic_id, duration, is_open } = req.body;

      const { error } = await supabase
        .from("assignments")
        .insert([{
          employee_id,
          topic_id,
          duration,
          is_open
        }]);

      if (error) throw error;

      return res.status(200).json({ message: "Assigned successfully" });
    }

    // ================= GET ASSIGNMENTS =================
    if (action === "get_assignments") {
      const { data, error } = await supabase
        .from("assignments")
        .select(`
          id,
          duration,
          is_open,
          users(name),
          topics(topic_name)
        `);

      if (error) throw error;

      const formatted = data.map(a => ({
        id: a.id,
        employee: a.users?.name,
        topic: a.topics?.topic_name,
        duration: a.duration,
        is_open: a.is_open
      }));

      return res.status(200).json(formatted);
    }

    // ================= SUBMIT =================
    if (action === "submit") {
      const { answers, questions, employee_id, topic_id } = req.body;

      let score = 0;

      questions.forEach((q, i) => {
        if (answers[i] === q.correct_option) score++;
      });

      score = (score / questions.length) * 100;

      const { error } = await supabase
        .from("results")
        .insert([{
          employee_id,
          topic_id,
          score
        }]);

      if (error) throw error;

      return res.status(200).json({ score });
    }

    // ================= RESULTS =================
    if (action === "get_results") {
      const { data, error } = await supabase
        .from("results")
        .select(`
          score,
          users(name),
          topics(topic_name)
        `);

      if (error) throw error;

      const formatted = data.map(r => ({
        name: r.users?.name,
        topic: r.topics?.topic_name,
        score: r.score
      }));

      return res.status(200).json(formatted);
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

    return res.status(400).json({ error: "Invalid action" });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ================= GET ASSESSMENT =================
if (action === "get_assessment") {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ error: "Topic required" });
  }

  // ✅ FIX: use topic_name
  const { data: topicData, error: topicError } = await supabase
    .from("topics")
    .select("id")
    .eq("topic_name", topic)
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
    questions: data || []
  });
}

// ================= ADD QUESTION =================
if (action === "add_question") {
  const { topic_id, question, option_a, option_b, option_c, option_d, correct_option } = req.body;

  const { error } = await supabase.from("questions").insert([{
    topic_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option
  }]);

  if (error) throw error;

  return res.status(200).json({ message: "Question added" });
}


// ================= UPDATE QUESTION =================
if (action === "update_question") {
  const { id, question, option_a, option_b, option_c, option_d, correct_option } = req.body;

  const { error } = await supabase
    .from("questions")
    .update({
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option
    })
    .eq("id", id);

  if (error) throw error;

  return res.status(200).json({ message: "Updated" });
}


// ================= DELETE QUESTION =================
if (action === "delete_question") {
  const { id } = req.body;

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return res.status(200).json({ message: "Deleted" });
}

// ================= GET RESULTS =================
if (action === "get_results") {
  const { data, error } = await supabase
    .from("attempts")
    .select(`
      score,
      employees(name),
      topics(topic_name)
    `);

  if (error) throw error;

  const formatted = data.map(r => ({
    name: r.employees?.name,
    topic: r.topics?.topic_name,
    score: r.score
  }));

  return res.status(200).json(formatted);
}
