import { supabase } from './_lib/supabase';

export default async function handler(req, res) {

  const { data } = await supabase
    .from('assessments')
    .select(`
      id,
      duration,
      is_open,
      employees:employee_id ( name ),
      topics:topic_id ( topic_name )
    `);

  const result = data.map(r => ({
    id: r.id,
    employee: r.employees?.name,
    topic: r.topics?.topic_name,
    duration: r.duration,
    is_open: r.is_open ? 1 : 0
  }));

  res.json(result);
}