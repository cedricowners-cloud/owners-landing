// Google Sheets Web App URL - 배포 후 이 URL을 변경해주세요
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycby-t2nqN6UeVe4fEu2gYfoVyFzg-OjDjnmyTODBJJLW0pUbRIw5cn9pYPbkvZwCIrAu/exec';

// DOM Elements
const form = document.getElementById('applicationForm');
const submitBtn = form.querySelector('.submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const floatingCta = document.querySelector('.floating-cta');

// Phone number formatting
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');

    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    if (value.length > 7) {
        value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
    }

    e.target.value = value;
});

// Form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate
    const companyName = document.getElementById('companyName').value.trim();
    const ceoName = document.getElementById('ceoName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const privacy = document.getElementById('privacy').checked;

    if (!companyName || !ceoName || !phone || !privacy) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }

    // Phone validation
    const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
        alert('올바른 연락처 형식을 입력해주세요. (예: 010-1234-5678)');
        return;
    }

    // Show loading state
    setLoading(true);

    try {
        const formData = {
            companyName: companyName,
            ceoName: ceoName,
            phone: phone,
            timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
        };

        // Check if Google Sheets URL is configured
        if (GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            // Demo mode - just show success
            console.log('Demo mode - Form data:', formData);
            showSuccessModal();
            form.reset();
        } else {
            // Send to Google Sheets (using redirect method for CORS)
            const response = await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                body: JSON.stringify(formData),
                redirect: 'follow'
            });

            const result = await response.json();

            if (result.result === 'duplicate') {
                showModal('duplicateModal');
            } else if (result.result === 'success') {
                showModal('successModal');
                form.reset();
            } else {
                showModal('errorModal');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showModal('errorModal');
    } finally {
        setLoading(false);
    }
});

// Loading state
function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline';
    btnLoading.style.display = isLoading ? 'inline' : 'none';
}

// Modal functions
function showModal(modalId) {
    const targetModal = document.getElementById(modalId);
    targetModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const targetModal = document.getElementById(modalId);
    targetModal.classList.remove('show');
    document.body.style.overflow = '';
}

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modalEl => {
    modalEl.addEventListener('click', function(e) {
        if (e.target === modalEl) {
            closeModal(modalEl.id);
        }
    });
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modalEl => {
            closeModal(modalEl.id);
        });
    }
});

// Hide floating CTA when form section is in view
const formSection = document.getElementById('apply');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            floatingCta.classList.add('hidden');
        } else {
            floatingCta.classList.remove('hidden');
        }
    });
}, observerOptions);

observer.observe(formSection);

// Smooth scroll for floating CTA
floatingCta.addEventListener('click', function(e) {
    e.preventDefault();
    formSection.scrollIntoView({ behavior: 'smooth' });
});
