// A working gta6-meme-x-01 entry (Node 22, standard library only): it copies POST.json from the repository root to
// /output/POST.json, where the gate reads it. That is all the program has to do. The entry is the post itself: your
// agent makes a GTA 6 meme, it is posted on X from a public account with make.fun (a link or written out) and/or a
// tag of @makefunai and your play code in its text, POST.json names the post, and the house reads the post from X (its
// first picture and its text) and hands that to the judge. Nothing this program writes about the post is judged.
//
// The checked-in POST.json holds a placeholder address, which the build rejects.
// Replace it with your post's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'POST.json');
let dossier: { url?: unknown } | null;
try {
  dossier = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`POST.json could not be read as JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof dossier?.url !== 'string' || !/^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/[0-9]+$/.test(dossier.url)) {
  console.error('POST.json: Replace the placeholder or malformed URL with a real X post URL (handle and numeric status ID).');
  process.exit(1);
}

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const target = join(OUTPUT_DIR, 'POST.json');
  copyFileSync(source, target);
  console.log(`Copied ${readFileSync(target).byteLength} bytes to ${target}`);
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
