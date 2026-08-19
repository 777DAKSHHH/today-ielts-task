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

// Initialize Firebase using compat UMD syntax
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

// ---------- Configuration ----------
const CORRECT_PASS = "VII I MMVI"; // exact passphrase
let TOTAL_STEPS = 8;
let currentMode = 'task1'; // 'task1' or 'task2'
let t1OverviewUnlocked = true;
let t2OverviewUnlocked = true;

// ---------- Elements ----------
const loginSection = document.getElementById('login-section');
const modeSelectionSection = document.getElementById('mode-selection-section');
const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');

const wizardHeader = document.getElementById('wizard-header');
const stepPill = document.getElementById('stepPill');
const stepTitle = document.getElementById('stepTitle');
const stepCounter = document.getElementById('stepCounter');
const progressBar = document.getElementById('progressBar');

let currentStep = 1;
let timerInterval = null;
let timerRemaining = 0;

// Utility
function qs(id){ return document.getElementById(id); }
function show(el){ if (el) el.classList.remove('hidden'); }
function hide(el){ if (el) el.classList.add('hidden'); }

// Enter key support for login
if (passwordInput) {
  passwordInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') loginBtn.click();
  });
}

// ---------- Login ----------
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const val = passwordInput.value.trim();
    if (val === CORRECT_PASS) {
      hide(loginSection);
      show(modeSelectionSection); // Show mode selection instead of wizard directly
    } else {
      if (loginError) {
        loginError.classList.remove('hidden');
        setTimeout(()=> loginError.classList.add('hidden'), 3000);
      }
    }
  });
}

// ---------- Mode Selection ----------
window.selectMode = function(mode) {
  currentMode = mode;
  hide(modeSelectionSection);
  const mainWizard = document.querySelector('.wizard-main');
  if (mainWizard) mainWizard.classList.remove('hidden');
  show(wizardHeader);

  // Toggle Wrappers
  if(mode === 'task1'){
    show(qs('task1-wrapper'));
    hide(qs('task2-wrapper'));
    TOTAL_STEPS = 8;
  } else {
    hide(qs('task1-wrapper'));
    show(qs('task2-wrapper'));
    TOTAL_STEPS = 8;
  }

  gotoStep(1);
  
  // Refresh plugins
  if (window.glightbox) { window.glightbox.reload(); }
  setTimeout(() => { if (window.AOS) AOS.refresh(); }, 100);
};

// ---------- Step Navigation ----------
function updateHeader() {
  if (stepPill) stepPill.textContent = currentStep;
  if (stepTitle) stepTitle.textContent = `Step ${currentStep}: ${getStepName(currentStep)}`;
  if (stepCounter) stepCounter.textContent = `${currentStep} / ${TOTAL_STEPS}`;

  const pct = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);
  if (progressBar) progressBar.style.width = pct + '%';
}

function getStepName(step){
  if(currentMode === 'task1'){
    switch(step){
      case 1: return 'Task Overview';
      case 2: return 'Brainstorm';
      case 3: return 'Vocabulary & Verbs';
      case 4: return 'Introduction & Overview';
      case 5: return 'Body Paragraph Bifurcation';
      case 6: return 'Stage-wise Explanation';
      case 7: return 'Grammar & Cohesive Devices';
      case 8: return 'Final Review';
    }
  } else {
    switch(step){
      case 1: return 'Task 2 Overview';
      case 2: return 'Brainstorm';
      case 3: return 'Vocabulary';
      case 4: return 'Introduction';
      case 5: return 'Conclusion';
      case 6: return 'Body Paragraph 1';
      case 7: return 'Body Paragraph 2';
      case 8: return 'Final Review';
    }
  }
  return 'Step';
}

function hideAllSteps(){
  // Hide all steps within the active wrapper
  const wrapper = document.getElementById(currentMode + '-wrapper');
  if (wrapper) {
    const steps = wrapper.querySelectorAll('.wizard-card');
    steps.forEach(el => el.classList.add('hidden'));
  }
}

window.gotoStep = function(step){
  if(step < 1) step = 1;
  if(step > TOTAL_STEPS) step = TOTAL_STEPS;

  // Staged Reveal Verification Check
  if(currentMode === 'task1' && currentStep === 1 && step > 1 && !t1OverviewUnlocked){
    alert("Please complete the Active Listening Guess Box and dictation recall in Step 1 to unlock the task details!");
    return;
  }
  if(currentMode === 'task2' && currentStep === 1 && step > 1 && !t2OverviewUnlocked){
    alert("Please complete the Active Listening Guess Box, recall, and stance in Step 1 to unlock the Task 2 details!");
    return;
  }

  currentStep = step;
  hideAllSteps();

  if (step === 1 && currentMode === 'task1') {
    const analysisBlock = qs('task1AnalysisBlock');
    if (analysisBlock) {
      if (t1OverviewUnlocked) {
        analysisBlock.classList.remove('locked-section');
        analysisBlock.classList.add('unlocked-section');
      } else {
        analysisBlock.classList.add('locked-section');
        analysisBlock.classList.remove('unlocked-section');
      }
    }
  }
  
  const wrapper = document.getElementById(currentMode + '-wrapper');
  if (wrapper) {
    const el = wrapper.querySelector('[data-step="'+step+'"]');
    if(el) {
      el.classList.remove('hidden');
      // Trigger smooth CSS animation
      el.classList.add('animate-step');
    }
  }

  // Resize canvas when entering Brainstorm step (Step 2 in Task 2)
  if(currentMode === 'task2' && step === 2){
    setTimeout(resizeBrainstormCanvas, 100);
  }

  updateHeader();
  // Adjust nav buttons:
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.style.visibility = (currentStep === 1) ? 'hidden' : 'visible';
  if (nextBtn) nextBtn.style.visibility = (currentStep === TOTAL_STEPS) ? 'hidden' : 'visible';

  // Scroll into view the wizard container
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.AOS) AOS.refresh();
};

window.nextStep = function(){
  if(currentStep < TOTAL_STEPS){
    gotoStep(currentStep + 1);
  }
};
window.prevStep = function(){
  if(currentStep > 1){
    gotoStep(currentStep - 1);
  }
};

// ---------- Timer Logic (Step 2) ----------
function setupTimer(btnId, overlayId, displayId, duration) {
  const btn = qs(btnId);
  const overlay = qs(overlayId);
  const display = qs(displayId);
  
  if(!btn) return;

  btn.addEventListener('click', () => {
    if (timerInterval) return;
    timerRemaining = duration;
    show(overlay);
    
    const update = () => {
      const min = Math.floor(timerRemaining / 60).toString().padStart(2,'0');
      const sec = (timerRemaining % 60).toString().padStart(2,'0');
      if (display) display.textContent = `${min}:${sec}`;
    };
    update();

    timerInterval = setInterval(() => {
      timerRemaining--;
      update();
      if (timerRemaining <= 0){
        clearInterval(timerInterval);
        timerInterval = null;
        timerFinished();
      }
    }, 1000);
  });
}

// Init timers
setupTimer('startTimerBtn', 'timerOverlay', 'timerDisplay', 180); // Task 1 (3 min)
setupTimer('startTimerBtnT2', 'timerOverlayT2', 'timerDisplayT2', 300); // Task 2 (5 min)

function timerFinished(){
  // show finished alert and auto-progress to next step
  alert('Timer complete — great job! Moving to the next step.');
  nextStep();
}

// ---------- Media Completion (Step 1) ----------
const overviewAudio = qs('overviewAudio');
const overviewVideo = qs('overviewVideo');
const mediaCompleteBadge = qs('mediaCompleteBadge');

function markMediaComplete(){
  if(mediaCompleteBadge) show(mediaCompleteBadge);
}

if (overviewAudio) overviewAudio.addEventListener('ended', markMediaComplete);
if (overviewVideo) overviewVideo.addEventListener('ended', markMediaComplete);

const overviewAudioT2 = qs('overviewAudioT2');
const overviewVideoT2 = qs('overviewVideoT2');
const mediaCompleteBadgeT2 = qs('mediaCompleteBadgeT2');

function markMediaCompleteT2(){
  if(mediaCompleteBadgeT2) show(mediaCompleteBadgeT2);
}

if (overviewAudioT2) overviewAudioT2.addEventListener('ended', markMediaCompleteT2);
if (overviewVideoT2) overviewVideoT2.addEventListener('ended', markMediaCompleteT2);

// ---------- Text-to-Speech for Vocabulary (Step 3) ----------
function speak(text, voiceNameOrLang, onEndCallback){
  if(!('speechSynthesis' in window)){
    alert('Speech synthesis not supported on this browser.');
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find voice by name
  const selectedVoice = voices.find(v => v.name === voiceNameOrLang);
  if (selectedVoice) {
    u.voice = selectedVoice;
    u.lang = selectedVoice.lang;
  } else {
    u.lang = voiceNameOrLang || 'en-GB';
  }

  if (onEndCallback) {
    u.onend = onEndCallback;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// Dynamically load voices for TTS dropdowns
function populateVoices() {
  if (!('speechSynthesis' in window)) return;
  
  const voices = window.speechSynthesis.getVoices();
  const select1 = document.getElementById('accentSelect');
  const select2 = document.getElementById('accentSelectT2');
  
  if (!select1 && !select2) return;
  
  // Filter English voices
  const englishVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith('en'));
  
  const updateDropdown = (selectEl) => {
    if (!selectEl) return;
    const previousValue = selectEl.value;
    selectEl.innerHTML = '';
    
    if (englishVoices.length === 0) {
      selectEl.innerHTML = `
        <option value="en-GB">UK (en-GB)</option>
        <option value="en-IN">Indian (en-IN)</option>
        <option value="en-US">US (en-US)</option>
      `;
      selectEl.value = previousValue || 'en-GB';
      return;
    }
    
    englishVoices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      if (voice.name === previousValue) {
        option.selected = true;
      }
      selectEl.appendChild(option);
    });
  };
  
  updateDropdown(select1);
  updateDropdown(select2);
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = populateVoices;
  // Try populating immediately
  populateVoices();
}

window.bindVocabPronunciationClicks = function() {
  document.querySelectorAll('.vocab-word').forEach(wordCell => {
    wordCell.style.cursor = 'pointer';
    wordCell.onclick = () => {
      const word = wordCell.textContent.trim();
      const row = wordCell.parentElement;
      row.classList.add('speaking-row');
      
      const wrapper = wordCell.closest('.wizard-wrapper');
      const selectId = (wrapper && wrapper.id === 'task2-wrapper') ? 'accentSelectT2' : 'accentSelect';
      const selectEl = qs(selectId);
      const accent = selectEl ? selectEl.value : 'en-GB';
      
      speak(word, accent, () => {
        // Remove highlight after speaking is finished
        setTimeout(() => row.classList.remove('speaking-row'), 300);
      });
    };
  });
};

// Bind initially on script load
bindVocabPronunciationClicks();

// ---------- Save & Finalize ----------
window.finalize = function(){
  // mark final completed (generic selector might pick both, so scope it)
  const msg = currentMode === 'task1' ? qs('finalMessage') : qs('finalMessageT2');
  if(msg) msg.classList.remove('hidden');
  
  const finishBtns = document.querySelectorAll('#finishBtn, .btn-success');
  finishBtns.forEach(btn => {
    if (btn.onclick && btn.onclick.toString().includes('finalize')) {
      btn.disabled = true;
    }
  });

  // optionally clear timer
  if(timerInterval){ clearInterval(timerInterval); timerInterval = null; }
  // lock navigation
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  if (nextBtn) nextBtn.disabled = true;
  if (prevBtn) prevBtn.disabled = true;
  // save state
  localStorage.setItem('ielts_finalized', '1');
};

// ---------- Presentation Mode (for Smartboard Teaching) ----------
const presentationModeBtn = qs('presentationModeBtn');
const presentationControls = qs('presentationControls');
const exitPresentationBtn = qs('exitPresentationBtn');
const highlighterToggleBtn = qs('highlighterToggleBtn');
const clearHighlightsBtn = qs('clearHighlightsBtn');
const canvas = qs('highlighterCanvas');
let ctx = null;
if (canvas) ctx = canvas.getContext('2d');
let isHighlighterActive = false;
let isDrawing = false;

function enterPresentationMode() {
  document.documentElement.requestFullscreen();
  show(presentationControls);
  hide(qs('wizard-footer'));
}

function exitPresentationMode() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  hide(presentationControls);
  show(qs('wizard-footer'));
  clearHighlights();
  isHighlighterActive = false;
  if (highlighterToggleBtn) highlighterToggleBtn.classList.remove('active');
  if (canvas) canvas.style.pointerEvents = 'none';
}

function toggleHighlighter() {
  isHighlighterActive = !isHighlighterActive;
  if (highlighterToggleBtn) highlighterToggleBtn.classList.toggle('active');
  if (canvas) canvas.style.pointerEvents = isHighlighterActive ? 'auto' : 'none';
}

function clearHighlights() {
  if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setupCanvas() {
  if (!canvas || !ctx) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.strokeStyle = 'rgba(255, 255, 0, 0.4)'; // Yellow highlighter
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';

  canvas.addEventListener('mousedown', (e) => {
    if (!isHighlighterActive) return;
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing || !isHighlighterActive) return;
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
  });

  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);
}

if (presentationModeBtn) presentationModeBtn.addEventListener('click', enterPresentationMode);
if (exitPresentationBtn) exitPresentationBtn.addEventListener('click', exitPresentationMode);
if (highlighterToggleBtn) highlighterToggleBtn.addEventListener('click', toggleHighlighter);
if (clearHighlightsBtn) clearHighlightsBtn.addEventListener('click', clearHighlights);
window.addEventListener('resize', setupCanvas);

// ---------- Brainstorming Canvas Logic (Task 2) ----------
let brainstormCanvas = null;
let bsCtx = null;
let isBsDrawing = false;
let bsHistory = [];
let bsStep = -1;
let bsToolMode = 'pencil'; // 'pencil', 'highlighter', 'eraser'

function initBrainstormCanvas(){
  brainstormCanvas = document.getElementById('brainstormCanvas');
  if(!brainstormCanvas) return;
  bsCtx = brainstormCanvas.getContext('2d');
  
  // Initial style
  updateBsStyle();
  
  // Attempt initial resize
  resizeBrainstormCanvas();

  // Save initial blank state if history empty
  if(bsStep === -1) saveBsState();

  // Use Pointer Events for touch + stylus support
  brainstormCanvas.addEventListener('pointerdown', startBsDraw);
  brainstormCanvas.addEventListener('pointermove', drawBs);
  brainstormCanvas.addEventListener('pointerup', stopBsDraw);
  brainstormCanvas.addEventListener('pointercancel', stopBsDraw);
}

window.resizeBrainstormCanvas = function(){
  if(!brainstormCanvas) initBrainstormCanvas(); 
  if(!brainstormCanvas) return;
  
  const textarea = document.getElementById('task2BrainstormArea');
  if (!textarea) return;
  const rect = textarea.getBoundingClientRect();
  
  // Resize canvas to match textarea
  if(rect.width > 0 && (brainstormCanvas.width !== rect.width || brainstormCanvas.height !== rect.height)){
    brainstormCanvas.width = rect.width;
    brainstormCanvas.height = rect.height;
    updateBsStyle(); 
    if(bsStep >= 0) loadBsState(); 
  }
};

window.updateBsStyle = function(){
  if(!bsCtx) return;
  const colorPicker = document.getElementById('bsColorPicker');
  const sizeSlider = document.getElementById('bsSizeSlider');
  const color = colorPicker ? colorPicker.value : '#0d6efd';
  const size = sizeSlider ? sizeSlider.value : '2';
  
  bsCtx.lineCap = 'round';
  bsCtx.lineJoin = 'round';
  
  // Reset composite operation to standard draw
  bsCtx.globalCompositeOperation = 'source-over';
  
  if (bsToolMode === 'eraser') {
    bsCtx.globalCompositeOperation = 'destination-out';
    bsCtx.lineWidth = 24; // Larger line width for easy erasing
  } else if (bsToolMode === 'highlighter') {
    bsCtx.strokeStyle = 'rgba(255, 255, 0, 0.4)'; 
    bsCtx.lineWidth = 20;
  } else {
    bsCtx.strokeStyle = color;
    bsCtx.lineWidth = size;
  }
};

window.setBsDrawMode = function(mode) {
  bsToolMode = mode;
  
  const penBtn = document.getElementById('bsPenBtn');
  const highlighterBtn = document.getElementById('bsHighlighterBtn');
  const eraserBtn = document.getElementById('bsEraserBtn');
  
  if(penBtn) penBtn.classList.remove('active');
  if(highlighterBtn) highlighterBtn.classList.remove('active');
  if(eraserBtn) eraserBtn.classList.remove('active');
  
  if(mode === 'pencil' && penBtn) penBtn.classList.add('active');
  if(mode === 'highlighter' && highlighterBtn) highlighterBtn.classList.add('active');
  if(mode === 'eraser' && eraserBtn) eraserBtn.classList.add('active');
  
  updateBsStyle();
};

function saveBsState(){
  if (!brainstormCanvas) return;
  bsStep++;
  if(bsStep < bsHistory.length){ bsHistory.length = bsStep; }
  bsHistory.push(brainstormCanvas.toDataURL());
}

window.bsUndo = function(){
  if(bsStep > 0){ bsStep--; loadBsState(); }
};
window.bsRedo = function(){
  if(bsStep < bsHistory.length - 1){ bsStep++; loadBsState(); }
};

function loadBsState(){
  if (!bsCtx || !brainstormCanvas) return;
  const img = new Image();
  img.src = bsHistory[bsStep];
  img.onload = () => {
    bsCtx.clearRect(0, 0, brainstormCanvas.width, brainstormCanvas.height);
    bsCtx.drawImage(img, 0, 0);
  };
}

function startBsDraw(e){
  isBsDrawing = true;
  bsCtx.beginPath();
  const rect = brainstormCanvas.getBoundingClientRect();
  bsCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  try {
    brainstormCanvas.setPointerCapture(e.pointerId);
  } catch (err) {}
}

function drawBs(e){
  if(!isBsDrawing) return;
  const rect = brainstormCanvas.getBoundingClientRect();
  bsCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  bsCtx.stroke();
}

function stopBsDraw(e){ 
  if(isBsDrawing){ 
    isBsDrawing = false; 
    try {
      if (e) brainstormCanvas.releasePointerCapture(e.pointerId);
    } catch (err) {}
    saveBsState(); 
  }
}

window.clearBrainstormCanvas = function(){
  if(!bsCtx || !brainstormCanvas) return;
  bsCtx.clearRect(0, 0, brainstormCanvas.width, brainstormCanvas.height);
  saveBsState();
};

window.downloadBrainstorm = function() {
  const textarea = document.getElementById('task2BrainstormArea');
  const canvas = document.getElementById('brainstormCanvas');
  if(!textarea || !canvas) return;

  // Create a temporary canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');

  // 1. Draw solid background
  tempCtx.fillStyle = '#FFFFFF';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // 2. Draw the text from the textarea
  const text = textarea.value;
  const lines = text.split('\n');
  
  const style = window.getComputedStyle(textarea);
  const paddingLeft = parseFloat(style.paddingLeft) || 16;
  const paddingTop = parseFloat(style.paddingTop) || 16;
  const fontSize = style.fontSize || '16px';
  const fontFamily = style.fontFamily || 'monospace';
  const lineHeight = parseFloat(style.lineHeight) || 24;

  tempCtx.fillStyle = '#0F172A'; // Slate text color
  tempCtx.font = `${fontSize} ${fontFamily}`;
  tempCtx.textBaseline = 'top';

  lines.forEach((line, index) => {
    tempCtx.fillText(line, paddingLeft, paddingTop + index * lineHeight);
  });

  // 3. Draw drawings overlay
  tempCtx.drawImage(canvas, 0, 0);

  // 4. Download
  const link = document.createElement('a');
  link.download = 'ielts-brainstorm-notes.png';
  link.href = tempCanvas.toDataURL('image/png');
  link.click();
};

window.setBrainstormTool = function(tool){
  const canvas = document.getElementById('brainstormCanvas');
  const typeBtn = document.getElementById('toolTypeBtn');
  const drawBtn = document.getElementById('toolDrawBtn');
  const options = document.getElementById('drawOptions');

  if(tool === 'type'){
    if (canvas) canvas.style.pointerEvents = 'none';
    if (typeBtn) typeBtn.classList.add('active');
    if (drawBtn) drawBtn.classList.remove('active');
    hide(options);
  } else {
    if (canvas) canvas.style.pointerEvents = 'auto';
    if (typeBtn) typeBtn.classList.remove('active');
    if (drawBtn) drawBtn.classList.add('active');
    show(options);
    resizeBrainstormCanvas(); 
  }
};

// Auto-resize logic
window.autoResize = function(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
  if(window.resizeBrainstormCanvas) window.resizeBrainstormCanvas();
};

// ---------- Init AOS & initial UI ----------
document.addEventListener('DOMContentLoaded', function(){
  // Load live lesson configurations from Firebase database
  loadLiveLesson();

  // Initialize AOS
  if(window.AOS){
    AOS.init({ duration: 500, once: false, easing: 'ease-out-cubic' });
  }

  // Hide header on first load; user must login
  if (wizardHeader) wizardHeader.classList.add('hidden');
  // Hide all step sections initially (they will be revealed when logged in)
  hideAllSteps();

  // Setup presentation mode canvas
  setupCanvas();

  // Initialize interactive sequencing game
  initSequencingGameT1();

  // Populate QR codes and links dynamically
  let baseOrigin = window.location.origin;
  if (!baseOrigin || baseOrigin.startsWith('file:') || baseOrigin === 'null') {
    // Fallback to the live Render domain so scanning from a phone works even when opened locally
    baseOrigin = "https://today-ielts-task.onrender.com";
  }

  const guessUrlT1 = baseOrigin + "/guess.html?task=task1";
  const guessUrlT2 = baseOrigin + "/guess.html?task=task2";
  
  const qrCodeApiUrlT1 = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(guessUrlT1)}`;
  const qrCodeApiUrlT2 = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(guessUrlT2)}`;
  
  const qrT1 = qs('qrCodeImgT1');
  const qrT2 = qs('qrCodeImgT2');
  const linkT1 = qs('guessLinkT1');
  const linkT2 = qs('guessLinkT2');
  
  if (qrT1) qrT1.src = qrCodeApiUrlT1;
  if (qrT2) qrT2.src = qrCodeApiUrlT2;
  if (linkT1) linkT1.href = guessUrlT1;
  if (linkT2) linkT2.href = guessUrlT2;

  // Auto-mode selector via URL query parameter (for direct navigation shortcuts)
  const urlParams = new URLSearchParams(window.location.search);
  const modeParam = urlParams.get('mode');
  if (modeParam === 'task1' || modeParam === 'task2') {
    if (loginSection) hide(loginSection);
    selectMode(modeParam);
  }
});

// Make some helpful keyboard shortcuts (for power users)
document.addEventListener('keydown', (e) => {
  if(e.altKey && e.key === 'ArrowRight') nextStep();
  if(e.altKey && e.key === 'ArrowLeft') prevStep();
});

// ---------- Task 1 Active Listening & Guess Box ----------
let guessListeners = {};

window.listenForStudentGuessT1 = function() {
  const name = qs('unlockNameInputT1').value.trim();
  const feedback = qs('unlockFeedbackT1');
  
  if (name.length < 2) {
    if (feedback) feedback.innerHTML = '<i class="bi bi-clock-history"></i> Waiting for name...';
    return;
  }

  const sanitized = name.replace(/[.#$\[\]]/g, "_");
  const guessRef = db.ref('guesses/' + sanitized);
  
  // Turn off previous observer
  guessRef.off('value');

  if (feedback) feedback.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Checking guess in database...';
  
  guessListeners['T1'] = guessRef.on('value', (snapshot) => {
    const val = snapshot.val();
    if (val && val.task === 'task1') {
      if (feedback) feedback.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Submission found! Unlocking...';
      unlockTask1();
    } else {
      if (feedback) feedback.innerHTML = '<i class="bi bi-exclamation-circle-fill text-warning"></i> No guess submitted yet. Please scan and submit via phone.';
    }
  });
};

window.unlockTask1 = function() {
  t1OverviewUnlocked = true;
  const analysisBlock = qs('task1AnalysisBlock');
  if (analysisBlock) {
    analysisBlock.classList.remove('locked-section');
    analysisBlock.classList.add('unlocked-section');
  }
  
  // Enable next step automatically
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) nextBtn.style.visibility = 'visible';

  alert("Cognitive check passed! Flowchart analysis is unlocked and active.");
};

// ---------- Task 2 Active Listening & Stance Selector ----------
window.listenForStudentGuessT2 = function() {
  const name = qs('unlockNameInputT2').value.trim();
  const feedback = qs('unlockFeedbackT2');
  
  if (name.length < 2) {
    if (feedback) feedback.innerHTML = '<i class="bi bi-clock-history"></i> Waiting for name...';
    return;
  }

  const sanitized = name.replace(/[.#$\[\]]/g, "_");
  const guessRef = db.ref('guesses/' + sanitized);
  
  // Turn off previous observer
  guessRef.off('value');

  if (feedback) feedback.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Checking guess in database...';

  guessListeners['T2'] = guessRef.on('value', (snapshot) => {
    const val = snapshot.val();
    if (val && val.task === 'task2') {
      if (feedback) feedback.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Submission found! Unlocking...';
      unlockTask2(val.taskType, val.context);
    } else {
      if (feedback) feedback.innerHTML = '<i class="bi bi-exclamation-circle-fill text-warning"></i> No guess submitted yet. Please scan and submit via phone.';
    }
  });
};

window.unlockTask2 = function(stance, thesis) {
  t2OverviewUnlocked = true;
  
  // Pre-fill student's stance and thesis statement directly into Task 2 Step 2 brainstorming textarea
  const brainstormArea = qs('task2BrainstormArea');
  if (brainstormArea) {
    const formattedThesis = `[STUDENT ACTIVE BRIEFING THESIS]\nMy Prediction: ${stance.toUpperCase()}\nNotes/Guess from Phone:\n"${thesis}"\n\n`;
    brainstormArea.value = formattedThesis + brainstormArea.value;
  }

  // Enable next step automatically
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) nextBtn.style.visibility = 'visible';

  alert("Cognitive stance lock passed! Brainstorm canvas and lesson details are unlocked.");
};

// ---------- Task 1 Bar Chart Ranking Challenge ----------
const TASK1_BARCHART_STAGES = [
  { id: 1, text: "Marina constructed in the sea" },
  { id: 2, text: "Factory replaced by supermarket near Sunset Street" },
  { id: 3, text: "Retail shops nearby divided into two units" },
  { id: 4, text: "Railway station built on the railway track" },
  { id: 5, text: "Petrol station near Estuary Road replaced by post office" },
  { id: 6, text: "Connecting road pedestrianized" },
  { id: 7, text: "Library, doctor's surgery, and college preserved" },
  { id: 8, text: "Bird house added to the woodland area" }
];
let userTimelineT1 = [];

window.initSequencingGameT1 = function() {
  userTimelineT1 = [];
  const scrambledContainer = qs('scrambledStagesT1');
  const timelineContainer = qs('orderedTimelineT1');
  const feedback = qs('sequencingFeedbackT1');
  
  if (!scrambledContainer) return;
  scrambledContainer.innerHTML = '';
  timelineContainer.innerHTML = '<span class="text-muted small italic" id="timelineEmptyHintT1">Timeline is empty. Click stages above to build it.</span>';
  if (feedback) feedback.className = 'small mb-0';
  if (feedback) feedback.textContent = '';

  // Scramble the stages
  const scrambled = [...TASK1_BARCHART_STAGES].sort(() => Math.random() - 0.5);
  
  scrambled.forEach(stage => {
    const badge = document.createElement('span');
    badge.className = 'badge bg-primary scrambled-badge';
    badge.textContent = stage.text;
    badge.onclick = () => selectStageT1(stage, badge);
    scrambledContainer.appendChild(badge);
  });
};

function selectStageT1(stage, badgeEl) {
  // Add to timeline
  userTimelineT1.push(stage);
  
  // Hide from scrambled grid
  badgeEl.style.display = 'none';
  
  // Update timeline UI
  const timelineContainer = qs('orderedTimelineT1');
  const emptyHint = qs('timelineEmptyHintT1');
  if (emptyHint) emptyHint.style.display = 'none';
  
  const stepIndex = userTimelineT1.length;
  const timelineBadge = document.createElement('span');
  timelineBadge.className = 'badge bg-success timeline-badge';
  timelineBadge.innerHTML = `${stepIndex}. ${stage.text}`;
  timelineContainer.appendChild(timelineBadge);
  
  // Check sequence when all stages are selected
  if (userTimelineT1.length === TASK1_BARCHART_STAGES.length) {
    verifySequenceT1();
  }
}

function verifySequenceT1() {
  const feedback = qs('sequencingFeedbackT1');
  let isCorrect = true;
  
  for (let i = 0; i < TASK1_BARCHART_STAGES.length; i++) {
    if (userTimelineT1[i].id !== TASK1_BARCHART_STAGES[i].id) {
      isCorrect = false;
      break;
    }
  }
  
  if (isCorrect) {
    feedback.className = 'small text-success fw-bold';
    feedback.innerHTML = '<i class="bi bi-check-circle-fill"></i> Riverpark Development Ranking Verified! Correct order locked.';
  } else {
    feedback.className = 'small text-danger fw-bold';
    feedback.innerHTML = '<i class="bi bi-x-circle-fill"></i> Incorrect ranking sequence. Resetting game...';
    setTimeout(initSequencingGameT1, 2000);
  }
}

// ---------- Vocabulary Ear-Trainer Hunt ----------
let heardVocabT1 = new Set();
let heardVocabT2 = new Set();

window.toggleVocabHeard = function(cardEl, word, mode) {
  const targetSet = (mode === 'T1') ? heardVocabT1 : heardVocabT2;
  const totalCount = (mode === 'T1') ? 4 : 6;
  const badgeId = (mode === 'T1') ? 'vocabTrainerBadgeT1' : 'vocabTrainerBadgeT2';
  
  if (targetSet.has(word)) {
    targetSet.delete(word);
    cardEl.classList.remove('heard');
    cardEl.querySelector('.status-icon').innerHTML = '<i class="bi bi-circle"></i> Unheard';
  } else {
    targetSet.add(word);
    cardEl.classList.add('heard');
    cardEl.querySelector('.status-icon').innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Heard ✓';
    
    // Play pronunciation trigger automatically as well (to keep audio synced)
    const selectId = (mode === 'T2') ? 'accentSelectT2' : 'accentSelect';
    const selectEl = qs(selectId);
    const accent = selectEl ? selectEl.value : 'en-GB';
    speak(word, accent);
  }
  
  const badge = qs(badgeId);
  if (badge) {
    badge.textContent = `Lexical Hunt: ${targetSet.size}/${totalCount} Found`;
    if (targetSet.size === totalCount) {
      badge.className = 'badge bg-success';
      badge.innerHTML = '<i class="bi bi-patch-check-fill"></i> Lexical Mastery Badge Unlocked!';
    } else {
      badge.className = 'badge bg-secondary';
    }
  }
};

// ---------- Load Lesson Data Dynamically from Firebase ----------
window.loadLiveLesson = function() {
  db.ref('activeLesson').once('value').then((snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // --- Task 1 Override ---
    if (data.task1) {
      const t1 = data.task1;
      if (t1.audioUrl && qs('t1AudioSource')) {
        qs('t1AudioSource').src = 'materials/' + t1.audioUrl;
        const overviewAudio = qs('overviewAudio');
        if (overviewAudio) overviewAudio.load();
      }
      if (t1.imageUrl && qs('t1Image')) {
        qs('t1Image').src = 'materials/' + t1.imageUrl;
        if (qs('t1ImageLink')) qs('t1ImageLink').href = 'materials/' + t1.imageUrl;
      }
      if (t1.taskType && qs('t1TaskType')) qs('t1TaskType').textContent = t1.taskType;
      if (t1.questionText && qs('t1QuestionText')) {
        qs('t1QuestionText').innerHTML = t1.questionText.replace(/\n/g, '<br>');
      }
      if (t1.sampleIntro && qs('t1SampleIntro')) qs('t1SampleIntro').textContent = `"${t1.sampleIntro}"`;
      if (t1.sampleOverview && qs('t1SampleOverview')) qs('t1SampleOverview').textContent = `"${t1.sampleOverview}"`;
      if (t1.bp1Covers && qs('t1Bp1Covers')) qs('t1Bp1Covers').textContent = t1.bp1Covers;
      if (t1.bp1Points && qs('t1Bp1Bullets')) {
        qs('t1Bp1Bullets').innerHTML = t1.bp1Points.map(p => `<li>${p}</li>`).join('');
      }
      if (t1.bp2Covers && qs('t1Bp2Covers')) qs('t1Bp2Covers').textContent = t1.bp2Covers;
      if (t1.bp2Points && qs('t1Bp2Bullets')) {
        qs('t1Bp2Bullets').innerHTML = t1.bp2Points.map(p => `<li>${p}</li>`).join('');
      }
      if (t1.bp1Flow && qs('t1Bp1Flow')) {
        qs('t1Bp1Flow').innerHTML = t1.bp1Flow.map(p => `<li>${p}</li>`).join('');
      }
      if (t1.bp2Flow && qs('t1Bp2Flow')) {
        qs('t1Bp2Flow').innerHTML = t1.bp2Flow.map(p => `<li>${p}</li>`).join('');
      }
      if (t1.vocabList && qs('t1VocabTable1')) {
        qs('t1VocabTable1').innerHTML = t1.vocabList.map(item => `
          <tr><td>${item.simple}</td><td class="vocab-word fw-bold text-success" role="button">${item.band9}</td></tr>
        `).join('');
      }
      // Update Ranking Game
      if (t1.ranking && Array.isArray(t1.ranking)) {
        TASK1_BARCHART_STAGES.length = 0;
        t1.ranking.forEach((text, i) => {
          TASK1_BARCHART_STAGES.push({ id: i + 1, text: text });
        });
        initSequencingGameT1();
      }
      // Update Lexical Hunt cards
      if (t1.vocabHunt && Array.isArray(t1.vocabHunt) && qs('t1VocabHuntContainer')) {
        qs('t1VocabHuntContainer').innerHTML = t1.vocabHunt.map(word => `
          <div class="col-md-3 col-6">
            <div class="vocab-trainer-card text-center" onclick="toggleVocabHeard(this, '${word}', 'T1')">
              <span class="word-title d-block fw-bold text-dark">${word}</span>
              <span class="status-icon text-muted small"><i class="bi bi-circle"></i> Unheard</span>
            </div>
          </div>
        `).join('');
      }
    }

    // --- Task 2 Override ---
    if (data.task2) {
      const t2 = data.task2;
      if (t2.audioUrl && qs('t2AudioSource')) {
        qs('t2AudioSource').src = 'materials/' + t2.audioUrl;
        const overviewAudioT2 = qs('overviewAudioT2');
        if (overviewAudioT2) overviewAudioT2.load();
      }
      if (t2.questionText && qs('t2QuestionText')) {
        qs('t2QuestionText').innerHTML = t2.questionText.replace(/\n/g, '<br>');
      }
      if (t2.sampleIntro && qs('t2SampleIntro')) qs('t2SampleIntro').textContent = t2.sampleIntro;
      if (t2.sampleConclusion && qs('t2SampleConclusion')) qs('t2SampleConclusion').textContent = t2.sampleConclusion;
      if (t2.bp1Title && qs('t2CausesTitle')) qs('t2CausesTitle').textContent = 'Focus: ' + t2.bp1Title;
      if (t2.bp2Title && qs('t2EffectsTitle')) qs('t2EffectsTitle').textContent = 'Focus: ' + t2.bp2Title;

      if (t2.vocabList && qs('t2VocabTable')) {
        qs('t2VocabTable').innerHTML = t2.vocabList.map(item => `
          <tr>
            <td class="vocab-word fw-bold" role="button">${item.word}</td>
            <td>${item.meaning}</td>
            <td>${item.example}</td>
          </tr>
        `).join('');
      }
      // Update Causes Grid
      if (t2.causes && Array.isArray(t2.causes) && qs('t2CausesGrid')) {
        qs('t2CausesGrid').innerHTML = t2.causes.map((item, i) => `
          <div class="col-md-6">
            <div class="card h-100 border-0 bg-light p-3">
              <h6 class="text-primary fw-bold mb-2">${i + 1}. ${item.title}</h6>
              <p class="small text-muted mb-2" style="line-height: 1.5;">${item.desc}</p>
              <div class="bg-white p-2 rounded border small text-secondary">
                <strong>Example:</strong> ${item.ex}
              </div>
            </div>
          </div>
        `).join('');
      }
      // Update Effects Grid
      if (t2.effects && Array.isArray(t2.effects) && qs('t2EffectsGrid')) {
        qs('t2EffectsGrid').innerHTML = t2.effects.map((item, i) => `
          <div class="col-md-6">
            <div class="card h-100 border-0 bg-light p-3">
              <h6 class="text-success fw-bold mb-2">${i + 1}. ${item.title}</h6>
              <p class="small text-muted mb-2" style="line-height: 1.5;">${item.desc}</p>
              <div class="bg-white p-2 rounded border small text-secondary">
                <strong>Example:</strong> ${item.ex}
              </div>
            </div>
          </div>
        `).join('');
      }
      // Update Lexical Hunt cards
      if (t2.vocabHunt && Array.isArray(t2.vocabHunt) && qs('t2VocabHuntContainer')) {
        qs('t2VocabHuntContainer').innerHTML = t2.vocabHunt.map(word => `
          <div class="col-md-4 col-6">
            <div class="vocab-trainer-card text-center" onclick="toggleVocabHeard(this, '${word}', 'T2')">
              <span class="word-title d-block fw-bold text-dark">${word}</span>
              <span class="status-icon text-muted small"><i class="bi bi-circle"></i> Unheard</span>
            </div>
          </div>
        `).join('');
      }
    }

    // Re-bind dynamic click events
    bindVocabPronunciationClicks();
  }).catch((err) => {
    console.warn("Could not load live lesson from database. Using fallbacks.", err);
  });
};
