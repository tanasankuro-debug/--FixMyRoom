/* ===============================
   ภาคผนวก - script.js
   หมายเหตุ: การ์ดทั้ง 6 หัวข้ออยู่ใน index.html โดยตรง
   (แก้ชื่อ/ลิงก์ได้ที่นั่น) ไฟล์นี้ดูแลเฉพาะเมนูมือถือ
   =============================== */

function setupNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    const isOpen = links.classList.toggle("show");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // ปิดเมนูเมื่อกดลิงก์
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("show");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", setupNavToggle);
