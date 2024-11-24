// Get references to key elements
const container = document.getElementById("array-container");
const generateButton = document.getElementById("generate");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resumeButton = document.getElementById("resume");
const explanation = document.getElementById("explanation");
const stepsList = document.getElementById("steps");

let array = [];
const size = 20; // Number of bars
let delay = 300; // Delay between animation steps
let isPaused = false;

// Generate a random array
function generateArray() {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 200) + 10);
  renderArray();
  explanation.innerText = "Click 'Start Bubble Sort' to begin!";
  updateSteps([
    "Step 1: Compare the first two adjacent elements.",
    "Step 2: Swap them if the first element is greater than the second."
  ]);
}

// Render the array visually
function renderArray() {
  container.innerHTML = "";
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    bar.style.width = "20px";
    bar.innerText = value;
    container.appendChild(bar);
  });
}

// Add delay for animations
function delayAnimation(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Pause function
function pauseExecution() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!isPaused) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

// Update steps in the side panel
function updateSteps(newSteps) {
  stepsList.innerHTML = ""; // Clear previous steps
  newSteps.forEach((step) => {
    const li = document.createElement("li");
    li.innerText = step;
    stepsList.appendChild(li);
  });
}

// Highlight bars during comparisons or swaps
function highlightBars(index1, index2, action) {
  const bars = document.querySelectorAll(".bar");
  bars[index1].classList.add(action);
  bars[index2].classList.add(action);
}

// Reset highlighted bars
function resetBars(index1, index2, action) {
  const bars = document.querySelectorAll(".bar");
  bars[index1].classList.remove(action);
  bars[index2].classList.remove(action);
}

// Bubble Sort Algorithm with Deep Explanations
async function bubbleSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length - 1; i++) {
    explanation.innerText = `Starting pass #${i + 1}. Comparing adjacent elements.`;
    updateSteps([
      `Pass #${i + 1}: Compare adjacent elements from the beginning.`,
      `Step 1: Compare each pair and swap if needed.`
    ]);

    for (let j = 0; j < array.length - i - 1; j++) {
      if (isPaused) await pauseExecution();

      // Highlight bars being compared
      highlightBars(j, j + 1, "active");
      explanation.innerText = `Comparing ${array[j]} and ${array[j + 1]}.`;
      updateSteps([
        `Comparing ${array[j]} and ${array[j + 1]}.`,
        array[j] > array[j + 1]
          ? `Swapping ${array[j]} and ${array[j + 1]}.`
          : `No swap needed, move to next pair.`
      ]);
      await delayAnimation(delay);

      // If left value is greater, swap them
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;
        bars[j].innerText = array[j];
        bars[j + 1].innerText = array[j + 1];

        // Highlight the swap
        highlightBars(j, j + 1, "swapped");
        explanation.innerText = `Swapping ${array[j]} and ${array[j + 1]}.`;
        await delayAnimation(delay);
        resetBars(j, j + 1, "swapped");
      }

      resetBars(j, j + 1, "active");
    }

    // After each pass, mark the last element as sorted
    bars[array.length - i - 1].classList.add("sorted");
    explanation.innerText = `Pass #${i + 1} complete! Element ${array.length - i - 1} is now sorted.`;
    updateSteps([`Pass #${i + 1}: Largest element bubbled to the correct position.`]);
  }

  // Mark all elements as sorted
  bars.forEach((bar) => bar.classList.add("sorted"));
  explanation.innerText = "Array is fully sorted! Great job!";
  updateSteps(["Sorting complete!"]);
}

// Event Listeners
generateButton.addEventListener("click", generateArray);
startButton.addEventListener("click", () => {
  isPaused = false;
  bubbleSort();
});
pauseButton.addEventListener("click", () => {
  isPaused = true;
  explanation.innerText = "Sorting paused. Click 'Resume' to continue.";
});
resumeButton.addEventListener("click", () => {
  isPaused = false;
  explanation.innerText = "Sorting resumed!";
});

// Initialize on page load
generateArray();
