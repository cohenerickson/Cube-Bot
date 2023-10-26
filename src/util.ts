// @ts-ignore
import { Alg } from "cubing/alg";
// @ts-ignore
import { randomScrambleForEvent } from "cubing/scramble";

export function processSequence(sequence: string): string {
  const alg = new Alg(sequence);

  return alg.experimentalSimplify().toString();
}

export async function generateScramble(): Promise<string> {
  return processSequence(await randomScrambleForEvent("333"));
}
