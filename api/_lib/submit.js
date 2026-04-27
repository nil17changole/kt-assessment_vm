import { supabase } from './_lib/supabase';

export default async function handler(req,res){

  const { answers, questions, time_taken } = req.body;

  let correct=0;

  questions.forEach((q,i)=>{
    if(answers[i] === q.correct_option) correct++;
  });

  const score = Math.round((correct/questions.length)*100);

  await supabase.from('attempts').insert([{
    employee_id: questions[0].employee_id || '',
    topic_id: questions[0].topic_id,
    score,
    time_taken
  }]);

  res.json({ score });
}