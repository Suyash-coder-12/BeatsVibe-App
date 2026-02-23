// ==========================================
// 1. DATABASE & MOCK DATA
// ==========================================
let beatsvibeDatabase = JSON.parse(localStorage.getItem('bv_mock_db')) || {
    "BV-1001": { 
        password: "pass", name: "Suyash Rathod", email: "suyash@beatsvibe.com", 
        phone: "+91 9876543210", education: "Founder", profilePic: "", 
        courses: ["Data Analytics Pro","MERN Stack Mastery"],
        activity: [80, 100, 60, 90, 100, 40, 100]
    }
};

const allCourses = [
    { id: "c1", title: "Data Analytics Pro", price: "₹249", numericPrice: 249, icon: "fa-chart-pie", desc: "SQL, PowerBI & Python." },
    { id: "c2", title: "MERN Stack Mastery", price: "₹499", numericPrice: 499, icon: "fa-code", desc: "Full-stack web dev." },
    { id: "c3", title: "AI & Neural Networks", price: "₹899", numericPrice: 899, icon: "fa-brain", desc: "Advanced AI models." },
    { id: "c4", title: "Cybersecurity Expert", price: "₹399", numericPrice: 399, icon: "fa-shield-alt", desc: "Ethical hacking." }
];

const faculties = [
    { name: "Suyash Rathod", role: "Founder & Lead Instructor", icon: "fa-crown", color: "blue" },
    { name: "Rahul Verma", role: "Data Scientist", icon: "fa-chart-pie", color: "green" },
    { name: "Ananya Sharma", role: "UI/UX Expert", icon: "fa-pen-nib", color: "purple" }
];

const courseData = {
    "Data Analytics Pro": { materialLink: "#", modules: [{ title: "1. Intro to Analytics", video: "https://www.youtube.com/embed/BC1bgvwB9HQ?rel=0" }] },
    "MERN Stack Mastery": { materialLink: "#", modules: [{ title: "1. Web Basics", video: "https://www.youtube.com/embed/tgbNymZ7vqY?rel=0" }] }
};

// ==========================================
// 2. UTILITIES
// ==========================================
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const isError = type === 'error';
    toast.className = `p-4 rounded-2xl shadow-xl flex items-center gap-3 transform -translate-y-10 opacity-0 transition-all duration-300 ${isError ? 'bg-red-500 text-white' : 'glass-panel dark:text-white'}`;
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} text-xl ${!isError && 'text-blue-500'}"></i><p class="font-bold text-sm">${message}</p>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('-translate-y-10', 'opacity-0'));
    setTimeout(() => { toast.classList.add('opacity-0', '-translate-y-5'); setTimeout(() => toast.remove(), 300); }, 3000);
}

function toggleModal(id, show) {
    const modal = document.getElementById(id);
    if(modal) { show ? (modal.classList.remove('hidden'), modal.classList.add('flex')) : (modal.classList.add('hidden'), modal.classList.remove('flex')); }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelectorAll('.fa-moon, .fa-sun').forEach(icon => icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon');
    if(typeof initAdminDashboard === 'function' && document.getElementById('mainAdminChart')) { initAdminDashboard(); }
}

// ==========================================
// 3. AUTHENTICATION LOGIC
// ==========================================
let currentAuthMode = 'signin';

function toggleLoginType(mode) {
    currentAuthMode = mode;
    const isSignIn = mode === 'signin';
    const signupField = document.getElementById('signupNameField');
    if(signupField) signupField.classList.toggle('hidden', isSignIn);
    
    if(document.getElementById('authSubmitBtn')) {
        document.getElementById('authSubmitBtn').innerHTML = isSignIn ? 'Continue <i class="fas fa-arrow-right ml-2"></i>' : 'Join Academy <i class="fas fa-user-plus ml-2"></i>';
    }
    if(document.getElementById('toggle-signin')) {
        document.getElementById('toggle-signin').className = isSignIn ? "flex-1 py-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm font-bold text-sm transition-all text-blue-600 dark:text-blue-400" : "flex-1 py-2 rounded-lg text-slate-500 font-bold text-sm transition-all";
        document.getElementById('toggle-signup').className = !isSignIn ? "flex-1 py-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm font-bold text-sm transition-all text-blue-600 dark:text-blue-400" : "flex-1 py-2 rounded-lg text-slate-500 font-bold text-sm transition-all";
    }
}

function switchAuthTab(tab) {
    const isStudent = tab === 'student';
    document.getElementById('auth-student').classList.toggle('hidden', !isStudent);
    document.getElementById('auth-student').classList.toggle('block', isStudent);
    document.getElementById('auth-admin').classList.toggle('hidden', isStudent);
    document.getElementById('auth-admin').classList.toggle('block', !isStudent);
    
    document.getElementById('tabBtn-student').className = isStudent ? "flex-1 font-bold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-2 transition-all" : "flex-1 font-bold text-slate-400 pb-2 transition-all";
    document.getElementById('tabBtn-admin').className = !isStudent ? "flex-1 font-bold text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400 pb-2 transition-all" : "flex-1 font-bold text-slate-400 pb-2 transition-all";
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
        const randomActivity = Array.from({length: 7}, () => Math.floor(Math.random() * 60) + 40); 
        db[newStudentId] = { password: pass, name: name, email: idOrEmail, phone: "", education: "School", college: "", profilePic: "", courses: [], activity: randomActivity };
        localStorage.setItem('bv_mock_db', JSON.stringify(db));
        
        showToast(`Welcome! ID: ${newStudentId}`);
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

function handleAdminLogin(event) {
    event.preventDefault();
    const id = document.getElementById('adminId').value.trim();
    const pass = document.getElementById('adminPass').value.trim();
    if (id === "Suyash" && pass === "Admin@123") {
        localStorage.setItem('beatsvibe_admin_session', 'true');
        showToast("Access Granted. Initializing Terminal...");
        setTimeout(() => window.location.href = "admin.html", 1000);
    } else { showToast("Breach Attempt Logged.", "error"); }
}

function logout() { localStorage.removeItem('beatsvibe_session'); window.location.replace("index.html"); }
function adminLogout() { localStorage.removeItem('beatsvibe_admin_session'); window.location.replace("index.html"); }

// ==========================================
// 4. SHARED RENDER LOGIC (Courses Store)
// ==========================================
function renderCourseStore(containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    
    grid.innerHTML = allCourses.map(c => `
        <div class="glass-panel p-6 rounded-[32px] shadow-sm flex flex-col">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-blue-50 dark:bg-slate-800 text-blue-500 rounded-2xl flex items-center justify-center text-xl"><i class="fas ${c.icon}"></i></div>
                <span class="text-xl font-black dark:text-white">${c.price}</span>
            </div>
            <h3 class="font-bold mb-1 dark:text-white">${c.title}</h3>
            <p class="text-xs text-slate-500 mb-6 flex-1">${c.desc}</p>
            <button onclick="buyCourse('${c.id}')" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">Enroll Now</button>
        </div>`).join('');
}

async function buyCourse(courseId) {
    const sessionStr = localStorage.getItem('beatsvibe_session');
    
    // If not logged in, show modal (Works on Index page)
    if (!sessionStr || sessionStr === "null") { 
        showToast("Please log in to enroll!", "error"); 
        return toggleModal('authModal', true); 
    }
    
    const user = JSON.parse(sessionStr);
    const course = allCourses.find(c => c.id === courseId);
    let db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
    
    if (db[user.id] && db[user.id].courses.includes(course.title)) return showToast("Already enrolled in this course!", "error");

    showToast("Connecting to gateway...");
    try {
        const res = await fetch('https://beatsvibeapp.vercel.app//api/payment/create-order', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: course.numericPrice, courseName: course.title, studentId: user.id })
        });
        const data = await res.json();
        if (!data.success) return showToast("Server offline. Connect Node.js", "error");

        new window.Razorpay({
            key: "rzp_test_SJZoROrIWuwQfT", // <-- Razorpay Test Key
            amount: data.order.amount, currency: "INR", name: "BeatsVibe", description: course.title, order_id: data.order.id,
            handler: function (response) {
                showToast("Payment Successful!", "success");
                db[user.id].courses.push(course.title); localStorage.setItem('bv_mock_db', JSON.stringify(db));
                user.courses.push(course.title); localStorage.setItem('beatsvibe_session', JSON.stringify(user));
                
                // If on dashboard, reload data. If on index, go to dashboard.
                if(document.getElementById('myCoursesList')) {
                    loadDashboardData(); switchAppTab('home');
                } else {
                    window.location.href = "dashboard.html";
                }
            },
            prefill: { name: user.name }, theme: { color: "#3b82f6" }
        }).open();
    } catch (error) { showToast("Backend is offline. Run 'node server.js'", "error"); }
}

// ==========================================
// 5. DASHBOARD & APP LOGIC
// ==========================================
function switchAppTab(tabId) {
    document.querySelectorAll('.app-section').forEach(el => { el.classList.add('hidden'); el.classList.remove('block'); });
    const targetTab = document.getElementById('tab-' + tabId);
    if(targetTab) { targetTab.classList.remove('hidden'); targetTab.classList.add('block'); }
    
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('nav-active'));
    const targetNav = document.getElementById('nav-' + tabId);
    if(targetNav) targetNav.classList.add('nav-active');
}

function loadDashboardData() {
    const session = JSON.parse(localStorage.getItem('beatsvibe_session'));
    if(!session) return;
    const db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
    const user = db[session.id];
    if(!user) return;

    // Header & Profile Setup
    const firstName = user.name.split(' ')[0];
    if(document.getElementById('dashName')) document.getElementById('dashName').innerText = firstName;
    if(document.getElementById('profileName')) document.getElementById('profileName').innerText = user.name;
    if(document.getElementById('profileId')) document.getElementById('profileId').innerText = session.id;
    
    if(user.profilePic) {
        ['headerAvatar', 'profileAvatar'].forEach(id => {
            const img = document.getElementById(id);
            if(img) { img.src = user.profilePic; img.classList.remove('hidden'); }
        });
        ['headerIcon', 'profileIcon'].forEach(id => {
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

    // Home Tab - My Courses
    const coursesList = document.getElementById('myCoursesList');
    if(coursesList) {
        if(user.courses.length === 0) {
            coursesList.innerHTML = `<div class="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center"><i class="fas fa-ghost text-3xl text-slate-300 mb-2"></i><p class="text-sm text-slate-500">No courses yet. Check Explore tab.</p></div>`;
        } else {
            coursesList.innerHTML = user.courses.map(c => `
                <div class="glass-panel p-5 rounded-3xl shadow-sm flex justify-between items-center cursor-pointer hover:scale-[1.02] transition-transform" onclick="window.location.href='lesson.html?course=${encodeURIComponent(c)}'">
                    <div class="flex items-center gap-4"><div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-2xl flex items-center justify-center"><i class="fas fa-play"></i></div><span class="font-bold text-sm dark:text-white">${c}</span></div>
                    <i class="fas fa-chevron-right text-slate-300"></i>
                </div>`).join('');
        }
    }

    // Explore Tab - Render the generic store and faculties
    renderCourseStore('appCourseGrid');
    
    const facList = document.getElementById('facultiesList');
    if(facList) {
        facList.innerHTML = faculties.map(f => `
            <div class="min-w-[140px] glass-panel p-4 rounded-3xl text-center snap-center">
                <div class="w-14 h-14 mx-auto bg-${f.color}-100 dark:bg-${f.color}-900/20 text-${f.color}-500 rounded-full flex items-center justify-center text-xl mb-3"><i class="fas ${f.icon}"></i></div>
                <h4 class="font-bold text-sm dark:text-white truncate">${f.name}</h4>
                <p class="text-[10px] text-slate-500">${f.role}</p>
            </div>`).join('');
    }

    // Study Tab
    const notesList = document.getElementById('myNotesList');
    const certsList = document.getElementById('myCertsList');
    if(notesList && certsList) {
        if(user.courses.length > 0) {
            notesList.innerHTML = user.courses.map(c => `<div class="glass-panel p-4 rounded-2xl flex justify-between items-center"><div class="flex items-center gap-3"><i class="fas fa-file-pdf text-red-500 text-2xl"></i><span class="font-bold text-sm dark:text-white">${c} Notes</span></div><button class="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-xs font-bold text-blue-500" onclick="showToast('Downloading secure PDF...')"><i class="fas fa-download"></i></button></div>`).join('');
            certsList.innerHTML = user.courses.map(c => `<div class="p-6 rounded-3xl bg-slate-900 text-white text-center shadow-lg relative overflow-hidden"><div class="absolute -right-4 -top-4 w-20 h-20 bg-yellow-500/20 rounded-full blur-xl"></div><i class="fas fa-award text-5xl text-yellow-400 mb-3 relative z-10"></i><h4 class="font-black text-sm mb-1 relative z-10">${c}</h4><p class="text-[10px] text-slate-400 mb-4 relative z-10">Certified Architect</p><button onclick="showToast('Generating HD Certificate...')" class="w-full bg-white/10 py-3 rounded-xl text-xs font-bold hover:bg-white hover:text-slate-900 transition relative z-10">View Certificate</button></div>`).join('');
        } else {
            notesList.innerHTML = `<p class="text-xs text-slate-400">Enroll to access notes.</p>`;
            certsList.innerHTML = `<p class="text-xs text-slate-400">Complete courses to unlock.</p>`;
        }
    }
}

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
    showToast("Profile Updated!"); loadDashboardData();
}

function handleProfileUpload(event) {
    const file = event.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const session = JSON.parse(localStorage.getItem('beatsvibe_session'));
        let db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
        db[session.id].profilePic = e.target.result;
        localStorage.setItem('bv_mock_db', JSON.stringify(db));
        showToast("Photo Updated!"); loadDashboardData();
    };
    reader.readAsDataURL(file);
}

// ==========================================
// 6. ADMIN DASHBOARD & GRAPHS
// ==========================================
let mainChartInstance = null;
let studentChartInstance = null;

function initAdminDashboard() {
    renderAdminDatabase();
    initPlatformRevenueGraph();
}

function renderAdminDatabase() {
    const studentListEl = document.getElementById('adminStudentList');
    if(!studentListEl) return;
    const db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
    const students = Object.keys(db);
    let totalSubs = 0;
    
    document.getElementById('statTotalStudents').innerText = students.length;
    studentListEl.innerHTML = students.map(id => {
        totalSubs += db[id].courses.length;
        const picHTML = db[id].profilePic ? `<img src="${db[id].profilePic}" class="w-full h-full object-cover">` : db[id].name.charAt(0);
        return `
        <div class="glass-panel p-4 rounded-2xl shadow-sm flex justify-between items-center group">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-50 dark:bg-slate-900 text-blue-500 rounded-full flex items-center justify-center font-bold overflow-hidden border border-blue-100 dark:border-slate-700">${picHTML}</div>
                <div><p class="font-bold text-sm dark:text-white">${db[id].name}</p><p class="text-[10px] text-slate-400 font-mono">${id}</p></div>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="openStudentGraph('${id}')" class="bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 hover:scale-105"><i class="fas fa-chart-line"></i> Stats</button>
                <button onclick="deleteUserNode('${id}')" class="text-slate-300 hover:text-red-500 transition p-2"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>`
    }).join('');
    
    document.getElementById('statActiveSubs').innerText = totalSubs;
    document.getElementById('statRevenue').innerText = `₹${(totalSubs * 499).toLocaleString()}`;
}

function openStudentGraph(studentId) {
    const db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
    const student = db[studentId];
    if(!student) return;

    document.getElementById('modalStudentName').innerText = student.name;
    document.getElementById('modalStudentId').innerText = studentId;
    document.getElementById('modalStudentAvatar').innerHTML = student.profilePic ? `<img src="${student.profilePic}" class="w-full h-full object-cover">` : student.name.charAt(0);

    toggleModal('studentGraphModal', true);

    const ctx = document.getElementById('studentAttendanceChart');
    if(!ctx) return;
    if(studentChartInstance) studentChartInstance.destroy();
    const activityData = student.activity || [50, 60, 70, 80, 90, 100, 100];
    
    Chart.defaults.color = localStorage.getItem('theme') === 'dark' ? '#94a3b8' : '#64748b';
    studentChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
            datasets: [{ label: 'Activity (%)', data: activityData, backgroundColor: '#06b6d4', borderRadius: 8 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { max: 100 }, x: { grid: { display: false } } } }
    });
}

function initPlatformRevenueGraph() {
    const ctx = document.getElementById('mainAdminChart');
    if(!ctx) return;
    if(mainChartInstance) mainChartInstance.destroy();
    Chart.defaults.color = localStorage.getItem('theme') === 'dark' ? '#94a3b8' : '#64748b';
    mainChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
            datasets: [{ label: 'Revenue (₹)', data: [2000, 4500, 3000, 8000, 6200, 9000, 12500], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function deleteUserNode(id) {
    if(confirm(`Terminate node ${id}?`)) {
        let db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
        delete db[id]; localStorage.setItem('bv_mock_db', JSON.stringify(db));
        showToast(`Node ${id} terminated.`, 'error'); initAdminDashboard();
    }
}

// ==========================================
// 7. NEURONOVA AI
// ==========================================
let nnExpanded = false; 
function toggleNeuroNova() {
    const widget = document.getElementById('neuroNovaWidget');
    const icon = document.getElementById('nn-toggle-icon');
    if(!widget) return;
    
    nnExpanded = !nnExpanded;
    if(nnExpanded) {
        widget.classList.remove('translate-y-[calc(100%-60px)]', 'translate-y-[150%]');
        if(icon) icon.className = 'fas fa-chevron-down text-cyan-500/50 hover:text-cyan-400 transition';
    } else {
        widget.classList.add(document.getElementById('statTotalStudents') ? 'translate-y-[calc(100%-60px)]' : 'translate-y-[150%]');
        if(icon) icon.className = 'fas fa-chevron-up text-cyan-500/50 hover:text-cyan-400 transition';
    }
}

function handleNeuroNova(event) {
    event.preventDefault();
    const inputEl = document.getElementById('nn-input');
    const cmd = inputEl.value.trim(); if(!cmd) return;
    const session = JSON.parse(localStorage.getItem('beatsvibe_session'));
    const isAdmin = document.getElementById('statTotalStudents');
    const userName = isAdmin ? 'Commander' : (session ? session.name.split(' ')[0] : 'User');
    
    printToConsole(userName, cmd, 'user'); inputEl.value = '';

    setTimeout(() => {
        let res = ""; const c = cmd.toLowerCase();
        if(c.includes('wake up')) res = "I'm awake and systems are online. How can I assist?";
        else if (c.includes('theme')) { toggleTheme(); res = "Visual parameters updated."; }
        else if (c.includes('status') && isAdmin) res = "All platform nodes operating at 100% efficiency.";
        else if (c.includes('graph') && isAdmin) res = "Click on 'Stats' next to any student to view their graph.";
        else res = "Processing... I am still learning. Try 'theme', 'status' or 'wake up'.";
        printToConsole('NeuroNova', res, 'ai');
    }, 600);
}

function printToConsole(sender, text, type) {
    const c = document.getElementById('nn-console'); if(!c) return;
    c.innerHTML += `<div class="flex flex-col gap-1 animate-fade-in-up"><span class="${type==='user'?'text-slate-500 text-right':'text-cyan-500'} text-[10px]">${sender}</span><p class="${type==='user'?'text-slate-300 bg-slate-800 ml-8 text-right rounded-tl-xl':'text-cyan-300 bg-cyan-500/10 mr-8 rounded-tr-xl'} p-3 rounded-bl-xl rounded-br-xl shadow-inner">${text}</p></div>`;
    c.scrollTop = c.scrollHeight;
}

// ==========================================
// 8. THE BOOT SEQUENCE (ROUTING CONTROLLER)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme
    if(localStorage.getItem('theme') === 'dark') { 
        document.documentElement.classList.add('dark'); 
        const ti = document.getElementById('themeIcon'); if(ti) ti.classList.replace('fa-moon', 'fa-sun'); 
    }

    // 2. Index Page Logic (Store & Smart Auth)
    if (document.getElementById('indexCourseGrid')) {
        renderCourseStore('indexCourseGrid');
        
        const navAuthBtn = document.getElementById('navAuthBtn');
        const session = localStorage.getItem('beatsvibe_session');
        if (navAuthBtn && session && session !== "undefined" && session !== "null") {
            const user = JSON.parse(session);
            navAuthBtn.innerHTML = `Dashboard (${user.name.split(' ')[0]}) <i class="fas fa-arrow-right ml-2"></i>`;
            navAuthBtn.onclick = () => window.location.href = "dashboard.html";
        }
    }

    // 3. Dashboard Page Logic
    if (document.getElementById('myCoursesList')) {
        loadDashboardData();
    }

    // 4. Admin Page Logic
    if (document.getElementById('statTotalStudents')) {
        initAdminDashboard();
    }
});
