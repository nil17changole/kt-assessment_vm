import { supabase } from './_lib/supabase.js';

export default async function handler(req,res){

  const { admin, topic } = req.body;

  await supabase
  .from('admin_topics')
  .insert([{ admin_id:admin, topic_id:topic }]);

  res.json({ success:true });
}
