const questions = [
  {
    type: "اختيار من متعدد",
    title: "تعتمد استراتيجية جدول التعلم (KWL) بصورة أساسية على:",
    options: [
      "حفظ المعلومات وتكرارها دون مناقشة.",
      "ربط المعرفة السابقة بما يريد المتعلم معرفته وما تعلمه بالفعل.",
      "اعتماد المتعلم على شرح المعلم فقط.",
      "تقييم المتعلم في نهاية الدرس فقط."
    ],
    answer: 1,
    explanation:
      "تربط الاستراتيجية بين ما يعرفه المتعلم، وما يريد معرفته، وما تعلمه بالفعل."
  },

  {
    type: "اختيار من متعدد",
    title: "في استراتيجية KWL، يشير الرمز (W) إلى:",
    options: [
      "المعلومات التي يعرفها المتعلم مسبقًا.",
      "المعلومات التي تعلمها المتعلم بعد دراسة الموضوع.",
      "المعلومات التي يريد المتعلم معرفتها عن الموضوع.",
      "المعلومات التي يقدمها المعلم في نهاية الدرس."
    ],
    answer: 2,
    explanation:
      "يرمز W إلى Want to know، أي ما يريد المتعلم معرفته عن الموضوع."
  },

  {
    type: "صح أم خطأ",
    title:
      "تساعد استراتيجية KWL على تنشيط المعرفة السابقة لدى المتعلمين وربطها بالمعلومات الجديدة.",
    options: ["صح", "خطأ"],
    answer: 0,
    explanation:
      "صحيح؛ إذ تبدأ الاستراتيجية باستدعاء المعرفة السابقة ثم ربطها بالتعلم الجديد."
  },

  {
    type: "صح أم خطأ",
    title:
      "يقتصر دور المتعلم في استراتيجية KWL على الاستماع للمعلم وتلقي المعلومات دون المشاركة أو طرح الأسئلة.",
    options: ["صح", "خطأ"],
    answer: 1,
    explanation:
      "خطأ؛ فالمتعلم يشارك بطرح الأسئلة والمناقشة وتصنيف الأفكار وتسجيل ما تعلمه."
  },

  {
    type: "سؤال مقالي",
    title:
      "اشرح استراتيجية جدول التعلم (KWL) من حيث مفهومها، ومراحل تنفيذها، موضحًا دور كلٍّ من المعلم والمتعلم في تطبيقها.",
    essay: true,
    answerText:
      "تتكون الاستراتيجية من ثلاثة أعمدة: K لما يعرفه المتعلم، وW لما يريد معرفته، وL لما تعلمه. تبدأ بالإعلان عن الموضوع واستدعاء المعرفة السابقة، ثم تحديد الأسئلة، وقراءة الموضوع والبحث عن الإجابات، وتسجيل ما تم تعلمه، ثم تقويم التعلم وتأكيده. دور المعلم التخطيط والتوجيه وإدارة النقاش والتقويم، ودور المتعلم طرح الأسئلة والمناقشة وتسجيل المعلومات الجديدة وتقويم تعلمه."
  }
];

// عناصر الصفحة
const questionArea = document.getElementById("questionArea");
const counter = document.getElementById("questionCounter");
const scoreLabel = document.getElementById("liveScore");
const progressFill = document.getElementById("progressFill");
const nextBtn = document.getElementById("nextBtn");

const quizShell = document.getElementById("quizShell");
const resultCard = document.getElementById("resultCard");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const finalScore = document.getElementById("finalScore");

const reviewArea = document.getElementById("reviewArea");
const reviewBtn = document.getElementById("reviewBtn");
const restartBtn = document.getElementById("restartBtn");

// حالة الاختبار
let current = 0;
let score = 0;
let selected = null;
let checked = false;
let answers = [];

// تحويل الأرقام إلى أرقام عربية
function arabicDigits(number) {
  return String(number).replace(
    /\d/g,
    digit => "٠١٢٣٤٥٦٧٨٩"[digit]
  );
}

// عرض السؤال الحالي
function renderQuestion() {
  const q = questions[current];

  selected = null;
  checked = false;

  counter.textContent =`
    السؤال ${arabicDigits(current + 1)} من ${arabicDigits(questions.length)};`

  scoreLabel.textContent = arabicDigits(score);

  progressFill.style.width =`
    ${(current / questions.length) * 100}%`;

  nextBtn.disabled = true;

  nextBtn.innerHTML =
    current === questions.length - 1
      ? 'عرض النتيجة <span>←</span>'
      : 'تأكيد الإجابة <span>←</span>';

  // السؤال المقالي
  if (q.essay) {
    questionArea.innerHTML = `
      <span class="question-type">${q.type}</span>

      <h3 class="question-title">${q.title}</h3>

      <textarea
        id="essayAnswer"
        rows="5"
        placeholder="اكتبي إجابتك هنا... حاولي ترتيب أفكارك في نقاط واضحة."
        style="
          width:100%;
          resize:vertical;
          background:rgba(255,255,255,.035);
          color:var(--text);
          border:1px solid var(--line);
          border-radius:15px;
          padding:15px;
          font:inherit;
          font-size:13px;
          line-height:2;
          outline:none;
        "
      ></textarea>

      <p style="color:var(--muted);font-size:11px;margin:9px 0 0;">
        السؤال المقالي للمراجعة الذاتية. قارني إجابتك بالنموذج بعد إنهاء الاختبار.
      </p>
    ;`

    const essayInput = document.getElementById("essayAnswer");

    // استعادة الإجابة إذا رجع الطالب للسؤال
    essayInput.value = answers[current]?.response || "";

    if (essayInput.value.trim().length >= 5) {
      selected = essayInput.value.trim();
      nextBtn.disabled = false;
    }

    essayInput.addEventListener("input", event => {
      selected = event.target.value.trim();
      nextBtn.disabled = selected.length < 5;
    });

    return;
  }

  // عرض الاختيارات
  questionArea.innerHTML = `
    <span class="question-type">${q.type}</span>

    <h3 class="question-title">${q.title}</h3>

    <div class="options" id="optionsList">
      ${q.options.map((option, i) => `
        <button
          class="option"
          type="button"
          data-index="${i}"
        >
          <span class="option-letter">
            ${q.options.length === 2
              ? (i === 0 ? "✓" : "✕")
              : ["أ", "ب", "ج", "د"][i]}
          </span>

          <span class="option-text">${option}</span>

          <span class="option-mark"></span>
        </button>
      `).join("")}
    </div>

    <div id="feedback"></div>
  ;`
  // اختيار إجابة
  document.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", () => {
      if (checked) return;

      selected = Number(button.dataset.index);

      document.querySelectorAll(".option").forEach(item => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");
      nextBtn.disabled = false;
    });
  });
}

// تصحيح الإجابة
function checkAnswer() {
  const q = questions[current];

  checked = true;

  // التعامل مع السؤال المقالي
  if (q.essay) {
    answers[current] = {
      response: selected,
      correct: null
    };

    nextBtn.disabled = false;

    nextBtn.innerHTML =
      current === questions.length - 1
        ? 'عرض النتيجة <span>←</span>'
        : 'السؤال التالي <span>←</span>';

    const feedback = document.createElement("div");

    feedback.className = "feedback good";

    feedback.textContent =
      "تم حفظ إجابتك للمراجعة. قارنيها بنموذج الإجابة بعد إنهاء الاختبار.";

    questionArea.appendChild(feedback);

    return;
  }

  const isCorrect = selected === q.answer;

  answers[current] = {
    response: selected,
    correct: isCorrect
  };

  if (isCorrect) {
    score++;
  }

  scoreLabel.textContent = arabicDigits(score);

  // إظهار الإجابة الصحيحة والخاطئة
  document.querySelectorAll(".option").forEach((button, i) => {
    button.disabled = true;

    if (i === q.answer) {
      button.classList.add("correct");
      button.querySelector(".option-mark").textContent = "✓";
    } else if (i === selected) {
      button.classList.add("wrong");
      button.querySelector(".option-mark").textContent = "×";
    }
  });

  const feedback = document.getElementById("feedback");

  feedback.className =
    `feedback ${isCorrect ? "good" : "bad"}`;

  feedback.textContent =`
    ${isCorrect ? "إجابة صحيحة! ✨" : "مش مشكلة، راجعي المعلومة:"} ${q.explanation};`

  progressFill.style.width =`
    ${((current + 1) / questions.length) * 100}%`;

  nextBtn.innerHTML =
    current === questions.length - 1
      ? 'عرض النتيجة <span>←</span>'
      : 'السؤال التالي <span>←</span>';
}

// عرض النتيجة النهائية
function showResults() {
  quizShell.classList.add("hidden");
  resultCard.classList.remove("hidden");
  // السؤال المقالي لا يدخل في الدرجة الموضوعية
  finalScore.textContent =`
    ${arabicDigits(score)} / ${arabicDigits(4)};`
}
  const ratio = score / 4;

  if (ratio === 1) {
    resultTitle.textContent = "ممتازة! ✨";

    resultMessage.textContent =
      "إجاباتك كلها صحيحة. واضح إنك فاهمة أساسيات استراتيجية KWL كويس جدًا.";

  } else if (ratio >= 0.5) {
    resultTitle.textContent = "شغل جميل! 🌟";

    resultMessage.textContent =
      "أداء كويس، راجعي الأسئلة اللي احتجتِ فيها مساعدة وثبّتي المعلومات.";

  } else {
    resultTitle.textContent = "بداية موفقة 💜";

    resultMessage.textContent =
      "راجعي مراحل استراتيجية KWL وأدوار المعلم والمتعلم، وبعدها جربي الاختبار مرة تانية.";
  }

  // تجهيز مراجعة الإجابات
  reviewArea.innerHTML = questions.map((q, i) => {
    let responseText;
    if (q.essay) {
      responseText = `
        <strong>إجابتك:</strong><br>
        ${escapeHtml(answers[i]?.response || "لم تتم الإجابة")}

        <br><br>

        <strong>نموذج إجابة للمراجعة:</strong><br>
        ${q.answerText}
      ;`
    } else {
      responseText = `
        <strong>الإجابة الصحيحة:</strong>
       ${q.options && q.options[q.answer] ? q.options[q.answer] : "الإجابة النموذجية غير متوفرة"}

        <br>

        <strong>نتيجتك:</strong>
        ${answers[i]?.correct ? "صحيحة ✓" : "تحتاج مراجعة"}
      ;`
    }

    return ` 
      <div class="review-item">
        <h3>${arabicDigits(i + 1)}. ${q.title}</h3>
        <p>${responseText}</p>
      </div>
    ;`
  }).join("");

  resultCard.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });


// HTML حماية النص المكتوب من تفسيره ككود
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// زر تأكيد الإجابة والانتقال
nextBtn.addEventListener("click", () => {
  if (!checked) {
    if (selected === null || selected === "") return;

    checkAnswer();
    return;
  }

  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    showResults();
  }
});

// إعادة الاختبار من البداية
restartBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  selected = null;
  checked = false;
  answers = [];


  resultCard.classList.add("hidden");
  reviewArea.classList.add("hidden");

  reviewBtn.textContent = "مراجعة الإجابات";

  quizShell.classList.remove("hidden");

  renderQuestion();

  quizShell.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// إظهار أو إخفاء مراجعة الإجابات
reviewBtn.addEventListener("click", () => {
  reviewArea.classList.toggle("hidden");

  reviewBtn.textContent =
    reviewArea.classList.contains("hidden")
      ? "مراجعة الإجابات"
      : "إخفاء المراجعة";
});

// تشغيل الموقع وعرض أول سؤال
renderQuestion();
