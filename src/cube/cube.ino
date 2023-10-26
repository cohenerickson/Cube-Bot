#include <Arduino.h>;
#include <stdio.h>;z

// Motor output pins
int directionPin = 2;
int downPin = 3;
int rightPin = 4;
int leftPin = 5;
int frontPin = 6;
int backPin = 7;

// Num of steps for full rotation
int steps = 200;

// Microseconds between ossilations
int stepDelay = 1000;

void setup() {
  // open serial port
  Serial.begin(115200);

  Serial.println("Ready!");

  // init pins
  pinMode(directionPin, OUTPUT);
  pinMode(downPin, OUTPUT);
  pinMode(rightPin, OUTPUT);
  pinMode(leftPin, OUTPUT);
  pinMode(frontPin, OUTPUT);
  pinMode(backPin, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readString();

    input.trim();

    int size;
    String *result = splitString(input, ' ', size);

    for (int i = 0; i < size; i++) {
      Serial.println(result[i]);

      processMove(result[i]);
    }

    delete[] result;

    Serial.println("Ready!");
  }
}

void processMove(String move) {
  bool ccw = false;
  int rots = 1;
  int motor = 0;

  move.toLowerCase();

  if (move.indexOf('\'') == 1) {
    ccw = true;
  }

  if (move.indexOf('2') == 1) {
    rots = 2;
  }

  if (move.indexOf('d') == 0) {
    motor = downPin;
  } else if (move.indexOf('r') == 0) {
    motor = rightPin;
  } else if (move.indexOf('l') == 0) {
    motor = leftPin;
  } else if (move.indexOf('f') == 0) {
    motor = frontPin;
  } else if (move.indexOf('b') == 0) {
    motor = backPin;
  } else {
    motor = directionPin;
  }

  Serial.print("Motor: ");
  Serial.println(motor);
  Serial.print("Rots: ");
  Serial.println(rots);
  Serial.print("CCW: ");
  Serial.println(ccw);

  turnMotor(motor, rots, ccw);
}

void turnMotor(int motorPin, int rots, bool ccw) {
  digitalWrite(directionPin, ccw);

  for (int i = 0; i < (steps / 4) * rots; i++) {
    digitalWrite(motorPin, HIGH);
    delayMicroseconds(stepDelay);
    digitalWrite(motorPin, LOW);
    delayMicroseconds(stepDelay);
  }
}

String *splitString(String input, char delimiter, int &size) {
  // Count the number of elements by counting delimiter occurrences
  int count = 1;
  for (int i = 0; i < input.length(); i++) {
    if (input.charAt(i) == delimiter) {
      count++;
    }
  }

  // Create an array of Strings to store the split parts
  String *result = new String[count];

  // Initialize variables for parsing
  int startIndex = 0;
  int endIndex = 0;
  int currentIndex = 0;

  // Iterate through the input string
  for (int i = 0; i < input.length(); i++) {
    if (input.charAt(i) == delimiter) {
      endIndex = i;
      result[currentIndex] = input.substring(startIndex, endIndex);
      startIndex = i + 1;
      currentIndex++;
    }
  }

  // Handle the last part of the string
  endIndex = input.length();
  result[currentIndex] = input.substring(startIndex, endIndex);

  // Set the size parameter to the number of split parts
  size = count;

  return result;
}
