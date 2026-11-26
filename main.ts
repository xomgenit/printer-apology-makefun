// The Printer Apology — make.fun one-line bounty entry.
// An office printer's apology note, written to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt when the harness sets it).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The gate, mirrored locally: entry.txt must be 1–120 characters and
// not only white space, or the sealed scorer marks it invalid.
const GATE_MIN = 1;
const GATE_MAX = 120;

function assertGate(text: string): void {
  const chars = [...text].length;
  if (chars < GATE_MIN || chars > GATE_MAX || text.trim().length === 0) {
    throw new Error(`entry fails gate: ${chars} chars (allowed ${GATE_MIN}-${GATE_MAX}, non-whitespace)`);
  }
}

// The apology itself: the printer owns the page-47 jam, blames the
// spreadsheet for the panic, and lands the shared-therapy punchline last.
const apology =
  "Sorry I jammed on page 47. I saw the spreadsheet, panicked, and now we both need therapy.";

function emit(): void {
  assertGate(apology);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "out";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  // No trailing newline: the gate reads the file as-is, and a stray
  // line break would count against the character budget.
  writeFileSync(target, apology, "utf8");
  // Read back what landed on disk and demand an exact match, so a
  // truncated or re-encoded write can never slip through silently.
  const written = readFileSync(target, "utf8");
  if (written !== apology) {
    throw new Error("entry.txt read-back does not match the apology line");
  }
  assertGate(written);
}

emit();
