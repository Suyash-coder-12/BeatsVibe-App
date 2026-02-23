// ==========================================
// 1. DATABASE & CONTENT
// ==========================================
let beatsvibeDatabase = JSON.parse(localStorage.getItem('bv_mock_db')) || {};

const allCourses = [
    { id: "c1", title: "Data Analytics Pro", price: "₹249", numericPrice: 249, icon: "fa-chart-pie", desc: "SQL, PowerBI & Python." },
    { id: "c2", title: "MERN Stack Mastery", price: "₹499", numericPrice: 499, icon: "fa-code", desc: "Full-stack web dev." },
    { id: "c3", title: "AI & Neural Networks", price: "₹899", numericPrice: 899, icon: "fa-brain", desc: "Advanced AI models." },
    { id: "c4", title: "Cybersecurity Expert", price: "₹399", numericPrice: 399, icon: "fa-shield-alt", desc: "Ethical hacking." }
];

const faculties = [
    { name: "Suyash Rathod", role: "Founder & Lead", icon: "fa-crown", color: "blue" },
    { name: "Rahul Verma", role: "Data Scientist", icon: "fa-chart-pie", color: "green" },
    { name: "Ananya Sharma", role: "UI/UX Expert", icon: "fa-pen-nib", color: "purple" }
];

const courseData = {
    "Data Analytics Pro": { materialLink: "#", modules: [{ title: "1. Intro to Analytics", video: "https://www.youtube.com/embed/BC1bgvwB9HQ?rel=0" }] },
    "MERN Stack Mastery": { materialLink: "#", modules: [{ title: "1. Web Basics", video: "https://www.youtube.com/embed/tgbNymZ7vqY?rel=0" }] }
};

// ==========================================
// 2. CORE UTILITIES
// ==========================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const isError = type === 'error';
    toast.className = `p-4 rounded-2xl shadow-xl flex items-center gap-3 transform -translate-y-10 opacity-0 transition-all duration-300 ${isError ? 'bg-red-500 text-white' : 'glass-panel dark:text-white'}`;
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} text-xl ${!isError && 'text-blue-500'}"></i><p class="font-bold text-sm">${message}</p>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('-translate-y-10', 'opacity-0'));
    setTimeout(() => { toast.classList.add('opacity-0', '-translate-y-5'); setTimeout(() => toast.remove(), 300); }, 3000);
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelectorAll('.fa-moon, .fa-sun').forEach(icon => icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon');
}

// ==========================================
// 3. AUTHENTICATION (index.html logic)
// ==========================================
let currentAuthMode = 'signin';

function toggleLoginType(mode) {
    currentAuthMode = mode;
    const isSignIn = mode === 'signin';
    document.getElementById('signupNameField').classList.toggle('hidden', isSignIn);
    document.getElementById('authSubmitBtn').innerHTML = isSignIn ? 'Continue <i class="fas fa-arrow-right ml-2"></i>' : 'Join Academy <i class="fas fa-user-plus ml-2"></i>';
    document.getElementById('toggle-signin').className = isSignIn ? "flex-1 py-3 rounded-xl bg-white dark:bg-slate-800 shadow-md font-bold text-sm transition-all text-blue-600 dark:text-blue-400" : "flex-1 py-3 rounded-xl text-slate-500 font-bold text-sm transition-all";
    document.getElementById('toggle-signup').className = !isSignIn ? "flex-1 py-3 rounded-xl bg-white dark:bg-slate-800 shadow-md font-bold text-sm transition-all text-blue-600 dark:text-blue-400" : "flex-1 py-3 rounded-xl text-slate-500 font-bold text-sm transition-all";
}

function handleStudentAuth(event) {
    event.preventDefault();
    const idOrEmail = document.getElementById('authId').value.trim();
    const pass = document.getElementById('authPass').value.trim();
    let db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};

    if (currentAuthMode === 'signup') {
        const name = document.getElementById('authName').value.trim();
        if (!name) return showToast("Enter your name.", "error");
        const newStudentId = "BV-" + Math.floor(1000 + Math.random() * 9000);
        db[newStudentId] = { password: pass, name: name, email: idOrEmail, phone: "", education: "School", college: "", profilePic: "", courses: [] };
        localStorage.setItem('bv_mock_db', JSON.stringify(db));
        showToast("Account Created!");
        setTimeout(() => { localStorage.setItem('beatsvibe_session', JSON.stringify({ id: newStudentId, name, courses: [] })); window.location.href = "dashboard.html"; }, 1000);
    } else {
        const student = db[idOrEmail] || Object.values(db).find(user => user.email === idOrEmail);
        if (student && student.password === pass) {
            const studentId = Object.keys(db).find(key => db[key] === student);
            localStorage.setItem('beatsvibe_session', JSON.stringify({ id: studentId, name: student.name, courses: student.courses }));
            window.location.href = "dashboard.html";
        } else { showToast("Invalid Credentials.", "error"); }
    }
}

function logout() { localStorage.removeItem('beatsvibe_session'); window.location.href = "index.html"; }

// ==========================================
// 4. APP NAVIGATION & UI (dashboard.html logic)
// ==========================================
function switchAppTab(tabId) {
    document.querySelectorAll('.app-section').forEach(el => { el.classList.add('hidden'); el.classList.remove('block'); });
    document.getElementById('tab-' + tabId).classList.remove('hidden'); document.getElementById('tab-' + tabId).classList.add('block');
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('nav-active'));
    document.getElementById('nav-' + tabId).classList.add('nav-active');
}

function loadAppData() {
    const session = JSON.parse(localStorage.getItem('beatsvibe_session'));
    if(!session) return;
    const db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
    const user = db[session.id];
    if(!user) return;

    // Header & Profile Setup
    const firstName = user.name.split(' ')[0];
    document.getElementById('dashName').innerText = firstName;
    document.getElementById('profileName').innerText = user.name;
    document.getElementById('profileId').innerText = session.id;
    
    if(user.profilePic) {
        ['headerAvatar', 'sidebarAvatar', 'profileAvatar'].forEach(id => {
            const img = document.getElementById(id);
            if(img) { img.src = user.profilePic; img.classList.remove('hidden'); }
        });
        ['headerIcon', 'sidebarIcon', 'profileIcon'].forEach(id => {
            const icon = document.getElementById(id);
            if(icon) icon.classList.add('hidden');
        });
    }

    // Form Fills
    if(document.getElementById('set-name')) {
        document.getElementById('set-name').value = user.name;
        document.getElementById('set-phone').value = user.phone || "";
        document.getElementById('set-edu').value = user.education || "School";
        document.getElementById('set-college').value = user.college || "";
    }

    // Render Home Courses
    const coursesList = document.getElementById('myCoursesList');
    if(user.courses.length === 0) {
        coursesList.innerHTML = `<div class="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center"><i class="fas fa-ghost text-3xl text-slate-300 mb-2"></i><p class="text-sm text-slate-500">No courses yet. Check Explore tab.</p></div>`;
    } else {
        coursesList.innerHTML = user.courses.map(c => `
            <div class="glass-panel p-5 rounded-3xl shadow-sm flex justify-between items-center" onclick="window.location.href='lesson.html?course=${encodeURIComponent(c)}'">
                <div class="flex items-center gap-4"><div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center"><i class="fas fa-play text-xs"></i></div><span class="font-bold text-sm dark:text-white">${c}</span></div>
                <i class="fas fa-chevron-right text-slate-300"></i>
            </div>`).join('');
    }

    // Render Explore (Store & Faculties)
    document.getElementById('courseGrid').innerHTML = allCourses.map(c => `
        <div class="glass-panel p-6 rounded-3xl shadow-sm">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-blue-50 dark:bg-slate-800 text-blue-500 rounded-2xl flex items-center justify-center text-xl"><i class="fas ${c.icon}"></i></div>
                <span class="text-xl font-extrabold dark:text-white">${c.price}</span>
            </div>
            <h3 class="font-bold mb-1 dark:text-white">${c.title}</h3>
            <p class="text-xs text-slate-500 mb-4">${c.desc}</p>
            <button onclick="buyCourse('${c.id}')" class="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition">Enroll Now</button>
        </div>`).join('');

    document.getElementById('facultiesList').innerHTML = faculties.map(f => `
        <div class="min-w-[140px] glass-panel p-4 rounded-3xl text-center snap-center">
            <div class="w-12 h-12 mx-auto bg-${f.color}-100 dark:bg-${f.color}-900/20 text-${f.color}-500 rounded-full flex items-center justify-center text-lg mb-3"><i class="fas ${f.icon}"></i></div>
            <h4 class="font-bold text-sm dark:text-white truncate">${f.name}</h4>
            <p class="text-[10px] text-slate-500">${f.role}</p>
        </div>`).join('');

    // Render Study (Notes & Certs)
    if(user.courses.length > 0) {
        document.getElementById('myNotesList').innerHTML = user.courses.map(c => `<div class="glass-panel p-4 rounded-2xl flex justify-between items-center"><div class="flex items-center gap-3"><i class="fas fa-file-pdf text-red-500 text-xl"></i><span class="font-bold text-sm">${c} Notes</span></div><button class="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-xs font-bold" onclick="showToast('Downloading...')"><i class="fas fa-download"></i></button></div>`).join('');
        document.getElementById('myCertsList').innerHTML = user.courses.map(c => `<div class="p-6 rounded-3xl bg-slate-900 text-white text-center shadow-lg"><i class="fas fa-award text-4xl text-yellow-400 mb-3"></i><h4 class="font-bold text-sm mb-1">${c}</h4><p class="text-[10px] text-slate-400 mb-4">Certified Expert</p><button class="w-full bg-white/10 py-2 rounded-xl text-xs font-bold hover:bg-white hover:text-slate-900 transition">View</button></div>`).join('');
    } else {
        document.getElementById('myCertsList').innerHTML = `<p class="text-xs text-slate-400">Complete courses to unlock.</p>`;
    }
}

// Profile Save & Image Base64
function saveProfileSettings(event) {
    event.preventDefault();
    const session = JSON.parse(localStorage.getItem('beatsvibe_session'));
    let db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
    db[session.id].name = document.getElementById('set-name').value.trim();
    db[session.id].phone = document.getElementById('set-phone').value.trim();
    db[session.id].education = document.getElementById('set-edu').value;
    db[session.id].college = document.getElementById('set-college').value.trim();
    localStorage.setItem('bv_mock_db', JSON.stringify(db));
    session.name = db[session.id].name; localStorage.setItem('beatsvibe_session', JSON.stringify(session));
    showToast("Profile Updated!"); loadAppData();
}

function handleProfileUpload(event) {
    const file = event.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const session = JSON.parse(localStorage.getItem('beatsvibe_session'));
        let db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
        db[session.id].profilePic = e.target.result;
        localStorage.setItem('bv_mock_db', JSON.stringify(db));
        showToast("Photo Updated!"); loadAppData();
    };
    reader.readAsDataURL(file);
}

// ==========================================
// 5. AUTO-ENROLLMENT (Razorpay)
// ==========================================
async function buyCourse(courseId) {
    const user = JSON.parse(localStorage.getItem('beatsvibe_session'));
    const course = allCourses.find(c => c.id === courseId);
    let db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
    if (db[user.id] && db[user.id].courses.includes(course.title)) return showToast("Already enrolled!", "error");

    showToast("Connecting to gateway...");
    try {
        const res = await fetch('http://localhost:5000/api/payment/create-order', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: course.numericPrice, courseName: course.title, studentId: user.id })
        });
        const data = await res.json();
        if (!data.success) return showToast("Server error.", "error");

        new window.Razorpay({
            key: "TERI_RAZORPAY_TEST_KEY_ID_YAHA_DAAL",
            amount: data.order.amount, currency: "INR", name: "BeatsVibe", description: course.title, order_id: data.order.id,
            handler: function (response) {
                showToast("Payment Successful!", "success");
                db[user.id].courses.push(course.title); localStorage.setItem('bv_mock_db', JSON.stringify(db));
                user.courses.push(course.title); localStorage.setItem('beatsvibe_session', JSON.stringify(user));
                loadAppData(); switchAppTab('home');
            },
            prefill: { name: user.name }, theme: { color: "#3b82f6" }
        }).open();
    } catch (error) { showToast("Backend offline.", "error"); }
}

// ==========================================
// 6. NEURONOVA AI
// ==========================================
function toggleNeuroNova() {
    const w = document.getElementById('neuroNovaWidget');
    if(w.classList.contains('translate-y-[150%]')) {
        w.classList.remove('translate-y-[150%]', 'hidden');
    } else {
        w.classList.add('translate-y-[150%]');
        setTimeout(() => w.classList.add('hidden'), 500);
    }
}

function handleNeuroNova(event) {
    event.preventDefault();
    const inputEl = document.getElementById('nn-input');
    const cmd = inputEl.value.trim(); if(!cmd) return;
    const userName = JSON.parse(localStorage.getItem('beatsvibe_session')).name.split(' ')[0];
    printToConsole(userName, cmd, 'user'); inputEl.value = '';

    setTimeout(() => {
        let res = "";
        if(cmd.toLowerCase().includes('wake up baby')) res = "I'm awake. How can I help you today?";
        else if (cmd.toLowerCase().includes('theme')) { toggleTheme(); res = "Visuals updated."; }
        else res = "I am processing that request. Try asking about courses or settings.";
        printToConsole('NeuroNova', res, 'ai');
    }, 600);
}

function printToConsole(sender, text, type) {
    const c = document.getElementById('nn-console');
    c.innerHTML += `<div class="flex flex-col gap-1 animate-fade-in-up"><span class="${type==='user'?'text-slate-500 text-right':'text-cyan-500'} text-[10px]">${sender}</span><p class="${type==='user'?'text-slate-300 bg-slate-800 ml-8 text-right rounded-tl-xl':'text-cyan-300 bg-cyan-500/10 mr-8 rounded-tr-xl'} p-3 rounded-bl-xl rounded-br-xl shadow-inner">${text}</p></div>`;
    c.scrollTop = c.scrollHeight;
}

// ==========================================
// 7. BOOT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('myCoursesList')) loadAppData();
});
