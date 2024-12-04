const SEARCHED_WORD = "XMAS";

function countWordsOn(grid, row, col) {
  const offsets = [
    { row: -1, col: -1 },
    { row: -1, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 1 },
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];
  let sum = 0;

  for (let i = 0; i < offsets.length; i++) {
    sum += findWordsByOffsetRecursively(
      grid,
      row,
      col,
      offsets[i].row,
      offsets[i].col
    );
  }

  return sum;
}

function findWordsByOffsetRecursively(
  grid,
  row,
  col,
  offsetRow,
  offsetCol,
  count = 1
) {
  const currentRow = row + offsetRow;
  const currentCol = col + offsetCol;
  const rows = grid.length;
  const cols = grid[0].length;

  if (
    currentRow >= 0 &&
    currentRow < rows &&
    currentCol >= 0 &&
    currentCol < cols &&
    grid[currentRow][currentCol] === SEARCHED_WORD[count]
  ) {
    // we can end the recursion if we have verified all letters
    return count === SEARCHED_WORD.length - 1
      ? 1
      : findWordsByOffsetRecursively(
          grid,
          currentRow,
          currentCol,
          offsetRow,
          offsetCol,
          count + 1
        );
  }

  return 0;
}

function countMasCross(grid, row, col) {
  if (
    row === 0 ||
    row === grid.length - 1 ||
    col === 0 ||
    col === grid[row].length - 1 ||
    grid[row][col] !== SEARCHED_WORD[2]
  ) {
    return 0;
  }

  const crossDictionary = {
    X: 0,
    M: 0,
    A: 0,
    S: 0,
  };

  crossDictionary[grid[row - 1][col - 1]]++;
  crossDictionary[grid[row - 1][col + 1]]++;
  crossDictionary[grid[row + 1][col - 1]]++;
  crossDictionary[grid[row + 1][col + 1]]++;

  /**
   * It is good enough to check if we have two M and S, and one if the diagonals
   * doesn't contain the same letters
   */
  if (
    crossDictionary.M === 2 &&
    crossDictionary.S === 2 &&
    grid[row - 1][col - 1] !== grid[row + 1][col + 1]
  ) {
    return 1;
  }

  return 0;
}

function day4(input, isPartTwo) {
  const lines = input.split("\n");
  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();

    for (let j = 0; j < line.length; j++) {
      if (!isPartTwo && line[j] === SEARCHED_WORD[0]) {
        // In part one we are searching for the letter X as it is the start of the sequence
        sum += countWordsOn(lines, i, j);
      } else if (isPartTwo && line[j] === SEARCHED_WORD[2]) {
        // In part two the letter A is the most important as it is the center of the cross
        sum += countMasCross(lines, i, j);
      }
    }
  }

  return sum;
}

module.exports = {
  day4,
};
