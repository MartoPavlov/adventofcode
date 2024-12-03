function getFilteredInput(input) {
  return input.split("don't()").reduce((filteredInput, block, index) => {
    if (index === 0 && block) return filteredInput.concat(block);

    const validMutiples = block.split("do()");
    validMutiples.shift();

    return filteredInput.concat(...validMutiples);
  }, "");
}

function day3(input, isPartTwo) {
  const finalInput = isPartTwo ? getFilteredInput(input) : input;

  return finalInput.match(/mul\(\d+,\d+\)/g).reduce((sum, validInstruction) => {
    const numbers = validInstruction.replace(/mul\((.+)\)/, "$1").split(",");

    return (sum += numbers[0] * numbers[1]);
  }, 0);
}

module.exports = { day3 };
