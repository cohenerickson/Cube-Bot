// @ts-ignore
import { Alg } from "cubing/alg";
// @ts-ignore
import { randomScrambleForEvent } from "cubing/scramble";

export function processSequence(sequence: string): string {
  const alg = new Alg(
    sequence
      .replaceAll("U2", "R L F2 B2 R' L' D2 R L F2 B2 R' L'")
      .replaceAll("U'", "R L F2 B2 R' L' D' R L F2 B2 R' L'")
      .replaceAll("U", "R L F2 B2 R' L' D R L F2 B2 R' L'")
  );

  return alg.toString();
}

export async function generateScramble(): Promise<string> {
  return processSequence(await randomScrambleForEvent("333"));
}
