function day11Part1(input) {
  const numberOfBlinks = 25;
  let plutonianPebbles = input.split(" ");

  for (let i = 0; i < numberOfBlinks; i++) {
    plutonianPebbles = plutonianPebbles.reduce(
      (newPlutonianPebbles, plutonianPebble) => {
        if (plutonianPebble === "0") {
          newPlutonianPebbles.push("1");
        } else if (plutonianPebble.length % 2 === 0) {
          const leftPebble = plutonianPebble.substring(
            0,
            plutonianPebble.length / 2
          );
          const rightPebble = Number(
            plutonianPebble.substring(plutonianPebble.length / 2)
          ).toString();

          newPlutonianPebbles.push(leftPebble);
          newPlutonianPebbles.push(rightPebble);
        } else {
          const pebbleNumber = Number(plutonianPebble);

          newPlutonianPebbles.push((pebbleNumber * 2024).toString());
        }

        return newPlutonianPebbles;
      },
      []
    );
  }

  return plutonianPebbles.length;
}

module.exports = { day11Part1 };
