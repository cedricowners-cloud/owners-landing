// Google Sheets Web App URL - 새 시트 배포 후 이 URL을 변경해주세요
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwL0GINFr8TjpKoj6fG6g4ph5bKK1bZqTJaF16eAUW2NpYd6YKgRkYho7SsgOEII4CM/exec";

// DOM Elements
const form = document.getElementById("applicationForm");
const submitBtn = form.querySelector(".submit-btn");
const btnText = submitBtn.querySelector(".btn-text");
const btnLoading = submitBtn.querySelector(".btn-loading");
const floatingCta = document.querySelector(".floating-cta");

// Business number formatting (000-00-00000)
const bizInput = document.getElementById("bizNumber");
bizInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/[^0-9]/g, "");

  if (value.length > 10) {
    value = value.slice(0, 10);
  }

  if (value.length > 5) {
    value = value.replace(/(\d{3})(\d{2})(\d{0,5})/, "$1-$2-$3");
  } else if (value.length > 3) {
    value = value.replace(/(\d{3})(\d{0,2})/, "$1-$2");
  }

  e.target.value = value;
});

// Phone number formatting
const phoneInput = document.getElementById("phone");
phoneInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/[^0-9]/g, "");

  if (value.length > 11) {
    value = value.slice(0, 11);
  }

  if (value.length > 7) {
    value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
  } else if (value.length > 3) {
    value = value.replace(/(\d{3})(\d{0,4})/, "$1-$2");
  }

  e.target.value = value;
});

// Form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Validate
  const companyName = document.getElementById("companyName").value.trim();
  const bizNumber = document.getElementById("bizNumber").value.trim();
  const ceoName = document.getElementById("ceoName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const privacy = document.getElementById("privacy").checked;

  if (!companyName || !bizNumber || !ceoName || !phone || !privacy) {
    alert("모든 필수 항목을 입력해주세요.");
    return;
  }

  // Business number validation
  const bizRegex = /^\d{3}-\d{2}-\d{5}$/;
  if (!bizRegex.test(bizNumber)) {
    alert("올바른 사업자등록번호 형식을 입력해주세요. (예: 000-00-00000)");
    return;
  }

  // Phone validation
  const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
  if (!phoneRegex.test(phone)) {
    alert("올바른 연락처 형식을 입력해주세요. (예: 010-1234-5678)");
    return;
  }

  // Show loading state
  setLoading(true);

  try {
    const formData = {
      companyName: companyName,
      bizNumber: bizNumber,
      ceoName: ceoName,
      phone: phone,
      timestamp: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
    };

    // Check if Google Sheets URL is configured
    if (GOOGLE_SHEET_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      // Demo mode - just show success
      console.log("Demo mode - Form data:", formData);
      showModal("successModal");
      form.reset();
    } else {
      // Send to Google Sheets
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData),
      });

      // no-cors 모드에서는 응답을 읽을 수 없으므로 성공으로 처리
      showModal("successModal");
      form.reset();
    }
  } catch (error) {
    console.error("Error:", error);
    showModal("errorModal");
  } finally {
    setLoading(false);
  }
});

// Loading state
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnText.style.display = isLoading ? "none" : "inline";
  btnLoading.style.display = isLoading ? "inline" : "none";
}

// Modal functions
function showModal(modalId) {
  const targetModal = document.getElementById(modalId);
  targetModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  const targetModal = document.getElementById(modalId);
  targetModal.classList.remove("show");
  document.body.style.overflow = "";
}

// Close modal on outside click
document.querySelectorAll(".modal").forEach((modalEl) => {
  modalEl.addEventListener("click", function (e) {
    if (e.target === modalEl) {
      closeModal(modalEl.id);
    }
  });
});

// Close modal on ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.show").forEach((modalEl) => {
      closeModal(modalEl.id);
    });
  }
});

// Hide floating CTA when form section is in view
const formSection = document.getElementById("apply");
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      floatingCta.classList.add("hidden");
    } else {
      floatingCta.classList.remove("hidden");
    }
  });
}, observerOptions);

observer.observe(formSection);

// Smooth scroll for floating CTA
floatingCta.addEventListener("click", function (e) {
  e.preventDefault();
  formSection.scrollIntoView({ behavior: "smooth" });
});
