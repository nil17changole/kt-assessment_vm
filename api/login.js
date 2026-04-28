import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  try {
    // Only POST allowed
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    const { employee_id, password } = req.body || {};

    // Validate input
    if (!employee_id || !password) {
      return res.json({
        success: false,
        error: "Missing credentials"
      });
    }

    console.log("LOGIN INPUT:", employee_id, password);

    // ✅ FIX: Ensure string match + safer query
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_id', employee_id.toString().trim());

    console.log("SUPABASE RESPONSE:", data, error);

    // Handle DB error
    if (error) {
      console.error("DB ERROR:", error);
      return res.status(500).json({
        success: false,
        error: "Database error"
      });
    }

    // No user found
    if (!data || data.length === 0) {
      return res.json({
        success: false,
        error: "User not found"
      });
    }

    const user = data[0];

    // Password check
    if (user.password !== password) {
      return res.json({
        success: false,
        error: "Wrong password"
      });
    }

    // ✅ SUCCESS
    return res.json({
      success: true,
      role: user.role
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
}
