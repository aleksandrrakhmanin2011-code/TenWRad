const { createClient } = require('@supabase/supabase-js');

// ⚠️ ВАШИ РЕАЛЬНЫЕ ДАННЫЕ
const SUPABASE_URL = 'https://wpjostnquydhwvcltgny.supabase.co';
const SUPABASE_KEY = 'sb_publishable_e78uAbOF1J2hiSaLTPS8yA_maTBxCze';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const { data, error } = await supabase
            .from('zones')
            .select('count', { count: 'exact', head: true })
            .eq('user_id', 'default');

        if (error) throw error;
        return res.status(200).json({
            status: 'online',
            timestamp: new Date().toISOString(),
            count: data || 0
        });
    } catch (error) {
        return res.status(500).json({
            status: 'offline',
            error: error.message
        });
    }
};
