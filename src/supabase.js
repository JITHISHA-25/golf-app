import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cghdncpwytvquwoyyjsj.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnaGRuY3B3eXR2cXV3b3l5anNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDk1MjYsImV4cCI6MjA5MDQyNTUyNn0.Nyd7LJTNa05KsJD99LBUzj7QChAVdUi6D6PwjySuwBU"

export const supabase = createClient(supabaseUrl, supabaseKey)