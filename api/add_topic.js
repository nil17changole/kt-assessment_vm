import { supabase } from './_lib/supabase.js';

export default async function handler(req,res){

  const { name } = req.body;

  const { error } = await supabase
  .from('topics')
  .insert([{ topic_name:name }]);

  res.json({ success: !error });
}
