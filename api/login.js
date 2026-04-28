import { supabase } from './_lib/supabase';

export default async function handler(req, res) {
  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { employee_id, password } = req.body || {};

    if (!employee_id || !password) {
      return res.json({ success: false });
    }

    // Fetch user
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_id', employee_id)
      .single();

    if (error || !data) {
      return res.json({ success: false });
    }

    // 🔥 TEMP: Plain password compare (safe for now)
    if (data.password !== password) {
      return res.json({ success: false });
    }

    // Success
    return res.json({
      success: true,
      role: data.role
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
}
