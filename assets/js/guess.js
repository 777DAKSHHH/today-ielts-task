// -------------------------
// IELTS Student Guess Submit
// Firebase Compat UMD Syntax
// -------------------------

// === Firebase config ===
const firebaseConfig = {
  apiKey: "AIzaSy***Q",
  authDomain: "ielts-live-dashboard.firebaseapp.com",
  databaseURL: "https://ielts-live-dashboard-default-rtdb.firebaseio.com",
  projectId: "ielts-live-dashboard",
  storageBucket: "ielts-live-dashboard.firebasestorage.app",
  messagingSenderId: "1044694021318",
  appId: "1:1044694021318:web:70f1ac1ba0787d37da93c7"
};

// Initialize Firebase Compat
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

// Live lesson task type cache (pre-fetched on load)
let liveTask1Type = "Bar Chart";
let liveTask2Type = "Causes and Effects Essay";

db.ref('activeLesson').once('value').then((snapshot) => {
  const data = snapshot.val();
  if (data) {
    if (data.task1 && data.task1.taskType) liveTask1Type = data.task1.taskType;
    if (data.task2 && data.task2.taskType) liveTask2Type = data.task2.taskType;
  }
}).catch((err) => {
  console.warn("Could not load live task types from Firebase. Using fallbacks.", err);
});

const guessForm = document.getElementById('guessForm');
const successOverlay = document.getElementById('successOverlay');
const cardHeader = document.getElementById('cardHeader');

if (guessForm) {
  guessForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('studentName').value.trim();
    const context = document.getElementById('contextGuess').value.trim();

    if (context.length < 20) {
      alert("Please write a detailed context guess (minimum 20 characters) based on the audio!");
      return;
    }

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Submitting...';
    }

    // Read task parameter from URL (e.g. ?task=task1 or ?task=task2)
    const urlParams = new URLSearchParams(window.location.search);
    const task = urlParams.get('task') || 'task1';
    
    // Auto-assign predicted task types based on active task parameter
    const taskType = (task === 'task1') ? liveTask1Type : liveTask2Type;

    // Save student's guess to Realtime Database under guesses node
    const sanitizedName = name.replace(/[.#$\[\]]/g, "_");
    const guessRef = db.ref('guesses/' + sanitizedName);
    
    guessRef.set({
      studentName: name,
      task: task,
      taskType: taskType,
      context: context,
      timestamp: new Date().toISOString()
    })
    .then(() => {
      // Hide form & header and show success overlay with smooth transition
      if (guessForm) guessForm.classList.add('hidden');
      if (cardHeader) cardHeader.classList.add('hidden');
      if (successOverlay) successOverlay.classList.remove('hidden');
    })
    .catch((error) => {
      console.error("❌ Submission failed:", error);
      alert("Error submitting guess: " + error.message);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Submit Guess';
      }
    });
  });
}

window.resetForm = function() {
  if (guessForm) {
    guessForm.reset();
    guessForm.classList.remove('hidden');
  }
  if (cardHeader) cardHeader.classList.remove('hidden');
  if (successOverlay) successOverlay.classList.add('hidden');
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Submit Guess';
  }
};
