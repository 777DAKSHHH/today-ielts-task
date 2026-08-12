// --- Firebase Config ---
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

// Initialize Firebase Compat UMD SDK
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

// --- Login Logic ---
const loginSection = document.getElementById('login-section');
const reportSection = document.getElementById('report-section');
const loginBtn = document.getElementById('login-btn');
const passwordInput = document.getElementById('password-input');
const errorAlert = document.getElementById('error-alert');

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    if (passwordInput && passwordInput.value === '3753') {
      if (loginSection) loginSection.style.display = 'none';
      document.body.style.backgroundColor = 'var(--bg-color)'; // Reset body background
      if (reportSection) reportSection.style.display = 'block';
      if (errorAlert) errorAlert.style.display = 'none';
    } else {
      if (errorAlert) errorAlert.style.display = 'block';
    }
  });
}

// Allow Enter key to trigger login
if (passwordInput) {
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (loginBtn) loginBtn.click();
    }
  });
}

// --- Data Store ---
let allRecords = []; // To store all records for analysis
const QUESTIONS = [ // Mirroring quiz.html to get question text
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

// --- Table Element ---
const tableBody = document.getElementById("reportTableBody");

// --- KPI Elements ---
const totalSubmissionsEl = document.getElementById('totalSubmissions');
const averageScoreEl = document.getElementById('averageScore');
const mostCommonErrorEl = document.getElementById('mostCommonError');
const lastUpdatedEl = document.getElementById('lastUpdated');

// --- Real-time Listener ---
const resultsRef = db.ref("quizResults");
resultsRef.on("value", (snapshot) => {
  const data = snapshot.val() || {};
  allRecords = Object.values(data); // Store for analysis
  renderTable(allRecords);
  updateKpis(allRecords);
  if (lastUpdatedEl) lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}, (error) => {
  console.error("❌ Firebase read error:", error.message);
});

function renderTable(records) {
  if (!tableBody) return;
  tableBody.innerHTML = "";
  if (records.length > 0) {
    records.forEach(record => {
      const row = `
        <tr class="animate-fade-in student-row" data-student-key="${record.taskId}" style="cursor: pointer;">
          <td class="fw-bold text-start">${record.taskId}</td>
          <td class="fw-bold text-success">${record.correct}</td>
          <td class="fw-bold text-danger">${record.incorrect}</td>
          <td class="fw-bold text-warning">${record.missed}</td>
          <td>${record.incorrectQuestions || "-"}</td>
          <td>${record.missedQuestions || "-"}</td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } else {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-muted text-center p-4">No results found yet. Waiting for first submission...</td></tr>`;
  }

  // Add click listeners for the new rows
  document.querySelectorAll('.student-row').forEach(row => {
    row.addEventListener('click', () => {
      showStudentDetails(row.dataset.studentKey);
    });
  });
}

function updateKpis(records) {
  if (totalSubmissionsEl) totalSubmissionsEl.textContent = records.length;

  if (records.length === 0) {
    if (averageScoreEl) averageScoreEl.textContent = '0%';
    if (mostCommonErrorEl) mostCommonErrorEl.textContent = '-';
    return;
  }

  // Calculate Average Score
  const totalCorrect = records.reduce((sum, record) => sum + (parseFloat(record.correct) || 0), 0);
  const avgScore = (totalCorrect / records.length).toFixed(1);
  if (averageScoreEl) averageScoreEl.textContent = `${avgScore}%`;

  // Find Most Common Error
  const wrongCounts = {};
  records.forEach(record => {
    if (record.rawAnswers && record.rawAnswers.length === QUESTIONS.length) {
      record.rawAnswers.forEach((answer, index) => {
        if (answer !== null && answer !== QUESTIONS[index].correct) {
          const questionNumber = index + 1;
          wrongCounts[questionNumber] = (wrongCounts[questionNumber] || 0) + 1;
        }
      });
    }
  });

  if (Object.keys(wrongCounts).length > 0) {
    const mostCommon = Object.entries(wrongCounts).sort((a, b) => b[1] - a[1])[0];
    if (mostCommonErrorEl) mostCommonErrorEl.textContent = `Question ${mostCommon[0]}`;
  } else {
    if (mostCommonErrorEl) mostCommonErrorEl.textContent = 'None';
  }
}

// --- Sorting Logic ---
let sortColumn = 'timestamp';
let sortDirection = 'desc';

document.querySelectorAll('.sortable').forEach(header => {
  header.addEventListener('click', () => {
    const column = header.dataset.sort;
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
    
    const sortedRecords = [...allRecords].sort((a, b) => {
      let valA = a[column];
      let valB = b[column];
      if (column !== 'taskId') { // For percentages, parse them as numbers
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      }
      return (valA > valB ? 1 : -1) * (sortDirection === 'asc' ? 1 : -1);
    });
    renderTable(sortedRecords);
  });
});

// --- Action Button Logic ---
const findCommonErrorBtn = document.getElementById('findCommonErrorBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const questionAnalysisBtn = document.getElementById('questionAnalysisBtn');

// Bootstrap Modals check
const commonErrorModalEl = document.getElementById('commonErrorModal');
const answerDistributionModalEl = document.getElementById('answerDistributionModal');
const questionAnalysisModalEl = document.getElementById('questionAnalysisModal');
const studentDetailModalEl = document.getElementById('studentDetailModal');

let commonErrorModal = null;
let answerDistributionModal = null;
let questionAnalysisModal = null;
let studentDetailModal = null;

if (typeof bootstrap !== 'undefined') {
  if (commonErrorModalEl) commonErrorModal = new bootstrap.Modal(commonErrorModalEl);
  if (answerDistributionModalEl) answerDistributionModal = new bootstrap.Modal(answerDistributionModalEl);
  if (questionAnalysisModalEl) questionAnalysisModal = new bootstrap.Modal(questionAnalysisModalEl);
  if (studentDetailModalEl) studentDetailModal = new bootstrap.Modal(studentDetailModalEl);
}

const commonErrorBody = document.getElementById('commonErrorBody');

if (findCommonErrorBtn) {
  findCommonErrorBtn.addEventListener('click', () => {
    if (!commonErrorBody) return;
    if (allRecords.length === 0) {
      commonErrorBody.innerHTML = `<p class="text-muted">No student data available to analyze.</p>`;
      if (commonErrorModal) commonErrorModal.show();
      return;
    }

    const wrongCounts = {}; // e.g., { 3: 2, 5: 4 }

    allRecords.forEach(record => {
      if (record.rawAnswers && record.rawAnswers.length === QUESTIONS.length) {
        record.rawAnswers.forEach((answer, index) => {
          if (answer !== null && answer !== QUESTIONS[index].correct) {
            const questionNumber = index + 1;
            wrongCounts[questionNumber] = (wrongCounts[questionNumber] || 0) + 1;
          }
        });
      }
    });

    if (Object.keys(wrongCounts).length === 0) {
      commonErrorBody.innerHTML = `<div class="alert alert-success">Great job! No incorrect answers have been recorded across all students.</div>`;
    } else {
      // Find the most common error
      const mostCommon = Object.entries(wrongCounts).sort((a, b) => b[1] - a[1])[0];
      const qNum = mostCommon[0];
      const qCount = mostCommon[1];
      const qText = QUESTIONS[qNum - 1].q;

      commonErrorBody.innerHTML = `
        <p>The most frequently incorrect question is:</p>
        <div class="alert alert-danger">
          <h5 class="alert-heading">Question ${qNum}</h5>
          <p>${qText}</p>
          <hr>
          <p class="mb-0">It was answered incorrectly <strong>${qCount}</strong> time(s).</p>
        </div>
      `;
    }
    if (commonErrorModal) commonErrorModal.show();
  });
}

if (clearAllBtn) {
  clearAllBtn.addEventListener('click', async () => {
    const pass = prompt("To clear all data, please enter the admin passcode:");
    if (pass === '3753') {
      if (confirm("Are you sure you want to permanently delete ALL quiz results? This cannot be undone.")) {
        await resultsRef.remove();
        alert("All quiz results have been cleared.");
      }
    } else if (pass !== null) { // User entered something but it was wrong
      alert("Incorrect passcode. Action cancelled.");
    }
  });
}

if (questionAnalysisBtn) {
  questionAnalysisBtn.addEventListener('click', () => {
    const questionAnalysisBody = document.getElementById('questionAnalysisBody');
    if (!questionAnalysisBody) return;
    if (allRecords.length === 0) {
      questionAnalysisBody.innerHTML = `<p class="text-muted">No student data available to analyze.</p>`;
      if (questionAnalysisModal) questionAnalysisModal.show();
      return;
    }

    let analysisHtml = '<ul class="list-group">';
    QUESTIONS.forEach((q, index) => {
      let correctCount = 0;
      let attemptedCount = 0;
      allRecords.forEach(record => {
        if (record.rawAnswers && record.rawAnswers[index] !== null) {
          attemptedCount++;
          if (record.rawAnswers[index] === q.correct) {
            correctCount++;
          }
        }
      });

      const successRate = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
      let progressBarClass = 'bg-success';
      if (successRate < 75) progressBarClass = 'bg-warning';
      if (successRate < 50) progressBarClass = 'bg-danger';

      analysisHtml += `
        <li class="list-group-item list-group-item-action" style="cursor: pointer;" data-question-index="${index}" title="${q.hint ? 'Click to see answer distribution. Hint available.' : 'Click to see answer distribution.'}">
          <div class="fw-bold">Q${index + 1}: ${q.q.substring(0, 80)}...</div>
          ${q.hint ? `<div class="text-muted small mt-1"><i class="bi bi-lightbulb text-warning"></i> <strong>Hint:</strong> ${q.hint}</div>` : ''}
          <div class="d-flex align-items-center mt-2">
            <div class="progress" style="height: 20px; flex-grow: 1;">
              <div class="progress-bar ${progressBarClass}" role="progressbar" style="width: ${successRate.toFixed(1)}%;" aria-valuenow="${successRate.toFixed(1)}" aria-valuemin="0" aria-valuemax="100">
                ${successRate.toFixed(1)}%
              </div>
            </div>
            <small class="ms-3 text-muted" style="min-width: 120px;">(${correctCount}/${attemptedCount} correct)</small>
          </div>
        </li>`;
    });
    analysisHtml += '</ul>';
    questionAnalysisBody.innerHTML = analysisHtml;

    // Add click listeners for the new analysis items
    questionAnalysisBody.querySelectorAll('.list-group-item-action').forEach(item => {
      item.addEventListener('click', () => {
        showAnswerDistribution(item.dataset.questionIndex);
      });
    });
    if (questionAnalysisModal) questionAnalysisModal.show();
  });
}

function showStudentDetails(studentKey) {
  const record = allRecords.find(r => r.taskId === studentKey);
  if (!record) return;

  const modalTitle = document.getElementById('studentDetailModalLabel');
  const modalBody = document.getElementById('studentDetailBody');
  if (modalTitle) modalTitle.textContent = `Details for ${record.taskId}`;
  if (!modalBody) return;

  let detailsHtml = '<div class="list-group">';
  QUESTIONS.forEach((q, index) => {
    const studentAnswer = record.rawAnswers ? record.rawAnswers[index] : null;
    const correctAnswer = q.correct;
    let statusIcon = '';
    let itemClass = '';

    if (studentAnswer === null) {
      statusIcon = '<i class="bi bi-skip-circle-fill text-warning"></i>';
      itemClass = 'list-group-item-warning';
    } else if (studentAnswer === correctAnswer) {
      statusIcon = '<i class="bi bi-check-circle-fill text-success"></i>';
      itemClass = 'list-group-item-success';
    } else {
      statusIcon = '<i class="bi bi-x-circle-fill text-danger"></i>';
      itemClass = 'list-group-item-danger';
    }

    detailsHtml += `
      <div class="list-group-item ${itemClass}">
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">${q.q}</h6>
          ${statusIcon}
        </div>
        <p class="mb-1 small">Your answer: <strong>${studentAnswer || 'N/A'}</strong> | Correct answer: <strong>${correctAnswer}</strong></p>
      </div>`;
  });
  detailsHtml += '</div>';
  modalBody.innerHTML = detailsHtml;
  if (studentDetailModal) studentDetailModal.show();
}

function showAnswerDistribution(questionIndex) {
  const qIndex = parseInt(questionIndex);
  const question = QUESTIONS[qIndex];
  const totalStudents = allRecords.length;

  const answerCounts = {};
  question.options.forEach((opt, i) => {
    const letter = String.fromCharCode(65 + i);
    answerCounts[letter] = 0;
  });

  allRecords.forEach(record => {
    if (record.rawAnswers && record.rawAnswers[qIndex] !== null) {
      const studentAnswer = record.rawAnswers[qIndex];
      if (answerCounts.hasOwnProperty(studentAnswer)) {
        answerCounts[studentAnswer]++;
      }
    }
  });

  const modalTitle = document.getElementById('answerDistributionModalLabel');
  const modalBody = document.getElementById('answerDistributionBody');
  if (modalTitle) modalTitle.textContent = `Answer Distribution for Question ${qIndex + 1}`;
  if (!modalBody) return;

  let distributionHtml = `<h5 class="mb-4">${question.q}</h5>`;
  question.options.forEach((opt, i) => {
    const letter = String.fromCharCode(65 + i);
    const count = answerCounts[letter];
    const percentage = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
    const isCorrect = letter === question.correct;
    const barClass = isCorrect ? 'bg-success' : 'bg-secondary';

    distributionHtml += `
      <div class="mb-3">
        <div class="d-flex justify-content-between">
          <strong>${letter}. ${opt.replace(/^([A-D]\.\s*)/,'')}</strong>
          <span>${count} vote(s)</span>
        </div>
        <div class="progress" style="height: 25px;">
          <div class="progress-bar ${barClass}" role="progressbar" style="width: ${percentage.toFixed(1)}%;" aria-valuenow="${percentage.toFixed(1)}">${percentage.toFixed(1)}%</div>
        </div>
      </div>`;
  });
  modalBody.innerHTML = distributionHtml;
  if (answerDistributionModal) answerDistributionModal.show();
}

// --- Active Lesson Content Sync ---
let liveKeywordsT1 = ['frog', 'cycle', 'egg', 'embryo', 'tadpole', 'limb', 'breathing', 'lung', 'gills', 'metamorphosis', 'reproduce'];
let liveKeywordsT2 = ['infrastructure', 'development', 'modernization', 'construction', 'roads', 'transport', 'urban growth', 'old buildings', 'heritage', 'history', 'culture', 'preservation', 'restoration', 'identity', 'architecture', 'tourism', 'cost', 'maintenance', 'progress', 'community'];
let liveTask2Type = "Causes and Effects Essay";

db.ref('activeLesson').on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    if (data.task1 && Array.isArray(data.task1.keywords)) {
      liveKeywordsT1 = data.task1.keywords;
    }
    if (data.task2 && Array.isArray(data.task2.keywords)) {
      liveKeywordsT2 = data.task2.keywords;
    }
    if (data.task2 && data.task2.taskType) {
      liveTask2Type = data.task2.taskType;
    }
    if (data.quizQuestions && Array.isArray(data.quizQuestions) && data.quizQuestions.length === 10) {
      // Sync QUESTIONS array for graph distributions
      QUESTIONS.length = 0;
      data.quizQuestions.forEach(q => {
        const mappedQ = {
          q: q.q,
          correct: q.correct,
          options: q.type === 'scramble' 
            ? ["A", "B", "C", "D"]
            : (q.options || ["A", "B", "C", "D"])
        };
        QUESTIONS.push(mappedQ);
      });
    }
    // Rerender guess table
    db.ref("guesses").once("value", (snap) => {
      const g = snap.val() || {};
      renderGuessTable(Object.values(g));
    });
  }
});

// --- Active Listening Guesses Listener ---
const guessesRef = db.ref("guesses");
const guessTableBody = document.getElementById("guessTableBody");
const clearGuessesBtn = document.getElementById("clearGuessesBtn");

guessesRef.on("value", (snapshot) => {
  const data = snapshot.val() || {};
  renderGuessTable(Object.values(data));
});

if (clearGuessesBtn) {
  clearGuessesBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all student guess submissions?")) {
      guessesRef.remove()
      .then(() => alert("Student guesses cleared!"))
      .catch(err => alert("Error clearing guesses: " + err.message));
    }
  });
}

function renderGuessTable(guesses) {
  if (!guessTableBody) return;
  guessTableBody.innerHTML = "";

  if (guesses.length === 0) {
    guessTableBody.innerHTML = `<tr><td colspan="6" class="text-muted p-4">No student guess submissions yet.</td></tr>`;
    return;
  }

  guesses.forEach(item => {
    const accuracy = calculateGuessAccuracy(item.task, item.taskType, item.context);
    
    // Format timestamp nicely
    let timeStr = "-";
    if (item.timestamp) {
      const date = new Date(item.timestamp);
      timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const taskLabel = item.task === 'task1' ? 'Task 1' : 'Task 2';
    
    // Badge color for accuracy
    let badgeClass = 'bg-danger';
    if (accuracy >= 80) badgeClass = 'bg-success';
    else if (accuracy >= 50) badgeClass = 'bg-warning text-dark';

    const row = `
      <tr class="animate-fade-in">
        <td class="fw-bold text-start">${item.studentName}</td>
        <td><span class="badge bg-secondary">${taskLabel}</span></td>
        <td><span class="small fw-semibold text-secondary">${item.taskType}</span></td>
        <td><span class="badge ${badgeClass} fs-6">${accuracy}%</span></td>
        <td class="text-start text-wrap small" style="max-width: 320px;">${item.context}</td>
        <td class="small text-muted">${timeStr}</td>
      </tr>`;
    guessTableBody.insertAdjacentHTML("beforeend", row);
  });
}

function calculateGuessAccuracy(task, guessType, context) {
  let score = 0;
  
  // 1. Task Type Match (50%)
  if (task === 'task1') {
    // Expected Task 1 is Bar Chart
    if (guessType.toLowerCase().includes('bar') || guessType.toLowerCase().includes('chart') || guessType.toLowerCase().includes('comparison')) {
      score += 50;
    }
  } else {
    // Expected Task 2 is dynamically checked based on liveTask2Type
    const target = liveTask2Type.toLowerCase();
    const guess = guessType.toLowerCase();
    if (target.includes('agree') || target.includes('disagree')) {
      if (guess.includes('agree') || guess.includes('disagree') || guess.includes('opinion')) score += 50;
    } else if (target.includes('cause') || target.includes('effect')) {
      if (guess.includes('cause') || guess.includes('effect')) score += 50;
    } else if (target.includes('advantage') || target.includes('disadvantage')) {
      if (guess.includes('advantage') || guess.includes('disadvantage') || guess.includes('benefit')) score += 50;
    } else {
      // Fallback matching
      if (guess.split(' ').some(w => w.length > 3 && target.includes(w))) score += 50;
    }
  }

  // 2. Keyword Match (50% max - 10% per keyword)
  const text = (context || '').toLowerCase();
  const targetKeywords = (task === 'task1') ? liveKeywordsT1 : liveKeywordsT2;
  let matches = 0;
  
  targetKeywords.forEach(kw => {
    if (text.includes(kw)) {
      matches++;
    }
  });

  score += Math.min(50, matches * 10);
  return score;
}

