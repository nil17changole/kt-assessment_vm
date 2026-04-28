import { supabase } from './_lib/supabase.js';

export default async function handler(req,res){
  const { data } = await supabase.from('employees').select('*');
  res.json(data);
}
