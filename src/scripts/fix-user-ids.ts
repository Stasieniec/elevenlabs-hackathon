import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUserIds() {
  const tables = [
    'user_progress',
    'chapter_progress',
    'course_enrollments',
    'conversation_performances',
    'user_preferences',
    'user_goals'
  ];

  for (const table of tables) {
    console.log(`Fixing user IDs in ${table}...`);
    
    // Get all records where user_id doesn't start with 'user_'
    const { data, error: fetchError } = await supabase
      .from(table)
      .select('id, user_id')
      .not('user_id', 'like', 'user_%');

    if (fetchError) {
      console.error(`Error fetching records from ${table}:`, fetchError);
      continue;
    }

    if (!data || data.length === 0) {
      console.log(`No records to update in ${table}`);
      continue;
    }

    console.log(`Found ${data.length} records to update in ${table}`);

    // Update each record
    for (const record of data) {
      const { error: updateError } = await supabase
        .from(table)
        .update({ user_id: `user_${record.user_id}` })
        .eq('id', record.id);

      if (updateError) {
        console.error(`Error updating record ${record.id} in ${table}:`, updateError);
      }
    }

    console.log(`Finished updating ${table}`);
  }
}

// Run the script
fixUserIds()
  .then(() => {
    console.log('All updates completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 