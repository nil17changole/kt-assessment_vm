import { supabase } from './_lib/supabase.js';

export default async function handler(req,res){

  const id = req.query.id;

  await supabase.from('employees')
  .delete()
  .eq('employee_id', id);

  res.json({ success:true });
}
