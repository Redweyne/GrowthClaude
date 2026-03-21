/**
 * Checks all spark video YouTube IDs for availability.
 * Run: npx tsx scripts/check-spark-videos.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Extract YouTube IDs from sparkVideos.ts without needing path aliases
const sparkFile = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'content', 'sparkVideos.ts'),
  'utf-8',
);
const idMatches = [...sparkFile.matchAll(/youtubeId:\s*'([^']+)'/g)];
const videos = idMatches.map((m) => m[1]);

console.log(`\nChecking ${videos.length} spark videos...\n`);

interface CheckResult {
  youtubeId: string;
  ok: boolean;
  status: number;
  title?: string;
}

async function checkVideo(youtubeId: string): Promise<CheckResult> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as { title?: string };
      return { youtubeId, ok: true, status: res.status, title: data.title };
    }
    return { youtubeId, ok: false, status: res.status };
  } catch {
    return { youtubeId, ok: false, status: 0 };
  }
}

async function main() {
  // Check in batches of 5 to avoid rate limiting
  const results: CheckResult[] = [];
  for (let i = 0; i < videos.length; i += 5) {
    const batch = videos.slice(i, i + 5);
    const batchResults = await Promise.all(batch.map(checkVideo));
    results.push(...batchResults);
    // Brief pause between batches
    if (i + 5 < videos.length) await new Promise((r) => setTimeout(r, 500));
  }

  const ok = results.filter((r) => r.ok);
  const broken = results.filter((r) => !r.ok);

  console.log(`  ${ok.length} videos OK`);
  if (broken.length > 0) {
    console.log(`  ${broken.length} videos BROKEN:\n`);
    for (const r of broken) {
      console.log(`    - ${r.youtubeId} (HTTP ${r.status})`);
    }
  } else {
    console.log('  All videos are accessible!\n');
  }

  // Show first few titles as sanity check
  console.log('Sample titles:');
  for (const r of ok.slice(0, 3)) {
    console.log(`  ${r.youtubeId}: "${r.title}"`);
  }

  process.exit(broken.length > 0 ? 1 : 0);
}

main();
