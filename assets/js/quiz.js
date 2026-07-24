// -------------------------
// Typeform-style Quiz (Clone)
// Firebase UMD Compat Syntax
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

// === Quiz data (10 questions on today's IELTS lessons) ===
const QUESTIONS = [
  { 
    q: "1. Which option provides the most appropriate academic alternative to: 'Students do the work experience requirement'?", 
    options: [
      "A. Students make the work experience requirement.",
      "B. Students complete the work experience requirement.",
      "C. Students undertake the work experience requirement.",
      "D. Students perform the work experience requirement."
    ], 
    correct: "C" 
  },
  { 
    q: "2. Select the grammatically correct passive sentence describing a stage in the flowchart:", 
    hint: "For process flows, use the structure: <b>Once [action] is/are [past participle], the next step is...</b>",
    options: [
      "A. Once employer acceptance obtained, the schedule is finalized.",
      "B. Once employer acceptance is obtained, the schedule is finalized.",
      "C. Once employer acceptance is obtain, the schedule is finalized.",
      "D. Once employer acceptance is obtaining, the schedule is finalize."
    ], 
    correct: "B" 
  },
  { 
    q: "3. Fill in the blank with the correct Band 9 vocabulary: 'For many health advocates, the excessive consumption of processed foods is an __________ to healthy living.'", 
    options: [
      "A. allure",
      "B. alternative",
      "C. allowance",
      "D. anathema"
    ], 
    correct: "D" 
  },
  { 
    q: "4. Which sequence connector is most suitable for describing two stages in the flowchart that happen at the same time?", 
    options: [
      "A. Subsequently",
      "B. Concurrently",
      "C. Initially",
      "D. Prior to"
    ], 
    correct: "B" 
  },
  { 
    q: "5. What is the precise meaning of the word 'ineluctable' in the context of ready-made meals?", 
    hint: "Recall: <i>'Demanding schedules have made the reliance on convenience foods ineluctable.'</i>",
    options: [
      "A. Something highly health-promoting",
      "B. Wise and showing good judgment",
      "C. Impossible to avoid or escape",
      "D. Easily ignored or rejected"
    ], 
    correct: "C" 
  },
  { 
    q: "6. Which option shows proper academic hedging when discussing the drawbacks of ready-made meals?", 
    options: [
      "A. Ready meals will immediately cause chronic illnesses in all consumers.",
      "B. Ready meals are definitely dangerous and should be banned.",
      "C. Excessive consumption of prepared meals may contribute to negative health outcomes.",
      "D. Preservatives in prepared meals always destroy public health."
    ], 
    correct: "C" 
  },
  { 
    q: "7. In the student work experience flowchart, what is the logical progression of the first three stages?", 
    options: [
      "A. Submit weekly progress reports ➔ Obtain professor approval ➔ Final evaluation",
      "B. Select workplace & apply ➔ Obtain professor approval ➔ Finalize schedule",
      "C. Finalize schedule ➔ Start weekly reports ➔ Complete professor approval",
      "D. Employer interview ➔ Select workplace ➔ Complete final report"
    ], 
    correct: "B" 
  },
  { 
    q: "8. What is the meaning of 'salubrious' in the sentence: 'Freshly prepared home meals are far more salubrious than processed foods'?", 
    options: [
      "A. Health-promoting; wholesome",
      "B. Expensive; luxurious",
      "C. Highly processed; convenience-focused",
      "D. Quick and easy to clean up"
    ], 
    correct: "A" 
  },
  { 
    q: "9. Identify the correct meaning of 'profligacy' in an IELTS essay about pre-packaged meals:", 
    options: [
      "A. Wise choices and conservation",
      "B. Reckless wastefulness or extravagance (e.g., plastic packaging)",
      "C. Financial affordability",
      "D. Nutritious value"
    ], 
    correct: "B" 
  },
  { 
    q: "10. What is the best Band 9 alternative for 'end' in: 'The six-stage work experience program ends with the final report'?", 
    options: [
      "A. commences with",
      "B. participates in",
      "C. schedules",
      "D. culminates in"
    ], 
    correct: "D" 
  }
];

// State
let studentName = "";
let idx = 0;
const skippedQuestions = new Set(); // Track explicitly skipped questions
const answers = Array(QUESTIONS.length).fill(null); // store selected letter "A"/"B"/...
let quizTimerInterval = null;
let timeRemaining = 180; // 3 minutes
let isQuizActive = false;

// Elements
const welcomeView = document.getElementById("welcomeView");
const quizView = document.getElementById("quizView");
const finalView = document.getElementById("finalView");
const nameInput = document.getElementById("studentName");
const nameWrap = document.getElementById("nameWrap");
const qNumber = document.getElementById("qNumber");
const progressNav = document.getElementById("progressNav");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const doneBtn = document.getElementById("doneBtn");
const correctAnswersCountEl = document.getElementById("correctAnswersCount");
const timerTextEl = document.getElementById("timerText");
const skipToast = document.getElementById("skipToast");
const studentLabelEl = document.getElementById("studentLabel");

// Helper: uppercase and sanitize student name for key
function sanitizeName(n){
  if(!n) return "";
  return n.trim().toUpperCase().replace(/\s+/g,' ');
}

// Welcome behavior
if (nameInput) {
  nameInput.addEventListener("focus", ()=> nameWrap.classList.add("focused"));
  nameInput.addEventListener("blur", ()=> nameWrap.classList.remove("focused"));

  nameInput.addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
      e.preventDefault();
      startQuizFlow();
    }
  });
}

// Start quiz: validate name & transition
function startQuizFlow(){
  if (!nameInput) return;
  const raw = nameInput.value || "";
  const cleaned = sanitizeName(raw);
  if(!cleaned){
    if (nameWrap) {
      nameWrap.animate([{transform:"translateX(0)"},{transform:"translateX(-8px)"},{transform:"translateX(8px)"},{transform:"translateX(0)"}], {duration:220});
    }
    return;
  }
  studentName = cleaned;
  if (studentLabelEl) studentLabelEl.textContent = studentName;
  
  if (welcomeView) welcomeView.classList.remove("show");
  setTimeout(()=>{
    if (welcomeView) welcomeView.style.display = "none";
    if (quizView) {
      quizView.style.display = "block";
      setTimeout(()=> quizView.classList.add("show"), 10);
    }
    loadQuestion(idx);
    startTimer();
  }, 200);
}

// Timer Logic
function startTimer() {
  isQuizActive = true;
  timeRemaining = 180; // 3 minutes
  updateTimerDisplay();

  quizTimerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      clearInterval(quizTimerInterval);
      isQuizActive = false;
      alert("Time's up! Your quiz will be submitted automatically.");
      disableQuizControls();
      submitQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const min = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
  const sec = (timeRemaining % 60).toString().padStart(2, '0');
  if (timerTextEl) timerTextEl.textContent = `${min}:${sec}`;

  const displayEl = document.getElementById('timerDisplay');
  if (displayEl) {
    if (timeRemaining < 60 && isQuizActive) {
      displayEl.classList.add('timer-urgent');
    } else {
      displayEl.classList.remove('timer-urgent');
    }
  }
}

function disableQuizControls() {
  document.querySelectorAll('.opt').forEach(opt => opt.disabled = true);
  if (nextBtn) nextBtn.disabled = true;
  if (backBtn) backBtn.disabled = true;
}

// Render the segmented progress bar
function renderProgressNav() {
  if (!progressNav) return;
  progressNav.innerHTML = "";
  QUESTIONS.forEach((_, i) => {
    const seg = document.createElement("div");
    seg.className = "nav-segment";
    
    if (i === idx) seg.classList.add("current");
    else if (answers[i] !== null) seg.classList.add("answered");
    else if (skippedQuestions.has(i)) seg.classList.add("skipped"); // Yellow if explicitly skipped

    // Allow jumping to any question
    seg.title = `Go to Question ${i + 1}`;
    seg.addEventListener("click", () => {
      if (i !== idx) transitionToQuestion(i);
    });
    
    progressNav.appendChild(seg);
  });
}

// Load question
function loadQuestion(i){
  idx = i;

  // update head
  if (qNumber) qNumber.textContent = `Question ${idx+1} / ${QUESTIONS.length}`;
  renderProgressNav();

  // Create fresh content container for animation
  const qArea = document.querySelector('.question-area');
  if (!qArea) return;
  qArea.innerHTML = ""; // Clear previous
  
  const contentWrap = document.createElement("div");
  contentWrap.className = "stack-anim";

  // fill question and options
  const q = QUESTIONS[idx];
  
  const qText = document.createElement("div");
  qText.className = "question-text";
  qText.textContent = q.q;
  contentWrap.appendChild(qText);

  // Add Hint if available
  if(q.hint){
    const hintDiv = document.createElement("div");
    hintDiv.style.cssText = "background:rgba(255,193,7,0.12); color:#856404; padding:12px 16px; border-radius:12px; margin-bottom:20px; font-size:14px; display:flex; gap:10px; align-items:start; border:1px solid rgba(255,193,7,0.2);";
    hintDiv.innerHTML = `<i class="bi bi-lightbulb-fill" style="margin-top:2px; color:#ffc107;"></i><div><strong>Hint:</strong> ${q.hint}</div>`;
    contentWrap.appendChild(hintDiv);
  }

  const optsList = document.createElement("div");
  optsList.className = "options";
  optsList.setAttribute("role", "listbox");

  q.options.forEach((optText, j)=>{
    const letter = String.fromCharCode(65 + j); // A,B,C...
    const opt = document.createElement("button");
    opt.type = "button";
    opt.className = "opt";
    opt.setAttribute("role","option");
    opt.innerHTML = `<span class="label">${letter}</span><span style="flex:1">${optText.replace(/^([A-D]\.\s*)/,'')}</span>`;
    if(answers[idx] === letter) opt.classList.add("selected");
    
    opt.addEventListener("click", ()=>{
      const wasSkipped = skippedQuestions.has(idx);
      const isFirstAttempt = answers[idx] === null && !wasSkipped;

      optsList.querySelectorAll(".opt").forEach(o=>o.classList.remove("selected"));
      opt.classList.add("selected");
      answers[idx] = letter;
      
      if (nextBtn) nextBtn.textContent = (idx === QUESTIONS.length - 1) ? "Submit" : "Next →";

      if (wasSkipped) skippedQuestions.delete(idx);
      renderProgressNav(); // Update nav

      // Auto-advance logic (Typeform style)
      if (isFirstAttempt && idx < QUESTIONS.length - 1) {
        setTimeout(() => {
          if (idx === i) {
            transitionToQuestion(idx + 1);
          }
        }, 350);
      }
    });
    optsList.appendChild(opt);
  });
  
  contentWrap.appendChild(optsList);
  qArea.appendChild(contentWrap);

  if (nextBtn) nextBtn.textContent = (idx === QUESTIONS.length - 1) ? "Submit" : (answers[idx] ? "Next →" : "Skip");
}

function transitionToQuestion(targetIdx) {
  loadQuestion(targetIdx);
}

if (backBtn) {
  backBtn.addEventListener("click", ()=>{
    if(idx > 0){
      transitionToQuestion(idx - 1);
    }
  });
}

let toastTimeout;
function showToast(msg) {
  if (!skipToast) return;
  skipToast.textContent = msg;
  skipToast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    skipToast.classList.remove("show");
  }, 4000);
}

if (nextBtn) {
  nextBtn.addEventListener("click", ()=>{
    if (answers[idx] === null) {
      skippedQuestions.add(idx);
      const name = studentName || "Student";
      showToast(`${name}, you have skipped question ${idx + 1}, tap on the yellow color bar to quickly jump to that question`);
    }
    if(idx < QUESTIONS.length - 1){
      transitionToQuestion(idx + 1);
    } else {
      submitQuiz();
    }
  });
}

// Mobile Swipe Logic
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

if (quizView) {
  quizView.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, {passive: true});

  quizView.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, {passive: true});
}

function handleSwipe() {
  const xDiff = touchStartX - touchEndX;
  const yDiff = touchStartY - touchEndY;

  if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 50) {
    if (xDiff > 0) {
      if (nextBtn) nextBtn.click();
    } else {
      if (backBtn) backBtn.click();
    }
  }
}

// keyboard shortcuts: number or letter to choose, enter to next
document.addEventListener("keydown", (e)=>{
  if(!isQuizActive || (welcomeView && welcomeView.style.display !== "none")) return;
  if(["1","2","3","4","5","6","7","8","9"].includes(e.key) && (parseInt(e.key) <= QUESTIONS[idx].options.length)){
    const choiceIndex = parseInt(e.key)-1;
    const optButtons = document.querySelectorAll(".opt");
    if(optButtons[choiceIndex]) optButtons[choiceIndex].click();
  }
  if(e.key.length === 1 && e.key.toLowerCase() >= 'a' && e.key.toLowerCase() <= 'd'){
    const ch = e.key.toUpperCase();
    const letterIndex = ch.charCodeAt(0)-65;
    if(letterIndex >=0 && letterIndex < QUESTIONS[idx].options.length){
      const optButtons = document.querySelectorAll(".opt");
      if(optButtons[letterIndex]) optButtons[letterIndex].click();
    }
  }
  if(e.key === "Enter"){
    if(document.activeElement && document.activeElement === nameInput) return;
    e.preventDefault();
    if (nextBtn) nextBtn.click();
  }
});

// Prevent accidental tab close while quiz is active
window.addEventListener('beforeunload', (e) => {
  if (isQuizActive) {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
  }
});

// Submit => compute score and push to Firebase
async function submitQuiz(){
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  isQuizActive = false;

  let correctCount = 0;
  let missedCount = 0;
  const incorrectList = [];
  const missedList = [];

  QUESTIONS.forEach((Q, i)=>{
    const ans = answers[i];
    if(ans === null){
      missedCount++;
      missedList.push(`Q${i+1}`);
    } else {
      if(ans === Q.correct) correctCount++;
      else {
        incorrectList.push(`Q${i+1}`);
      }
    }
  });

  const total = QUESTIONS.length;
  const incorrectCount = total - correctCount - missedCount;
  const correctPct = ((correctCount / total) * 100).toFixed(1) + "%";
  const incorrectPct = ((incorrectCount / total) * 100).toFixed(1) + "%";
  const missedPct = ((missedCount / total) * 100).toFixed(1) + "%";
  const incorrectQuestionsStr = incorrectList.length ? incorrectList.join(", ") : "-";
  const missedQuestionsStr = missedList.length ? missedList.join(", ") : "-";

  const studentKey = sanitizeName(studentName) || ("ANON_" + Date.now());
  const payload = {
    taskId: studentKey,
    correct: correctPct,
    rawCorrectCount: correctCount,
    incorrect: incorrectPct,
    missed: missedPct,
    incorrectQuestions: incorrectQuestionsStr,
    missedQuestions: missedQuestionsStr,
    rawAnswers: answers,
    timestamp: Date.now()
  };

  try {
    const targetRef = db.ref(`quizResults/${studentKey}`);
    await targetRef.set(payload);

    if (quizView) quizView.classList.remove("show");
    setTimeout(()=>{
      if (correctAnswersCountEl) correctAnswersCountEl.textContent = correctCount;
      if (quizView) quizView.style.display = "none";
      if (finalView) {
        finalView.style.display = "block";
        finalView.classList.add("show");
      }
    }, 180);
  } catch(err){
    console.error("Firebase write error:", err);
    alert("Could not save your result right now. Check network or Firebase config.");
  }
}

// When Done clicked => reset
if (doneBtn) {
  doneBtn.addEventListener("click", ()=>{
    if (finalView) finalView.classList.remove("show");
    setTimeout(()=>{
      if (finalView) finalView.style.display = "none";
      if (welcomeView) {
        welcomeView.style.display = "block";
        setTimeout(()=> {
          welcomeView.classList.add("show");
          // reset state
          idx = 0;
          for(let i=0;i<answers.length;i++) answers[i] = null;
          skippedQuestions.clear();
          if (nameInput) nameInput.value = "";
          studentName = "";
          if (studentLabelEl) studentLabelEl.textContent = "—";
          if (quizView) quizView.style.display = "none";
          if (nextBtn) nextBtn.disabled = false;
          if (backBtn) backBtn.disabled = false;
          isQuizActive = false;
          timeRemaining = 180;
          const displayEl = document.getElementById('timerDisplay');
          if (displayEl) displayEl.classList.remove('timer-urgent');
        }, 10);
      }
    }, 160);
  });
}

// Initialize: hide quiz/final views until start
if (quizView) quizView.style.display = "none";
if (finalView) finalView.style.display = "none";

// Auto-focus the name input
if (nameInput) nameInput.focus();

// Accessibility: focus name input on card click
const cardEl = document.querySelector('.card');
if (cardEl) {
  cardEl.addEventListener('click', ()=>{
    if(welcomeView && welcomeView.style.display !== "none"){
      if (nameInput) nameInput.focus();
    }
  });
}
