// @ts-ignore
import { randomScrambleForEvent } from "cubing/scramble";

export function processSequence(sequence: string): string {
  const alg = simplify(transform(sequence.toLowerCase().split(/\s/g)));

  return alg.join(" ").toUpperCase();
}

export async function generateScramble(): Promise<string> {
  return processSequence(await randomScrambleForEvent("333"));
}

export function transform(alg: string[], transformation?: string[]) {
  const transformedMoves: string[] = [];

  if (transformation) {
    for (let i = 0; i < alg.length; i++) {
      let move = (alg[i].match(/^[a-z]+/i) ?? "")[0];
      const double = /^[a-z]+2$/i.test(alg[i]);
      const prime = /^[a-z]+'$/i.test(alg[i]);

      if (!move) continue;

      const index = transformation.indexOf(move);

      if (index >= 0) {
        move = transformation[(index + 1) % transformation.length];
        alg[i] = move + (double ? "2" : prime ? "'" : "");
      }
    }
  }

  for (let i = 0; i < alg.length; i++) {
    const move = (alg[i].match(/^[a-z]+/i) ?? "")[0];
    const double = /^[a-z]+2$/i.test(alg[i]);
    const prime = /^[a-z]+'$/i.test(alg[i]);

    if (!move) continue;

    if (move === "x") {
      transformation = ["u", "f", "d", "b"];
      if (prime) transformation = transformation.reverse();
    } else if (move === "y") {
      transformation = ["r", "f", "l", "b"];
      if (prime) transformation = transformation.reverse();
    } else if (move === "z") {
      transformation = ["u", "r", "d", "l"];
      if (prime) transformation = transformation.reverse();
    } else if (move === "m") {
      transformedMoves.push(
        ...transform(
          [
            `x${double ? "2" : prime ? "" : "'"}`,
            `r${double ? "2" : prime ? "'" : ""}`,
            `l${double ? "2" : prime ? "" : "'"}`,
            ...alg.slice(i + 1)
          ]
        )
      );
      break;
    } else if (move === "e") {
      transformedMoves.push(
        ...transform(
          [
            `y${double ? "2" : prime ? "" : "'"}`,
            `u${double ? "2" : prime ? "'" : ""}`,
            `d${double ? "2" : prime ? "" : "'"}`,
            ...alg.slice(i + 1)
          ]
        )
      );
      break;
    } else if (move === "s") {
      transformedMoves.push(
        ...transform(
          [
            `z${double ? "2" : prime ? "'" : ""}`,
            `f${double ? "2" : prime ? "" : "'"}`,
            `b${double ? "2" : prime ? "'" : ""}`,
            ...alg.slice(i + 1)
          ]
        )
      );
      break;
    } else if (move === "u") {
      transformedMoves.push(
        ...`R L F2 B2 R' L' D${
          double ? "2" : prime ? "'" : ""
        } R L F2 B2 R' L'`.split(/\s/g)
      );
      continue;
    } else {
      transformedMoves.push(move + (double ? "2" : prime ? "'" : ""));
      continue;
    }

    transformedMoves.push(
      ...transform(
        double ? [move, ...alg.slice(i + 1)] : alg.slice(i + 1),
        transformation
      )
    );
    break;
  }

  return transformedMoves;
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
