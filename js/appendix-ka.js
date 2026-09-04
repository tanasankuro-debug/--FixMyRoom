/* ===============================
   ภาคผนวก ก - แบบประเมิน (ทีละข้อ)
   ส่งคำตอบเข้า Google Form โดยตรง
   =============================== */

// ---- ปลายทาง Google Form ----
const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSegSESQQTio4wEL1R5hwi4hsvNkxkRtUD606WuPFT7syeeYjA/formResponse";

// ---- ขั้นตอนทั้งหมดของแบบประเมิน ----
// entry = ชื่อฟิลด์ของ Google Form (ห้ามแก้ถ้าไม่ได้แก้ฟอร์ม)
const STEPS = [
  {
    type: "choice",
    section: "ตอนที่ 1  ข้อมูลทั่วไป",
    title: "สถานภาพของท่าน",
    entry: "entry.266497830",
    options: ["นักเรียนระดับชั้นมัธยมศึกษาปีที่ 6", "ครู", "บุคลากรอื่น ๆ"]
  },

  { type: "scale", section: "ด้านที่ 1: ด้านการใช้งาน", title: "1. ความสะดวกและง่ายในการแจ้งซ่อม", entry: "entry.191322587" },
  { type: "scale", section: "ด้านที่ 1: ด้านการใช้งาน", title: "2. ความง่ายในการติดตามสถานะการซ่อม", entry: "entry.310789826" },
  { type: "scale", section: "ด้านที่ 1: ด้านการใช้งาน", title: "3. ผังห้องเรียนช่วยให้เห็นภาพรวมของปัญหาได้ชัดเจน", entry: "entry.279067487" },
  { type: "scale", section: "ด้านที่ 1: ด้านการใช้งาน", title: "4. ความรวดเร็วในการแสดงผลของเว็บ", entry: "entry.1848523209" },

  { type: "scale", section: "ด้านที่ 2: ด้านการออกแบบ", title: "5. ความสวยงามของหน้าเว็บโดยรวม", entry: "entry.1798652220" },
  { type: "scale", section: "ด้านที่ 2: ด้านการออกแบบ", title: "6. การใช้สีบอกสถานะเข้าใจง่าย", entry: "entry.1616952463" },
  { type: "scale", section: "ด้านที่ 2: ด้านการออกแบบ", title: "7. การสลับโหมดมืดและโหมดสว่างใช้งานสะดวก", entry: "entry.261038919" },
  { type: "scale", section: "ด้านที่ 2: ด้านการออกแบบ", title: "8. การแสดงผลบนโทรศัพท์มือถือ", entry: "entry.1444342167" },

  { type: "scale", section: "ด้านที่ 3: ด้านประโยชน์ที่ได้รับ", title: "9. ระบบช่วยให้การแจ้งซ่อมรวดเร็ว เป็นระเบียบ และตรวจสอบย้อนหลังได้", entry: "entry.1271791403" },
  { type: "scale", section: "ด้านที่ 3: ด้านประโยชน์ที่ได้รับ", title: "10. การตรวจสอบยืนยันโดยครูหัวหน้าสายชั้นทำให้ข้อมูลการแจ้งน่าเชื่อถือ", entry: "entry.1252162713" },
  { type: "scale", section: "ด้านที่ 3: ด้านประโยชน์ที่ได้รับ", title: "11. ข้อมูลสถิติเป็นประโยชน์ต่อการวางแผนซ่อมบำรุงของโรงเรียน", entry: "entry.1360231425" },

  {
    type: "text",
    section: "ตอนที่ 3",
    title: "ข้อเสนอแนะเพิ่มเติม (ถ้ามี)",
    entry: "entry.1614842875"
  }
];

// ---- ระดับคะแนน ----
const SCALE = [
  { value: 5, label: "มากที่สุด" },
  { value: 4, label: "มาก" },
  { value: 3, label: "ปานกลาง" },
  { value: 2, label: "น้อย" },
  { value: 1, label: "น้อยที่สุด" }
];

const TOTAL_STEPS = STEPS.length;

// ---- สถานะ ----
let currentStep = 0;
let answers = new Array(TOTAL_STEPS).fill(null);

// ---- อ้างอิง element ----
const el = {
  intro:         document.getElementById("screenIntro"),
  quiz:          document.getElementById("screenQuiz"),
  done:          document.getElementById("screenDone"),
  progressLabel: document.getElementById("progressLabel"),
  progressPct:   document.getElementById("progressPercent"),
  progressBar:   document.getElementById("progressBar"),
  sectionTag:    document.getElementById("sectionTag"),
  questionText:  document.getElementById("questionText"),
  options:       document.getElementById("options"),
  suggestWrap:   document.getElementById("suggestWrap"),
  suggestInput:  document.getElementById("suggestInput"),
  btnStart:      document.getElementById("btnStart"),
  btnPrev:       document.getElementById("btnPrev"),
  btnNext:       document.getElementById("btnNext"),
  btnRestart:    document.getElementById("btnRestart"),
  scoreValue:    document.getElementById("scoreValue"),
  scoreLevel:    document.getElementById("scoreLevel"),
  summary:       document.getElementById("summary"),
  sendStatus:    document.getElementById("sendStatus"),
  sendNote:      document.getElementById("sendNote"),
  gformFrame:    document.getElementById("gformFrame")
};

// ---- สลับหน้าจอ ----
function showScreen(name) {
  el.intro.classList.toggle("is-hidden", name !== "intro");
  el.quiz.classList.toggle("is-hidden",  name !== "quiz");
  el.done.classList.toggle("is-hidden",  name !== "done");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- วาดคำถามตามขั้นตอนปัจจุบัน ----
function renderStep() {
  const step = STEPS[currentStep];

  // แถบความคืบหน้า
  const percent = Math.round((currentStep / TOTAL_STEPS) * 100);
  el.progressLabel.textContent = "ข้อ " + (currentStep + 1) + " จาก " + TOTAL_STEPS;
  el.progressPct.textContent = percent + "%";
  el.progressBar.style.width = percent + "%";

  el.sectionTag.textContent = step.section;
  el.questionText.textContent = step.title;
  el.btnPrev.disabled = currentStep === 0;

  // ---- ช่องข้อความยาว (ข้อเสนอแนะ) ----
  if (step.type === "text") {
    el.options.classList.add("is-hidden");
    el.suggestWrap.classList.remove("is-hidden");
    el.suggestInput.value = answers[currentStep] || "";
    el.btnNext.textContent = "ส่งคำตอบ";
    el.btnNext.disabled = false;
    el.suggestInput.focus();
    return;
  }

  // ---- ตัวเลือก ----
  el.suggestWrap.classList.add("is-hidden");
  el.options.classList.remove("is-hidden");
  el.btnNext.textContent = "ถัดไป";
  el.btnNext.disabled = answers[currentStep] === null;

  if (step.type === "scale") {
    el.options.innerHTML = SCALE.map(function (s) {
      const active = answers[currentStep] === String(s.value) ? " is-active" : "";
      return '<button type="button" class="option' + active + '" data-value="' + s.value + '">' +
               '<span class="option-num">' + s.value + '</span>' +
               '<span class="option-label">' + s.label + '</span>' +
             '</button>';
    }).join("");
  } else {
    el.options.innerHTML = step.options.map(function (opt) {
      const active = answers[currentStep] === opt ? " is-active" : "";
      return '<button type="button" class="option option-plain' + active + '" data-value="' + opt + '">' +
               '<span class="option-dot"></span>' +
               '<span class="option-label">' + opt + '</span>' +
             '</button>';
    }).join("");
  }
}

// ---- เลือกคำตอบ ----
function selectAnswer(value) {
  if (STEPS[currentStep].type === "text") return;

  answers[currentStep] = String(value);
  renderStep();

  // เลื่อนไปข้อถัดไปอัตโนมัติเล็กน้อย เพื่อให้เห็นว่าเลือกอะไร
  setTimeout(function () {
    if (answers[currentStep] !== null) goNext();
  }, 260);
}

// ---- ถัดไป / ส่งคำตอบ ----
function goNext() {
  const step = STEPS[currentStep];

  if (step.type === "text") {
    answers[currentStep] = el.suggestInput.value.trim();
    finish();
    return;
  }
  if (answers[currentStep] === null) return;

  currentStep++;
  renderStep();
}

// ---- ย้อนกลับ ----
function goPrev() {
  if (STEPS[currentStep].type === "text") {
    answers[currentStep] = el.suggestInput.value.trim();
  }
  if (currentStep === 0) return;

  currentStep--;
  renderStep();
}

// ---- แปลผลคะแนนเฉลี่ย ----
function levelOf(avg) {
  if (avg >= 4.51) return "มากที่สุด";
  if (avg >= 3.51) return "มาก";
  if (avg >= 2.51) return "ปานกลาง";
  if (avg >= 1.51) return "น้อย";
  return "น้อยที่สุด";
}

// ---- ส่งเข้า Google Form ผ่าน iframe ที่ซ่อนไว้ ----
function submitToGoogleForm(onDone) {
  const form = document.createElement("form");
  form.action = FORM_ACTION;
  form.method = "POST";
  form.target = "gformFrame";
  form.style.display = "none";

  STEPS.forEach(function (step, i) {
    const value = answers[i];
    if (value === null || value === "") return;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = step.entry;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);

  let finished = false;

  function settle(ok) {
    if (finished) return;
    finished = true;
    el.gformFrame.removeEventListener("load", onLoad);
    form.remove();
    onDone(ok);
  }

  function onLoad() { settle(true); }

  el.gformFrame.addEventListener("load", onLoad);
  setTimeout(function () { settle(false); }, 15000); // กันค้างถ้าอินเทอร์เน็ตช้ามาก

  form.submit();
}

// ---- หน้าสรุปผล ----
function finish() {
  // คิดคะแนนเฉลี่ยจากข้อ 1-11 เท่านั้น
  const scores = STEPS
    .map(function (s, i) { return s.type === "scale" ? Number(answers[i]) : null; })
    .filter(function (v) { return v !== null; });

  const avg = scores.reduce(function (a, b) { return a + b; }, 0) / scores.length;

  el.scoreValue.textContent = avg.toFixed(2);
  el.scoreLevel.textContent = "ระดับ " + levelOf(avg);

  // ตารางสรุปคำตอบ
  let html = STEPS.map(function (step, i) {
    if (step.type === "text") return "";
    return '<div class="summary-row">' +
             '<span class="summary-q">' + step.title + '</span>' +
             '<span class="summary-a">' + answers[i] + '</span>' +
           '</div>';
  }).join("");

  const note = answers[TOTAL_STEPS - 1];
  if (note) {
    html += '<div class="summary-note">' +
              '<span class="summary-note-title">ข้อเสนอแนะเพิ่มเติม</span>' +
              '<p>' + note.replace(/</g, "&lt;") + '</p>' +
            '</div>';
  }
  el.summary.innerHTML = html;

  // แสดงหน้าจบ พร้อมสถานะการส่ง
  el.sendStatus.className = "send-status is-sending";
  el.sendStatus.textContent = "กำลังส่งคำตอบเข้า Google Form...";
  el.sendNote.textContent = "";
  showScreen("done");

  submitToGoogleForm(function (ok) {
    if (ok) {
      el.sendStatus.className = "send-status is-ok";
      el.sendStatus.textContent = "ส่งคำตอบเข้า Google Form เรียบร้อยแล้ว";
      el.sendNote.textContent = "คำตอบถูกบันทึกลงสเปรดชีตผลการตอบกลับโดยอัตโนมัติ";
    } else {
      el.sendStatus.className = "send-status is-warn";
      el.sendStatus.textContent = "ส่งคำตอบแล้ว กำลังรอการยืนยันจาก Google";
      el.sendNote.textContent = "อินเทอร์เน็ตอาจช้ากว่าปกติ หากภายหลังไม่พบข้อมูลในสเปรดชีต กรุณาทำแบบประเมินอีกครั้ง";
    }
  });
}

// ---- เริ่มใหม่ ----
function restart() {
  currentStep = 0;
  answers = new Array(TOTAL_STEPS).fill(null);
  renderStep();
  showScreen("quiz");
}

// ---- ผูก event ----
el.btnStart.addEventListener("click", function () {
  renderStep();
  showScreen("quiz");
});

el.options.addEventListener("click", function (e) {
  const btn = e.target.closest(".option");
  if (btn) selectAnswer(btn.dataset.value);
});

el.btnNext.addEventListener("click", goNext);
el.btnPrev.addEventListener("click", goPrev);
el.btnRestart.addEventListener("click", restart);

// กดตัวเลขเพื่อตอบ, Enter เพื่อไปต่อ
document.addEventListener("keydown", function (e) {
  if (el.quiz.classList.contains("is-hidden")) return;
  if (e.target === el.suggestInput) return;

  const buttons = el.options.querySelectorAll(".option");
  const index = Number(e.key) - 1;

  if (index >= 0 && index < buttons.length) {
    selectAnswer(buttons[index].dataset.value);
  } else if (e.key === "Enter" && !el.btnNext.disabled) {
    goNext();
  }
});
