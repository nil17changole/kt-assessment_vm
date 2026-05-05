import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  const { action } = req.query;

  try {

    // ================= USERS =================
    if (action === "get_users") {
      const { data, error } = await supabase.from("employees").select("*");
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (action === "add_user") {
      const { employee_id, name, password, role } = req.body;

      const { error } = await supabase
        .from("employees")
        .insert([{ employee_id, name, password, role }]);

      if (error) throw error;
      return res.status(200).json({ message: "User added" });
    }

    if (action === "delete_user") {
      const { employee_id } = req.body;

      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("employee_id", employee_id);

      if (error) throw error;
      return res.status(200).json({ message: "User deleted" });
    }

    // ================= ADMINS =================
    if (action === "get_admins") {
      const { data, error } = await supabase
        .from("employees")
        .select("employee_id, name")
        .in("role", ["ADMIN", "SUPERADMIN"]);

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    // ================= TOPICS =================
    if (action === "topics") {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .order("id");

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    // ================= QUESTIONS =================
    if (action === "get_questions") {
      const { topic_id } = req.body;

      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("topic_id", topic_id);

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (action === "add_question") {
      const q = req.body;

      const { error } = await supabase.from("questions").insert([q]);

      if (error) throw error;
      return res.status(200).json({ message: "Question added" });
    }

    if (action === "update_question") {
      const { id, ...rest } = req.body;

      const { error } = await supabase
        .from("questions")
        .update(rest)
        .eq("id", id);

      if (error) throw error;
      return res.status(200).json({ message: "Updated" });
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
        .from("employees")
        .select("employee_id, name")
        .eq("role", "EMPLOYEE");

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    // ================= ASSIGN =================
    if (action === "assign") {
      const { employee_id, topic_id, duration, is_open } = req.body;

      const { error } = await supabase
        .from("assessments") // ✅ FIXED
        .insert([{ employee_id, topic_id, duration, is_open }]);

      if (error) throw error;

      return res.status(200).json({ message: "Assigned" });
    }

    // ================= GET ASSIGNMENTS =================
    if (action === "get_assignments") {

      const { data, error } = await supabase
        .from("assessments") // ✅ FIXED
        .select(`
          duration,
          is_open,
          employees ( name ),
          topics ( topic_name )
        `);

      if (error) throw error;

      const result = data.map(a => ({
        employee: a.employees?.name,
        topic: a.topics?.topic_name,
        duration: a.duration,
        is_open: a.is_open
      }));

      return res.status(200).json(result);
    }

    // ================= RESULTS =================
    if (action === "get_results") {
      const { data, error } = await supabase
        .from("attempts")
        .select(`
          score,
          employees ( name ),
          topics ( topic_name )
        `);

      if (error) throw error;

      const result = data.map(r => ({
        name: r.employees?.name,
        topic: r.topics?.topic_name,
        score: r.score
      }));

      return res.status(200).json(result);
    }

    return res.status(400).json({ error: "Invalid action" });

  } catch (err) {
    console.error("🔥 API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
