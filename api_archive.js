const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wpjostnquydhwvcltgny.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_e78uAbOF1J2hiSaLTPS8yA_maTBxCze';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // GET — получить архив
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('zones')
                .select('*')
                .eq('user_id', 'default')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            return res.status(200).json(data || []);
        }

        // DELETE — удалить зону по id
        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: 'Не указан id зоны' });
            }

            const { error } = await supabase
                .from('zones')
                .delete()
                .eq('id', id)
                .eq('user_id', 'default');

            if (error) throw error;
            return res.status(200).json({ success: true, message: 'Зона удалена' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('API ошибка:', error);
        return res.status(500).json({ error: error.message });
    }
};