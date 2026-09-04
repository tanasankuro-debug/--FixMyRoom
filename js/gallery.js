/* ===============================
   แกลเลอรีภาพ + กล่องดูภาพขนาดเต็ม (ใช้ร่วมกันหลายหน้า)
   =============================== */

const items = Array.prototype.slice.call(document.querySelectorAll(".gal-img"));
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCaption = document.getElementById("lbCaption");

let current = 0;

// ---- เปิดภาพที่ตำแหน่ง i ----
function open(i) {
  current = (i + items.length) % items.length;

  const img = items[current];

  lbImg.src = img.getAttribute("src");
  lbImg.alt = img.getAttribute("alt") || "";
  lbCaption.textContent = (current + 1) + " / " + items.length + " · " + (img.dataset.caption || "");

  lb.hidden = false;
  document.body.classList.add("lb-open");
}

function close() {
  lb.hidden = true;
  lbImg.src = "";
  document.body.classList.remove("lb-open");
}

// ---- ผูก event ----
items.forEach(function (item, i) {
  item.addEventListener("click", function () { open(i); });
});

document.getElementById("lbClose").addEventListener("click", close);

document.getElementById("lbPrev").addEventListener("click", function (e) {
  e.stopPropagation();
  open(current - 1);
});

document.getElementById("lbNext").addEventListener("click", function (e) {
  e.stopPropagation();
  open(current + 1);
});

// คลิกพื้นที่ว่างเพื่อปิด
lb.addEventListener("click", function (e) {
  if (e.target === lb || e.target === lbImg || e.target === lbCaption) close();
});

// คีย์บอร์ด: Esc ปิด, ลูกศรเลื่อนภาพ
document.addEventListener("keydown", function (e) {
  if (lb.hidden) return;
  if (e.key === "Escape") close();
  else if (e.key === "ArrowLeft") open(current - 1);
  else if (e.key === "ArrowRight") open(current + 1);
});
