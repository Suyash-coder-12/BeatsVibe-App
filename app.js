// ==========================================
// 1. FIREBASE CONFIGURATION (CRASH-PROOF)
// ==========================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // Apna API Key yahan add karna mat bhulna
    authDomain: "beatsvibeedtech.firebaseapp.com",
    projectId: "beatsvibeedtech",
    storageBucket: "beatsvibeedtech.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let auth = null, firestoreDb = null, googleProvider = null;

try {
    if (typeof firebase !== 'undefined' && firebase.apps) {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        if (firebase.auth) {
            auth = firebase.auth();
            googleProvider = new firebase.auth.GoogleAuthProvider();
        }
        if (firebase.firestore) firestoreDb = firebase.firestore();
    }
} catch (error) {
    console.warn("[SYS] Firebase missing/invalid keys. Running Safe Local Mode.");
}

function safeGetLocal(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        localStorage.removeItem(key);
        return null;
    }
}

// ==========================================
// 2. COURSES CATALOG DATA
// ==========================================
const allCourses = [
    { id: "c1", title: "MERN Full-Stack Architecture", price: "₹4,999", numericPrice: 4999, icon: "fa-layer-group", desc: "Master MongoDB, Express, React, and Node.js with real-time enterprise projects." },
    { id: "c2", title: "AI & Machine Learning", price: "₹6,499", numericPrice: 6499, icon: "fa-robot", desc: "Python, TensorFlow, Neural Networks, and building Intelligence Models." },
    { id: "c3", title: "Cloud Computing & DevOps", price: "₹5,499", numericPrice: 5499, icon: "fa-server", desc: "AWS infrastructure, Docker containers, Kubernetes, and CI/CD pipelines." },
    { id: "c4", title: "Cybersecurity & Forensics", price: "₹4,499", numericPrice: 4499, icon: "fa-shield-alt", desc: "Network security, ethical hacking, cryptography, and server defense." },
    { id: "c5", title: "Advanced JavaScript & TS", price: "₹2,999", numericPrice: 2999, icon: "fab fa-js", desc: "Deep dive into JS engines, closures, and TypeScript static typing." },
    { id: "c6", title: "Mobile App Dev (Kotlin)", price: "₹3,999", numericPrice: 3999, icon: "fab fa-android", desc: "Native Android app development architecture using Jetpack Compose." }
];

// ==========================================
// 3. CORE UTILITIES
// ==========================================
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) { alert(message); return; }
    
    const toast = document.createElement('div');
    const isError = type === 'error';
    
    toast.className = `p-4 rounded-xl shadow-xl flex items-center gap-3 transform -translate-y-10 opacity-0 transition-all duration-300 ${isError ? 'bg-red-500 text-white' : 'bg-white border border-slate-200 text-slate-800 z-[9999]'}`;
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} text-xl ${!isError && 'text-blue-500'}"></i><p class="font-bold text-sm">${message}</p>`;
    
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('-translate-y-10', 'opacity-0'));
    setTimeout(() => { toast.classList.add('opacity-0', '-translate-y-5'); setTimeout(() => toast.remove(), 300); }, 3000);
}

function toggleModal(id, show) {
    const modal = document.getElementById(id);
    if(modal) { 
        if(show) { modal.classList.remove('hidden'); modal.classList.add('flex'); } 
        else { modal.classList.add('hidden'); modal.classList.remove('flex'); }
    }
}

// ==========================================
// 4. AUTHENTICATION & LOGIN LOGIC
// ==========================================
let currentAuthMode = 'signin';

function toggleLoginType(mode) {
    currentAuthMode = mode;
    const isSignIn = mode === 'signin';
    const signupField = document.getElementById('signupNameField');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const toggleSignInBtn = document.getElementById('toggle-signin');
    const toggleSignUpBtn = document.getElementById('toggle-signup');

    if(signupField) {
        if(isSignIn) {
            signupField.classList.add('hidden'); document.getElementById('authName').removeAttribute('required'); 
        } else {
            signupField.classList.remove('hidden'); document.getElementById('authName').setAttribute('required', 'true');
        }
    }
    if(authSubmitBtn) authSubmitBtn.innerHTML = isSignIn ? 'Login <i class="fas fa-arrow-right ml-2 text-xs"></i>' : 'Create Account <i class="fas fa-user-plus ml-2 text-xs"></i>';
    
    if(toggleSignInBtn && toggleSignUpBtn) {
        if(isSignIn) {
            toggleSignInBtn.className = "flex-1 py-1.5 rounded-md bg-white text-blue-600 shadow-sm font-semibold text-xs transition-all";
            toggleSignUpBtn.className = "flex-1 py-1.5 rounded-md text-slate-500 font-semibold text-xs transition-all hover:text-slate-700";
        } else {
            toggleSignInBtn.className = "flex-1 py-1.5 rounded-md text-slate-500 font-semibold text-xs transition-all hover:text-slate-700";
            toggleSignUpBtn.className = "flex-1 py-1.5 rounded-md bg-white text-blue-600 shadow-sm font-semibold text-xs transition-all";
        }
    }
}

function switchAuthTab(tab) {
    const isStudent = tab === 'student';
    document.getElementById('auth-student').classList.toggle('hidden', !isStudent);
    document.getElementById('auth-student').classList.toggle('block', isStudent);
    document.getElementById('auth-admin').classList.toggle('hidden', isStudent);
    document.getElementById('auth-admin').classList.toggle('block', !isStudent);
}

// GOOGLE AUTH
async function signInWithGoogle() {
    if(!auth || !googleProvider) return showToast("Firebase API keys missing. Offline mode active.", "error");
    try {
        showToast("Connecting to Google...", "success");
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        const docRef = firestoreDb.collection("students").doc(user.uid);
        const doc = await docRef.get();
        let userData;
        
        if (!doc.exists) {
            const newStudentId = "BV-" + Math.floor(1000 + Math.random() * 9000);
            userData = {
                uid: user.uid, studentId: newStudentId, name: user.displayName || "Google User",
                email: user.email, photo: user.photoURL || "", phone: user.phoneNumber || "",
                college: "", github: "", bio: "", courses: []
            };
            await docRef.set(userData);
        } else {
            userData = doc.data();
            if(user.photoURL && userData.photo !== user.photoURL) {
                await docRef.update({ photo: user.photoURL });
                userData.photo = user.photoURL;
            }
        }
        
        localStorage.setItem('beatsvibe_session', JSON.stringify({ 
            id: userData.studentId, uid: user.uid, name: userData.name, photo: userData.photo, courses: userData.courses || [] 
        }));
        showToast("Google Identity Verified!", "success");
        setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
    } catch (error) { showToast(`Google Login Failed: ${error.message}`, "error"); }
}

// EMAIL AUTH
async function handleStudentAuth(event) {
    event.preventDefault();
    const emailField = document.getElementById('authId') || document.getElementById('loginEmail') || document.getElementById('regEmail');
    const passField = document.getElementById('authPass') || document.getElementById('loginPass') || document.getElementById('regPass');
    const nameField = document.getElementById('authName') || document.getElementById('regName');
    if(!emailField || !passField) return;

    const email = emailField.value.trim();
    const pass = passField.value.trim();
    
    if(auth && firestoreDb) {
        if (currentAuthMode === 'signup' || window.location.href.includes('register')) {
            const name = nameField ? nameField.value.trim() : "Student";
            if (!name) return showToast("Enter your full name.", "error");
            showToast("Securing Node via Firebase...", "success");
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
                const user = userCredential.user;
                const newStudentId = "BV-" + Math.floor(1000 + Math.random() * 9000);
                const userData = { uid: user.uid, studentId: newStudentId, name: name, email: email, photo: "", phone: "", college: "", github: "", bio: "", courses: [] };
                await firestoreDb.collection("students").doc(user.uid).set(userData);
                localStorage.setItem('beatsvibe_session', JSON.stringify({ id: newStudentId, uid: user.uid, name: name, photo: "", courses: [] }));
                showToast(`Account Created! Redirecting...`);
                setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
            } catch (error) { showToast(error.message, "error"); }
        } else {
            showToast("Verifying Credentials...", "success");
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, pass);
                const user = userCredential.user;
                const doc = await firestoreDb.collection("students").doc(user.uid).get();
                if (doc.exists) {
                    const userData = doc.data();
                    localStorage.setItem('beatsvibe_session', JSON.stringify({ 
                        id: userData.studentId, uid: user.uid, name: userData.name, photo: userData.photo, courses: userData.courses || [] 
                    }));
                    showToast("Login Successful. Initializing Interface...", "success");
                    setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
                } else { showToast("User data not found in Database.", "error"); }
            } catch (error) { showToast("Invalid Credentials or Account not found.", "error"); }
        }
    } else {
        let db = safeGetLocal('bv_mock_db') || {};
        if (currentAuthMode === 'signup') {
            const name = nameField ? nameField.value.trim() : "Student";
            const newStudentId = "BV-" + Math.floor(1000 + Math.random() * 9000);
            db[newStudentId] = { password: pass, name: name, email: email, photo: "", phone: "", college: "", github: "", bio: "", courses: [] };
            localStorage.setItem('bv_mock_db', JSON.stringify(db));
            localStorage.setItem('beatsvibe_session', JSON.stringify({ id: newStudentId, name: name, photo: "", courses: [] }));
            showToast(`Offline Account Created! Redirecting...`);
            setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
        } else {
            const studentMatch = Object.values(db).find(u => u.email === email);
            if (studentMatch && studentMatch.password === pass) {
                const studentId = Object.keys(db).find(key => db[key] === studentMatch);
                localStorage.setItem('beatsvibe_session', JSON.stringify({ id: studentId, name: studentMatch.name, photo: studentMatch.photo, courses: studentMatch.courses }));
                showToast("Login Successful. Redirecting...", "success");
                setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
            } else { showToast("Invalid Credentials.", "error"); }
        }
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const idField = document.getElementById('adminId');
    const passField = document.getElementById('adminPass');
    if(!idField || !passField) return;
    if (idField.value.trim() === "Suyash" && passField.value.trim() === "Admin@123") {
        localStorage.setItem('beatsvibe_admin_session', 'true');
        showToast("Root Access Granted. Initializing Terminal...");
        setTimeout(() => window.location.href = "/admin", 1500);
    } else { showToast("Breach Attempt Logged.", "error"); }
}

function logout() { 
    if(auth) auth.signOut();
    localStorage.removeItem('beatsvibe_session'); 
    window.location.replace("/"); 
}

// ==========================================
// 5. SECURE LAB ANIMATION (ENTER LAB & REDIRECT)
// ==========================================
function enterLab(courseName) {
    const overlay = document.getElementById('lab-overlay');
    const logs = document.getElementById('lab-logs');
    const progress = document.getElementById('lab-progress');
    
    if(!overlay) { showToast("Opening Lab environment...", "success"); return; }
    
    overlay.style.display = 'flex';
    let width = 0;
    
    const logMessages = [
        "Connecting to secure AWS server...",
        "Authenticating student identity...",
        `Loading architecture blocks for ${courseName}...`,
        "Decrypting project files...",
        "Lab Node Ready. Transferring..."
    ];
    
    let logIndex = 0;
    const logInterval = setInterval(() => {
        if(logIndex < logMessages.length) { logs.innerText = logMessages[logIndex]; logIndex++; }
    }, 600);

    // Creates specific HTML URL for the course (e.g. MERN Full-Stack -> /mern-full-stack-architecture.html)
    const courseSlug = "/" + courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + ".html";

    const progInterval = setInterval(() => {
        if(width >= 100) {
            clearInterval(progInterval); clearInterval(logInterval);
            showToast("Welcome to the Lab Environment!", "success");
            overlay.style.display = 'none';
            // Redirecting user to the dynamically generated course URL
            window.location.href = courseSlug;
        } else {
            width += Math.floor(Math.random() * 15);
            if(width > 100) width = 100;
            progress.style.width = width + '%';
        }
    }, 400);
}

// ==========================================
// 6. DASHBOARD DATA & BASE64 PROFILE SYNC
// ==========================================
function switchAppTab(tabId) {
    document.querySelectorAll('.app-section').forEach(el => { el.classList.add('hidden'); el.classList.remove('block', 'animate-fade-in'); });
    const targetTab = document.getElementById('tab-' + tabId);
    if(targetTab) { targetTab.classList.remove('hidden'); targetTab.classList.add('block', 'animate-fade-in'); }
    if(tabId === 'explore') { renderCourseStore('dashExploreGrid'); }
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600/20', 'text-blue-400'); btn.classList.add('hover:bg-slate-800/50', 'text-slate-400');
    });
    const targetNav = document.getElementById('nav-' + tabId);
    if(targetNav) { targetNav.classList.remove('hover:bg-slate-800/50', 'text-slate-400'); targetNav.classList.add('bg-blue-600/20', 'text-blue-400'); }
}

async function loadDashboardData() {
    const session = safeGetLocal('beatsvibe_session');
    if(!session) { window.location.href = '/'; return; }
    
    let user = session;
    if(firestoreDb && session.uid) {
        try {
            const doc = await firestoreDb.collection("students").doc(session.uid).get();
            if(doc.exists) user = doc.data();
        } catch(e) { console.error("Firestore read error", e); }
    } else {
        let db = safeGetLocal('bv_mock_db') || {};
        if(db[session.id]) user = db[session.id];
    }

    const dashNameEl = document.getElementById('dashName');
    const avatarInitEl = document.getElementById('avatarInitial');
    const avatarImgEl = document.getElementById('avatarImg');
    const formAvatarPreview = document.getElementById('formAvatarPreview');
    const hiddenPhotoInput = document.getElementById('profilePhotoBase64');
    const photoFileInput = document.getElementById('profilePhotoFile');
    
    if(dashNameEl && user.name) dashNameEl.innerText = user.name.split(' ')[0];
    if(hiddenPhotoInput) hiddenPhotoInput.value = user.photo || "";
    
    if(user.photo && user.photo.trim() !== "") {
        if(avatarImgEl) { avatarImgEl.src = user.photo; avatarImgEl.classList.remove('hidden'); if(avatarInitEl) avatarInitEl.classList.add('hidden'); }
        if(formAvatarPreview) formAvatarPreview.src = user.photo;
    } else {
        if(avatarInitEl && user.name) { avatarInitEl.innerText = user.name.charAt(0); avatarInitEl.classList.remove('hidden'); }
        if(avatarImgEl) avatarImgEl.classList.add('hidden');
    }

    if(document.getElementById('profileName')) {
        document.getElementById('profileName').value = user.name || "";
        document.getElementById('profilePhone').value = user.phone || "";
        document.getElementById('profileCollege').value = user.college || "";
        document.getElementById('profileGithub').value = user.github || "";
        document.getElementById('profileBio').value = user.bio || "";
    }

    // Process Base64 File Upload
    if(photoFileInput) {
        photoFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64String = event.target.result;
                    if(hiddenPhotoInput) hiddenPhotoInput.value = base64String;
                    if(formAvatarPreview) formAvatarPreview.src = base64String;
                    showToast("Photo processed! Click Save to apply.", "success");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        const newForm = profileForm.cloneNode(true);
        profileForm.parentNode.replaceChild(newForm, profileForm);
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newName = document.getElementById('profileName').value.trim();
            const photo = document.getElementById('profilePhotoBase64').value; // Fetching Base64 image
            const phone = document.getElementById('profilePhone').value.trim();
            const college = document.getElementById('profileCollege').value.trim();
            const github = document.getElementById('profileGithub').value.trim();
            const bio = document.getElementById('profileBio').value.trim();
            
            if(firestoreDb && session.uid) {
                await firestoreDb.collection("students").doc(session.uid).update({
                    name: newName, photo: photo, phone: phone, college: college, github: github, bio: bio
                });
            } else {
                let db = safeGetLocal('bv_mock_db') || {};
                if(db[session.id]) {
                    db[session.id] = { ...db[session.id], name: newName, photo: photo, phone: phone, college: college, github: github, bio: bio };
                    localStorage.setItem('bv_mock_db', JSON.stringify(db));
                }
            }
            
            session.name = newName; session.photo = photo;
            localStorage.setItem('beatsvibe_session', JSON.stringify(session));
            
            if(dashNameEl) dashNameEl.innerText = newName.split(' ')[0];
            if(photo && photo.trim() !== "") {
                if(avatarImgEl) { avatarImgEl.src = photo; avatarImgEl.classList.remove('hidden'); if(avatarInitEl) avatarInitEl.classList.add('hidden'); }
                if(formAvatarPreview) formAvatarPreview.src = photo;
            } else {
                if(avatarInitEl) { avatarInitEl.innerText = newName.charAt(0); avatarInitEl.classList.remove('hidden'); }
                if(avatarImgEl) avatarImgEl.classList.add('hidden');
            }
            showToast("Configuration Saved!", "success");
        });
    }

    populateLists(user.courses || session.courses || []);
}

function populateLists(userCourses) {
    const coursesList = document.getElementById('myCoursesList');
    if(coursesList) {
        if(userCourses.length > 0) {
            coursesList.innerHTML = userCourses.map(c => `
                <div class="flex flex-col sm:flex-row items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white hover:border-blue-300 hover:shadow-md transition gap-4">
                    <div class="flex items-center gap-4 w-full">
                        <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl shrink-0"><i class="fas fa-server"></i></div>
                        <div>
                            <h4 class="font-bold text-slate-900 text-lg">${c}</h4>
                            <p class="text-xs text-slate-500 font-medium mt-1">Status: <span class="text-green-500 font-bold"><i class="fas fa-check-circle"></i> Node Active</span></p>
                        </div>
                    </div>
                    <button onclick="enterLab('${c}')" class="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 shadow-md whitespace-nowrap"><i class="fas fa-terminal mr-2"></i> Enter Lab</button>
                </div>
            `).join('');
        } else {
            coursesList.innerHTML = `<div class="text-center py-10 border border-dashed border-slate-300 rounded-2xl"><div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"><i class="fas fa-ghost"></i></div><p class="text-slate-500 font-medium">You have not enrolled in any programs yet.</p></div>`;
        }
    }

    const certsList = document.getElementById('myCertsList');
    if(certsList) {
        if(userCourses.length > 0) {
            certsList.innerHTML = userCourses.map(c => `
                <div class="border border-slate-200 p-8 rounded-2xl bg-white shadow-sm hover:border-blue-400 transition text-center relative overflow-hidden group">
                    <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl"></div>
                    <i class="fas fa-certificate text-5xl text-blue-600 mb-4 relative z-10"></i>
                    <h4 class="font-bold text-slate-900 mb-2 relative z-10 text-lg">${c}</h4>
                    <p class="text-xs text-slate-500 font-bold tracking-widest uppercase mb-6 relative z-10">ISO Certified Credentials</p>
                    <button onclick="generateProCertificate('${c}')" class="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition shadow-md relative z-10"><i class="fas fa-download mr-2"></i> Download High-Res PDF</button>
                </div>
            `).join('');
        } else {
            certsList.innerHTML = `<div class="col-span-1 md:col-span-2 text-center py-10 border border-dashed border-slate-300 rounded-2xl"><i class="fas fa-lock text-3xl text-slate-300 mb-3"></i><p class="text-slate-500 font-medium text-sm">Complete programs to unlock certificates.</p></div>`;
        }
    }
}

// ==========================================
// 7. COURSE RENDERING & PAYMENTS
// ==========================================
function renderCourseStore(containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    const isDashboard = containerId === 'dashExploreGrid';

    grid.innerHTML = allCourses.map(c => {
        const buttonHtml = isDashboard 
            ? `<button onclick="window.location.href='/course-details?course=${c.title.split(' ')[0].toLowerCase()}'" class="w-full bg-blue-600 text-white px-4 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg transition-all shadow-md mt-4 flex items-center justify-center gap-2 tracking-wide">View Full Details <i class="fas fa-arrow-right text-xs"></i></button>`
            : `<button class="bg-slate-100 text-blue-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2" onclick="window.location.href='/course-details?course=${c.title.split(' ')[0].toLowerCase()}'">View Details <i class="fas fa-arrow-right text-xs"></i></button>`;

        return `
        <div class="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col hover:border-blue-400 hover:shadow-[0_10px_30px_rgba(37,99,235,0.1)] transition-all">
            <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm"><i class="fas ${c.icon}"></i></div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">${c.title}</h3>
            <p class="text-slate-500 text-sm mb-6 flex-1 leading-relaxed">${c.desc}</p>
            <div class="border-t border-slate-100 pt-5 flex ${isDashboard ? 'flex-col items-start' : 'justify-between items-center'} w-full">
                <span class="font-black text-3xl text-slate-900">${c.price}</span>
                ${buttonHtml}
            </div>
        </div>`;
    }).join('');
}

async function processCoursePayment(courseName, amount) {
    const isTestMode = true; 
    const session = safeGetLocal('beatsvibe_session');
    if(!session) { showToast("Authentication Required.", "error"); setTimeout(()=> window.location.href = '/login', 1500); return; }

    const userCourses = session.courses || [];
    if (userCourses.includes(courseName)) return showToast("You are already enrolled!", "error");

    showToast("Establishing Secure Gateway Connection...");

    try {
        const res = await fetch('http://localhost:5000/api/payment/create-order', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amount, courseName: courseName, studentId: session.id })
        });
        
        const data = await res.json();
        if (!data.success) throw new Error("Server Offline");

        const options = {
            key: "rzp_test_TU6zzd7qlXCLZs", 
            amount: data.order.amount,
            currency: "INR", name: "BeatsVibe Technologies",
            description: `Enrollment: ${courseName}`,
            image: "logo1.png", order_id: data.order.id,
            handler: function (response) { handlePaymentSuccess(courseName, amount, session, isTestMode, response.razorpay_payment_id); },
            prefill: { name: session.name, email: session.email || "", contact: session.phone || "" },
            theme: { color: "#2563eb" }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (res){ showToast(`Payment Failed: ${res.error.description}`, "error"); });
        rzp.open();

    } catch (error) {
        showToast("Server Offline. Running Mock Mode...", "error");
        setTimeout(() => {
            const confirmMock = confirm(`[TEST] Simulate payment of ₹${amount} for ${courseName}?`);
            if(confirmMock) handlePaymentSuccess(courseName, amount, session, isTestMode, "pay_mock_" + Math.random().toString(36).substr(2, 9));
        }, 1000);
    }
}

async function handlePaymentSuccess(courseName, amount, session, isTestMode, paymentId) {
    if(firestoreDb && session.uid) {
        try { await firestoreDb.collection("students").doc(session.uid).update({ courses: firebase.firestore.FieldValue.arrayUnion(courseName) }); } 
        catch(e) { console.error("Firestore sync error", e); }
    } else {
        let db = safeGetLocal('bv_mock_db') || {};
        if(db[session.id]) {
            if(!db[session.id].courses) db[session.id].courses = [];
            db[session.id].courses.push(courseName);
            localStorage.setItem('bv_mock_db', JSON.stringify(db));
        }
    }

    session.courses.push(courseName);
    localStorage.setItem('beatsvibe_session', JSON.stringify(session));
    
    showToast("Payment Successful! Generating receipt...", "success");
    setTimeout(() => {
        window.location.href = "/dashboard";
        setTimeout(() => { switchAppTab('mycourses'); }, 500);
        generateProfessionalReceipt(courseName, amount, isTestMode, paymentId, session);
    }, 1500);
}

// ==========================================
// 8. PRO-LEVEL PDF GENERATORS (Receipt & Certificate)
// ==========================================
function generateProfessionalReceipt(courseName, amount, isTestMode, paymentId, userDetails) {
    if(!window.jspdf) { alert("jsPDF missing"); return; }
    const { jsPDF } = window.jspdf; const doc = new jsPDF('p', 'mm', 'a4'); 
    const dateStr = new Date().toLocaleDateString('en-IN');
    const invoiceNo = "BV-INV-" + Math.floor(Math.random() * 900000);

    doc.setTextColor(37, 99, 235); doc.setFontSize(28); doc.setFont("helvetica", "bold"); doc.text("BeatsVibe Technologies", 20, 30);
    doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal"); doc.text("ISO 9001:2015 Certified", 20, 38);
    doc.setFontSize(16); doc.setTextColor(37, 99, 235); doc.setFont("helvetica", "bold"); doc.text("OFFICIAL RECEIPT", 140, 30);
    doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal"); doc.text(`Txn ID: ${paymentId}`, 140, 43);
    doc.setDrawColor(226, 232, 240); doc.line(20, 50, 190, 50);
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("Billed To:", 20, 60);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.text(`Name: ${userDetails.name || "Student"}`, 20, 67);
    doc.setFillColor(37, 99, 235); doc.rect(20, 85, 170, 10, "F"); 
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.text("Program", 25, 92); doc.text("Amount", 160, 92);
    doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal"); doc.text(courseName, 25, 105); doc.text(`INR ${amount}`, 160, 105);
    doc.save(`Receipt_${invoiceNo}.pdf`);
}

// THE ULTIMATE QR CODE CERTIFICATE
async function generateProCertificate(courseName) {
    if(!window.jspdf) { alert("jsPDF missing"); return; }
    
    const session = safeGetLocal('beatsvibe_session'); 
    const studentName = session ? session.name : "Guest Student";
    const dateObj = new Date();
    const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const certId = "BV-CERT-" + Math.floor(Math.random() * 9000000);
    
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF('l', 'mm', 'a4'); 
    const width = doc.internal.pageSize.getWidth(); const height = doc.internal.pageSize.getHeight();
    
    showToast("Generating Encrypted High-Res Certificate...", "success");

    doc.setFillColor(252, 253, 255); doc.rect(0, 0, width, height, "F");
    doc.setDrawColor(15, 23, 42); doc.setLineWidth(4); doc.rect(12, 12, width - 24, height - 24); 
    doc.setDrawColor(218, 165, 32); doc.setLineWidth(1); doc.rect(16, 16, width - 32, height - 32);
    
    doc.setFontSize(38); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text("BEATSVIBE TECHNOLOGIES", width/2, 45, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal"); doc.text("ISO 9001:2015 CERTIFIED EDUCATIONAL INSTITUTION", width/2, 55, { align: "center", charSpace: 2 });
    doc.setFontSize(30); doc.setTextColor(218, 165, 32); doc.setFont("times", "italic"); doc.text("Certificate of Excellence", width/2, 85, { align: "center" });
    
    doc.setFontSize(14); doc.setTextColor(71, 85, 105); doc.setFont("helvetica", "normal"); doc.text("THIS IS PROUDLY PRESENTED TO", width/2, 105, { align: "center" });
    
    doc.setFontSize(34); doc.setTextColor(37, 99, 235); doc.setFont("helvetica", "bold"); doc.text(studentName.toUpperCase(), width/2, 125, { align: "center" });
    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.5); doc.line(width/2 - 70, 130, width/2 + 70, 130);
    
    doc.setFontSize(14); doc.setTextColor(71, 85, 105); doc.setFont("helvetica", "normal"); doc.text("for successfully completing the rigorous enterprise-grade program in", width/2, 145, { align: "center" });
    doc.setFontSize(22); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text(courseName, width/2, 160, { align: "center" });
    
    // DYNAMIC QR CODE LOGIC
    const qrData = `Verified: ${studentName} | ${courseName} | ID: ${certId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    
    try {
        const img = new Image(); img.crossOrigin = "Anonymous"; img.src = qrUrl;
        await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
        doc.addImage(img, 'PNG', 30, height - 55, 35, 35); 
    } catch(e) { console.log("QR Load failed, skipping."); }

    doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text("VERIFICATION DETAILS", 75, height - 45);
    doc.setFont("helvetica", "normal"); doc.text(`Date: ${dateStr}`, 75, height - 38); doc.text(`Time: ${timeStr}`, 75, height - 32); doc.text(`Cert ID: ${certId}`, 75, height - 26);
    
    doc.setFontSize(26); doc.setFont("times", "italic"); doc.setTextColor(15, 23, 42); doc.text("Suyash Rathod", width - 60, height - 35, { align: "center" });
    doc.setDrawColor(15, 23, 42); doc.setLineWidth(0.5); doc.line(width - 100, height - 30, width - 20, height - 30);
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("SUYASH RATHOD", width - 60, height - 24, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139); doc.text("Founder & Executive Director", width - 60, height - 19, { align: "center" });

    doc.save(`${studentName.replace(/ /g, "_")}_Certificate.pdf`);
}

// ==========================================
// 9. APP BOOT SEQUENCE 
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('indexCourseGrid')) renderCourseStore('indexCourseGrid');
    if (document.getElementById('programsCourseGrid')) renderCourseStore('programsCourseGrid');

    const session = safeGetLocal('beatsvibe_session');
    const navAuthBtn = document.getElementById('navAuthBtn');
    
    if (navAuthBtn) {
        if (session && session.id) {
            navAuthBtn.innerHTML = `Dashboard <i class="fas fa-arrow-right ml-2"></i>`;
            navAuthBtn.onclick = () => window.location.href = "/dashboard";
        } else {
            navAuthBtn.innerHTML = `Student Login`;
            navAuthBtn.onclick = () => toggleModal('authModal', true);
        }
    }

    if (document.getElementById('profileForm') || document.getElementById('dashName')) {
        loadDashboardData();
    }
});