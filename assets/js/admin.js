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
    audioUrl: "Replacing_coastal_factories_with_luxury_marinas.m4a",
    imageUrl: "riverpark-comparison.png",
    taskType: "Map Comparison (Development over Time)",
    questionText: "The diagrams below show the Riverpark area of 20 years ago and the Riverpark area now. Summarise the information by selecting and reporting the main features and make relevant comparisons.",
    sampleIntro: "The maps illustrate the industrial, commercial, and infrastructural developments in the Riverpark area over a twenty-year period from the past to the present day.",
    sampleOverview: "Overall, the Riverpark area has undergone a significant transformation from a semi-industrial layout into a more commercial and leisure-oriented space. The most notable changes include the construction of a marina in the sea, the replacement of the factory with a supermarket, and the addition of public transport links near the railway track.",
    bp1Title: "Body Paragraph 1",
    bp1Covers: "Sea, Sunset Street, and the Railway Track",
    bp1Points: [
      "In terms of commercial and transport developments, a new marina has been constructed in the sea to accommodate boats.",
      "Near Sunset Street, the former factory has been demolished and replaced by a supermarket, while the retail shops nearby have been redeveloped into two separate units.",
      "Additionally, a new railway station has been built on the railway track."
    ],
    bp2Title: "Body Paragraph 2",
    bp2Covers: "Estuary Road, Sun Road, College, and the Woodlands",
    bp2Points: [
      "Regarding public infrastructure, the petrol station along Estuary Road has been replaced by a post office, and the road connecting Sunset Street to Sun Road has been pedestrianized.",
      "In contrast, the library, doctor's surgery, and college have remained unchanged in their original positions.",
      "Finally, the woodland area has been preserved, with a bird house added to the site."
    ],
    bp1Flow: [
      "Marina: Built in the sea to provide vessel mooring facilities.",
      "Supermarket & Shops: Former factory demolished to erect a supermarket; nearby shops split into two units.",
      "Railway: A new station built along the railway track."
    ],
    bp2Flow: [
      "Post Office: Replaced the old petrol station along Estuary Road.",
      "Pedestrianization: Central connecting road turned into a walking pedestrian road.",
      "Woodlands: Trees preserved and a bird house added."
    ],
    vocabList: [
      { simple: "pulled down", band9: "Demolished" },
      { simple: "built", band9: "Constructed" },
      { simple: "converted for walking", band9: "Pedestrianized" },
      { simple: "kept unchanged", band9: "Preserved" },
      { simple: "modernized", band9: "Redeveloped" },
      { simple: "split into two", band9: "Divided" },
      { simple: "changed function", band9: "Converted" },
      { simple: "remained", band9: "Persisted" }
    ],
    vocabHunt: ["Demolished", "Constructed", "Pedestrianized", "Preserved"],
    ranking: ["Marina constructed in the sea", "Factory replaced by supermarket near Sunset Street", "Retail shops nearby divided into two units", "Railway station built on the railway track", "Petrol station near Estuary Road replaced by post office", "Connecting road pedestrianized", "Library, doctor's surgery, and college preserved", "Bird house added to the woodland area"],
    keywords: ["riverpark", "maps", "comparisons", "sea", "marina", "factory", "supermarket", "shops", "railway", "station", "petrol station", "post office", "pedestrian", "road", "library", "surgery", "college", "bird house", "trees", "development", "transformation"]
  },
  task2: {
    audioUrl: "Why_Students_Are_Quitting_Hard_Science.m4a",
    taskType: "Why is this & Positive/Negative Development Essay",
    questionText: "Nowadays, not enough students choose science subjects at university in many countries. Why is this? Is this a positive or negative development?",
    sampleIntro: "In recent years, a growing number of countries have witnessed a decline in the number of university students opting to study science-related disciplines. This trend is primarily driven by the perceived difficulty of scientific fields and the allure of lucrative careers in technology and business. In my view, this is a highly negative development, as it creates critical deficits in essential fields like healthcare and environmental research.",
    sampleConclusion: "In conclusion, the dwindling interest in university science courses stems from the rigorous academic demands of these subjects and a shift toward high-paying sectors like commerce. I strongly believe this decline represents a highly detrimental development, because a society lacking skilled scientific professionals cannot adequately address future healthcare crises or technological challenges.",
    bp1Title: "Why science enrollment is decreasing (Reasons)",
    bp2Title: "Why this is a negative development (Consequences)",
    vocabList: [
      { word: "Disinclination", meaning: "A reluctance or lack of enthusiasm to do something.", example: "The growing disinclination among university applicants to select science fields is due to the demanding workloads." },
      { word: "Remuneration", meaning: "Money paid for work or a service (salary/compensation).", example: "Careers in finance often offer substantial financial remuneration compared to laboratory research positions." },
      { word: "Plummet", meaning: "To fall or drop straight down at high speed.", example: "Enrollment numbers in advanced physics and chemistry courses have plummeted over the last decade." },
      { word: "Myopic", meaning: "Short-sighted; lacking foresight or intellectual insight.", example: "Avoiding scientific studies for short-term financial gains is a myopic strategy that harms long-term technological progress." },
      { word: "Exodus", meaning: "A mass departure of people (e.g. leaving sciences for business).", example: "The steady exodus of students from pure sciences into business majors has created a deficit in research labs." },
      { word: "Conundrum", meaning: "A confusing and difficult problem or question.", example: "Addressing the shortage of researchers without increasing university funding presents a major policy conundrum." }
    ],
    vocabHunt: ["Disinclination", "Remuneration", "Plummet", "Myopic", "Exodus", "Conundrum"],
    causes: [
      { title: "Rigorous and Demanding Academic Pathways", desc: "Science subjects like physics, chemistry, and advanced mathematics require long hours of laboratory work and complex formulas.", ex: "STEM courses typically have significantly higher dropout rates compared to humanities." },
      { title: "Perceived Mismatch in Financial Compensation", desc: "Many students perceive that careers in corporate finance, marketing, or management offer faster paths to high salaries.", ex: "A fresh business graduate often secures a higher starting salary than a research chemist." },
      { title: "Inadequate Engagement in Early Education", desc: "In many schools, science is taught through dry memorization rather than practical, engaging laboratory experiences.", ex: "Schools lacking functioning labs struggle to inspire students to pursue tertiary science." },
      { title: "Lack of Visible Career Progression", desc: "Unlike medicine or law, research positions in pure sciences are often dependent on unstable government grants.", ex: "Postdoctoral research positions are frequently short-term, leading to job insecurity." }
    ],
    effects: [
      { title: "[Negative] Stifles Innovation in Vital Industries", desc: "A lack of science graduates slows down breakthroughs in critical areas such as pharmacology and energy.", ex: "Developing next-generation vaccines or solar panels requires a constant influx of trained chemists." },
      { title: "[Negative] Widens Technological Gaps Between Nations", desc: "Countries with a shortage of science graduates become dependent on importing foreign technology.", ex: "Developing nations often rely on hiring international firms for infrastructure projects due to lack of local talent." },
      { title: "[Negative] Impairs Policy and Crisis Management", desc: "Governments require scientific advisors to formulate policies on pandemics and environmental threats.", ex: "A shortage of experts leads to poorly informed governance during public health crises." },
      { title: "[Positive] Fosters Growth in Other Essential Sectors", desc: "A shift away from sciences allows more students to enter other crucial fields like psychology, law, and creative design.", ex: "The growth of digital media and user experience (UX) industries relies heavily on humanities graduates." },
      { title: "[Positive] Promotes Interdisciplinary Innovation", desc: "Modern industries value graduates who combine creative humanities thinking with technological application.", ex: "Leading technology firms are frequently co-founded by individuals who blend business, psychology, and basic engineering." },
      { title: "[Positive] Natural Market-Driven Correction", desc: "A shortage of scientists forces the market to adjust by offering higher salaries and better benefits to attract graduates.", ex: "Biotech firms have begun offering fully-funded research fellowships to attract students back to pure science." }
    ],
    keywords: ["science", "subjects", "university", "countries", "STEM", "enrollment", "careers", "lucrative", "innovation", "detrimental", "extinction", "education", "shortage", "research"]
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
