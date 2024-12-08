/**
 * Generates a string -> array pairs for each antenna type. For example:
 * - { a: [{row: 1, col: 1}, { row: 2, col: 2 }], b: [{ 5, 6 }] }
 * @param {Array} cityGrid
 * @returns - dictionary
 */
function generateAntennaDictionary(cityGrid) {
  return cityGrid.reduce((antennaDictionary, cityLine, row) => {
    for (let col = 0; col < cityLine.length; col++) {
      const currentCharacter = cityLine[col];

      if (currentCharacter !== ".") {
        if (antennaDictionary[currentCharacter]) {
          antennaDictionary[currentCharacter].push({ row, col });
        } else {
          antennaDictionary[currentCharacter] = [{ row, col }];
        }
      }
    }

    return antennaDictionary;
  }, {});
}

function isInGridBounds(cityGrid, row, col) {
  const maxRow = cityGrid.length;
  const maxCol = cityGrid[0].length;

  return row >= 0 && row < maxRow && col >= 0 && col < maxCol;
}

function getAllAntinodesForDiff(cityGrid, antenna, rowDiff, colDiff, maxCount) {
  const antinodes = [];
  let count = 1;

  while (
    isInGridBounds(
      cityGrid,
      antenna.row + rowDiff * count,
      antenna.col + colDiff * count
    ) &&
    count <= maxCount
  ) {
    antinodes.push({
      row: antenna.row + rowDiff * count,
      col: antenna.col + colDiff * count,
    });
    count++;
  }

  return antinodes;
}

function calculateAntinodes(cityGrid, antennaDictionary, isPartTwo) {
  return Object.keys(antennaDictionary).reduce(
    (antinodesArray, antennaType) => {
      const antennaArray = antennaDictionary[antennaType];
      let antinodesForTypeArray = [];

      for (let i = 0; i < antennaArray.length; i++) {
        const currentAntenna = antennaArray[i];

        // for part two the antennas themself are counted as antinodes
        isPartTwo && antinodesForTypeArray.push(currentAntenna);

        for (let j = i + 1; j < antennaArray.length; j++) {
          const compareAntenna = antennaArray[j];
          const rowDiff = currentAntenna.row - compareAntenna.row;
          const colDiff = currentAntenna.col - compareAntenna.col;

          // concat all antinodes for the upper diagonal and lower diagonal
          antinodesForTypeArray = antinodesForTypeArray
            .concat(
              getAllAntinodesForDiff(
                cityGrid,
                currentAntenna,
                rowDiff,
                colDiff,
                isPartTwo ? cityGrid.length : 1
              )
            )
            .concat(
              getAllAntinodesForDiff(
                cityGrid,
                compareAntenna,
                -rowDiff,
                -colDiff,
                isPartTwo ? cityGrid.length : 1
              )
            );
        }
      }

      // filter antinodes that already exist
      return antinodesArray.concat(
        antinodesForTypeArray.filter(
          (antinodeForType) =>
            !antinodesArray.find(
              (antinode) =>
                antinode.row === antinodeForType.row &&
                antinode.col === antinodeForType.col
            )
        )
      );
    },
    []
  );
}

function day8(input, isPartTwo) {
  const cityGrid = input.split("\r\n");
  const antinodes = calculateAntinodes(
    cityGrid,
    generateAntennaDictionary(cityGrid),
    isPartTwo
  );

  return antinodes.length;
}

module.exports = { day8 };
