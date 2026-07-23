// -------------------------
// Typeform-style Quiz (Clone)
// Firebase (v11 modular)
// -------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// === Quiz data (10 questions) ===
const QUESTIONS = [
  { q:"1. Choose the grammatically correct passive form: “Researchers have recently conducted several studies on climate change.”", options:["A. Several studies have been conduct on climate change recently.","B. Several studies were being conducted on climate change recently.","C. Several studies have recently conducting on climate change.","D. Several studies have recently been conducted on climate change."], correct:"D" },
  { q:"2. Which sentence correctly uses a gerund after a reporting verb?", hint:"Some reporting verbs (e.g. <i>recommend, suggest, avoid</i>) are followed by <b>verb + ing</b>, not <i>to + verb</i>.", options:["A. The committee recommended to revise the policy immediately.","B. The committee recommended revise the policy immediately.","C. The committee recommended to revising the policy immediately.","D. The committee recommended revising the policy immediately."], correct:"D" },
  { q:"3. Identify the sentence that is grammatically correct and academically appropriate.", options:["A. There are many factors cause unemployment in cities.","B. There are many factors which cause unemployment in cities.","C. There are many factors that causing unemployment in cities.","D. There are many factors that cause unemployment in cities."], correct:"D" },
  { q:"4. Choose the correctly structured complex sentence with logical subordination.", options:["A. Public transport was improved, congestion was reduced.","B. Public transport was improved and congestion reducing.","C. Public transport was improved, reducing congestion in cities.","D. Public transport was improved because congestion had become severe."], correct:"D" },
  { q:"5. Which option demonstrates correct control of clause structure?", hint:"When using <i>while</i>, check that <b>both clauses are complete and grammatically balanced</b>.", options:["A. While the economy expanded, unemployment reducing.","B. While the economy expanded, unemployment reduce.","C. While the economy expanded, unemployment was reduce.","D. While the economy expanded, unemployment was reduced."], correct:"D" },
  { q:"6. Choose the sentence with correct infinitive usage.", hint:"After verbs like <i>aim, plan, decide</i>, use <b>to + base verb</b>.", options:["A. The government aims reducing inequality through education.","B. The government aims reduce inequality through education.","C. The government aims to reducing inequality through education.","D. The government aims to reduce inequality through education."], correct:"D" },
  { q:"7. Which sentence reflects accurate grammatical control expected in IELTS Task 2?", options:["A. The data analysed by experts reveal a clear trend.","B. The data was analysed and reveal a clear trend.","C. The data analysed reveals clear trend.","D. The data analysed by experts reveal a clear trend."], correct:"D" },
  { q:"8. A line graph shows that internet usage rose sharply between 2005 and 2010, before levelling off until 2020. Which statement is MOST accurate?", options:["A. Internet usage declined steadily after 2010.","B. Internet usage fluctuated considerably throughout the period.","C. Internet usage continued to rise at the same pace after 2010.","D. Internet usage increased rapidly initially and then stabilised."], correct:"D" },
  { q:"9. What does the word “adamant” most precisely mean?", options:["A. Willing to negotiate under pressure","B. Uncertain about one’s stance","C. Open to alternative viewpoints","D. Refusing to change one’s mind; unyielding"], correct:"D" },
  { q:"10. What is the closest meaning of “allure” in academic context?", options:["A. A logical explanation","B. A temporary trend","C. A financial incentive","D. The power to attract or charm"], correct:"D" }
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
    const targetRef = ref(db, `quizResults/${studentKey}`);
    await set(targetRef, payload);

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
