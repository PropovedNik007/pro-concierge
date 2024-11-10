import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUser() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session?.user; // Return user information
}


export async function signUp(email, password, role = 'client') {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role // Assign role to user_metadata
            }
        }
    });
    if (error) throw error;
    return data;
}

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;

    // Retrieve user’s role from user_metadata
    const userRole = data.user?.user_metadata?.role;
    return { user: data.user, role: userRole };
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}