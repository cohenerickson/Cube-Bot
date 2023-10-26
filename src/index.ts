// @ts-ignore
import { Alg } from "cubing/alg";
// @ts-ignore
import { randomScrambleForEvent } from "cubing/scramble";
import ora from "ora";
import prompts from "prompts";
import { SerialPort } from "serialport";

const port = new SerialPort({
  path: "COM3",
  baudRate: 115200
});

let currentProcess: Promise<void> | null;
let resolveCurrent: () => void;

port.on("open", () => {
  awaitInput();
});

port.on("data", () => {
  if (currentProcess) {
    resolveCurrent();
  }
});

async function awaitInput() {
  const { action } = await prompts({
    type: "select",
    name: "action",
    message: "Choose an action",
    choices: [
      { title: "Random Scramble", value: "scramble" },
      { title: "Run Algorithm", value: "algorithm" }
    ]
  });

  switch (action) {
    // Run scramble on cube
    case "scramble": {
      // Generate scramble
      const spinner = ora("Generating scramble").start();
      const scramble = randomScrambleForEvent("333");

      // Execute scramble on cube
      spinner.text = "Executing scramble - ";
      const currentProcess = new Promise<void>((resolve) => {
        resolveCurrent = resolve;
        port.write(scramble + "\n");
      });

      // Wait for cube to finish
      await currentProcess;
      spinner.stop();

      // Wait for further input
      awaitInput();
      break;
    }
    // Run user submitted algorithm
    case "algorithm": {
      // Get alg
      const { rawAlg } = (await prompts({
        type: "text",
        name: "rawAlg",
        message: "Enter algorithm to run"
      })) as { rawAlg: string };

      // Modify alg to be compatible with 5 sides
      const alg = new Alg(
        rawAlg
          .replace(/u[^'2]/i, "")
          .replace(/u'/i, "")
          .replace(/u2/i, "")
      );

      // Execute algorithm on cube
      const spinner = ora("Executing algorithm").start();
      const currentProcess = new Promise<void>((resolve) => {
        resolveCurrent = resolve;
        port.write(alg.experimentalSimplify().toString() + "\n");
      });

      // Wait for cube to finish
      await currentProcess;
      spinner.stop();

      // Wait for further input
      awaitInput();
      break;
    }
    default:
      awaitInput();
      break;
  }
}
