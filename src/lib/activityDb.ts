// Re-exports the shared Supabase service client for analytics.
// The old Prisma/SQLite client has been removed — all analytics now go to Supabase.
export { getServiceClient } from './supabaseService';
