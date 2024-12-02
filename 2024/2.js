function isValidReport(report) {
  let lastChange = 0;

  for (let i = 1; i < report.length; i++) {
    const change = report[i] - report[i - 1];

    if (Math.abs(change) > 3 || (i > 1 && lastChange * change <= 0)) {
      return false;
    }

    lastChange = change;
  }

  return true;
}

function day2(input, isPartTwo) {
  return input.split("\n").filter((line) => {
    const report = line.split(" ");

    if (isPartTwo) {
      for (let i = 0; i < report.length; i++) {
        const result = isValidReport(report.filter((_, index) => i !== index));

        if (result) {
          return true;
        }
      }

      return false;
    }

    return isValidReport(report);
  }).length;
}

module.exports = {
  day2,
};
