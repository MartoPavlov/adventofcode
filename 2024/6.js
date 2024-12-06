const GUARD_DIRECTION = {
  "^": { row: -1, col: 0 },
  ">": { row: 0, col: 1 },
  v: { row: 1, col: 0 },
  "<": { row: 0, col: -1 },
};

const TOKEN_CHANGE = {
  "^": ">",
  ">": "v",
  v: "<",
  "<": "^",
};

function findGuardPosition(map) {
  for (let i = 0; i < map.length; i++) {
    const mapLine = map[i];

    for (let j = 0; j < mapLine.length; j++) {
      const tile = mapLine[j];

      if (!!GUARD_DIRECTION[tile]) {
        return { row: i, col: j };
      }
    }
  }

  return { row: -1, col: -1 };
}

function moveRecursively(
  map,
  row,
  col,
  offsetRow,
  offsetCol,
  discoverDictionary
) {
  const currentRow = row + offsetRow;
  const currentCol = col + offsetCol;
  const rows = map.length;
  const cols = map[0].length;

  if (
    currentRow < 0 ||
    currentRow >= rows ||
    currentCol < 0 ||
    currentCol >= cols
  ) {
    return { row: -1, col: -1 };
  } else if (map[currentRow][currentCol] === "#") {
    return { row, col };
  }

  discoverDictionary[
    JSON.stringify({ row: currentRow, col: currentCol })
  ] = true;

  return moveRecursively(
    map,
    currentRow,
    currentCol,
    offsetRow,
    offsetCol,
    discoverDictionary
  );
}

function moveGuard(guardPosition, map, guardToken, discoverDictionary) {
  const offset = GUARD_DIRECTION[guardToken];
  const newPosition = moveRecursively(
    map,
    guardPosition.row,
    guardPosition.col,
    offset.row,
    offset.col,
    discoverDictionary
  );

  return newPosition;
}

/**
 * Fill a dictionary with all the paths visited by the guard while they are
 * using the 90 degree rule to navigate the maze.
 * @param {Array} map
 * @param {number} guardRow
 * @param {number} guardCol
 * @returns dictionary if a path out exists, or null if the guard gets
 * stuck in a loop
 */
function generateDiscoverDictonary(map, guardRow, guardCol) {
  let guardPosition = { row: guardRow, col: guardCol };
  let guardToken = map[guardPosition.row][guardPosition.col];
  const discoverDictionary = {
    [JSON.stringify(guardPosition)]: true,
  };
  // records all tiles where the guard has encountered an obstruction
  const rotationDictionary = {};

  while (guardPosition.row !== -1 && guardPosition.col !== -1) {
    const { row, col } = moveGuard(
      guardPosition,
      map,
      guardToken,
      discoverDictionary
    );

    // we are stuck in a loop
    if (
      (row !== guardPosition.row || col !== guardPosition.col) &&
      !!rotationDictionary[JSON.stringify({ row, col })]
    ) {
      return null;
    }

    rotationDictionary[JSON.stringify({ row, col })] = true;
    guardPosition = { row, col };
    guardToken = TOKEN_CHANGE[guardToken];
  }

  return discoverDictionary;
}

function generateMapWithObstructionAt(map, row, col) {
  return map.map((mapLine, rowIndex) => {
    if (rowIndex === row) {
      return mapLine.substring(0, col) + "#" + mapLine.substring(col + 1);
    }

    return mapLine;
  });
}

function day6(input, isPartTwo) {
  const mapLines = input.split("\r\n");
  let guardPosition = findGuardPosition(mapLines);

  const discoverDictionary = generateDiscoverDictonary(
    mapLines,
    guardPosition.row,
    guardPosition.col
  );

  if (isPartTwo) {
    let sum = 0;

    /**
     * Add obstruction on the map on every tile the guard will visit, except the
     * initial starting one. Test it with the same approach as part one.
     */
    Object.keys(discoverDictionary).forEach((key) => {
      const obstructionPosition = JSON.parse(key);

      if (
        guardPosition.row !== obstructionPosition.row ||
        guardPosition.col !== obstructionPosition.col
      ) {
        const newMap = generateMapWithObstructionAt(
          mapLines,
          obstructionPosition.row,
          obstructionPosition.col
        );

        if (
          !generateDiscoverDictonary(
            newMap,
            guardPosition.row,
            guardPosition.col
          )
        ) {
          sum++;
        }
      }
    });

    return sum;
  }

  return Object.keys(discoverDictionary).length;
}

module.exports = { day6 };
