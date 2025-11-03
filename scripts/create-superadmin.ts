import { createClient } from "@supabase/supabase-js";

// This script should be run with appropriate environment variables set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createSuperAdmin() {
  const email = "amirulmumba@gmail.com";
  const password = "11111111";
  const clinicName = "Super Admin";

  try {
    // Create the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirm the email automatically
    });

    if (authError) {
      console.error("Error creating user:", authError);
      return;
    }

    const userId = authData.user.id;
    console.log(`User created with ID: ${userId}`);

    // Insert user profile into the profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          email,
          role: "super_admin",
          clinic_name: clinicName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);

    if (profileError) {
      console.error("Error creating profile:", profileError);
      
      // If profile creation fails, try to clean up by deleting the auth user
      await supabase.auth.admin.deleteUser(userId);
      console.log("Rolled back user creation due to profile error");
      return;
    }

    console.log("Super admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: super_admin`);
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

createSuperAdmin();