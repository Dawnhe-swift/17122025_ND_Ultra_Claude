---
alwaysApply: true
---
Create a Singapore Nominee Director obligation tracking system with the following architecture:
Project structure should have frontend and backend
- nd-ui - NextJS frontend, React, Tailwind + shadcn/ui
- nd-api - NestJS backend
Avenir font always
Use supabase for database. Do not use Anon key for backend, use supabase service role key
Always use supabase cli for migrations, do not create migrations files yourself
These variables are in .env
SUPABASE_DB_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_PASSWORD