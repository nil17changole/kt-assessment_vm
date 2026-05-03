import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  const { action } = req.query;

  try {

    // ================= USERS =================
    if (action === "get_users") {
      const { data, error } = await supabase
        .from("employees")
        .select("*");

      if (error) throw error;

      return res.status(200).json(data);
    }

    if (action === "add_user") {
      const { emp_id, name, password, role } = req.body;

      if (!emp_id || !name || !password) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const { error } = await supabase
        .from("employees")
        .insert([{
          employee_id: emp_id,
          name,
          password,
          role
        }]);

      if (error) throw error;

      return res.status(200).json({ message: "User added" });
    }

    // ================= TOPICS =================
    if (action === "get_topics") {
      const { data, error } = await supabase
        .from("topics")
        .select("*");

      if (error) throw error;

      return res.status(200).json(data);
    }

    // ================= ADMINS =================
    if (action === "get_admins") {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("role", "ADMIN");

      if (error) throw error;

      return res.status(200).json(data);
    }

    // ================= PERMISSIONS =================
    if (action === "assign_permission") {
      const { admin_id, topic_id } = req.body;

      if (!admin_id || !topic_id) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const { error } = await supabase
        .from("admin_topics")
        .insert([{ admin_id, topic_id }]);

      if (error) throw error;

      return res.status(200).json({ message: "Assigned successfully" });
    }

    // ================= DEFAULT =================
    return res.status(400).json({ error: "Invalid action" });

  } catch (err) {
    console.error("API ERROR:", err);

    // ✅ IMPORTANT FIX: ALWAYS RETURN JSON
    return res.status(500).json({
      error: err.message || "Internal Server Error"
    });
  }
}
