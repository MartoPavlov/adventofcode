class Node {
  value;
  children;

  constructor(value) {
    this.value = value;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
  }

  existChild(value) {
    return !!this.children.find((child) => child.value === value);
  }
}

/**
 * Generates a dictionary from nodes based on the rules provided. The final
 * result looks something like this:
 * {
 *  '13': Node { value: '13', children: [] },
 *  '29': Node { value: '29', children: [ [Node] ] },
 *  '47': Node { value: '47', children: [ [Node], [Node], [Node], [Node] ] },
 * }
 * @param {string} orderingRules multilane string that has the following format:
 * 11|22
 * 123|213
 * 1|99
 * @returns a dictionary
 */
function generateNodeDictionary(orderingRules) {
  const ruleDictionary = {};

  orderingRules.split("\r\n").forEach((rule) => {
    const numbers = rule.split("|");
    const firstNumber = numbers[0];
    const secondNumber = numbers[1].trimEnd();

    if (!ruleDictionary[firstNumber]) {
      ruleDictionary[firstNumber] = new Node(firstNumber);
    }

    const rightNumberNode = ruleDictionary[secondNumber]
      ? ruleDictionary[secondNumber]
      : new Node(secondNumber);
    if (!ruleDictionary[secondNumber]) {
      ruleDictionary[secondNumber] = rightNumberNode;
    }

    ruleDictionary[firstNumber].addChild(rightNumberNode);
  });

  return ruleDictionary;
}

/**
 * Calculates if the pages array obey the rules in the dictionary by looping
 * through the array in reversed order and checking if a node with a larger index
 * in the array has a child with the same value as a smaller index.
 * @param {Object} ruleDictionary
 * @param {Array} pages
 * @returns boolean
 */
function pagesAreValid(ruleDictionary, pages) {
  for (let i = pages.length - 1; i >= 0; i--) {
    const currentPage = pages[i];

    for (let j = i - 1; j >= 0; j--) {
      const comparePage = pages[j];

      if (ruleDictionary[currentPage].existChild(comparePage)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Build a valid pages array based on an invalid one and the rules provided.
 * It does so by following a few steps:
 * - find a value that is not present as a child in any node corresponding to
 * a page (array item)
 * - save the found value in a new array
 * - remove the saved value from the working array
 * - repeat until no elements are left in the working array.
 * @param {Object} ruleDictionary
 * @param {Array} pages
 * @returns Array
 */
function getFixedPages(ruleDictionary, pages) {
  const fixedPages = [];
  let workingArray = [...pages];

  for (let i = 0; i < pages.length; i++) {
    let pageAdded;

    for (let j = 0; j < workingArray.length; j++) {
      let foundError = false;
      const currentPage = workingArray[j];

      for (let k = j + 1; k < workingArray.length; k++) {
        const comparePage = workingArray[k];

        if (ruleDictionary[comparePage].existChild(currentPage)) {
          foundError = true;
          break;
        }
      }

      if (!foundError) {
        pageAdded = currentPage;
        fixedPages.push(currentPage);
        break;
      }
    }

    workingArray = workingArray.filter((item) => item !== pageAdded);
  }

  return fixedPages;
}

function day5(input, isPartTwo) {
  const sections = input.split(/\n\s*\n/);
  const orderingRules = sections[0];
  const pagesSection = sections[1];

  const ruleDictionary = generateNodeDictionary(orderingRules);
  const pagesLines = pagesSection.split("\r\n");
  let sum = 0;

  for (let i = 0; i < pagesLines.length; i++) {
    const pagesLine = pagesLines[i];
    const pages = pagesLine.split(",");
    const arePagesValid = pagesAreValid(ruleDictionary, pages);

    if (arePagesValid && !isPartTwo) {
      sum += Number(pages[(pages.length - 1) / 2]);
    } else if (!arePagesValid && isPartTwo) {
      const newPages = getFixedPages(ruleDictionary, pages);

      sum += Number(newPages[(newPages.length - 1) / 2]);
    }
  }

  return sum;
}

module.exports = { day5 };
