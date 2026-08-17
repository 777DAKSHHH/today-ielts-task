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
    audioUrl: "How_Instant_Cup_Noodles_Are_Made.m4a",
    imageUrl: "instant-noodles.png",
    taskType: "Process Diagram (Man-made Process)",
    questionText: "The diagram below shows how instant noodles are manufactured. Summarize the information by selecting and reporting the main features.",
    sampleIntro: "The diagram illustrates the manufacturing process of instant noodles, showing how the product is produced on an industrial scale.",
    sampleOverview: "Overall, this is a man-made linear process comprising eight distinct stages, commencing with the storage of flour in silos and culminating in the labelling and sealing of the finished noodle cups. A striking feature of this process is that the noodles are cooked in oil and dried before being portioned into cups, where supplementary ingredients are added prior to final packaging.",
    bp1Title: "Body Paragraph 1",
    bp1Covers: "Flour Silo Storage ➔ Dough Sheets ➔ Slicing Dough Strips",
    bp1Points: [
      "Initially, raw flour is transported from storage silos to a mixing machine, where it is homogenized with water and oil.",
      "Subsequently, the mixture is passed through a series of rollers to flatten it into thin dough sheets.",
      "Following this, these flat sheets are sheared by machinery to form wavy dough strips."
    ],
    bp2Title: "Body Paragraph 2",
    bp2Covers: "Forming Noodle Discs ➔ Frying & Dehydrating ➔ Cup Packaging ➔ Sealing",
    bp2Points: [
      "Thereafter, the wavy strips are portioned and shaped into circular noodle discs.",
      "These discs are then cooked in hot oil, which parboils them, and are subsequently dried to remove moisture.",
      "Next, the dehydrated noodle discs are dispensed into cups, followed by the addition of dried vegetables and spices.",
      "Eventually, the cups are hermetically sealed and labelled, completing the production line."
    ],
    bp1Flow: [
      "Initially: The manufacturing line commences when raw flour is released from storage silos into a mixer.",
      "Subsequently: The flour, water, and oil are homogenized into dough and rolled into laminated sheets.",
      "Shearing: The dough sheets are then sheared into narrow, wavy strips."
    ],
    bp2Flow: [
      "Thereafter: The strips are shaped into circular noodle discs, cooked in oil, and dehydrated.",
      "Cup Dispensing: The dry noodle discs are placed in cups with vegetables and spices added.",
      "Eventually: The cups are hermetically sealed and labelled, completing the production cycle."
    ],
    vocabList: [
      { simple: "starts", band9: "Commences" },
      { simple: "ends with", band9: "Culminates" },
      { simple: "mixed thoroughly", band9: "Homogenized" },
      { simple: "rolled flat", band9: "Laminated" },
      { simple: "cut with pressure", band9: "Sheared" },
      { simple: "all moisture removed", band9: "Dehydrated" },
      { simple: "portioned/dispensed", band9: "Dispensed" },
      { simple: "sealed airtight", band9: "Hermetically sealed" }
    ],
    vocabHunt: ["Commences", "Homogenized", "Laminated", "Hermetically sealed"],
    ranking: ["Flour Storage (Silos)", "Mixing (Water & Oil)", "Rolling Dough Sheets", "Slicing Dough Strips", "Forming Noodle Discs", "Cooking & Drying", "Adding Vegetables & Spices", "Sealing & Labelling Cups"],
    keywords: ["noodles", "manufacture", "process", "stages", "flour", "silos", "mixer", "water", "oil", "dough", "sheets", "rollers", "strips", "discs", "cooking", "frying", "drying", "cups", "vegetables", "spices", "labelling", "sealing"]
  },
  task2: {
    audioUrl: "Sanctuaries_or_prisons_for_endangered_species.m4a",
    taskType: "Discuss Both Views & Opinion Essay",
    questionText: "Some people think that zoos are cruel and should be closed down. Others, however, believe that zoos can be useful in protecting wild animals. Discuss both the views and give your opinion.",
    sampleIntro: "While many people argue that keeping animals in zoos is cruel and should be banned, others believe these facilities play a key role in protecting wildlife. In my opinion, despite the ethical concerns of keeping animals in cages, zoos are necessary because they safeguard endangered species from extinction.",
    sampleConclusion: "In conclusion, although captivity can cause animals psychological distress and limit their freedom, zoos provide essential breeding programs and a safe environment for species under threat. Therefore, I believe zoos should remain open, but they must prioritize animal welfare over commercial profit.",
    bp1Title: "Arguments for Zoo Closure (Cruelty & Captivity)",
    bp2Title: "Arguments for Zoo Conservation (Wildlife Protection)",
    vocabList: [
      { word: "Confinement", meaning: "The state of being restricted in a limited space.", example: "The lifelong confinement of large predators in small cages can lead to severe psychological distress." },
      { word: "Indispensable", meaning: "Absolutely necessary; essential.", example: "Captive breeding programs have proved indispensable in saving endangered species from extinction." },
      { word: "Abolished", meaning: "Formally put an end to a system, practice, or institution.", example: "Critics demand that traditional zoos be abolished in favor of natural wildlife reserves." },
      { word: "Cognitive", meaning: "Relating to mental processes of perception, memory, judgment, and reasoning.", example: "Restrictive enclosures often fail to stimulate the cognitive abilities of highly intelligent primates." },
      { word: "Altruistic", meaning: "Showing a disinterested and selfless concern for the well-being of others.", example: "While some zoo operators have purely commercial motives, others are driven by altruistic conservation goals." },
      { word: "Propensity", meaning: "An inclination or natural tendency to behave in a particular way.", example: "Captive animals often lose their natural propensity to hunt and survive in the wild." }
    ],
    vocabHunt: ["Confinement", "Indispensable", "Abolished", "Cognitive", "Altruistic", "Propensity"],
    causes: [
      { title: "Restricts Natural Behavior", desc: "Enclosures prevent animals from roaming long distances, hunting, and engaging in natural social structures.", ex: "Large migratory species like elephants and polar bears often develop repetitive pacing behaviors in confined spaces." },
      { title: "Causes Psychological Distress", desc: "Constant public exposure and artificial noise can lead to chronic stress and depression in captive animals.", ex: "Many primates exhibit self-harming habits and aggression due to the lack of mental stimulation in artificial habitats." },
      { title: "Weakens Survival Instincts", desc: "Animals born or raised in captivity become dependent on keepers for food and shelter, losing crucial survival skills.", ex: "Predators raised in cages struggle to adapt or hunt successfully if they are reintroduced into natural wild ecosystems." },
      { title: "Driven by Commercial Profit", desc: "Many roadside zoos prioritize ticket sales and public entertainment over the genuine health and comfort of their animals.", ex: "Exploitative animal shows and petting encounters are often designed for visitor amusement rather than ecological education." }
    ],
    effects: [
      { title: "Prevents Extinction", desc: "Captive breeding programs provide a safe refuge to rebuild populations of species threatened in the wild.", ex: "The California Condor and the Arabian Oryx were saved from total extinction solely through specialized zoo breeding initiatives." },
      { title: "Fosters Public Awareness", desc: "Seeing live animals up close inspires visitors to care about conservation and support global wildlife protection funds.", ex: "School children who visit zoo education centers are statistically more likely to support environmental charities in the future." },
      { title: "Facilitates Scientific Research", desc: "Zoos offer researchers a controlled environment to study animal biology, behavior, and disease management.", ex: "Veterinary findings in zoos regarding infectious wildlife diseases can be directly applied to protect wild herds." },
      { title: "Safe Haven from Threats", desc: "Zoos shield vulnerable animals from threats in the wild, such as poaching, habitat destruction, and climate change.", ex: "Orphaned or injured animals are given life-saving rehabilitation that would be impossible in the harsh wilderness." }
    ],
    keywords: ["zoos", "cruelty", "closed down", "protecting", "wild animals", "captivity", "conservation", "endangered species", "breeding", "cages", "natural habitat", "freedom", "extinction", "public awareness", "research", "animal welfare", "ethical concerns", "rehabilitation"]
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
