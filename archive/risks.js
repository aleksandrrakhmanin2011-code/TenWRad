const { createClient } = require('@supabase/supabase-js');

// ⚠️ ЭТО ВАШИ РЕАЛЬНЫЕ ДАННЫЕ (не загружайте на GitHub в открытом виде!)
const SUPABASE_URL = 'https://wpjostnquydhwvcltgny.supabase.co';
const SUPABASE_KEY = 'sb_publishable_e78uAbOF1J2hiSaLTPS8yA_maTBxCze';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('zones')
                .select('*')
                .eq('user_id', 'default')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return res.status(200).json(data || []);
        }

        if (req.method === 'POST') {
            const body = req.body;
            const zones = Array.isArray(body) ? body : [body];
            
            const processedZones = zones.map(zone => ({
                user_id: 'default',
                coords: zone.coords || [],
                color: zone.color || '#3498db',
                border: zone.border || '#2980b9',
                label: zone.label || 'Риск',
                risk_level: zone.risk_level || 'moderate',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));

            const { data, error } = await supabase
                .from('zones')
                .insert(processedZones)
                .select();

            if (error) throw error;
            return res.status(201).json({ success: true, data });
        }

        if (req.method === 'DELETE') {
            const { error } = await supabase
                .from('zones')
                .delete()
                .eq('user_id', 'default');

            if (error) throw error;
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('API ошибка:', error);
        return res.status(500).json({ error: error.message });
    }
};
