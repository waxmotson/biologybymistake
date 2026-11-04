const clickSound = new Audio('vine2.mp3');
clickSound.addEventListener('error', () => {
  // fallback if vine2.mp3 is not in this repo yet
  clickSound.src = 'https://raw.githubusercontent.com/waxmotson/biologybymistake/main/vine2.mp3';
});
let answered = false;

const correct = [
  "Natural selection favours you.",
  "Homeostasis maintained.",
  "ATP well spent.",
  "Your mitochondria are proud.",
  "Survival of the fittest.",
  "Enzyme-substrate fit: perfect.",
  "Peer review approved."
];

const incorrect = [
  "Selection pressure applied.",
  "Your hypothesis was rejected.",
  "Mutation detected. Try again.",
  "Cellular respiration failed.",
  "Extinction event. Round two?",
  "Putting the mistake in BIOLOGY BY MISTAKE",
  "Denatured. Try again."
];

let current = null;

function loadRandom() {
  answered = false;

  document.querySelectorAll('.buttons button').forEach(btn => {
    btn.disabled = false;
  });

  // Prefer questions not answered in the last 24 hours (see streak.js)
  current = (typeof pickQuestion === 'function')
    ? pickQuestion(answers)
    : answers[Math.floor(Math.random() * answers.length)];

  document.getElementById('title').textContent = current.question;
  document.getElementById('question-img').src = 'static/' + current.question;
  document.getElementById('result').textContent = '';
  document.getElementById('message').textContent = '';
  document.getElementById('reloader').hidden = true;
}

/** NESA sometimes accepts more than one answer (e.g. 2019 Q14). */
function acceptedAnswers(q) {
  return Array.isArray(q.answer) ? q.answer : [q.answer];
}

function correctText(accepted) {
  if (accepted.length >= 4) {
    return 'CORRECT ANSWER: ANY (NESA accepted all four)';
  }
  if (accepted.length > 1) {
    return 'CORRECT ANSWER: ' + accepted.join(' or ') + ' (both accepted)';
  }
  return 'CORRECT ANSWER: ' + accepted[0];
}

function check(choice) {
  if (answered) return;
  answered = true;

  document.querySelectorAll('.buttons button').forEach(btn => {
    btn.disabled = true;
  });

  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
  document.getElementById('reloader').hidden = false;

  const accepted = acceptedAnswers(current);
  const shown = accepted.join(' or ');

  if (accepted.includes(choice)) {
    recordAnswer(true, current.question);
    document.getElementById('result').textContent = correctText(accepted);
    document.getElementById('message').textContent =
      correct[Math.floor(Math.random() * correct.length)];
    document.getElementById('result').style.color = 'lawngreen';
  } else {
    recordAnswer(false, current.question);
    document.getElementById('result').textContent =
      'Incorrect, it was: ' + shown;
    document.getElementById('message').textContent =
      incorrect[Math.floor(Math.random() * incorrect.length)];
    document.getElementById('result').style.color = 'firebrick';
  }
}

loadRandom();
