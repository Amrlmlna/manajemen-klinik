# Super Admin Setup Guide

To create your super admin account, you can either:

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Invite a user" or "Create a user"
4. Enter the email: `amirulmumba@gmail.com`
5. Set a temporary password (or send an invite)
6. Go to the SQL Editor tab
7. Run the following SQL to set the role:

```sql
INSERT INTO profiles (id, email, role, clinic_name, created_at, updated_at)
SELECT auth.users.id, 'amirulmumba@gmail.com', 'super_admin', 'Super Admin', NOW(), NOW()
FROM auth.users
WHERE email = 'amirulmumba@gmail.com';
```

## Option 2: Using Supabase CLI

If you have the Supabase CLI installed, you can run the following command after installing the Node.js script:

1. Install the script dependencies:
```bash
npm install @supabase/supabase-js
```

2. Set your environment variables:
```bash
export NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. Run the script:
```bash
node scripts/create-superadmin.js
```

## Account Details

- Email: `amirulmumba@gmail.com`
- Password: `11111111`
- Role: `super_admin`

## Important Notes

- The super admin account will have access to the `/admin` page
- Regular admin accounts can be created from the admin panel once logged in
- All accounts must be created by an admin or super admin (no public signups)