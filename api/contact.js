import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase contact query error:', error);
        throw error;
      }
      return res.status(200).json(data || []);
    }
    if (req.method === 'POST') {
      const { name, email, phone, message } = req.body;
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({ name, email, phone, message })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Contact API error:', err.message || err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
