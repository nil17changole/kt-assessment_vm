import { supabase } from './_lib/supabase';

export default async function handler(req, res) {
  const { data } = await supabase
    .from('topics')
    .select('*');

  res.json(data);
}