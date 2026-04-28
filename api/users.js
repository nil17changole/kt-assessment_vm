import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  const { action, payload } = req.body;

  try {
    if (action === "getUsers") {
      const { data } = await supabase.from('employees').select('*');
      return res.json({ success: true, data });
    }

    if (action === "addUser") {
      const { employee_id, name, password, role } = payload;

      const { error } = await supabase.from('employees').insert([
        { employee_id, name, password, role }
      ]);

      return res.json({ success: !error });
    }

    if (action === "deleteUser") {
      const { employee_id } = payload;

      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('employee_id', employee_id);

      return res.json({ success: !error });
    }

    return res.json({ success: false });

  } catch (err) {
    return res.status(500).json({ success: false });
  }
}
