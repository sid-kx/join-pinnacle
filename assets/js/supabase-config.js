import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://daxrirnhbcfpqzswjofl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZQSOJjMvm6ypIfe3dOQBdw_qFcEorrb";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);