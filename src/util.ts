// @ts-ignore
import { randomScrambleForEvent } from "cubing/scramble";

export function processSequence(sequence: string): string {
  const alg = simplify(
    sequence
      .toString()
      .replace(/u2/gi, "R L F2 B2 R' L' D2 R L F2 B2 R' L'")
      .replace(/u'/gi, "R L F2 B2 R' L' D' R L F2 B2 R' L'")
      .replace(/u/gi, "R L F2 B2 R' L' D R L F2 B2 R' L'")
      .split(/\s/g)
  );

  return alg.join(" ");
}

export async function generateScramble(): Promise<string> {
  return processSequence(await randomScrambleForEvent("333"));
}

export function simplify(alg: string[]): string[] {
  const simplified = [];

  for (let i = 0; i < alg.length; i++) {
    const move = (alg[i].match(/^[a-z]+/i) ?? "")[0];
    const double = /^[a-z]+2$/i.test(alg[i]);
    const prime = /^[a-z]+'$/i.test(alg[i]);

    if (!move) continue;

    const nextMove = ((alg[i + 1] ?? "").match(/^[a-z]+/i) ?? [])[0];
    const nextDouble = /^[a-z]+2$/i.test(alg[i + 1] ?? "");
    const nextPrime = /^[a-z]+'$/i.test(alg[i + 1] ?? "");

    if (move === nextMove) {
      if (double && nextDouble) {
        i++;
        continue;
      }

      if (+double ^ +nextDouble) {
        simplified.push(`${move}${prime || nextPrime ? "" : "'"}`);
        i++;
        continue;
      }

      if (+prime ^ +nextPrime) {
        i++;
        continue;
      }

      simplified.push(`${move}2`);
      i++;
      continue;
    } else {
      simplified.push(`${move}${prime ? "'" : double ? "2" : ""}`);
    }
  }

  if (simplified.length === alg.length) {
    return simplified;
  } else {
    return simplify(simplified);
  }
}
