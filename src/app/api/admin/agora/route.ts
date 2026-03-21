import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabaseService';
import { z } from 'zod';

const PatchSchema = z.object({
  postId: z.string().uuid(),
  status: z.enum(['open', 'heard', 'in_progress', 'done']),
});

function validateAuth(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret === 'change-this-to-a-secure-random-string') return false;
  const auth = request.headers.get('authorization');
  if (!auth) return false;
  return auth.replace('Bearer ', '') === secret;
}

export async function PATCH(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { error } = await supabase
    .from('agora_posts')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.postId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
