<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Root Admin | BeatsVibe</title>
    <link rel="icon" type="image/png" href="logo1.png">
    
    <!-- Tailwind & Fonts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0b1120; color: #f8fafc; }
        
        .admin-card { 
            background: #1e293b; border: 1px solid #334155; border-radius: 16px; 
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); 
            transition: all 0.3s ease;
        }
        .admin-card:hover { border-color: #475569; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); }
        
        .glass-header { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid #334155; }
        
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }

        .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .blink { animation: blink-animation 1s steps(2, start) infinite; }
        @keyframes blink-animation { to { visibility: hidden; } }
    </style>
</head>
<body class="flex h-screen overflow-hidden no-select" oncontextmenu="return false;">

    <!-- TOAST NOTIFICATIONS -->
    <div id="toast-container" class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-[90%] md:w-full max-w-sm mx-auto md:mx-0"></div>

    <!-- SIDEBAR -->
    <aside class="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col hidden md:flex z-20">
        <div class="h-20 flex items-center px-6 border-b border-slate-800 bg-[#0b1120]">
            <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black mr-3 shadow-[0_0_15px_rgba(220,38,38,0.5)] text-white">R</div>
            <div>
                <span class="font-bold tracking-widest text-sm uppercase text-slate-200 block leading-tight">Root Access</span>
                <span class="text-[10px] text-red-500 font-mono">sysadmin@beatsvibe</span>
            </div>
        </div>
        
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-3 mb-3">Core Modules</p>
            <button id="nav-overview" onclick="switchAdminTab('overview')" class="admin-nav-btn w-full text-left px-4 py-3 rounded-xl bg-red-600/10 text-red-400 border border-red-500/20 font-bold text-sm transition"><i class="fas fa-chart-network mr-3 w-4 text-center"></i> System Overview</button>
            <button id="nav-students" onclick="switchAdminTab('students')" class="admin-nav-btn w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 font-bold text-sm transition border border-transparent"><i class="fas fa-users mr-3 w-4 text-center"></i> Student Database</button>
            <button id="nav-revenue" onclick="switchAdminTab('revenue')" class="admin-nav-btn w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 font-bold text-sm transition border border-transparent"><i class="fas fa-file-invoice-dollar mr-3 w-4 text-center"></i> Revenue Logs</button>
            <button id="nav-nodes" onclick="switchAdminTab('nodes')" class="admin-nav-btn w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 font-bold text-sm transition border border-transparent"><i class="fas fa-server mr-3 w-4 text-center"></i> Active Nodes</button>
        </nav>
        
        <div class="p-4 border-t border-slate-800 bg-[#0b1120]">
            <button onclick="adminLogout()" class="w-full text-left px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl font-bold text-sm transition border border-transparent"><i class="fas fa-power-off mr-3 w-4 text-center"></i> Terminate Session</button>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0b1120]">
        
        <!-- HEADER -->
        <header class="h-20 glass-header px-6 md:px-10 flex justify-between items-center sticky top-0 z-10">
            <div>
                <h1 id="header-title" class="text-xl md:text-2xl font-extrabold text-white tracking-tight">Command Center</h1>
                <p class="text-xs text-slate-400 font-mono mt-1"><i class="fas fa-circle text-green-500 text-[8px] mr-1 blink"></i> All systems operational</p>
            </div>
            <div class="flex items-center gap-4">
                <button onclick="fetchDatabase()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border border-slate-700"><i class="fas fa-sync-alt"></i> Sync Cloud Data</button>
                <div class="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-[0_0_10px_rgba(220,38,38,0.4)]">SR</div>
            </div>
        </header>

        <div class="p-6 md:p-10 max-w-7xl mx-auto w-full">

            <!-- ======================================= -->
            <!-- TAB 1: SYSTEM OVERVIEW (Default)        -->
            <!-- ======================================= -->
            <div id="tab-overview" class="admin-section block animate-fade-in space-y-8">
                <!-- STATS GRID -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="admin-card p-6 relative overflow-hidden group">
                        <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition"></div>
                        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Students</p>
                        <h3 id="stat-students" class="text-4xl font-black text-white">0</h3>
                        <div class="mt-4 flex items-center text-xs font-bold text-green-400 bg-green-400/10 w-max px-2 py-1 rounded"><i class="fas fa-arrow-up mr-1"></i> Live DB</div>
                    </div>
                    <div class="admin-card p-6 relative overflow-hidden group">
                        <div class="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition"></div>
                        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue (INR)</p>
                        <h3 id="stat-revenue" class="text-4xl font-black text-white">₹0</h3>
                        <div class="mt-4 flex items-center text-xs font-bold text-green-400 bg-green-400/10 w-max px-2 py-1 rounded"><i class="fas fa-chart-line mr-1"></i> Processed via Razorpay</div>
                    </div>
                    <div class="admin-card p-6 relative overflow-hidden group">
                        <div class="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition"></div>
                        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Courses Sold</p>
                        <h3 id="stat-courses" class="text-4xl font-black text-white">0</h3>
                        <div class="mt-4 flex items-center text-xs font-bold text-purple-400 bg-purple-400/10 w-max px-2 py-1 rounded"><i class="fas fa-box mr-1"></i> Active Nodes Enrolled</div>
                    </div>
                </div>

                <!-- QUICK SYSTEM HEALTH -->
                <div class="admin-card p-6 bg-[#1a2332]">
                    <h2 class="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-3 flex items-center gap-2"><i class="fas fa-heartbeat text-red-500"></i> Platform Health Status</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
                            <p class="text-xs text-slate-400 uppercase font-bold mb-1">Main Database</p>
                            <p class="text-green-400 font-mono text-sm"><i class="fas fa-check-circle mr-1"></i> Connected</p>
                        </div>
                        <div class="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
                            <p class="text-xs text-slate-400 uppercase font-bold mb-1">Payment Gateway</p>
                            <p class="text-green-400 font-mono text-sm"><i class="fas fa-check-circle mr-1"></i> Razorpay Up</p>
                        </div>
                        <div class="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
                            <p class="text-xs text-slate-400 uppercase font-bold mb-1">Lab Containers</p>
                            <p class="text-blue-400 font-mono text-sm"><i class="fas fa-docker mr-1"></i> 6/6 Running</p>
                        </div>
                        <div class="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
                            <p class="text-xs text-slate-400 uppercase font-bold mb-1">Security Firewall</p>
                            <p class="text-green-400 font-mono text-sm"><i class="fas fa-shield-alt mr-1"></i> Max Protection</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ======================================= -->
            <!-- TAB 2: STUDENT DATABASE                 -->
            <!-- ======================================= -->
            <div id="tab-students" class="admin-section hidden animate-fade-in space-y-6">
                <div class="admin-card overflow-hidden">
                    <div class="p-6 border-b border-slate-700 flex justify-between items-center bg-[#1a2332]">
                        <h2 class="text-lg font-bold text-white flex items-center gap-2"><i class="fas fa-users text-blue-500"></i> Student Directory</h2>
                        <span class="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded border border-slate-700">Live Sync</span>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-[#0f172a] text-slate-400 text-xs uppercase tracking-widest border-b border-slate-700">
                                    <th class="p-4 font-bold">Node ID</th>
                                    <th class="p-4 font-bold">Student Name</th>
                                    <th class="p-4 font-bold">Contact Info</th>
                                    <th class="p-4 font-bold">Enrolled Programs</th>
                                </tr>
                            </thead>
                            <tbody id="student-table-body" class="text-sm divide-y divide-slate-700/50">
                                <!-- Populated by JS -->
                            </tbody>
                        </table>
                    </div>
                    <div id="empty-state-students" class="hidden text-center py-12">
                        <i class="fas fa-ghost text-4xl text-slate-600 mb-4"></i>
                        <p class="text-slate-400 font-medium">No student data found.</p>
                    </div>
                </div>
            </div>

            <!-- ======================================= -->
            <!-- TAB 3: REVENUE LOGS                     -->
            <!-- ======================================= -->
            <div id="tab-revenue" class="admin-section hidden animate-fade-in space-y-6">
                <div class="admin-card overflow-hidden">
                    <div class="p-6 border-b border-slate-700 flex justify-between items-center bg-[#1a2332]">
                        <h2 class="text-lg font-bold text-white flex items-center gap-2"><i class="fas fa-file-invoice-dollar text-green-500"></i> Financial Transactions</h2>
                        <span class="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded border border-slate-700">Secured via Razorpay</span>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-[#0f172a] text-slate-400 text-xs uppercase tracking-widest border-b border-slate-700">
                                    <th class="p-4 font-bold">Txn ID (Auto-Gen)</th>
                                    <th class="p-4 font-bold">Student</th>
                                    <th class="p-4 font-bold">Purchased Program</th>
                                    <th class="p-4 font-bold">Amount Paid</th>
                                    <th class="p-4 font-bold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody id="revenue-table-body" class="text-sm divide-y divide-slate-700/50">
                                <!-- Populated by JS -->
                            </tbody>
                        </table>
                    </div>
                    <div id="empty-state-revenue" class="hidden text-center py-12">
                        <i class="fas fa-wallet text-4xl text-slate-600 mb-4"></i>
                        <p class="text-slate-400 font-medium">No financial transactions processed yet.</p>
                    </div>
                </div>
            </div>

            <!-- ======================================= -->
            <!-- TAB 4: ACTIVE NODES (Servers)           -->
            <!-- ======================================= -->
            <div id="tab-nodes" class="admin-section hidden animate-fade-in space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <!-- Node 1: MERN -->
                    <div class="admin-card p-6 border-t-4 border-t-blue-500 bg-[#1a2332] hover:bg-[#1e293b] transition relative overflow-hidden">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-white font-bold text-lg"><i class="fab fa-node-js text-green-500 mr-2"></i> MERN Cluster</h3>
                                <p class="text-slate-400 text-xs font-mono mt-1">Instance: i-0f9c28b3a</p>
                            </div>
                            <span class="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest flex items-center"><i class="fas fa-circle text-[8px] mr-1 blink"></i> Online</span>
                        </div>
                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between text-xs text-slate-400 mb-1"><span>CPU Usage</span><span>42%</span></div>
                                <div class="w-full bg-slate-800 rounded-full h-1.5"><div class="bg-blue-500 h-1.5 rounded-full" style="width: 42%"></div></div>
                            </div>
                            <div>
                                <div class="flex justify-between text-xs text-slate-400 mb-1"><span>Memory (RAM)</span><span>2.4 / 8 GB</span></div>
                                <div class="w-full bg-slate-800 rounded-full h-1.5"><div class="bg-purple-500 h-1.5 rounded-full" style="width: 30%"></div></div>
                            </div>
                        </div>
                    </div>

                    <!-- Node 2: AI GPU -->
                    <div class="admin-card p-6 border-t-4 border-t-purple-500 bg-[#1a2332] hover:bg-[#1e293b] transition relative overflow-hidden">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-white font-bold text-lg"><i class="fas fa-brain text-purple-400 mr-2"></i> AI Tensor Node</h3>
                                <p class="text-slate-400 text-xs font-mono mt-1">GPU: NVIDIA T4 Tensor Core</p>
                            </div>
                            <span class="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest flex items-center"><i class="fas fa-circle text-[8px] mr-1 blink"></i> Online</span>
                        </div>
                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between text-xs text-slate-400 mb-1"><span>GPU VRAM Usage</span><span>11.2 / 16 GB</span></div>
                                <div class="w-full bg-slate-800 rounded-full h-1.5"><div class="bg-purple-500 h-1.5 rounded-full" style="width: 75%"></div></div>
                            </div>
                            <div>
                                <div class="flex justify-between text-xs text-slate-400 mb-1"><span>GPU Temperature</span><span>68°C</span></div>
                                <div class="w-full bg-slate-800 rounded-full h-1.5"><div class="bg-orange-500 h-1.5 rounded-full" style="width: 68%"></div></div>
                            </div>
                        </div>
                    </div>

                    <!-- Node 3: DevOps -->
                    <div class="admin-card p-6 border-t-4 border-t-orange-500 bg-[#1a2332] hover:bg-[#1e293b] transition relative overflow-hidden">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-white font-bold text-lg"><i class="fab fa-aws text-orange-500 mr-2"></i> Cloud / DevOps Env</h3>
                                <p class="text-slate-400 text-xs font-mono mt-1">Containers: 14 Active</p>
                            </div>
                            <span class="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest flex items-center"><i class="fas fa-circle text-[8px] mr-1 blink"></i> Online</span>
                        </div>
                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between text-xs text-slate-400 mb-1"><span>Network Traffic (I/O)</span><span>1.2 Gbps</span></div>
                                <div class="w-full bg-slate-800 rounded-full h-1.5"><div class="bg-orange-500 h-1.5 rounded-full" style="width: 55%"></div></div>
                            </div>
                        </div>
                    </div>

                    <!-- Node 4: Cybersecurity -->
                    <div class="admin-card p-6 border-t-4 border-t-green-500 bg-[#1a2332] hover:bg-[#1e293b] transition relative overflow-hidden">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-white font-bold text-lg"><i class="fas fa-shield-alt text-green-500 mr-2"></i> CyberSec Kali Lab</h3>
                                <p class="text-slate-400 text-xs font-mono mt-1">Virtualization: VMWare ESXi</p>
                            </div>
                            <span class="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest flex items-center"><i class="fas fa-circle text-[8px] mr-1 blink"></i> Online</span>
                        </div>
                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between text-xs text-slate-400 mb-1"><span>Active Tunnels</span><span>24 connections</span></div>
                                <div class="w-full bg-slate-800 rounded-full h-1.5"><div class="bg-green-500 h-1.5 rounded-full" style="width: 24%"></div></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </main>

    <!-- ADMIN LOGIC SCRIPT -->
    <script>
        // Check Security: Prevent unauthorized access
        document.addEventListener('DOMContentLoaded', () => {
            const isAdmin = localStorage.getItem('beatsvibe_admin_session');
            if (isAdmin !== 'true') { window.location.replace('/login'); } 
            else { fetchDatabase(); }
        });

        // Tab Switching Logic
        function switchAdminTab(tabId) {
            // Hide all sections
            document.querySelectorAll('.admin-section').forEach(el => el.classList.add('hidden'));
            // Show targeted section
            document.getElementById('tab-' + tabId).classList.remove('hidden');

            // Reset nav buttons
            document.querySelectorAll('.admin-nav-btn').forEach(btn => {
                btn.className = "admin-nav-btn w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 font-bold text-sm transition border border-transparent";
            });

            // Highlight active button
            const activeBtn = document.getElementById('nav-' + tabId);
            activeBtn.className = "admin-nav-btn w-full text-left px-4 py-3 rounded-xl bg-red-600/10 text-red-400 border border-red-500/20 font-bold text-sm transition";

            // Update Header Title
            const titles = {
                'overview': 'Command Center',
                'students': 'Student Directory',
                'revenue': 'Financial Operations',
                'nodes': 'Server Architecture'
            };
            document.getElementById('header-title').innerText = titles[tabId];
        }

        // Price Dictionary
        const coursePrices = {
            "MERN Full-Stack Architecture": 4999, "AI & Machine Learning": 6499,
            "Cloud Computing & DevOps": 5499, "Cybersecurity & Forensics": 4499,
            "Advanced JavaScript & TS": 2999, "Mobile App Dev (Kotlin)": 3999
        };

        function fetchDatabase() {
            const dbString = localStorage.getItem('bv_mock_db');
            let db = {};
            if(dbString) { try { db = JSON.parse(dbString); } catch(e) {} }

            const studentTable = document.getElementById('student-table-body');
            const revenueTable = document.getElementById('revenue-table-body');
            
            studentTable.innerHTML = ''; revenueTable.innerHTML = '';
            
            let totalStudents = 0, totalRevenue = 0, totalCoursesSold = 0;
            const students = Object.keys(db);

            if(students.length === 0) {
                document.getElementById('empty-state-students').classList.remove('hidden');
                document.getElementById('empty-state-revenue').classList.remove('hidden');
            } else {
                document.getElementById('empty-state-students').classList.add('hidden');
                let hasRevenue = false;
                
                students.forEach(id => {
                    const student = db[id];
                    totalStudents++;
                    const enrolledCount = student.courses ? student.courses.length : 0;
                    totalCoursesSold += enrolledCount;
                    
                    let coursesHtml = '';
                    if(enrolledCount > 0) {
                        hasRevenue = true;
                        student.courses.forEach((c, index) => {
                            const price = coursePrices[c] || 0;
                            totalRevenue += price;
                            coursesHtml += `<span class="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-1 rounded mr-1 mb-1">${c}</span>`;
                            
                            // Generate Revenue Log Row
                            const mockTxn = `pay_rzp${Math.floor(Math.random()*900000) + 100000}`;
                            const mockDate = new Date().toLocaleDateString('en-IN');
                            const revRow = document.createElement('tr');
                            revRow.className = "hover:bg-[#1e293b] transition group";
                            revRow.innerHTML = `
                                <td class="p-4 font-mono text-xs text-blue-400">${mockTxn}</td>
                                <td class="p-4 font-bold text-white text-xs">${student.name}<br><span class="font-normal text-slate-500">${student.email}</span></td>
                                <td class="p-4 text-xs text-slate-300 font-bold">${c}</td>
                                <td class="p-4 text-sm font-bold text-green-400">₹${price.toLocaleString('en-IN')}</td>
                                <td class="p-4 text-right"><span class="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Successful</span></td>
                            `;
                            revenueTable.appendChild(revRow);
                        });
                    } else {
                        coursesHtml = `<span class="text-slate-500 text-xs italic">No enrollments</span>`;
                    }

                    // Generate Student Row
                    const row = document.createElement('tr');
                    row.className = "hover:bg-[#1e293b] transition group";
                    row.innerHTML = `
                        <td class="p-4 font-mono text-xs text-slate-400 group-hover:text-blue-400 transition">${id}</td>
                        <td class="p-4 font-bold text-white flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs overflow-hidden border border-slate-600">
                                ${student.photo ? `<img src="${student.photo}" class="w-full h-full object-cover">` : student.name.charAt(0)}
                            </div>
                            ${student.name}
                        </td>
                        <td class="p-4 text-xs text-slate-400">
                            <div><i class="fas fa-envelope mr-1"></i> ${student.email}</div>
                        </td>
                        <td class="p-4 max-w-xs">${coursesHtml}</td>
                    `;
                    studentTable.appendChild(row);
                });

                if(!hasRevenue) document.getElementById('empty-state-revenue').classList.remove('hidden');
            }

            // Update Dashboards Stats
            document.getElementById('stat-students').innerText = totalStudents;
            document.getElementById('stat-revenue').innerText = `₹${totalRevenue.toLocaleString('en-IN')}`;
            document.getElementById('stat-courses').innerText = totalCoursesSold;
            
            showToast("Cloud Database synchronized successfully.", "success");
        }

        function adminLogout() {
            localStorage.removeItem('beatsvibe_admin_session');
            window.location.replace('/login');
        }

        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            const isError = type === 'error';
            toast.className = `p-4 rounded-xl shadow-2xl flex items-center gap-3 transform -translate-y-10 opacity-0 transition-all duration-300 ${isError ? 'bg-red-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-200'}`;
            toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'} text-xl ${!isError && 'text-green-400'}"></i><p class="font-bold text-sm">${message}</p>`;
            container.appendChild(toast);
            requestAnimationFrame(() => toast.classList.remove('-translate-y-10', 'opacity-0'));
            setTimeout(() => { toast.classList.add('opacity-0', '-translate-y-5'); setTimeout(() => toast.remove(), 300); }, 3000);
        }
    </script>
</body>
</html>