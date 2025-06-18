// content.js
// This script replaces numbers 1-9 with letters A-I on the NYT Sudoku puzzle, including the grid and input controls.

const numberToLetter = {
  '1': 'A',
  '2': 'B',
  '3': 'C',
  '4': 'D',
  '5': 'E',
  '6': 'F',
  '7': 'G',
  '8': 'H',
  '9': 'I'
};

// Helper to replace numbers with letters in a given element
function replaceNumbersWithLetters(element) {
  if (!element) return;
  // Only replace if the text is exactly 1-9
  if (numberToLetter[element.textContent]) {
    element.textContent = numberToLetter[element.textContent];
  }
}

// Replace numbers in the Sudoku grid and input controls
function replaceAllNumbers() {
  // Replace in grid cells
  const gridCells = document.querySelectorAll('text, .su-cell, .su-input, .su-board-cell');
  gridCells.forEach(cell => replaceNumbersWithLetters(cell));

  // Replace in number pad/buttons
  const numberPadButtons = document.querySelectorAll('button, .su-key, .su-numpad-btn');
  numberPadButtons.forEach(btn => replaceNumbersWithLetters(btn));
}

// Observe DOM changes to keep numbers replaced
const observer = new MutationObserver(() => {
  replaceAllNumbers();
});

// Start observing the whole document body
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});

// Initial run
replaceAllNumbers(); 