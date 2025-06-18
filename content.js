// content.js
// This script replaces numbers 1-9 with letters A-I on the NYT Sudoku puzzle, including the grid and input controls.
console.log("Sudoku Letters extension loaded!");

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

// Helper to overlay a letter on top of a cell or button
function overlayLetter(svg) {
  const num = svg.getAttribute('data-number');
  if (!numberToLetter[num]) return;

  // Only overlay if SVG is a direct child of a grid cell, keypad button, or is a candidate/candidate-button
  const parent = svg.parentElement;
  if (!parent) return;
  const isGridCell = parent.classList.contains('su-cell');
  const isKeypad = parent.classList.contains('su-keyboard__svg-container');
  const isCandidateButton = svg.classList.contains('su-candidate-button');
  const isCandidate = svg.classList.contains('su-candidate');
  if (!isGridCell && !isKeypad && !isCandidateButton && !isCandidate) return;

  if (isCandidateButton) {
    // Avoid duplicate overlays for this candidate SVG
    if (svg.nextSibling && svg.nextSibling.classList && (svg.nextSibling.classList.contains('sudoku-letter-candidate-overlay'))) return;
    // Hide the SVG for candidate button overlays
    svg.style.display = 'none';
    // Create overlay
    const overlay = document.createElement('span');
    overlay.className = 'sudoku-letter-candidate-overlay';
    overlay.textContent = numberToLetter[num];
    overlay.style.position = 'absolute';
    overlay.style.top = svg.style.top || '0';
    overlay.style.left = svg.style.left || '0';
    overlay.style.width = svg.style.width || '17px';
    overlay.style.height = svg.style.height || '17px';
    overlay.style.fontSize = '0.8em';
    overlay.style.fontWeight = 'bold';
    overlay.style.color = '#222';
    overlay.style.pointerEvents = 'none';
    overlay.style.userSelect = 'none';
    overlay.style.fontFamily = 'inherit';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10'; // Ensure overlay is above SVG
    // Insert overlay as a sibling after the SVG
    svg.parentNode.insertBefore(overlay, svg.nextSibling);
    return;
  }

  if (isCandidate) {
    // Only create overlay if one does not already exist as nextSibling
    if (svg.nextSibling && svg.nextSibling.classList && svg.nextSibling.classList.contains('sudoku-letter-candidate-overlay')) return;
    // Hide the SVG for manual candidate overlays
    svg.style.display = 'none';
    // Create overlay
    const overlay = document.createElement('span');
    overlay.className = 'sudoku-letter-candidate-overlay';
    overlay.textContent = numberToLetter[num];
    overlay.style.position = 'absolute';
    overlay.style.top = svg.style.top || '0';
    overlay.style.left = svg.style.left || '0';
    overlay.style.width = svg.style.width || '17px';
    overlay.style.height = svg.style.height || '17px';
    overlay.style.fontSize = '0.8em';
    overlay.style.fontWeight = 'bold';
    overlay.style.color = '#222';
    overlay.style.pointerEvents = 'none';
    overlay.style.userSelect = 'none';
    overlay.style.fontFamily = 'inherit';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10'; // Ensure overlay is above SVG
    // Insert overlay as a sibling after the SVG
    svg.parentNode.insertBefore(overlay, svg.nextSibling);
    return;
  }

  // Avoid duplicate overlays for grid/keypad
  if (parent.querySelector('.sudoku-letter-overlay')) return;
  // Hide the SVG
  svg.style.display = 'none';
  // Create overlay
  const overlay = document.createElement('span');
  overlay.className = 'sudoku-letter-overlay';
  overlay.textContent = numberToLetter[num];
  overlay.style.position = 'absolute';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%, -50%)';
  overlay.style.fontSize = '2em';
  overlay.style.fontWeight = 'bold';
  overlay.style.color = '#222';
  overlay.style.pointerEvents = 'none';
  overlay.style.userSelect = 'none';
  overlay.style.fontFamily = 'inherit';
  // Make sure parent is positioned
  if (getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }
  parent.appendChild(overlay);
}

// Remove overlays if SVGs are removed or changed
function cleanUpOverlays() {
  // Remove candidate overlays if their SVG is gone
  document.querySelectorAll('.sudoku-letter-candidate-overlay').forEach(overlay => {
    if (!overlay.previousSibling || !overlay.previousSibling.classList || !overlay.previousSibling.classList.contains('su-candidate-button')) {
      overlay.remove();
    }
  });
  // Remove main overlays if their SVG is gone
  document.querySelectorAll('.sudoku-letter-overlay').forEach(overlay => {
    const parent = overlay.parentElement;
    if (!parent || !parent.querySelector('svg[data-number]')) {
      overlay.remove();
    }
  });
}

function replaceSVGsWithLetters() {
  // For grid and number pad
  const svgs = document.querySelectorAll('svg[data-number]');
  svgs.forEach(svg => overlayLetter(svg));
  cleanUpOverlays();
}

// Observe DOM changes to keep overlays up-to-date
let rafPending = false;
const observer = new MutationObserver(() => {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      replaceSVGsWithLetters();
      rafPending = false;
    });
  }
});

// Start observing the whole document body
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});

// Initial run
replaceSVGsWithLetters();

// Listen for A-I key presses and map them to 1-9
window.addEventListener('keydown', function(e) {
  // Only handle single letter keys A-I (case-insensitive)
  const key = e.key.toUpperCase();
  const letterToNumber = {
    'A': '1',
    'B': '2',
    'C': '3',
    'D': '4',
    'E': '5',
    'F': '6',
    'G': '7',
    'H': '8',
    'I': '9'
  };
  if (letterToNumber[key]) {
    // Prevent the default letter input
    e.preventDefault();
    // Dispatch a new KeyboardEvent for the corresponding number
    const numberEvent = new KeyboardEvent('keydown', {
      key: letterToNumber[key],
      code: 'Digit' + letterToNumber[key],
      keyCode: letterToNumber[key].charCodeAt(0),
      which: letterToNumber[key].charCodeAt(0),
      bubbles: true,
      cancelable: true
    });
    document.activeElement.dispatchEvent(numberEvent);
  }
});

// Inject CSS to hide all candidate-related elements
(function injectHideCandidatesCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .su-candidate,
    .su-candidate-button {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
})(); 