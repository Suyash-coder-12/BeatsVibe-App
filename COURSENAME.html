// Replace your old enterLab function with this:
function enterLab(courseName) {
    const overlay = document.getElementById('lab-overlay');
    const logs = document.getElementById('lab-logs');
    const progress = document.getElementById('lab-progress');
    
    if(!overlay) return;
    
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

    // Dynamic URL Slug generation (e.g., "MERN Architecture" -> "/mern-architecture.html")
    const courseSlug = "/" + courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + ".html";

    const progInterval = setInterval(() => {
        if(width >= 100) {
            clearInterval(progInterval); clearInterval(logInterval);
            showToast("Welcome to the Lab Environment!", "success");
            overlay.style.display = 'none';
            // REDIRECT TO COURSE HTML PAGE
            window.location.href = courseSlug;
        } else {
            width += Math.floor(Math.random() * 15);
            if(width > 100) width = 100;
            progress.style.width = width + '%';
        }
    }, 400);
}