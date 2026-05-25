import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { category } = req.query;
      let query = supabase.from('menu_items').select('*').order('category', { ascending: true }).order('id', { ascending: true });
      if (category) query = query.eq('category', category);
      const { data, error } = await query;
      if (error) {
        console.error('Supabase menu query error:', error);
        throw error;
      }
      return res.status(200).json(data || []);
    }
    if (req.method === 'POST') {
      const { name, description, price, category, image_url, is_popular } = req.body;
      const { data, error } = await supabase
        .from('menu_items')
        .insert({ name, description, price, category, image_url, is_popular })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Menu API error:', err.message || err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
