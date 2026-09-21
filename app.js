const firebaseConfig = {
    apiKey: "YOUR_API_KEY", 
    authDomain: "beatsvibeedtechfirebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let auth = null, firestoreDb = null, googleProvider = null;
try {
    if (typeof firebase !== 'undefined' && firebase.apps) {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        if (firebase.auth) { auth = firebase.auth(); googleProvider = new firebase.auth.GoogleAuthProvider(); }
        if (firebase.firestore) firestoreDb = firebase.firestore();
    }
} catch (error) { console.warn("Firebase Safe Mode."); }

function safeGetLocal(key) {
    try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : null; } 
    catch (e) { localStorage.removeItem(key); return null; }
}

// Added Internship IDs so routing from Programs page works perfectly
const allCourses = [
    { id: "c1", title: "MERN Full-Stack Architecture", price: "₹4,999", numericPrice: 4999, icon: "fa-layer-group", desc: "Master MongoDB, Express, React, and Node.js." },
    { id: "c2", title: "AI & Machine Learning", price: "₹6,499", numericPrice: 6499, icon: "fa-robot", desc: "Python, TensorFlow, Neural Networks." },
    { id: "c3", title: "Cloud Computing & DevOps", price: "₹5,499", numericPrice: 5499, icon: "fa-server", desc: "AWS infrastructure, Docker, Kubernetes, CI/CD." },
    { id: "c4", title: "Cybersecurity & Forensics", price: "₹4,499", numericPrice: 4499, icon: "fa-shield-alt", desc: "Network security, ethical hacking." },
    { id: "c5", title: "Advanced JavaScript & TS", price: "₹2,999", numericPrice: 2999, icon: "fab fa-js", desc: "Deep dive into JS engines and TypeScript." },
    { id: "c6", title: "Mobile App Dev (Kotlin)", price: "₹3,999", numericPrice: 3999, icon: "fab fa-android", desc: "Native Android architecture." },
    { id: "i1", title: "SDE Internship", price: "₹8,999", numericPrice: 8999, icon: "fa-briefcase", desc: "Live client projects using React and Node.js." },
    { id: "i2", title: "IoT Internship", price: "₹7,999", numericPrice: 7999, icon: "fa-microchip", desc: "Hardware, Arduino/C++, and smart systems prototyping." }
    { id: "i3", title: "Data Science Internship", price: "₹9,499", numericPrice: 9499, icon: "fa-database", desc: "Data analysis, visualization, and machine learning." }
];

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-xl shadow-xl flex items-center gap-3 transform -translate-y-10 opacity-0 transition-all duration-300 ${type === 'error' ? 'bg-red-500 text-white' : 'bg-white border border-slate-200 text-slate-800 z-[9999]'}`;
    toast.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} text-xl ${type !== 'error' && 'text-blue-500'}"></i><p class="font-bold text-sm">${message}</p>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('-translate-y-10', 'opacity-0'));
    setTimeout(() => { toast.classList.add('opacity-0', '-translate-y-5'); setTimeout(() => toast.remove(), 300); }, 3000);
}

let currentAuthMode = 'signin';
function toggleLoginType(mode) {
    currentAuthMode = mode; const isSignIn = mode === 'signin';
    const signupField = document.getElementById('signupNameField');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    if(signupField) {
        signupField.classList.toggle('hidden', isSignIn);
        document.getElementById('authName').required = !isSignIn;
    }
    if(authSubmitBtn) authSubmitBtn.innerHTML = isSignIn ? 'Access Dashboard' : 'Initialize Account';
}

async function signInWithGoogle() {
    if(!auth) {
        showToast("Mock Google Auth (Firebase Missing)", "success");
        const userData = { uid: "test-uid-google", studentId: "BV-" + Math.floor(1000 + Math.random() * 9000), name: "Google User", email: "test@google.com", photo: "", courses: [] };
        localStorage.setItem('beatsvibe_session', JSON.stringify(userData));
        setTimeout(() => window.location.href = "/dashboard", 1000);
        return;
    }
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const docRef = firestoreDb.collection("students").doc(result.user.uid);
        const doc = await docRef.get();
        let userData;
        if (!doc.exists) {
            userData = { uid: result.user.uid, studentId: "BV-" + Math.floor(1000 + Math.random() * 9000), name: result.user.displayName, email: result.user.email, photo: result.user.photoURL || "", phone: "", courses: [] };
            await docRef.set(userData);
        } else { userData = doc.data(); }
        localStorage.setItem('beatsvibe_session', JSON.stringify(userData));
        window.location.href = "/dashboard";
    } catch (e) { showToast(e.message, "error"); }
}

async function handleStudentAuth(event) {
    event.preventDefault();
    const email = document.getElementById('authId').value.trim();
    const pass = document.getElementById('authPass').value.trim();

    if(!auth || !firestoreDb) {
        showToast("Mock Auth Mode (Firebase Disabled)", "success");
        let userData;
        if (currentAuthMode === 'signup') {
            const name = document.getElementById('authName').value.trim();
            if (!name) return showToast("Name required.", "error");
            userData = { uid: "test-uid-" + Date.now(), studentId: "BV-" + Math.floor(1000+Math.random()*9000), name: name, email: email, photo: "", courses: [] };
        } else {
            userData = { uid: "test-uid-default", studentId: "BV-1234", name: email.split('@')[0], email: email, photo: "", courses: [] };
        }
        localStorage.setItem('beatsvibe_session', JSON.stringify(userData));
        setTimeout(() => window.location.href = "/dashboard", 1000);
        return;
    }

    if(auth && firestoreDb) {
        if (currentAuthMode === 'signup') {
            const name = document.getElementById('authName').value.trim();
            if (!name) return showToast("Name required.", "error");
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
                const userData = { uid: userCredential.user.uid, studentId: "BV-" + Math.floor(1000+Math.random()*9000), name: name, email: email, photo: "", courses: [] };
                await firestoreDb.collection("students").doc(userCredential.user.uid).set(userData);
                localStorage.setItem('beatsvibe_session', JSON.stringify(userData));
                window.location.href = "/dashboard";
            } catch (e) { showToast(e.message, "error"); }
        } else {
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, pass);
                const doc = await firestoreDb.collection("students").doc(userCredential.user.uid).get();
                if (doc.exists) {
                    localStorage.setItem('beatsvibe_session', JSON.stringify(doc.data()));
                    window.location.href = "/dashboard";
                }
            } catch (e) { showToast("Invalid Credentials.", "error"); }
        }
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    if (document.getElementById('adminId').value === "Suyash" && document.getElementById('adminPass').value === "Admin@123") {
        localStorage.setItem('beatsvibe_admin_session', 'true'); window.location.href = "/admin";
    } else { showToast("Access Denied.", "error"); }
}

function logout() { if(auth) auth.signOut(); localStorage.removeItem('beatsvibe_session'); window.location.replace("/"); }

function enterLab(courseName) {
    const overlay = document.getElementById('lab-overlay');
    if(!overlay) return; overlay.style.display = 'flex';
    setTimeout(() => { window.location.href = "/" + courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-'); }, 2000);
}

function switchAppTab(tabId) {
    document.querySelectorAll('.app-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('tab-' + tabId).classList.remove('hidden');
    document.querySelectorAll('.sidebar-btn').forEach(btn => { btn.classList.remove('bg-blue-500/15', 'text-blue-400', 'border-blue-500/30', 'hover:shadow-lg'); btn.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-white', 'border-transparent'); });
    const activeBtn = document.getElementById('nav-' + tabId);
    activeBtn.classList.remove('text-slate-400', 'hover:bg-slate-800', 'hover:text-white', 'border-transparent');
    activeBtn.classList.add('bg-blue-500/15', 'text-blue-400', 'border-blue-500/30', 'hover:shadow-lg');
}

async function loadDashboardData() {
    const session = safeGetLocal('beatsvibe_session');
    if(!session) return window.location.href = '/login';
    let user = session;
    if(firestoreDb) {
        const doc = await firestoreDb.collection("students").doc(session.uid).get();
        if(doc.exists) user = doc.data();
    }
    if(document.getElementById('dashName')) document.getElementById('dashName').innerText = user.name.split(' ')[0];
    if(document.getElementById('profileName')) {
        document.getElementById('profileName').value = user.name || "";
        document.getElementById('profilePhotoBase64').value = user.photo || "";
        if(user.photo) { document.getElementById('formAvatarPreview').src = user.photo; document.getElementById('topAvatarImg').src = user.photo; document.getElementById('topAvatarImg').classList.remove('hidden'); }
    }
    populateLists(user.courses || []);
}

function populateLists(userCourses) {
    const coursesList = document.getElementById('myCoursesList');
    if(coursesList) {
        if(userCourses.length > 0) {
            coursesList.innerHTML = userCourses.map(c => `
                <div class="flex items-center justify-between p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <div class="flex items-center gap-4"><div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl"><i class="fas fa-server"></i></div>
                    <div><h4 class="font-bold text-slate-900">${c}</h4><p class="text-xs text-green-500 font-bold">Node Active</p></div></div>
                    <button onclick="enterLab('${c}')" class="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm">Launch Lab</button>
                </div>`).join('');
        } else { coursesList.innerHTML = `<p class="text-slate-500 text-center py-8">No active environments.</p>`; }
    }
}

async function processCoursePayment(courseName, amount) {
    const session = safeGetLocal('beatsvibe_session');
    if(!session) return window.location.href = '/login';
    if ((session.courses || []).includes(courseName)) return showToast("Already enrolled!", "error");
    try {
        const res = await fetch('http://localhost:5000/api/payment/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: amount, courseName: courseName, studentId: session.id }) });
        const data = await res.json();
        const options = { key: "rzp_test_TU6zzd7qlXCLZs", amount: data.order.amount, currency: "INR", name: "BeatsVibe", order_id: data.order.id, handler: function (response) { handlePaymentSuccess(courseName, session); }, prefill: { name: session.name, email: session.email } };
        new window.Razorpay(options).open();
    } catch (e) {
        if(confirm(`[TEST MODE] Simulate ₹${amount} payment for ${courseName}?`)) handlePaymentSuccess(courseName, session);
    }
}

async function handlePaymentSuccess(courseName, session) {
    if(firestoreDb) await firestoreDb.collection("students").doc(session.uid).update({ courses: firebase.firestore.FieldValue.arrayUnion(courseName) });
    session.courses.push(courseName); localStorage.setItem('beatsvibe_session', JSON.stringify(session));
    window.location.href = "/dashboard";
}

function loadGoogleTranslate() {
    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
    
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    };

    if(!document.getElementById('google_translate_element')){
        const gtDiv = document.createElement('div');
        gtDiv.id = 'google_translate_element';
        gtDiv.style.position = 'fixed';
        gtDiv.style.bottom = '20px';
        gtDiv.style.left = '20px';
        gtDiv.style.zIndex = '999999';
        gtDiv.style.backgroundColor = '#ffffff';
        gtDiv.style.padding = '8px';
        gtDiv.style.borderRadius = '12px';
        gtDiv.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(gtDiv);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('profileForm') || document.getElementById('dashName')) loadDashboardData();
    loadGoogleTranslate();
});