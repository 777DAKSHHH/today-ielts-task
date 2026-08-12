// --- Firebase Config (Mirrors teacher-report.js / quiz.js) ---
const firebaseConfig = {
  apiKey: "AIzaSy***Q",
  authDomain: "ielts-live-dashboard.firebaseapp.com",
  databaseURL: "https://ielts-live-dashboard-default-rtdb.firebaseio.com",
  projectId: "ielts-live-dashboard",
  storageBucket: "ielts-live-dashboard.firebasestorage.app",
  messagingSenderId: "1044694021318",
  appId: "1:1044694021318:web:70f1ac1ba0787d37da93c7",
  measurementId: "G-R9G2YGSBM9"
};

// Initialize Firebase Compat
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

// Passcode Check login
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const errorAlert = document.getElementById('error-alert');

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    if (passwordInput && passwordInput.value === '3753') {
      loginSection.style.display = 'none';
      adminSection.style.display = 'block';
    } else {
      errorAlert.style.display = 'block';
    }
  });
}
if (passwordInput) {
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      loginBtn.click();
    }
  });
}

// --- Dynamic Inputs Renderers ---
const t1VocabContainer = document.getElementById('t1-vocab-container');
const t2VocabContainer = document.getElementById('t2-vocab-container');
const t2CausesContainer = document.getElementById('t2-causes-container');
const t2EffectsContainer = document.getElementById('t2-effects-container');
const quizContainer = document.getElementById('quiz-questions-container');

// Render Task 1 Vocab Table Rows
function renderT1Vocab(items = []) {
  t1VocabContainer.innerHTML = '';
  // We want 8 rows of Simple Term & Band 9 Alternative
  for (let i = 0; i < 8; i++) {
    const item = items[i] || { simple: '', band9: '' };
    t1VocabContainer.insertAdjacentHTML('beforeend', `
      <div class="row g-2 mb-2 align-items-center">
        <div class="col-sm-5">
          <input type="text" class="form-control form-control-sm t1-vocab-simple" data-index="${i}" placeholder="Simple term" value="${item.simple}">
        </div>
        <div class="col-sm-2 text-center text-muted">➔</div>
        <div class="col-sm-5">
          <input type="text" class="form-control form-control-sm t1-vocab-band9" data-index="${i}" placeholder="Band 9 Alternative" value="${item.band9}">
        </div>
      </div>
    `);
  }
}

// Render Task 2 Vocab Cards
function renderT2Vocab(items = []) {
  t2VocabContainer.innerHTML = '';
  // 6 words
  for (let i = 0; i < 6; i++) {
    const item = items[i] || { word: '', meaning: '', example: '' };
    t2VocabContainer.insertAdjacentHTML('beforeend', `
      <div class="card-form-sub p-3 mb-3">
        <h6 class="fw-bold mb-2">Word #${i + 1}</h6>
        <div class="row g-2">
          <div class="col-md-4">
            <input type="text" class="form-control form-control-sm t2-vocab-word" data-index="${i}" placeholder="Word" value="${item.word}">
          </div>
          <div class="col-md-8">
            <input type="text" class="form-control form-control-sm t2-vocab-meaning" data-index="${i}" placeholder="Meaning" value="${item.meaning}">
          </div>
          <div class="col-12">
            <input type="text" class="form-control form-control-sm t2-vocab-example" data-index="${i}" placeholder="IELTS Example Sentence" value="${item.example}">
          </div>
        </div>
      </div>
    `);
  }
}

// Render Task 2 Causes Cards
function renderT2Causes(items = []) {
  t2CausesContainer.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const item = items[i] || { title: '', desc: '', ex: '' };
    t2CausesContainer.insertAdjacentHTML('beforeend', `
      <div class="col-md-6">
        <div class="card-form-sub p-3 h-100">
          <h6 class="fw-bold mb-2 text-primary">Cause Card #${i + 1}</h6>
          <div class="mb-2">
            <label class="form-label small mb-1">Title</label>
            <input type="text" class="form-control form-control-sm t2-cause-title" data-index="${i}" value="${item.title}">
          </div>
          <div class="mb-2">
            <label class="form-label small mb-1">Description</label>
            <textarea class="form-control form-control-sm t2-cause-desc" data-index="${i}" rows="2">${item.desc}</textarea>
          </div>
          <div>
            <label class="form-label small mb-1">Example</label>
            <textarea class="form-control form-control-sm t2-cause-ex" data-index="${i}" rows="2">${item.ex}</textarea>
          </div>
        </div>
      </div>
    `);
  }
}

// Render Task 2 Effects Cards
function renderT2Effects(items = []) {
  t2EffectsContainer.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const item = items[i] || { title: '', desc: '', ex: '' };
    t2EffectsContainer.insertAdjacentHTML('beforeend', `
      <div class="col-md-6">
        <div class="card-form-sub p-3 h-100">
          <h6 class="fw-bold mb-2 text-warning">Effect Card #${i + 1}</h6>
          <div class="mb-2">
            <label class="form-label small mb-1">Title</label>
            <input type="text" class="form-control form-control-sm t2-effect-title" data-index="${i}" value="${item.title}">
          </div>
          <div class="mb-2">
            <label class="form-label small mb-1">Description</label>
            <textarea class="form-control form-control-sm t2-effect-desc" data-index="${i}" rows="2">${item.desc}</textarea>
          </div>
          <div>
            <label class="form-label small mb-1">Example</label>
            <textarea class="form-control form-control-sm t2-effect-ex" data-index="${i}" rows="2">${item.ex}</textarea>
          </div>
        </div>
      </div>
    `);
  }
}

// Render 10 Quiz Questions
function renderQuizQuestions(items = []) {
  quizContainer.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const item = items[i] || { type: 'scramble', q: '', words: [], correctSentence: '', sentence: '', errorWord: '', options: [], correct: 'A' };
    
    quizContainer.insertAdjacentHTML('beforeend', `
      <div class="card-form-sub p-4 mb-4 border-start border-primary border-4 animate-fade-in">
        <h5 class="fw-bold text-dark mb-3">Question #${i + 1}</h5>
        
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Question Type</label>
            <select class="form-select form-select-sm quiz-type" data-index="${i}" onchange="toggleQuizTypeFields(this, ${i})">
              <option value="scramble" ${item.type === 'scramble' ? 'selected' : ''}>Scrambled Sentence (Tap-to-Order)</option>
              <option value="error-correction" ${item.type === 'error-correction' ? 'selected' : ''}>Spot the Error Correction</option>
            </select>
          </div>
          <div class="col-md-8">
            <label class="form-label">Question Header / Prompt</label>
            <input type="text" class="form-control form-control-sm quiz-q" data-index="${i}" value="${item.q}">
          </div>

          <!-- SCRAMBLE FIELDS -->
          <div class="col-12 quiz-scramble-fields-${i}" style="display: ${item.type === 'scramble' ? 'block' : 'none'};">
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label">Scramble Words (comma-separated)</label>
                <input type="text" class="form-control form-control-sm quiz-words" data-index="${i}" placeholder="word1, word2, word3..." value="${(item.words || []).join(', ')}">
              </div>
              <div class="col-md-6">
                <label class="form-label">Correct Sentence Structure</label>
                <input type="text" class="form-control form-control-sm quiz-correctSentence" data-index="${i}" placeholder="Once acceptance is obtained..." value="${item.correctSentence || ''}">
              </div>
            </div>
          </div>

          <!-- ERROR SPOT FIELDS -->
          <div class="col-12 quiz-error-fields-${i}" style="display: ${item.type === 'error-correction' ? 'block' : 'none'};">
            <div class="row g-2">
              <div class="col-md-8">
                <label class="form-label">Full Sentence</label>
                <input type="text" class="form-control form-control-sm quiz-sentence" data-index="${i}" placeholder="While the economy expanded, unemployment was reduce." value="${item.sentence || ''}">
              </div>
              <div class="col-md-4">
                <label class="form-label">Error Word (must match exactly in sentence)</label>
                <input type="text" class="form-control form-control-sm quiz-errorWord" data-index="${i}" placeholder="reduce." value="${item.errorWord || ''}">
              </div>
              <div class="col-12">
                <label class="form-label">Correction Options (comma-separated, 4 options)</label>
                <input type="text" class="form-control form-control-sm quiz-options" data-index="${i}" placeholder="optionA, optionB, optionC, optionD" value="${(item.options || []).join(', ')}">
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <label class="form-label">Database Option Key Mapping</label>
            <select class="form-select form-select-sm quiz-correct" data-index="${i}">
              <option value="A" ${item.correct === 'A' ? 'selected' : ''}>A</option>
              <option value="B" ${item.correct === 'B' ? 'selected' : ''}>B</option>
              <option value="C" ${item.correct === 'C' ? 'selected' : ''}>C</option>
              <option value="D" ${item.correct === 'D' ? 'selected' : ''}>D</option>
            </select>
          </div>
        </div>
      </div>
    `);
  }
}

// Toggle Scramble / Error correction view fields
window.toggleQuizTypeFields = function(selectEl, index) {
  const isScramble = selectEl.value === 'scramble';
  document.querySelector(`.quiz-scramble-fields-${index}`).style.display = isScramble ? 'block' : 'none';
  document.querySelector(`.quiz-error-fields-${index}`).style.display = isScramble ? 'none' : 'block';
};

// --- DEFAULT LESSON PAYLOAD ---
const DEFAULT_LESSON = {
  task1: {
    audioUrl: "Fast_food_habits_2003_to_2013.m4a",
    imageUrl: "frog-life-cycle.png",
    taskType: "Process Diagram (Natural Cycle)",
    questionText: "The diagram below shows the life cycle of a frog. Summarize the information by selecting and reporting the main features.",
    sampleIntro: "The diagram illustrates the natural life cycle of a frog, showing the series of developmental stages through which it progresses from an egg to adulthood.",
    sampleOverview: "Overall, this is a natural cyclical process comprising six main stages, beginning with the formation of eggs and culminating in the development of an adult frog. A striking feature is the continuous transformation of the tadpole, which gradually develops limbs and the ability to breathe through its lungs before reaching maturity.",
    bp1Title: "Body Paragraph 1",
    bp1Covers: "Eggs ➔ Tadpole ➔ Development of limbs",
    bp1Points: [
      "Initially, the cycle begins with eggs laid in water, within which an embryo develops.",
      "Subsequently, the eggs hatch into tadpoles, which undergo gradual physical development.",
      "As the tadpole matures, its body becomes more developed and the hind and front limbs emerge.",
      "Following this, the developing frog acquires its front legs, marking a further transition towards adulthood."
    ],
    bp2Title: "Body Paragraph 2",
    bp2Covers: "Pulmonary breathing ➔ Tadpole frog ➔ Adult frog",
    bp2Points: [
      "Thereafter, the developing frog begins pulmonary breathing, indicating the transition from aquatic to air-based respiration.",
      "The tail gradually diminishes as the animal develops into a tadpole frog.",
      "Eventually, the juvenile frog completes its metamorphosis and becomes an adult frog.",
      "The mature frog subsequently reproduces, laying eggs and thereby restarting the cycle."
    ],
    bp1Flow: [
      "Initially: The cycle commences with eggs laid in water, within which an embryo develops.",
      "Subsequently: The eggs hatch into tadpoles, which undergo gradual physical development in water.",
      "Limbs Development: As the tadpole matures, its body becomes more developed and the hind and front limbs emerge."
    ],
    bp2Flow: [
      "Thereafter: The developing frog begins pulmonary breathing, indicating the transition from aquatic to air-based respiration.",
      "Tadpole Frog: The tail gradually diminishes as the animal develops into a tadpole frog.",
      "Eventually: The juvenile frog completes its metamorphosis and becomes a mature adult frog, which eventually reproduces."
    ],
    vocabList: [
      { simple: "physical transformation", band9: "Metamorphosis" },
      { simple: "ends with", band9: "Culminates" },
      { simple: "experiences", band9: "Undergoes" },
      { simple: "becomes visible", band9: "Emerges" },
      { simple: "changes into", band9: "Transforms" },
      { simple: "becomes smaller", band9: "Diminishes" },
      { simple: "begins", band9: "Commences" },
      { simple: "develops forward", band9: "Progresses" }
    ],
    vocabHunt: ["Metamorphosis", "Culminates", "Undergoes", "Emerges"],
    ranking: ["Eggs", "Tadpole", "Limbs Development", "Pulmonary Breathing", "Tadpole Frog", "Adult Frog"],
    keywords: ["frog", "cycle", "egg", "embryo", "tadpole", "limb", "breathing", "lung", "gills", "metamorphosis", "reproduce"]
  },
  task2: {
    audioUrl: "Replacing_historic_landmarks_with_modern_infrastructure.m4a",
    taskType: "Causes and Effects Essay",
    questionText: "Very few people devote time to hobbies these days. Why is this happening? What effect does this have on an individual and society in general?",
    sampleIntro: "Nowadays, considerably fewer people devote time to hobbies than in the past due to increasing professional commitments, digital distractions, and the growing pressure to remain competitive. This trend has significant consequences for individual well-being, creativity, social cohesion, and overall quality of life.",
    sampleConclusion: "In conclusion, while demanding work hours and digital screens have ineluctably reduced the time spent on hobbies, this change redounds to lower mental health standards and fragmented communities. Prioritizing recreational outlets is essential for restoring both personal well-being and societal unity.",
    bp1Title: "Investing in New Infrastructure",
    bp2Title: "Preserving Old Buildings",
    vocabList: [
      { word: "Anathema", meaning: "Something intensely disliked or loathed.", example: "For dedicated career professionals, spending hours on unproductive leisure activities is often considered an anathema." },
      { word: "Ineluctable", meaning: "Unable to be avoided; resistless; inevitable.", example: "The ineluctable rise of demanding work schedules has left little room for hobbies." },
      { word: "Redound", meaning: "To have a particular result or effect (often negative in this context).", example: "Neglecting relaxation does not redound to professional success, but rather leads to burnout." },
      { word: "Salubrious", meaning: "Favorable to or promoting health; healthful.", example: "Pursuing active outdoor hobbies has a highly salubrious effect on mental and physical health." },
      { word: "Profligacy", meaning: "Reckless extravagance or wastefulness.", example: "The profligacy of screen-time habits consumes hours of potential leisure." },
      { word: "Sagacious", meaning: "Having or showing keen discernment and good judgment.", example: "A sagacious individual recognizes the necessity of work-life balance for long-term productivity." }
    ],
    vocabHunt: ["Anathema", "Ineluctable", "Redound", "Salubrious", "Profligacy", "Sagacious"],
    causes: [
      { title: "Accommodates Population Growth", desc: "Modern facilities can meet the demands of expanding urban populations.", ex: "New housing, transport networks and hospitals can ease pressure on overcrowded cities." },
      { title: "Enhances Economic Productivity", desc: "Efficient infrastructure facilitates business activity and improves connectivity.", ex: "Upgraded roads and public transport can reduce commuting and freight-delivery times." },
      { title: "Improves Public Safety", desc: "New structures can incorporate contemporary safety and environmental standards.", ex: "Modern bridges and buildings are designed to withstand structural and climatic risks more effectively." },
      { title: "Supports Technological Progress", desc: "Contemporary infrastructure can accommodate emerging technologies and changing public needs.", ex: "Smart transport systems and energy-efficient buildings can improve urban efficiency." }
    ],
    effects: [
      { title: "Protects Cultural Heritage", desc: "Historic structures embody a society's architectural and cultural legacy.", ex: "Preserving landmarks allows future generations to retain a tangible connection with their history." },
      { title: "Strengthens Tourism", desc: "Heritage sites can attract visitors and generate local economic activity.", ex: "Historic districts often support museums, hotels, restaurants and local businesses." },
      { title: "Maintains Architectural Identity", desc: "Older buildings give cities a distinctive character that modern developments may lack.", ex: "Traditional architecture can differentiate one city from increasingly uniform urban landscapes." },
      { title: "Encourages Sustainable Development", desc: "Reusing existing structures can reduce demolition waste and conserve construction resources.", ex: "Converting historic buildings into offices or cultural centres can extend their useful life." }
    ],
    keywords: ["infrastructure", "development", "modernization", "construction", "roads", "transport", "urban growth", "old buildings", "heritage", "history", "culture", "preservation", "restoration", "identity", "architecture", "tourism", "cost", "maintenance", "progress", "community"]
  },
  quizQuestions: [
    { 
      type: "scramble",
      q: "1. Arrange the words below to form a grammatically correct sentence describing the start of the life cycle:", 
      words: ["begins", "water.", "The", "eggs", "with", "laid", "in", "cycle"],
      correctSentence: "The cycle begins with eggs laid in water.",
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
      sentence: "The developmental process culminate in the emergence of an adult frog.",
      errorWord: "culminate",
      options: ["culminates", "culminating", "culmination", "culminated"],
      correct: "A"
    },
    { 
      type: "scramble",
      q: "5. Arrange the words below to form a grammatically correct Task 2 sentence about work schedules and hobbies:", 
      words: ["left", "rose", "hobbies.", "has", "schedules", "of", "demanding", "little", "ineluctable", "work", "The", "room", "for"],
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
      q: "9. Arrange the words below to form a grammatically correct sentence describing the tadpole development stage:", 
      words: ["undergoes", "physical", "before", "The", "tadpole", "reaching", "several", "changes", "maturity."],
      correctSentence: "The tadpole undergoes several physical changes before reaching maturity.",
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
  ]
};

// Populate the form fields with a specific lesson object
function populateForm(data) {
  const t1 = data.task1 || {};
  const t2 = data.task2 || {};
  
  // Task 1 fields
  document.getElementById('t1-audio').value = t1.audioUrl || '';
  document.getElementById('t1-image').value = t1.imageUrl || '';
  document.getElementById('t1-type').value = t1.taskType || '';
  document.getElementById('t1-question').value = t1.questionText || '';
  document.getElementById('t1-intro').value = t1.sampleIntro || '';
  document.getElementById('t1-overview').value = t1.sampleOverview || '';
  document.getElementById('t1-bp1-covers').value = t1.bp1Covers || '';
  document.getElementById('t1-bp1-bullets').value = (t1.bp1Points || []).join('\n');
  document.getElementById('t1-bp2-covers').value = t1.bp2Covers || '';
  document.getElementById('t1-bp2-bullets').value = (t1.bp2Points || []).join('\n');
  document.getElementById('t1-bp1-flow').value = (t1.bp1Flow || []).join('\n');
  document.getElementById('t1-bp2-flow').value = (t1.bp2Flow || []).join('\n');
  document.getElementById('t1-keywords').value = (t1.keywords || []).join(', ');
  document.getElementById('t1-ranking').value = (t1.ranking || []).join(', ');
  document.getElementById('t1-vocab-hunt').value = (t1.vocabHunt || []).join(', ');
  renderT1Vocab(t1.vocabList || []);

  // Task 2 fields
  document.getElementById('t2-audio').value = t2.audioUrl || '';
  document.getElementById('t2-type').value = t2.taskType || '';
  document.getElementById('t2-question').value = t2.questionText || '';
  document.getElementById('t2-intro').value = t2.sampleIntro || '';
  document.getElementById('t2-conclusion').value = t2.sampleConclusion || '';
  document.getElementById('t2-bp1-title').value = t2.bp1Title || '';
  document.getElementById('t2-bp2-title').value = t2.bp2Title || '';
  document.getElementById('t2-keywords').value = (t2.keywords || []).join(', ');
  document.getElementById('t2-vocab-hunt').value = (t2.vocabHunt || []).join(', ');
  renderT2Vocab(t2.vocabList || []);
  renderT2Causes(t2.causes || []);
  renderT2Effects(t2.effects || []);

  // Update card section headers based on custom paragraph titles
  const bp1TitleVal = t2.bp1Title || "Body Paragraph 1";
  const bp2TitleVal = t2.bp2Title || "Body Paragraph 2";
  if (document.getElementById('t2-bp1-header-label')) {
    document.getElementById('t2-bp1-header-label').textContent = `${bp1TitleVal} Grid Cards (4 items)`;
  }
  if (document.getElementById('t2-bp2-header-label')) {
    document.getElementById('t2-bp2-header-label').textContent = `${bp2TitleVal} Grid Cards (4 items)`;
  }

  // Quiz questions
  renderQuizQuestions(data.quizQuestions || []);
}

// Fetch active lesson from Firebase on load
db.ref('activeLesson').once('value').then((snapshot) => {
  const data = snapshot.val();
  if (data) {
    populateForm(data);
  } else {
    populateForm(DEFAULT_LESSON);
  }
}).catch((err) => {
  console.warn("Firebase offline or locked, loading default lesson config.", err);
  populateForm(DEFAULT_LESSON);
});

// Bind Defaults button
document.getElementById('btn-load-defaults').addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm("Are you sure you want to overwrite form fields with default Fast Food & Hobbies templates?")) {
    populateForm(DEFAULT_LESSON);
  }
});

// Handle Form Submission (Save to Firebase)
document.getElementById('cms-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById('btn-submit');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Publishing Updates...';

  // Serialize Task 1 vocab items
  const t1VocabSimpleEls = document.querySelectorAll('.t1-vocab-simple');
  const t1VocabBand9Els = document.querySelectorAll('.t1-vocab-band9');
  const t1VocabList = [];
  t1VocabSimpleEls.forEach((el, index) => {
    t1VocabList.push({
      simple: el.value.trim(),
      band9: t1VocabBand9Els[index].value.trim()
    });
  });

  // Serialize Task 2 vocab items
  const t2VocabWordEls = document.querySelectorAll('.t2-vocab-word');
  const t2VocabMeaningEls = document.querySelectorAll('.t2-vocab-meaning');
  const t2VocabExampleEls = document.querySelectorAll('.t2-vocab-example');
  const t2VocabList = [];
  t2VocabWordEls.forEach((el, index) => {
    t2VocabList.push({
      word: el.value.trim(),
      meaning: t2VocabMeaningEls[index].value.trim(),
      example: t2VocabExampleEls[index].value.trim()
    });
  });

  // Serialize Task 2 Causes card items
  const t2CauseTitleEls = document.querySelectorAll('.t2-cause-title');
  const t2CauseDescEls = document.querySelectorAll('.t2-cause-desc');
  const t2CauseExEls = document.querySelectorAll('.t2-cause-ex');
  const t2Causes = [];
  t2CauseTitleEls.forEach((el, index) => {
    t2Causes.push({
      title: el.value.trim(),
      desc: t2CauseDescEls[index].value.trim(),
      ex: t2CauseExEls[index].value.trim()
    });
  });

  // Serialize Task 2 Effects card items
  const t2EffectTitleEls = document.querySelectorAll('.t2-effect-title');
  const t2EffectDescEls = document.querySelectorAll('.t2-effect-desc');
  const t2EffectExEls = document.querySelectorAll('.t2-effect-ex');
  const t2Effects = [];
  t2EffectTitleEls.forEach((el, index) => {
    t2Effects.push({
      title: el.value.trim(),
      desc: t2EffectDescEls[index].value.trim(),
      ex: t2EffectExEls[index].value.trim()
    });
  });

  // Serialize 10 Quiz Questions
  const quizTypeEls = document.querySelectorAll('.quiz-type');
  const quizQEls = document.querySelectorAll('.quiz-q');
  const quizWordsEls = document.querySelectorAll('.quiz-words');
  const quizCorrectSentenceEls = document.querySelectorAll('.quiz-correctSentence');
  const quizSentenceEls = document.querySelectorAll('.quiz-sentence');
  const quizErrorWordEls = document.querySelectorAll('.quiz-errorWord');
  const quizOptionsEls = document.querySelectorAll('.quiz-options');
  const quizCorrectEls = document.querySelectorAll('.quiz-correct');
  
  const quizQuestions = [];
  for (let i = 0; i < 10; i++) {
    const type = quizTypeEls[i].value;
    const qObj = {
      type: type,
      q: quizQEls[i].value.trim(),
      correct: quizCorrectEls[i].value
    };
    if (type === 'scramble') {
      qObj.words = quizWordsEls[i].value.split(',').map(s => s.trim()).filter(s => s !== '');
      qObj.correctSentence = quizCorrectSentenceEls[i].value.trim();
    } else {
      qObj.sentence = quizSentenceEls[i].value.trim();
      qObj.errorWord = quizErrorWordEls[i].value.trim();
      qObj.options = quizOptionsEls[i].value.split(',').map(s => s.trim()).filter(s => s !== '');
    }
    quizQuestions.push(qObj);
  }

  // Build the complete schema payload
  const payload = {
    task1: {
      audioUrl: document.getElementById('t1-audio').value.trim(),
      imageUrl: document.getElementById('t1-image').value.trim(),
      taskType: document.getElementById('t1-type').value.trim(),
      questionText: document.getElementById('t1-question').value.trim(),
      sampleIntro: document.getElementById('t1-intro').value.trim(),
      sampleOverview: document.getElementById('t1-overview').value.trim(),
      bp1Title: "Body Paragraph 1",
      bp1Covers: document.getElementById('t1-bp1-covers').value.trim(),
      bp1Points: document.getElementById('t1-bp1-bullets').value.split('\n').map(s => s.trim()).filter(s => s !== ''),
      bp2Title: "Body Paragraph 2",
      bp2Covers: document.getElementById('t1-bp2-covers').value.trim(),
      bp2Points: document.getElementById('t1-bp2-bullets').value.split('\n').map(s => s.trim()).filter(s => s !== ''),
      bp1Flow: document.getElementById('t1-bp1-flow').value.split('\n').map(s => s.trim()).filter(s => s !== ''),
      bp2Flow: document.getElementById('t1-bp2-flow').value.split('\n').map(s => s.trim()).filter(s => s !== ''),
      vocabList: t1VocabList,
      keywords: document.getElementById('t1-keywords').value.split(',').map(s => s.trim()).filter(s => s !== ''),
      ranking: document.getElementById('t1-ranking').value.split(',').map(s => s.trim()).filter(s => s !== ''),
      vocabHunt: document.getElementById('t1-vocab-hunt').value.split(',').map(s => s.trim()).filter(s => s !== '')
    },
    task2: {
      audioUrl: document.getElementById('t2-audio').value.trim(),
      taskType: document.getElementById('t2-type').value.trim(),
      questionText: document.getElementById('t2-question').value.trim(),
      sampleIntro: document.getElementById('t2-intro').value.trim(),
      sampleConclusion: document.getElementById('t2-conclusion').value.trim(),
      bp1Title: document.getElementById('t2-bp1-title').value.trim(),
      bp2Title: document.getElementById('t2-bp2-title').value.trim(),
      vocabList: t2VocabList,
      causes: t2Causes,
      effects: t2Effects,
      keywords: document.getElementById('t2-keywords').value.split(',').map(s => s.trim()).filter(s => s !== ''),
      vocabHunt: document.getElementById('t2-vocab-hunt').value.split(',').map(s => s.trim()).filter(s => s !== '')
    },
    quizQuestions: quizQuestions
  };

  // Write live payload back to Firebase
  db.ref('activeLesson').set(payload).then(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-cloud-arrow-up-fill me-2"></i>Publish Live Lesson';
    
    // Show toast message
    const toastEl = document.getElementById('successToast');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }).catch((err) => {
    alert("Database update failed! Check internet connection & Firebase rules.\n\nError: " + err.message);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-cloud-arrow-up-fill me-2"></i>Publish Live Lesson';
  });
});
