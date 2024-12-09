function moveSegmentBlocks(diskSegmentsArray) {
  const resultArray = [];
  let reverseSearchStartIndex = diskSegmentsArray.length - 1;

  for (let i = 0; i < reverseSearchStartIndex + 1; i++) {
    if (diskSegmentsArray[i] !== -1) {
      resultArray.push(diskSegmentsArray[i]);
    } else {
      for (let j = reverseSearchStartIndex; j > i; j--) {
        if (diskSegmentsArray[j] !== -1) {
          resultArray.push(diskSegmentsArray[j]);
          reverseSearchStartIndex = j - 1;
          break;
        }
      }
    }
  }

  return resultArray;
}

function hasValidReplace(diskString, id, fileSize) {
  let emptySpaceCount = 0;
  const diskSpaceArray = diskString.split("_");

  for (let i = 0; i < diskSpaceArray.length; i++) {
    if (diskSpaceArray[i] === id) return false;

    if (diskSpaceArray[i] === ".") {
      emptySpaceCount++;
    } else {
      emptySpaceCount = 0;
    }

    if (emptySpaceCount === Number(fileSize)) return true;
  }

  return false;
}

function day9(input, isPartTwo) {
  if (isPartTwo) {
    let diskString = "";
    const diskSpaceArray = [];

    for (let i = 0; i < input.length; i += 2) {
      const diskSegmentData = input.substring(i, i + 2).split("");
      const id = `${i / 2}_`;
      const fileSize = diskSegmentData[0];
      const freeSpace = diskSegmentData.length === 1 ? 0 : diskSegmentData[1];

      for (let j = 0; j < fileSize; j++) {
        diskString += id;
      }
      for (let j = 0; j < freeSpace; j++) {
        diskString += "._";
      }

      diskSpaceArray.push({ id, fileSize, freeSpace });
    }

    for (let i = diskSpaceArray.length - 1; i > 0; i--) {
      const { id, fileSize } = diskSpaceArray[i];

      if (hasValidReplace(diskString, id.replace("_", ""), fileSize)) {
        const fillRegex = new RegExp(`(\\._){${fileSize}}`);
        const removeRegex = new RegExp(`(${id}){${fileSize}}`);
        let emptySpace = "";
        let fillSpace = "";

        for (let j = 0; j < fileSize; j++) {
          emptySpace += "._";
          fillSpace += id;
        }

        diskString = diskString.replace(removeRegex, emptySpace);
        diskString = diskString.replace(fillRegex, fillSpace);
      }
    }

    return diskString.split("_").reduce((sum, id, index) => {
      if (id !== ".") {
        return sum + Number(id) * index;
      }

      return sum;
    }, 0);
  }
  const diskSegmentsArray = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < Number(input[i]); j++) {
      diskSegmentsArray.push(i % 2 === 0 ? i / 2 : -1);
    }
  }

  return moveSegmentBlocks(diskSegmentsArray).reduce(
    (sum, currentSegment, currentIndex) => {
      return sum + currentIndex * currentSegment;
    },
    0
  );
}

module.exports = { day9 };
