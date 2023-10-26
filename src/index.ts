import { generateScramble, processSequence } from "./util";
import ora from "ora";
import prompts from "prompts";
import { SerialPort } from "serialport";

const port = new SerialPort({
  path: "COM3",
  baudRate: 115200
});

port.on("open", () => {
  awaitInput();
});

port.on("data", (data) => {
  const message = data.toString("utf-8").trim();

  if (currentProcess && message === "Ready!") {
    resolveCurrent();
    currentProcess = null;
  }
});

let currentProcess: Promise<void> | null;
let resolveCurrent: () => void;

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
    case "scramble": {
      const spinner = ora("Generating scramble").start();
      const scramble = await generateScramble();

      spinner.text = "Executing scramble";

      currentProcess = new Promise<void>((resolve) => {
        resolveCurrent = resolve;
        port.write(scramble + "\n", "utf-8");
      });

      await currentProcess;

      spinner.stop();
      awaitInput();
      break;
    }
    case "algorithm": {
      const { notation } = await prompts({
        type: "text",
        name: "notation",
        message: "Enter algorithm to run"
      });
      const sequence = processSequence(notation);
      const spinner = ora("Executing algorithm").start();

      currentProcess = new Promise<void>((resolve) => {
        resolveCurrent = resolve;
        port.write(sequence + "\n", "utf-8");
      });

      await currentProcess;

      spinner.stop();
      awaitInput();
      break;
    }
    default:
      awaitInput();
      break;
  }
}
