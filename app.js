// 2FA Authenticator - Simple & Functional
// Vercel Ready - Glassmorphism Theme

let currentSecret = '';

const generateCodeForm = document.getElementById('generateCodeForm');
const secretInput = document.getElementById('secret');
const pasteBtn = document.getElementById('pasteBtn');
const resultDiv = document.getElementById('result');

// Paste from clipboard
pasteBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        secretInput.value = text.trim().toUpperCase();
    } catch (err) {
        alert('Could not access clipboard');
    }
});

// Generate code
generateCodeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const secret = secretInput.value.trim().toUpperCase();
    resultDiv.innerHTML = '';
    
    // Validate Base32
    if (!/^[A-Z2-7]+=*$/.test(secret)) {
        resultDiv.innerHTML = '<div class="alert alert-danger">Invalid Base32 secret. Use only A-Z and 2-7.</div>';
        return;
    }
    
    if (secret.length < 8) {
        resultDiv.innerHTML = '<div class="alert alert-danger">Secret too short (min 8 characters).</div>';
        return;
    }
    
    try {
        const response = await fetch(`/api/generatecode?secret=${encodeURIComponent(secret)}`);
        const data = await response.json();
        
        if (response.ok && data.code) {
            currentSecret = secret;
            resultDiv.innerHTML = `
                <div class="code-display">
                    <div class="code-value">${data.code}</div>
                    <div class="code-actions">
                        <button id="copyBtn">Copy</button>
                    </div>
                    <div class="countdown">Next code in: <span id="timer">30</span>s</div>
                </div>
            `;
            
            document.getElementById('copyBtn').addEventListener('click', () => {
                navigator.clipboard.writeText(data.code);
            });
            
            startCountdown();
        } else {
            resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${data.error || 'Unknown error'}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
});

// Countdown timer
function startCountdown() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    
    let seconds = 30 - (Math.floor(Date.now() / 1000) % 30);
    timerElement.textContent = seconds;
    
    const interval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(interval);
            generateCodeForm.dispatchEvent(new Event('submit'));
        } else {
            timerElement.textContent = seconds;
        }
    }, 1000);
}
