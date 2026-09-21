<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App | BeatsVibe</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f1f5f9; }</style>
</head>
<body class="flex h-screen overflow-hidden text-slate-800">

    <div id="toast-container" class="fixed top-6 right-6 z-50 flex flex-col gap-3"></div>
    <div id="lab-overlay" class="fixed inset-0 bg-slate-900 z-[999] hidden flex-col justify-center items-center text-green-400 font-mono"><i class="fas fa-server text-6xl animate-pulse mb-4"></i><p id="lab-logs">Booting Node...</p></div>

    <!-- App Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
        <div class="h-16 flex items-center px-6 border-b border-slate-100 cursor-pointer" onclick="window.location.href='/'">
            <div class="w-8 h-8 bg-blue-600 rounded-lg text-white flex items-center justify-center font-black mr-2">B</div>
            <span class="font-bold text-slate-900">BeatsVibe</span>
        </div>
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-3">General</p>
            <button onclick="switchAppTab('dashboard')" id="nav-dashboard" class="sidebar-btn w-full text-left px-4 py-2.5 rounded-lg bg-blue-600/10 text-blue-600 border border-blue-600 font-bold text-sm transition"><i class="fas fa-user-cog w-5 text-center mr-2"></i> Settings</button>
            <button onclick="switchAppTab('mycourses')" id="nav-mycourses" class="sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 font-bold text-sm transition border border-transparent"><i class="fas fa-laptop-code w-5 text-center mr-2"></i> Deployments</button>
            <button onclick="switchAppTab('explore')" id="nav-explore" class="sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 font-bold text-sm transition border border-transparent"><i class="fas fa-compass w-5 text-center mr-2"></i> Catalog</button>
        </nav>
        <div class="p-4 border-t border-slate-100">
            <button onclick="logout()" class="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-lg font-bold text-sm transition"><i class="fas fa-power-off w-5 text-center mr-2"></i> Sign Out</button>
        </div>
    </aside>

    <!-- App Main Area -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header class="h-16 bg-white/80 backdrop-blur border-b border-slate-200 px-8 flex justify-between items-center z-10 shrink-0">
            <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Overview</h2>
            <div class="flex items-center gap-4">
                <button class="text-slate-400 hover:text-slate-600"><i class="fas fa-bell"></i></button>
                <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold shadow overflow-hidden border-2 border-white">
                    <span id="avatarInitial">S</span><img id="topAvatarImg" class="hidden w-full h-full object-cover" src="">
                </div>
            </div>
        </header>

        <div class="flex-1 overflow-y-auto p-8">
            <div class="max-w-4xl mx-auto">
                
                <!-- Setup Tab -->
                <div id="tab-dashboard" class="app-section block">
                    <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <h3 class="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Identity Configuration</h3>
                        <form id="profileForm" class="space-y-6">
                            <div class="flex items-center gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <img id="formAvatarPreview" src="https://via.placeholder.com/150" class="w-20 h-20 rounded-full border-4 border-white shadow object-cover cursor-pointer" onclick="document.getElementById('profilePhotoFile').click()">
                                <div><p class="text-sm font-bold text-slate-900">Avatar Sync</p><p class="text-xs text-slate-500 mb-2">Click image to upload.</p><input type="file" id="profilePhotoFile" accept="image/*" class="hidden"><input type="hidden" id="profilePhotoBase64"></div>
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div><label class="block text-xs font-bold text-slate-500 mb-2">Full Name</label><input type="text" id="profileName" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"></div>
                                <div><label class="block text-xs font-bold text-slate-500 mb-2">Contact</label><input type="tel" id="profilePhone" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"></div>
                                <div><label class="block text-xs font-bold text-slate-500 mb-2">Organization</label><input type="text" id="profileCollege" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"></div>
                                <div><label class="block text-xs font-bold text-slate-500 mb-2">GitHub URL</label><input type="url" id="profileGithub" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"></div>
                            </div>
                            <div><label class="block text-xs font-bold text-slate-500 mb-2">Bio</label><textarea id="profileBio" rows="3" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"></textarea></div>
                            <div class="flex justify-end"><button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-md hover:bg-blue-700">Save Configuration</button></div>
                        </form>
                    </div>
                </div>

                <!-- Deployments Tab -->
                <div id="tab-mycourses" class="app-section hidden space-y-6">
                    <h3 class="text-xl font-bold text-slate-900 mb-4">Active Deployments</h3>
                    <div id="myCoursesList" class="space-y-4"></div>
                </div>

                <!-- Explore Tab -->
                <div id="tab-explore" class="app-section hidden">
                    <h3 class="text-xl font-bold text-slate-900 mb-6">Catalog Store</h3>
                    <div id="dashExploreGrid" class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
                </div>

            </div>
        </div>
    </main>

    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore-compat.js"></script>
    <script src="app.js"></script>
</body>
</html>