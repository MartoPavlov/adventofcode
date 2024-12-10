function findAllTrailHeads(hikingMap) {
  const trailheadsArray = [];

  for (let i = 0; i < hikingMap.length; i++) {
    const hikingMapLine = hikingMap[i];

    for (let j = 0; j < hikingMapLine.length; j++) {
      if (hikingMapLine[j] === "0") {
        trailheadsArray.push({ row: i, col: j });
      }
    }
  }

  return trailheadsArray;
}

/**
 * Checks if the trail is out of bounds and that the trail elevation
 * is only increasing by from the @prevStep
 * @param {Array} hikingMap
 * @param {number} row
 * @param {number} col
 * @param {number} prevStep
 * @returns boolean
 */
function isValidNextStep(hikingMap, row, col, prevStep) {
  const maxRows = hikingMap.length - 1;
  const maxCols = hikingMap[0].length - 1;

  return (
    row >= 0 &&
    row <= maxRows &&
    col >= 0 &&
    col <= maxCols &&
    Number(hikingMap[row][col]) - prevStep === 1
  );
}

/**
 * Calculates the score for the trailhead by checking all the paths
 * that start from 0 and end on a 9, by moving by one number either
 * left, right, down or up on the map.
 * For part two we don't want to filter duplicate paths as there we are
 * trying to find all possible paths that lead to a 9 and not only to
 * how many unique 9s the trailhead leads to.
 * @param {Array} hikingMap
 * @param {number} trailheadRow
 * @param {number} trailheadCol
 * @param {boolean} isPartTwo
 * @returns number
 */
function getTrailheadScore(hikingMap, trailheadRow, trailheadCol, isPartTwo) {
  let trailArray = [{ row: trailheadRow, col: trailheadCol }];

  for (let i = 0; i < 9; i++) {
    trailArray = trailArray.reduce((nextStepArray, item) => {
      const directionOffsets = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ];

      for (let j = 0; j < directionOffsets.length; j++) {
        const newRow = item.row + directionOffsets[j].row;
        const newCol = item.col + directionOffsets[j].col;

        if (
          isValidNextStep(hikingMap, newRow, newCol, i) &&
          (isPartTwo ||
            !nextStepArray.find(
              (trail) => trail.row === newRow && trail.col === newCol
            ))
        ) {
          nextStepArray.push({ row: newRow, col: newCol });
        }
      }

      return nextStepArray;
    }, []);
  }

  return trailArray.length;
}

function day10(input, isPartTwo) {
  const hikingMap = input.split("\r\n");
  const trailheadsArray = findAllTrailHeads(hikingMap);

  return trailheadsArray.reduce((sum, trailhead) => {
    return (
      sum +
      getTrailheadScore(hikingMap, trailhead.row, trailhead.col, isPartTwo)
    );
  }, 0);
}

module.exports = { day10 };
