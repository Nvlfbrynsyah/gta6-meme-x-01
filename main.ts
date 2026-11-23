// make.fun entry runner for gta6-meme-x-01 (Node 22, standard library only).
//
// The judged organism is the X post itself: an agent renders a GTA 6 meme,
// ships it from a public account whose text carries make.fun (linked or
// spelled out) and/or an @makefunai tag plus the play code, and POST.json
// names that post. The house then reads the post from X -- its first picture
// and its text -- and hands it to the judge.
//
// All this program owes the gate is a copy of POST.json at /output/POST.json,
// so it validates the address honestly and refuses to launder a placeholder
// through the build senses. The checked-in POST.json is a placeholder and
// aborts here until a real X status URL replaces it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const SOURCE = join(BOT_DIR, 'POST.json');
const TARGET = join(OUTPUT_DIR, 'POST.json');

const MAX_URL_LENGTH = 16_384;
const REAL_POST_URL = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/[0-9]+$/;

const REPLACE_HINT =
  'POST.json: replace the placeholder with a real X post URL - https://x.com/<handle>/status/<id>, where <id> is the numeric status ID.';

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function readDossier(): { url?: unknown } {
  let raw: string;
  try {
    raw = readFileSync(SOURCE, 'utf8');
  } catch (err) {
    fail(`POST.json could not be read: ${(err as Error).message}`);
  }
  try {
    return JSON.parse(raw) as { url?: unknown };
  } catch (err) {
    fail(`POST.json is not valid JSON: ${(err as Error).message}`);
  }
}

const dossier = readDossier();

if (typeof dossier.url !== 'string') {
  fail(REPLACE_HINT);
}

const url = dossier.url.trim();

if (url.length > MAX_URL_LENGTH) {
  fail(`POST.json: the X post URL must be at most ${MAX_URL_LENGTH} characters, got ${url.length}.`);
}

if (!REAL_POST_URL.test(url)) {
  let hostRace = '';
  try {
    hostRace = new URL(url).host;
  } catch {
    hostRace = '';
  }
  if (hostRace && hostRace !== 'x.com') {
    fail(`POST.json: the post must live on x.com, got host "${hostRace}". ${REPLACE_HINT}`);
  }
  fail(REPLACE_HINT);
}

dossier.url = url;

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(SOURCE, TARGET);
  const bytes = readFileSync(TARGET).byteLength;
  console.log(`Copied ${bytes} bytes from ${SOURCE} to ${TARGET}`);
} catch (err) {
  fail(`POST.json could not be copied from ${BOT_DIR} to ${OUTPUT_DIR}: ${(err as Error).message}`);
}
