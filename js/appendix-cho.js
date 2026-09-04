/* ===============================
   ภาคผนวก จ - คำนวณและแสดงผลการประเมิน
   ใช้ข้อมูลจาก js/data-cho.js
   =============================== */

// ---- รายการประเมิน 11 ข้อ แบ่งเป็น 3 ด้าน ----
const SECTIONS = [
  {
    name: "ด้านที่ 1: ด้านการใช้งาน",
    items: [
      { no: 1, text: "ความสะดวกและง่ายในการแจ้งซ่อม" },
      { no: 2, text: "ความง่ายในการติดตามสถานะการซ่อม" },
      { no: 3, text: "ผังห้องเรียนช่วยให้เห็นภาพรวมของปัญหาได้ชัดเจน" },
      { no: 4, text: "ความรวดเร็วในการแสดงผลของเว็บ" }
    ]
  },
  {
    name: "ด้านที่ 2: ด้านการออกแบบ",
    items: [
      { no: 5, text: "ความสวยงามของหน้าเว็บโดยรวม" },
      { no: 6, text: "การใช้สีบอกสถานะเข้าใจง่าย" },
      { no: 7, text: "การสลับโหมดมืดและโหมดสว่างใช้งานสะดวก" },
      { no: 8, text: "การแสดงผลบนโทรศัพท์มือถือ" }
    ]
  },
  {
    name: "ด้านที่ 3: ด้านประโยชน์ที่ได้รับ",
    items: [
      { no: 9, text: "ระบบช่วยให้การแจ้งซ่อมรวดเร็ว เป็นระเบียบ และตรวจสอบย้อนหลังได้" },
      { no: 10, text: "การตรวจสอบยืนยันโดยครูหัวหน้าสายชั้นทำให้ข้อมูลการแจ้งน่าเชื่อถือ" },
      { no: 11, text: "ข้อมูลสถิติเป็นประโยชน์ต่อการวางแผนซ่อมบำรุงของโรงเรียน" }
    ]
  }
];

const STATUS_LABEL = {
  S: "นักเรียนระดับชั้นมัธยมศึกษาปีที่ 6",
  T: "ครู",
  O: "บุคลากรอื่น ๆ"
};

const N = SURVEY_RESPONSES.length;

// ---- ฟังก์ชันสถิติ ----
function mean(values) {
  return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
}

function sd(values) {
  if (values.length < 2) return 0;
  const m = mean(values);
  const sum = values.reduce(function (a, b) { return a + Math.pow(b - m, 2); }, 0);
  return Math.sqrt(sum / (values.length - 1));
}

function levelOf(avg) {
  if (avg >= 4.51) return "มากที่สุด";
  if (avg >= 3.51) return "มาก";
  if (avg >= 2.51) return "ปานกลาง";
  if (avg >= 1.51) return "น้อย";
  return "น้อยที่สุด";
}

// คะแนนทั้งหมดของข้อที่ระบุ (no = 1..11)
function scoresOf(no) {
  return SURVEY_RESPONSES.map(function (row) { return row[no]; });
}

// ---- หัวรายงาน ----
function renderHead() {
  const all = [];
  for (let q = 1; q <= 11; q++) all.push.apply(all, scoresOf(q));
  const m = mean(all);

  document.getElementById("reportSub").textContent =
    "ผลการประเมินจาก " + SURVEY_META.formTitle +
    " จำนวนผู้ตอบทั้งสิ้น " + N + " คน (ข้อมูล ณ วันที่ " + SURVEY_META.collectedAt + ")";

  document.getElementById("statRow").innerHTML =
    '<div class="stat-card"><span class="stat-label">ผู้ตอบแบบประเมิน</span>' +
      '<span class="stat-value">' + N + '</span><span class="stat-unit">คน</span></div>' +
    '<div class="stat-card is-primary"><span class="stat-label">ค่าเฉลี่ยรวม</span>' +
      '<span class="stat-value">' + m.toFixed(2) + '</span><span class="stat-unit">จาก 5.00</span></div>' +
    '<div class="stat-card"><span class="stat-label">ระดับความพึงพอใจ</span>' +
      '<span class="stat-value stat-text">' + levelOf(m) + '</span><span class="stat-unit">S.D. = ' + sd(all).toFixed(2) + '</span></div>';
}

// ---- ตอนที่ 1 : สถานภาพผู้ตอบ ----
function renderStatusTable() {
  const count = { S: 0, T: 0, O: 0 };
  SURVEY_RESPONSES.forEach(function (row) { count[row[0]]++; });

  let rows = "";
  ["S", "T", "O"].forEach(function (key) {
    const pct = (count[key] / N) * 100;
    rows +=
      "<tr>" +
        "<td>" + STATUS_LABEL[key] + "</td>" +
        '<td class="num">' + count[key] + "</td>" +
        '<td class="num">' + pct.toFixed(2) + "</td>" +
      "</tr>";
  });

  document.getElementById("tableStatus").innerHTML =
    "<thead><tr><th>สถานภาพ</th><th class='num'>จำนวน (คน)</th><th class='num'>ร้อยละ</th></tr></thead>" +
    "<tbody>" + rows +
      "<tr class='row-total'><td>รวม</td><td class='num'>" + N + "</td><td class='num'>100.00</td></tr>" +
    "</tbody>";
}

// ---- แถวข้อมูล 1 ข้อ ----
function itemRow(item) {
  const v = scoresOf(item.no);
  const m = mean(v);
  return "<tr>" +
      '<td class="num">' + item.no + "</td>" +
      "<td>" + item.text + "</td>" +
      '<td class="num">' + m.toFixed(2) + "</td>" +
      '<td class="num">' + sd(v).toFixed(2) + "</td>" +
      "<td>" + levelOf(m) + "</td>" +
      '<td class="bar-cell"><span class="bar"><span class="bar-fill" style="width:' +
        ((m / 5) * 100).toFixed(1) + '%"></span></span></td>' +
    "</tr>";
}

// ---- ตอนที่ 2 : ผลรายข้อ ----
function renderItemsTable() {
  let html =
    "<thead><tr>" +
      "<th class='num'>ข้อ</th><th>รายการประเมิน</th>" +
      "<th class='num'>x̄</th><th class='num'>S.D.</th>" +
      "<th>ระดับ</th><th>สัดส่วน</th>" +
    "</tr></thead><tbody>";

  const all = [];

  SECTIONS.forEach(function (sec) {
    html += "<tr class='row-section'><td colspan='6'>" + sec.name + "</td></tr>";

    const secScores = [];
    sec.items.forEach(function (item) {
      html += itemRow(item);
      secScores.push.apply(secScores, scoresOf(item.no));
    });
    all.push.apply(all, secScores);

    const sm = mean(secScores);
    html += "<tr class='row-subtotal'>" +
        "<td></td><td>เฉลี่ยรวม " + sec.name + "</td>" +
        '<td class="num">' + sm.toFixed(2) + "</td>" +
        '<td class="num">' + sd(secScores).toFixed(2) + "</td>" +
        "<td>" + levelOf(sm) + "</td>" +
        '<td class="bar-cell"><span class="bar"><span class="bar-fill" style="width:' +
          ((sm / 5) * 100).toFixed(1) + '%"></span></span></td>' +
      "</tr>";
  });

  const m = mean(all);
  html += "<tr class='row-total'>" +
      "<td></td><td>ค่าเฉลี่ยรวมทุกด้าน</td>" +
      '<td class="num">' + m.toFixed(2) + "</td>" +
      '<td class="num">' + sd(all).toFixed(2) + "</td>" +
      "<td>" + levelOf(m) + "</td>" +
      '<td class="bar-cell"><span class="bar"><span class="bar-fill" style="width:' +
        ((m / 5) * 100).toFixed(1) + '%"></span></span></td>' +
    "</tr></tbody>";

  document.getElementById("tableItems").innerHTML = html;
}

// ---- ตอนที่ 3 : ข้อเสนอแนะ ----
function renderNotes() {
  const notes = SURVEY_RESPONSES
    .map(function (row) { return String(row[12]).trim(); })
    .filter(function (t) { return t !== ""; });

  const box = document.getElementById("notesBox");

  if (notes.length === 0) {
    box.innerHTML = '<p class="notes-empty">ไม่มีผู้ให้ข้อเสนอแนะเพิ่มเติม</p>';
    return;
  }

  // นับจำนวนข้อความที่ซ้ำกัน
  const tally = {};
  notes.forEach(function (t) { tally[t] = (tally[t] || 0) + 1; });

  const list = Object.keys(tally).map(function (t) {
    return '<li><span class="note-text">' + t.replace(/</g, "&lt;") +
           '</span><span class="note-count">' + tally[t] + " คน</span></li>";
  }).join("");

  box.innerHTML =
    '<p class="notes-empty">มีผู้ให้ข้อเสนอแนะ ' + notes.length + " คน จากทั้งหมด " + N +
    " คน (อีก " + (N - notes.length) + " คนเว้นว่างไว้)</p>" +
    '<ul class="notes-list">' + list + "</ul>";
}

// ---- เริ่มทำงาน ----
document.addEventListener("DOMContentLoaded", function () {
  renderHead();
  renderStatusTable();
  renderItemsTable();
  renderNotes();
});
