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
    type: "scramble",
    q: "1. Arrange the words below to form a grammatically correct sentence describing a trend from the bar chart:", 
    words: ["represented", "the", "consistently", "Daily", "decade.", "proportion", "visits", "throughout", "smallest"],
    correctSentence: "Daily visits consistently represented the smallest proportion throughout the decade.",
    correct: "B"
  },
  { 
    type: "error-correction",
    q: "2. Tap the incorrect word in the sentence below and select its correction:", 
    sentence: "While the economy expanded, unemployment was reduce.",
    errorWord: "reduce.",
    options: ["reduced.", "reducing.", "reduces.", "reduction."],
    correct: "A"
  },
  { 
    type: "scramble",
    q: "3. Arrange the words below to form a grammatically correct Band 9 sentence about hobbies and career professionals:", 
    words: ["dedicated", "leisure", "unproductive", "an", "anathema.", "For", "career", "hours", "spending", "considered", "on", "professionals,", "is", "often", "activities"],
    correctSentence: "For dedicated career professionals, spending hours on unproductive leisure activities is often considered an anathema.",
    correct: "D"
  },
  { 
    type: "error-correction",
    q: "4. Tap the incorrect word in the sentence below and select its correction:", 
    sentence: "The percentage of weekly diners fluctuate slightly during the period.",
    errorWord: "fluctuate",
    options: ["fluctuated", "fluctuating", "fluctuates", "fluctuation"],
    correct: "A"
  },
  { 
    type: "scramble",
    q: "5. Arrange the words below to form a grammatically correct Task 2 sentence about work schedules and hobbies:", 
    words: ["left", "rise", "hobbies.", "has", "schedules", "of", "demanding", "little", "ineluctable", "work", "The", "room", "for"],
    correctSentence: "The ineluctable rise of demanding work schedules has left little room for hobbies.",
    correct: "C"
  },
  { 
    type: "error-correction",
    q: "6. Tap the incorrect word in the sentence below and select its correction:", 
    sentence: "Pursuing active outdoor hobbies has a highly salubrious affect on health.",
    errorWord: "affect",
    options: ["effect", "effective", "effects", "affective"],
    correct: "A"
  },
  { 
    type: "scramble",
    q: "7. Arrange the words below to form a grammatically correct comparative sentence:", 
    words: ["By", "considerably", "in", "figure", "comparison,", "lower", "was", "the", "2006."],
    correctSentence: "By comparison, the figure was considerably lower in 2006.",
    correct: "B"
  },
  { 
    type: "error-correction",
    q: "8. Tap the incorrect word in the sentence below and select its correction:", 
    sentence: "The profligacy of screen-time habits consume hours of potential leisure.",
    errorWord: "consume",
    options: ["consumes", "consuming", "consumption", "consumed"],
    correct: "A"
  },
  { 
    type: "scramble",
    q: "9. Arrange the words below to form a grammatically correct summary of a gradual trend change:", 
    words: ["gradual", "towards", "shift", "a", "The", "monthly", "chart", "consumption.", "illustrates"],
    correctSentence: "The chart illustrates a gradual shift towards monthly consumption.",
    correct: "D"
  },
  { 
    type: "error-correction",
    q: "10. Tap the incorrect word in the sentence below and select its correction:", 
    sentence: "A sagacious individual recognise the necessity of work-life balance.",
    errorWord: "recognise",
    options: ["recognises", "recognising", "recognition", "recognised"],
    correct: "A"
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

// State tracking arrays for scrambled sentence builder and error spotting
const studentAssembledWords = Array(QUESTIONS.length).fill(null).map(() => []);
const studentErrorSelections = Array(QUESTIONS.length).fill(null).map(() => ({ tappedWord: null, selectedOptionIndex: null }));

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
    isQuizActive = true;
  }, 200);
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

  // Render based on type
  if (q.type === "scramble") {
    renderScrambleQuestion(q, contentWrap);
  } else if (q.type === "error-correction") {
    renderErrorCorrectionQuestion(q, contentWrap);
  }

  qArea.appendChild(contentWrap);

  // Set initial text for Next Button
  if (nextBtn) {
    if (idx === QUESTIONS.length - 1) {
      nextBtn.textContent = "Submit";
    } else {
      nextBtn.textContent = answers[idx] ? "Next →" : "Skip";
    }
  }
}

function renderScrambleQuestion(q, contentWrap) {
  // Preview Box
  const previewBox = document.createElement("div");
  previewBox.className = "scramble-preview-box";
  previewBox.id = "scramblePreview";
  contentWrap.appendChild(previewBox);

  // Tray
  const tray = document.createElement("div");
  tray.className = "token-tray";
  tray.id = "tokenTray";
  contentWrap.appendChild(tray);

  // Help info
  const helpInfo = document.createElement("div");
  helpInfo.className = "small text-muted text-center mt-2";
  helpInfo.innerHTML = "<i class='bi bi-info-circle'></i> Tap words below to build the sentence. Tap words in the box to remove them.";
  contentWrap.appendChild(helpInfo);

  function drawScrambleState() {
    previewBox.innerHTML = "";
    tray.innerHTML = "";

    const currentAssembly = studentAssembledWords[idx];

    // Draw preview box words
    currentAssembly.forEach((wordIndex, order) => {
      const word = q.words[wordIndex];
      const token = document.createElement("span");
      token.className = "word-token";
      token.textContent = word;
      token.addEventListener("click", () => {
        // Remove from assembly
        studentAssembledWords[idx] = currentAssembly.filter((_, idxFilter) => idxFilter !== order);
        updateScrambleAnswer();
        drawScrambleState();
      });
      previewBox.appendChild(token);
    });

    // Draw tray words (in original scrambled order)
    q.words.forEach((word, wordIndex) => {
      const token = document.createElement("span");
      token.className = "word-token";
      token.textContent = word;
      
      const isUsed = currentAssembly.includes(wordIndex);
      if (isUsed) {
        token.classList.add("used");
      } else {
        token.addEventListener("click", () => {
          // Add to assembly
          studentAssembledWords[idx].push(wordIndex);
          updateScrambleAnswer();
          drawScrambleState();
        });
      }
      tray.appendChild(token);
    });
  }

  function updateScrambleAnswer() {
    const currentAssembly = studentAssembledWords[idx];
    const sentence = currentAssembly.map(index => q.words[index]).join(" ");
    
    const cleanAssembled = sentence.replace(/\s+/g, ' ').trim();
    const cleanTarget = q.correctSentence.replace(/\s+/g, ' ').trim();

    if (cleanAssembled === cleanTarget) {
      answers[idx] = q.correct;
    } else {
      if (currentAssembly.length === q.words.length) {
        answers[idx] = q.correct === "A" ? "B" : "A";
      } else {
        answers[idx] = null;
      }
    }

    if (nextBtn) {
      if (idx === QUESTIONS.length - 1) {
        nextBtn.textContent = "Submit";
      } else {
        nextBtn.textContent = answers[idx] ? "Next →" : "Skip";
      }
    }
    
    // Auto-advance if correctly assembled
    if (cleanAssembled === cleanTarget && idx < QUESTIONS.length - 1) {
      setTimeout(() => {
        transitionToQuestion(idx + 1);
      }, 600);
    }

    renderProgressNav();
  }

  drawScrambleState();
}

function renderErrorCorrectionQuestion(q, contentWrap) {
  // Clickable Sentence wrapper
  const clickableSentence = document.createElement("div");
  clickableSentence.className = "clickable-sentence";
  clickableSentence.id = "clickableSentence";
  contentWrap.appendChild(clickableSentence);

  const words = q.sentence.split(' ');
  words.forEach((word) => {
    const span = document.createElement("span");
    span.className = "sentence-word";
    span.textContent = word;

    const errorState = studentErrorSelections[idx];
    if (errorState.tappedWord === word) {
      if (errorState.selectedOptionIndex !== null) {
        span.classList.add("corrected");
        span.textContent = q.options[errorState.selectedOptionIndex];
      } else {
        span.classList.add("selected-error");
      }
    }

    span.addEventListener("click", () => {
      clickableSentence.querySelectorAll(".sentence-word").forEach(s => {
        s.classList.remove("selected-error");
      });
      span.classList.add("selected-error");

      // Update state
      studentErrorSelections[idx].tappedWord = word;
      studentErrorSelections[idx].selectedOptionIndex = null;
      answers[idx] = null;

      renderCorrectionPanel(q, span, contentWrap);
    });

    clickableSentence.appendChild(span);
  });

  // Help info
  const helpInfo = document.createElement("div");
  helpInfo.className = "small text-muted text-center mt-2";
  helpInfo.innerHTML = "<i class='bi bi-hand-index-thumb'></i> Tap the incorrect word in the sentence above to show corrections.";
  contentWrap.appendChild(helpInfo);

  // Restore correction panel if already clicked previously
  if (studentErrorSelections[idx].tappedWord !== null) {
    const errorState = studentErrorSelections[idx];
    const wordSpans = clickableSentence.querySelectorAll(".sentence-word");
    let targetSpan = null;
    wordSpans.forEach(s => {
      if (s.textContent === errorState.tappedWord || q.options.includes(s.textContent)) {
        targetSpan = s;
      }
    });
    if (targetSpan) {
      renderCorrectionPanel(q, targetSpan, contentWrap);
    }
  }
}

function renderCorrectionPanel(q, wordSpan, contentWrap) {
  let existingPanel = document.getElementById("correctionPanel");
  if (existingPanel) existingPanel.remove();

  const panel = document.createElement("div");
  panel.id = "correctionPanel";
  panel.className = "correction-panel mt-4";

  const title = document.createElement("div");
  title.className = "correction-title mb-2";
  title.textContent = "Select the correct replacement:";
  panel.appendChild(title);

  const optionsDiv = document.createElement("div");
  optionsDiv.className = "correction-options";

  q.options.forEach((optText, index) => {
    const optBtn = document.createElement("button");
    optBtn.type = "button";
    optBtn.className = "correction-opt";
    optBtn.textContent = optText;

    const savedSelection = studentErrorSelections[idx].selectedOptionIndex;
    if (savedSelection === index) {
      optBtn.classList.add("selected");
    }

    optBtn.addEventListener("click", () => {
      optionsDiv.querySelectorAll(".correction-opt").forEach(o => o.classList.remove("selected"));
      optBtn.classList.add("selected");

      // Update state
      studentErrorSelections[idx].selectedOptionIndex = index;
      
      // Update word span text and style
      wordSpan.textContent = optText;
      wordSpan.classList.remove("selected-error");
      wordSpan.classList.add("corrected");

      // Save answer as letter (A, B, C, D)
      const letter = String.fromCharCode(65 + index);
      answers[idx] = letter;

      if (nextBtn) {
        nextBtn.textContent = (idx === QUESTIONS.length - 1) ? "Submit" : "Next →";
      }
      renderProgressNav();

      // Auto-advance
      if (idx < QUESTIONS.length - 1) {
        setTimeout(() => {
          transitionToQuestion(idx + 1);
        }, 600);
      }
    });

    optionsDiv.appendChild(optBtn);
  });

  panel.appendChild(optionsDiv);
  contentWrap.appendChild(panel);
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
  if(QUESTIONS[idx].options && ["1","2","3","4","5","6","7","8","9"].includes(e.key) && (parseInt(e.key) <= QUESTIONS[idx].options.length)){
    const choiceIndex = parseInt(e.key)-1;
    const optButtons = document.querySelectorAll(".opt");
    if(optButtons[choiceIndex]) optButtons[choiceIndex].click();
  }
  if(QUESTIONS[idx].options && e.key.length === 1 && e.key.toLowerCase() >= 'a' && e.key.toLowerCase() <= 'd'){
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
