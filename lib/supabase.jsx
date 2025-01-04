import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://adzrewydpoxhzrdmnmhm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkenJld3lkcG94aHpyZG1ubWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MDY2OTIsImV4cCI6MjA1MDk4MjY5Mn0.8GzSkFCLnRAmF_rk7248AugqH6CG9gLJQXAdcTnMBD0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})