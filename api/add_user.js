import { supabase } from './_lib/supabase.js';

export default async function handler(req,res){

  const { emp_id, name, password, role } = req.body;

  const { error } = await supabase.from('employees')
  .insert([{ employee_id:emp_id, name, password, role }]);

  res.json({ success: !error });
}
