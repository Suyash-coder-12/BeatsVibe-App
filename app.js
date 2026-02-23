// ==========================================
// 1. DATABASE & CONTENT
// ==========================================
// Added 'activity' array to mock student data for the new attendance graph
let beatsvibeDatabase = JSON.parse(localStorage.getItem('bv_mock_db')) || {
    "BV-1001": { 
        password: "pass", name: "Suyash Rathod", email: "suyash@beatsvibe.com", 
        phone: "+91 9876543210", education: "Founder", profilePic: "", 
        courses: ["Data Analytics Pro","MERN Stack Mastery"],
        activity: [80, 100, 60, 90, 100, 40, 100] // Last 7 days % active
    }
};

const allCourses = [
    { id: "c1", title: "Data Analytics Pro", price: "₹249", numericPrice: 249, icon: "fa-chart-pie", desc: "SQL, PowerBI & Python." },
    { id: "c2", title: "MERN Stack Mastery", price: "₹499", numericPrice: 499, icon: "fa-code", desc: "Full-stack web dev." },
    { id: "c3", title: "AI & Neural Networks", price: "₹899", numericPrice: 899, icon: "fa-brain", desc: "Advanced AI models." },
    { id: "c4", title: "Cybersecurity Expert", price: "₹399", numericPrice: 399, icon: "fa-shield-alt", desc: "Ethical hacking." }
];

const faculties = [
    { name: "Suyash Rathod", role: "Founder & Lead", icon: "fa-crown", color: "blue" },
    { name: "Rahul Verma", role: "Data Scientist", icon: "fa-chart-pie", color: "green" }
];

const courseData = {
    "Data Analytics Pro": { materialLink: "#", modules: [{ title: "1. Intro to Analytics", video: "https://www.youtube.com/embed/BC1bgvwB9HQ?rel=0" }] },
    "MERN Stack Mastery": { materialLink: "#", modules: [{ title: "1. Web Basics", video: "https://www.youtube.com/embed/tgbNymZ7vqY?rel=0" }] }
};

// ==========================================
// 2. CORE UTILITIES
// ==========================================
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const isError = type === 'error';
    toast.className = `p-4 rounded-2xl shadow-xl flex items-center gap-3 transform -translate-y-10 opacity-0 transition-all duration-300 ${isError ? 'bg-red-500 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'}`;
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} text-xl"></i><p class="font-bold text-sm">${message}</p>`;
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
    if(typeof initAdminDashboard === 'function' && document.getElementById('mainAdminChart')) initAdminDashboard(); // Refresh graphs if on admin
}

// ==========================================
// 3. AUTHENTICATION & LOGIN
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
        document.getElementById('toggle-signin').className = isSignIn ? "flex-1 py-3 rounded-xl bg-white dark:bg-slate-800 shadow-md font-bold text-sm transition-all text-blue-600 dark:text-blue-400" : "flex-1 py-3 rounded-xl text-slate-500 font-bold text-sm transition-all";
        document.getElementById('toggle-signup').className = !isSignIn ? "flex-1 py-3 rounded-xl bg-white dark:bg-slate-800 shadow-md font-bold text-sm transition-all text-blue-600 dark:text-blue-400" : "flex-1 py-3 rounded-xl text-slate-500 font-bold text-sm transition-all";
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
        // Add random mock activity for new user
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
// 4. ADMIN DASHBOARD & ADVANCED GRAPHS (NEW)
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
        <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center group">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-50 dark:bg-slate-900 text-blue-500 rounded-full flex items-center justify-center font-bold overflow-hidden border border-blue-100 dark:border-slate-700">${picHTML}</div>
                <div><p class="font-bold text-sm dark:text-white">${db[id].name}</p><p class="text-xs text-slate-400 font-mono">${id}</p></div>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="openStudentGraph('${id}')" class="text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"><i class="fas fa-chart-line"></i> Stats</button>
                <button onclick="deleteUserNode('${id}')" class="text-slate-300 hover:text-red-500 transition p-2"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>`
    }).join('');
    
    document.getElementById('statActiveSubs').innerText = totalSubs;
    document.getElementById('statRevenue').innerText = `₹${(totalSubs * 499).toLocaleString()}`;
}

// Function to Open Individual Student Attendance Graph
function openStudentGraph(studentId) {
    const db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
    const student = db[studentId];
    if(!student) return;

    document.getElementById('modalStudentName').innerText = student.name;
    document.getElementById('modalStudentId').innerText = studentId;
    document.getElementById('modalStudentAvatar').innerHTML = student.profilePic ? `<img src="${student.profilePic}" class="w-full h-full object-cover rounded-2xl">` : student.name.charAt(0);

    toggleModal('studentGraphModal', true);

    const ctx = document.getElementById('studentAttendanceChart');
    if(!ctx) return;
    if(studentChartInstance) studentChartInstance.destroy();

    // Default activity if old user doesn't have it
    const activityData = student.activity || [50, 60, 70, 80, 90, 100, 100];
    
    Chart.defaults.color = localStorage.getItem('theme') === 'dark' ? '#94a3b8' : '#64748b';
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

    studentChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
            datasets: [{
                label: 'Activity / Attendance (%)',
                data: activityData,
                backgroundColor: 'rgba(6, 182, 212, 0.8)', // Cyan Neon
                borderRadius: 8,
                barThickness: 12
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function initPlatformRevenueGraph() {
    const ctx = document.getElementById('mainAdminChart');
    if(!ctx) return;
    if(mainChartInstance) mainChartInstance.destroy();
    
    Chart.defaults.color = localStorage.getItem('theme') === 'dark' ? '#94a3b8' : '#64748b';
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

    mainChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
            datasets: [
                { label: 'Revenue (₹)', data: [2000, 4500, 3000, 8000, 6200, 9000, 12500], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 3, tension: 0.4, fill: true }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function deleteUserNode(id) {
    if(confirm(`WARNING: Terminate node ${id}? This cannot be undone.`)) {
        let db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
        delete db[id]; localStorage.setItem('bv_mock_db', JSON.stringify(db));
        showToast(`Node ${id} terminated.`, 'error'); initAdminDashboard();
    }
}

// ==========================================
// 5. NEURONOVA AI
// ==========================================
let nnExpanded = false; 
function toggleNeuroNova() {
    const widget = document.getElementById('neuroNovaWidget');
    const icon = document.getElementById('nn-toggle-icon');
    if(!widget) return;
    
    nnExpanded = !nnExpanded;
    if(nnExpanded) {
        widget.classList.remove('translate-y-[calc(100%-60px)]', 'translate-y-[150%]'); // Handles both Admin & Student UI
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
    
    printToConsole(userName, cmd, 'user'); 
    inputEl.value = '';

    setTimeout(() => {
        let res = "";
        const c = cmd.toLowerCase();
        if(c.includes('wake up')) res = "I'm awake and systems are online. How can I assist?";
        else if (c.includes('theme')) { toggleTheme(); res = "Visual parameters updated."; }
        else if (c.includes('status') && isAdmin) res = "All platform nodes operating at 100% efficiency.";
        else if (c.includes('graph') && isAdmin) res = "Click on 'Stats' next to any student to view their attendance graph.";
        else res = "Processing request... I am still learning. Try 'theme', 'status' or 'wake up'.";
        printToConsole('NeuroNova', res, 'ai');
    }, 600);
}

function printToConsole(sender, text, type) {
    const c = document.getElementById('nn-console');
    if(!c) return;
    c.innerHTML += `<div class="flex flex-col gap-1 animate-fade-in-up"><span class="${type==='user'?'text-slate-500 text-right':'text-cyan-500'} text-[10px]">${sender}</span><p class="${type==='user'?'text-slate-300 bg-slate-800 ml-8 text-right rounded-tl-xl':'text-cyan-300 bg-cyan-500/10 mr-8 rounded-tr-xl'} p-3 rounded-bl-xl rounded-br-xl shadow-inner">${text}</p></div>`;
    c.scrollTop = c.scrollHeight;
}


// ==========================================
// 6. STUDENT APP LOGIC (For dashboard.html & App Navigation)
// ==========================================
// ... (The rest of the app logic for dashboard navigation, profile saving, and payment stays exactly the same as previously built, I am keeping it intact so everything works)

function switchAppTab(tabId) {
    document.querySelectorAll('.app-section').forEach(el => { el.classList.add('hidden'); el.classList.remove('block'); });
    const targetTab = document.getElementById('tab-' + tabId);
    if(targetTab) { targetTab.classList.remove('hidden'); targetTab.classList.add('block'); }
    
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('nav-active'));
    const targetNav = document.getElementById('nav-' + tabId);
    if(targetNav) targetNav.classList.add('nav-active');
}

function loadAppData() {
    const session = JSON.parse(localStorage.getItem('beatsvibe_session'));
    if(!session) return;
    const db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
    const user = db[session.id];
    if(!user) return;

    if(document.getElementById('dashName')) document.getElementById('dashName').innerText = user.name.split(' ')[0];
    if(document.getElementById('profileName')) document.getElementById('profileName').innerText = user.name;
    if(document.getElementById('profileId')) document.getElementById('profileId').innerText = session.id;
    
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

    if(document.getElementById('set-name')) {
        document.getElementById('set-name').value = user.name;
        document.getElementById('set-phone').value = user.phone || "";
        document.getElementById('set-edu').value = user.education || "School";
        document.getElementById('set-college').value = user.college || "";
    }

    const coursesList = document.getElementById('myCoursesList');
    if(coursesList) {
        if(user.courses.length === 0) {
            coursesList.innerHTML = `<div class="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center"><i class="fas fa-ghost text-3xl text-slate-300 mb-2"></i><p class="text-sm text-slate-500">No courses yet. Check Explore tab.</p></div>`;
        } else {
            coursesList.innerHTML = user.courses.map(c => `
                <div class="glass-panel p-5 rounded-3xl shadow-sm flex justify-between items-center" onclick="window.location.href='lesson.html?course=${encodeURIComponent(c)}'">
                    <div class="flex items-center gap-4"><div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center"><i class="fas fa-play text-xs"></i></div><span class="font-bold text-sm dark:text-white">${c}</span></div>
                    <i class="fas fa-chevron-right text-slate-300"></i>
                </div>`).join('');
        }
    }

    const grid = document.getElementById('courseGrid');
    if(grid) {
        grid.innerHTML = allCourses.map(c => `
            <div class="glass-panel p-6 rounded-3xl shadow-sm">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-12 h-12 bg-blue-50 dark:bg-slate-800 text-blue-500 rounded-2xl flex items-center justify-center text-xl"><i class="fas ${c.icon}"></i></div>
                    <span class="text-xl font-extrabold dark:text-white">${c.price}</span>
                </div>
                <h3 class="font-bold mb-1 dark:text-white">${c.title}</h3>
                <p class="text-xs text-slate-500 mb-4">${c.desc}</p>
                <button onclick="buyCourse('${c.id}')" class="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition">Enroll Now</button>
            </div>`).join('');
    }

    const facList = document.getElementById('facultiesList');
    if(facList) {
        facList.innerHTML = faculties.map(f => `
            <div class="min-w-[140px] glass-panel p-4 rounded-3xl text-center snap-center">
                <div class="w-12 h-12 mx-auto bg-${f.color}-100 dark:bg-${f.color}-900/20 text-${f.color}-500 rounded-full flex items-center justify-center text-lg mb-3"><i class="fas ${f.icon}"></i></div>
                <h4 class="font-bold text-sm dark:text-white truncate">${f.name}</h4>
                <p class="text-[10px] text-slate-500">${f.role}</p>
            </div>`).join('');
    }
}

async function buyCourse(courseId) {
    const user = JSON.parse(localStorage.getItem('beatsvibe_session'));
    const course = allCourses.find(c => c.id === courseId);
    let db = JSON.parse(localStorage.getItem('bv_mock_db')) || {};
    if (db[user.id] && db[user.id].courses.includes(course.title)) return showToast("Already enrolled!", "error");

    showToast("Connecting to gateway...");
    try {
        const res = await fetch('https://beatsvibe.space/api/payment/create-order', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: course.numericPrice, courseName: course.title, studentId: user.id })
        });
        const data = await res.json();
        if (!data.success) return showToast("Server error.", "error");

        new window.Razorpay({
            key: "rzp_test_SJZoROrIWuwQfT", // IMPORTANT
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
// 7. BOOT SEQUENCE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Smart Session Logic for index.html
    const navAuthBtn = document.getElementById('navAuthBtn');
    const session = localStorage.getItem('beatsvibe_session');
    if (navAuthBtn && session && session !== "undefined" && session !== "null") {
        const user = JSON.parse(session);
        navAuthBtn.innerHTML = `App (${user.name.split(' ')[0]}) <i class="fas fa-arrow-right ml-2"></i>`;
        navAuthBtn.onclick = () => window.location.href = "dashboard.html";
    }

    if (document.getElementById('myCoursesList')) loadAppData();
});
