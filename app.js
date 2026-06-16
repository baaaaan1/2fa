// 2FA Authenticator - Main Application

// Supabase Configuration (replace with your own credentials)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabase = null;
try {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.log('Supabase not configured - guest mode only');
}

let currentSecret = '';
let html5QrCode = null;
let isLightMode = localStorage.getItem('lightMode') === 'true';
let currentUser = null;
let isPrivateMode = false;

const modeToggle = document.getElementById('modeToggle');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userEmail = document.getElementById('userEmail');
const guestModeRadio = document.getElementById('guestMode');
const privateModeRadio = document.getElementById('privateMode');
const generateCodeForm = document.getElementById('generateCodeForm');
const secretInput = document.getElementById('secret');
const pasteBtn = document.getElementById('pasteBtn');
const qrScanBtn = document.getElementById('qrScanBtn');
const qrGenerateBtn = document.getElementById('qrGenerateBtn');
const qrScannerModal = document.getElementById('qrScannerModal');
const qrGeneratorModal = document.getElementById('qrGeneratorModal');
const closeScanner = document.getElementById('closeScanner');
const closeGenerator = document.getElementById('closeGenerator');
const resultDiv = document.getElementById('result');
const savedAccounts = document.getElementById('savedAccounts');
const accountsList = document.getElementById('accountsList');

function applyTheme() {
    document.body.classList.toggle('light-mode', isLightMode);
    modeToggle.innerHTML = isLightMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
applyTheme();

modeToggle.addEventListener('click', () => {
    isLightMode = !isLightMode;
    localStorage.setItem('lightMode', isLightMode);
    applyTheme();
});

async function checkAuth() {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        updateAuthUI();
        if (isPrivateMode) loadSavedAccounts();
    }
}

function updateAuthUI() {
    if (currentUser) {
        loginBtn.classList.add('d-none');
        userInfo.classList.remove('d-none');
        userEmail.textContent = currentUser.email;
    } else {
        loginBtn.classList.remove('d-none');
        userInfo.classList.add('d-none');
    }
}

loginBtn.addEventListener('click', async () => {
    if (!supabase) {
        Swal.fire({ icon: 'warning', title: 'Not Configured', text: 'Please configure Supabase credentials in app.js', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        return;
    }
    try {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) throw error;
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'Login Failed', text: error.message });
    }
});

logoutBtn.addEventListener('click', async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    currentUser = null;
    updateAuthUI();
    savedAccounts.classList.add('d-none');
    Swal.fire({ icon: 'success', title: 'Logged Out', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
});

guestModeRadio.addEventListener('change', () => { isPrivateMode = false; savedAccounts.classList.add('d-none'); qrGenerateBtn.classList.add('d-none'); });
privateModeRadio.addEventListener('change', () => {
    isPrivateMode = true;
    if (currentUser) { savedAccounts.classList.remove('d-none'); loadSavedAccounts(); qrGenerateBtn.classList.remove('d-none'); }
    else {
        Swal.fire({ icon: 'info', title: 'Login Required', text: 'Please login to use private account mode.', confirmButtonText: 'Login' })
            .then(() => { loginBtn.click(); guestModeRadio.checked = true; isPrivateMode = false; });
    }
});

async function startQRScanner() {
    qrScannerModal.classList.remove('d-none');
    try {
        html5QrCode = new Html5Qrcode('qrVideo');
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
            await html5QrCode.start(cameras[0].id, { fps: 10, qrbox: { width: 250, height: 250 } }, onScanSuccess, onScanFailure);
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Camera Error', text: 'Could not access camera.' });
    }
}

function onScanSuccess(decodedText) {
    const match = decodedText.match(/otpauth:\/\/totp\/[^?]+\?secret=([A-Z2-7]+)/i);
    if (match && match[1]) { stopQRScanner(); secretInput.value = match[1]; qrScannerModal.classList.add('d-none'); Swal.fire({ icon: 'success', title: 'QR Scanned!', toast: true, position: 'top-end', timer: 1500 }); }
    else {
        const base32Match = decodedText.match(/[A-Z2-7]{16,}/i);
        if (base32Match) { stopQRScanner(); secretInput.value = base32Match[0].toUpperCase(); qrScannerModal.classList.add('d-none'); Swal.fire({ icon: 'success', title: 'QR Scanned!', toast: true, position: 'top-end', timer: 1500 }); }
    }
}
function onScanFailure(error) {}
function stopQRScanner() { if (html5QrCode) { html5QrCode.stop().catch(console.error); html5QrCode = null; } }

qrScanBtn.addEventListener('click', startQRScanner);
closeScanner.addEventListener('click', () => { stopQRScanner(); qrScannerModal.classList.add('d-none'); });

qrGenerateBtn.addEventListener('click', async () => {
    const secret = secretInput.value.trim().toUpperCase();
    if (!secret) { Swal.fire({ icon: 'warning', title: 'No Secret', text: 'Please enter a secret key first.' }); return; }
    const otpauthUrl = `otpauth://totp/2FA-Authenticator:User-${Date.now()}?secret=${secret}&issuer=2FA-Authenticator`;
    qrGeneratorModal.classList.remove('d-none');
    const qrCodeDisplay = document.getElementById('qrCodeDisplay');
    qrCodeDisplay.innerHTML = '';
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, { width: 256, margin: 2, color: { dark: '#000000', light: '#ffffff' } });
        qrCodeDisplay.innerHTML = `<img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code-img">`;
        document.getElementById('secretDisplay').innerHTML = `<small class="text-muted">Secret: <code>${secret}</code></small>`;
    } catch (err) { Swal.fire({ icon: 'error', title: 'QR Generation Failed', text: err.message }); }
});
closeGenerator.addEventListener('click', () => { qrGeneratorModal.classList.add('d-none'); });

pasteBtn.addEventListener('click', async () => {
    try { const text = await navigator.clipboard.readText(); secretInput.value = text.trim().toUpperCase(); Swal.fire({ icon: 'success', title: 'Pasted!', toast: true, position: 'top-end', timer: 1000 }); }
    catch (err) { Swal.fire({ icon: 'error', title: 'Paste Failed', text: 'Could not access clipboard.' }); }
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => { Swal.fire({ icon: 'success', title: 'Copied!', toast: true, position: 'top-end', timer: 1000 }); }, (err) => { Swal.fire({ icon: 'error', title: 'Copy Failed', text: 'Could not copy to clipboard.' }); });
}

generateCodeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;
    const secret = secretInput.value.trim().toUpperCase();
    resultDiv.innerHTML = '';
    if (!/^[A-Z2-7]+=*$/.test(secret)) { resultDiv.innerHTML = '<div class="alert alert-danger p-3"><i class="fas fa-exclamation-triangle"></i> Invalid Base32 secret.</div>'; return; }
    if (secret.length < 8) { resultDiv.innerHTML = '<div class="alert alert-danger p-3"><i class="fas fa-exclamation-triangle"></i> Secret too short.</div>'; return; }
    try {
        const response = await fetch(`/api/generatecode?secret=${encodeURIComponent(secret)}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        const data = await response.json();
        if (response.ok && data.code) {
            currentSecret = secret;
            resultDiv.innerHTML = `<div class="code-display"><div class="code-value">${data.code}</div><div class="code-actions"><button class="btn btn-retro btn-action" id="copyResultBtn"><i class="fas fa-copy"></i> Copy</button><button class="btn btn-retro btn-action" id="pasteResultBtn"><i class="fas fa-paste"></i> Paste</button></div><div class="countdown"><span>Next code in: </span><span id="timer">30</span>s</div></div>`;
            document.getElementById('copyResultBtn').addEventListener('click', () => { copyToClipboard(data.code); });
            document.getElementById('pasteResultBtn').addEventListener('click', () => { copyToClipboard(data.code); });
            startCountdown();
            if (isPrivateMode && currentUser) saveAccount(secret, `Account-${Date.now()}`);
            Swal.fire({ icon: 'success', title: 'Code Generated!', toast: true, position: 'top-end', timer: 1500 });
        } else { resultDiv.innerHTML = `<div class="alert alert-danger p-3"><i class="fas fa-exclamation-triangle"></i> Error: ${data.error || 'Unknown error'}</div>`; }
    } catch (error) { resultDiv.innerHTML = `<div class="alert alert-danger p-3"><i class="fas fa-exclamation-triangle"></i> ${error.message}</div>`; }
});

function startCountdown() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    let seconds = 30 - (Math.floor(Date.now() / 1000) % 30);
    timerElement.textContent = seconds;
    const interval = setInterval(() => { seconds--; if (seconds <= 0) { clearInterval(interval); generateCodeForm.dispatchEvent(new Event('submit')); } else { timerElement.textContent = seconds; } }, 1000);
}

async function saveAccount(secret, name) {
    if (!supabase || !currentUser) return;
    try { const { error } = await supabase.from('accounts').insert([{ user_id: currentUser.id, name, secret, created_at: new Date().toISOString() }]); if (error) throw error; loadSavedAccounts(); } catch (err) { console.error('Save account error:', err); }
}

async function loadSavedAccounts() {
    if (!supabase || !currentUser) return;
    try {
        const { data, error } = await supabase.from('accounts').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
            accountsList.innerHTML = data.map(account => `<div class="account-item"><span class="account-name">${escapeHtml(account.name)}</span><button class="btn btn-sm btn-retro" onclick="loadAccount('${account.secret}', '${escapeHtml(account.name)}')"><i class="fas fa-play"></i></button><button class="btn btn-sm btn-danger" onclick="deleteAccount('${account.id}')"><i class="fas fa-trash"></i></button></div>`).join('');
            savedAccounts.classList.remove('d-none');
        }
    } catch (err) { console.error('Load accounts error:', err); }
}

function loadAccount(secret, name) { secretInput.value = secret; Swal.fire({ icon: 'info', title: 'Account Loaded', text: `Loaded: ${name}`, toast: true, position: 'top-end', timer: 1500 }); }

async function deleteAccount(id) {
    if (!supabase) return;
    const result = await Swal.fire({ icon: 'warning', title: 'Delete Account?', text: 'This action cannot be undone.', showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel' });
    if (result.isConfirmed) {
        try { await supabase.from('accounts').delete().eq('id', id); loadSavedAccounts(); Swal.fire({ icon: 'success', title: 'Deleted!', toast: true, position: 'top-end', timer: 1500 }); }
        catch (err) { Swal.fire({ icon: 'error', title: 'Delete Failed', text: err.message }); }
    }
}

window.loadAccount = loadAccount;
window.deleteAccount = deleteAccount;

function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (supabase) {
        supabase.auth.onAuthStateChange((event, session) => {
            if (session) { currentUser = session.user; updateAuthUI(); if (isPrivateMode) loadSavedAccounts(); }
            else { currentUser = null; updateAuthUI(); savedAccounts.classList.add('d-none'); }
        });
    }
});
