import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserRole {
  user: User | null;
  role: 'cook' | 'admin' | 'student' | null;
  loading: boolean;
}

export function useAuth(): UserRole {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'cook' | 'admin' | 'student' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getRole = async (currentUser: User) => {
      try {
        // Check if admin
        const { data: isAdmin } = await supabase
          .rpc('is_admin', { user_id: currentUser.id });

        if (isAdmin) {
          setRole('admin');
          return;
        }

        // Check if cook
        const { data: cook } = await supabase
          .from('cooks')
          .select('id')
          .eq('id', currentUser.id)
          .single();

        if (cook) {
          setRole('cook');
          return;
        }

        // Default to student
        setRole('student');
      } catch (error) {
        console.error('Error determining user role:', error);
        setRole('student'); // Default fallback
      }
    };

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await getRole(session.user);
      } else {
        setUser(null);
        setRole(null);
      }
      
      setLoading(false);
    };

    // Initial check
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (session?.user) {
          setUser(session.user);
          await getRole(session.user);
        } else {
          setUser(null);
          setRole(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, role, loading };
}
