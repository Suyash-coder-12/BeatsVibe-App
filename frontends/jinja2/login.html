<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Node | BeatsVibe App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; }</style>
</head>
<body class="flex h-screen overflow-hidden">
    <div id="toast-container" class="fixed top-6 right-6 z-50 flex flex-col gap-3"></div>

    <!-- Left: App Branding -->
    <div class="hidden lg:flex flex-1 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div class="relative z-10 flex items-center gap-3 cursor-pointer" onclick="window.location.href='/'">
            <div class="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center font-black text-xl">B</div>
            <span class="font-extrabold text-white text-xl tracking-wide">BeatsVibe</span>
        </div>
        <div class="relative z-10">
            <h1 class="text-5xl font-black text-white mb-6 leading-tight">Your Virtual <br><span class="text-blue-500">Engineering Lab.</span></h1>
            <p class="text-slate-400 text-lg max-w-md">Authenticate to access your active deployment pipelines, AI mentoring sessions, and secure classrooms.</p>
        </div>
        <div class="relative z-10 text-slate-500 text-sm font-mono">System Status: <span class="text-green-400"><i class="fas fa-circle text-[8px] animate-pulse"></i> All Nodes Operational</span></div>
    </div>

    <!-- Right: Auth Form -->
    <div class="flex-1 flex items-center justify-center bg-white p-8 overflow-y-auto">
        <div class="w-full max-w-md">
            <h2 class="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
            <p class="text-slate-500 text-sm mb-8">Enter your credentials to access the platform.</p>

            <div class="flex bg-slate-50 rounded-xl p-1 mb-6 border border-slate-200">
                <button id="tab-student-btn" onclick="customTabSwitch('student')" class="flex-1 py-2 rounded-lg bg-white text-slate-900 font-bold shadow-sm text-sm">Student</button>
                <button id="tab-admin-btn" onclick="customTabSwitch('admin')" class="flex-1 py-2 rounded-lg text-slate-500 font-bold hover:text-slate-800 text-sm">Admin</button>
            </div>

            <div id="auth-student" class="block">
                <div class="flex gap-2 mb-6">
                    <button onclick="toggleLoginType('signin')" class="flex-1 border-b-2 border-blue-600 text-blue-600 font-bold pb-2 text-sm">Sign In</button>
                    <button onclick="toggleLoginType('signup')" class="flex-1 border-b-2 border-transparent text-slate-400 font-bold pb-2 text-sm hover:text-slate-600">Register</button>
                </div>

                <button onclick="signInWithGoogle()" class="w-full border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-3 mb-6 shadow-sm">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5"> Google Auth
                </button>
                <div class="flex items-center gap-3 mb-6"><hr class="flex-1 border-slate-200"><span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Or Email</span><hr class="flex-1 border-slate-200"></div>

                <form onsubmit="handleStudentAuth(event)" class="space-y-4">
                    <div id="signupNameField" class="hidden"><input type="text" id="authName" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-sm" placeholder="Full Name"></div>
                    <input type="email" id="authId" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-sm" placeholder="Email Address" required>
                    <input type="password" id="authPass" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-sm" placeholder="Password" required>
                    <button type="submit" id="authSubmitBtn" class="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-600/20 text-sm">Access Dashboard</button>
                </form>
            </div>

            <div id="auth-admin" class="hidden">
                <form onsubmit="handleAdminLogin(event)" class="space-y-4 mt-8">
                    <input type="text" id="adminId" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 text-sm" placeholder="Admin ID" required>
                    <input type="password" id="adminPass" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 text-sm" placeholder="Root Key" required>
                    <button type="submit" class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-md text-sm">Connect to Server</button>
                </form>
            </div>
        </div>
    </div>

    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore-compat.js"></script>
    <script src="app.js"></script>
    <script>
        function customTabSwitch(tab) {
            const isStudent = tab === 'student';
            document.getElementById('auth-student').classList.toggle('hidden', !isStudent);
            document.getElementById('auth-admin').classList.toggle('hidden', isStudent);
            document.getElementById('tab-student-btn').className = isStudent ? "flex-1 py-2 rounded-lg bg-white text-slate-900 font-bold shadow-sm text-sm" : "flex-1 py-2 rounded-lg text-slate-500 font-bold hover:text-slate-800 text-sm bg-transparent";
            document.getElementById('tab-admin-btn').className = !isStudent ? "flex-1 py-2 rounded-lg bg-white text-slate-900 font-bold shadow-sm text-sm" : "flex-1 py-2 rounded-lg text-slate-500 font-bold hover:text-slate-800 text-sm bg-transparent";
        }
    </script>
</body>
</html>