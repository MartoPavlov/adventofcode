function day1(input, isPartTwo) {
  const leftSide = [];
  const rightSide = [];

  input.split("\n").forEach((line) => {
    const items = line.split(/\s+/);

    leftSide.push(items[0]);
    rightSide.push(items[1]);
  });

  let sum = 0;

  if (isPartTwo) {
    leftSide.forEach((leftItem) => {
      sum +=
        leftItem *
        rightSide.filter((rightItem) => leftItem === rightItem).length;
    });
  } else {
    leftSide.sort();
    rightSide.sort();

    for (let i = 0; i < leftSide.length; i++) {
      sum += Math.abs(leftSide[i] - rightSide[i]);
    }
  }

  return sum;
}

module.exports = {
  day1,
};
