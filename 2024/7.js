function day7(input, isPartTwo) {
  const operatorLines = input.split("\r\n");
  let sum = 0;

  operatorLines.forEach((operatorLine) => {
    const operatorLineSections = operatorLine.split(": ");
    const result = Number(operatorLineSections[0]);
    const digits = operatorLineSections[1].split(" ");
    let possibleResultsArray = [];

    /**
     * Recreate a new array for each digit to reflect the new possible
     * result. For example, if we have [1, 2, 3] as digits:
     * - after first step => [1]
     * - after second step => [3, 2, 12]
     * - after third step => [6, 9, 33, 5, 6, 23, 15, 36, 123]
     */
    for (let i = 0; i < digits.length; i++) {
      const numberDigit = Number(digits[i]);
      if (i === 0) {
        possibleResultsArray.push(numberDigit);
      } else {
        possibleResultsArray = possibleResultsArray.reduce(
          (newArray, total) => {
            newArray.push(total + numberDigit);
            newArray.push(total * numberDigit);
            if (isPartTwo) {
              newArray.push(
                Number(total.toString().concat(numberDigit.toString()))
              );
            }

            return newArray;
          },
          []
        );
      }
    }

    sum += !!possibleResultsArray.find((item) => item === result) ? result : 0;
  });

  return sum;
}

module.exports = { day7 };
