// Site interactions: mobile nav toggle and simple contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');
    if(navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }

    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic client-side validation
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            if(!name || !email || !message) {
                status.textContent = 'Please complete all fields.';
                return;
            }
            status.textContent = 'Sending message...';
            // Here you would integrate with your backend or email service.
            setTimeout(()=>{
                status.textContent = 'Message sent — we will reply shortly.';
                form.reset();
            }, 800);
        });
    }

    // Show works banner by default (access key removed)
    const worksBanner = document.getElementById('works-banner');
    if(worksBanner) worksBanner.classList.remove('hidden');

    // Work name tap/click -> show phone panel
    const phonePanel = document.getElementById('work-phone-panel');
    const panelPhones = document.getElementById('panel-phones');
    const panelTitle = document.getElementById('panel-title');
    const panelClose = document.getElementById('panel-close');

    function showPhonePanel(title, phones){
        if(!phonePanel) return;
        panelTitle.textContent = title + ' — Contacts';
        panelPhones.innerHTML = '';
        if(!phones || phones.length === 0){
            const li = document.createElement('li');
            li.textContent = 'No contacts available.';
            panelPhones.appendChild(li);
        } else {
            phones.forEach(p => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `tel:${p}`;
                link.textContent = p;
                link.setAttribute('aria-label', `Call ${p}`);
                const copyBtn = document.createElement('button');
                copyBtn.className = 'button button-ghost';
                copyBtn.textContent = 'Copy';
                copyBtn.addEventListener('click', ()=>{
                    try{navigator.clipboard.writeText(p); copyBtn.textContent = 'Copied'; setTimeout(()=>copyBtn.textContent = 'Copy',900)}catch(e){/* ignore */}
                });
                li.appendChild(link);
                li.appendChild(copyBtn);
                panelPhones.appendChild(li);
            });
        }
        phonePanel.classList.remove('hidden');
    }

    // click handler for works items (both overlay and banner)
    document.addEventListener('click', function(e){
        const el = e.target.closest('[data-phones]');
        if(!el) return;
        const phonesAttr = el.getAttribute('data-phones') || '';
        const phones = phonesAttr.split(',').map(s=>s.trim()).filter(Boolean);
        const title = el.textContent.trim();
        showPhonePanel(title, phones);
    });

    // keyboard activation (Enter) for works items
    document.addEventListener('keydown', function(e){
        if(e.key !== 'Enter') return;
        const active = document.activeElement;
        if(active && active.hasAttribute && active.hasAttribute('data-phones')){
            active.click();
        }
    });

    if(panelClose){ panelClose.addEventListener('click', ()=> phonePanel.classList.add('hidden')); }
    // click outside to close
    document.addEventListener('click', function(e){
        if(!phonePanel || phonePanel.classList.contains('hidden')) return;
        if(e.target.closest('.work-phone-panel') || e.target.closest('[data-phones]')) return;
        phonePanel.classList.add('hidden');
    });

    // (access key removed)

    // Admin password login (password: 123q)
    const LOGIN_PASSWORD = '123q';
    const loginToggle = document.querySelector('.login-toggle');
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const loginInput = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const adminArea = document.getElementById('admin-area');
    const logoutBtn = document.getElementById('logout-btn');

    function markAdmin(){
        try{sessionStorage.setItem('nkol_admin','logged')}catch(e){}
        if(loginOverlay) loginOverlay.classList.add('hidden');
        if(adminArea) adminArea.style.display = 'flex';
    }

    function unmarkAdmin(){
        try{sessionStorage.removeItem('nkol_admin')}catch(e){}
        if(adminArea) adminArea.style.display = 'none';
    }

    // restore admin state if present
    if(sessionStorage && sessionStorage.getItem('nkol_admin') === 'logged'){
        if(adminArea) adminArea.style.display = 'flex';
    }

    if(loginToggle && loginOverlay){
        loginToggle.addEventListener('click', ()=>{
            loginOverlay.classList.remove('hidden');
            loginInput && loginInput.focus();
        });
    }

    if(loginForm){
        loginForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            const val = (loginInput && loginInput.value || '').trim();
            if(!val){ loginError.textContent = 'Please enter your password.'; return; }
            if(val === LOGIN_PASSWORD){
                try{ sessionStorage.setItem('nkol_admin','logged') }catch(e){}
                // redirect to the polished admin page
                window.location.href = 'admin.html';
            } else {
                loginError.textContent = 'Incorrect password.';
                loginInput && (loginInput.value = '');
                loginInput && loginInput.focus();
            }
        });
    }

    if(logoutBtn){
        logoutBtn.addEventListener('click', ()=>{
            unmarkAdmin();
        });
    }

    // Admin income dashboard logic
    const adminDashboard = document.getElementById('admin-dashboard');
    const incomeAmount = document.getElementById('income-amount');
    const addIncomeBtn = document.getElementById('add-income-btn');
    const clearIncomeBtn = document.getElementById('clear-income-btn');
    const incomeStatus = document.getElementById('income-status');
    const incomeList = document.getElementById('income-list');
    const todayAmountEl = document.getElementById('today-amount');
    const weekAmountEl = document.getElementById('week-amount');
    const monthAmountEl = document.getElementById('month-amount');

    function parseFloatSafe(v){return Number.isFinite(+v)? +v : 0}

    function loadEntries(){
        try{
            const raw = localStorage.getItem('nkol_income');
            return raw ? JSON.parse(raw) : [];
        } catch(e){return []}
    }
    function saveEntries(arr){
        try{ localStorage.setItem('nkol_income', JSON.stringify(arr)) }catch(e){}
    }

    function formatCurrency(v){
        return (+v).toFixed(2);
    }

    function renderDashboard(){
        if(!adminDashboard) return;
        const entries = loadEntries();
        // compute sums
        const now = Date.now();
        const dayMs = 24*60*60*1000;
        const weekCut = now - 7*dayMs;
        const monthCut = now - 30*dayMs;
        let todaySum = 0, weekSum = 0, monthSum = 0;
        incomeList && (incomeList.innerHTML = '');
        entries.slice().reverse().forEach(e =>{
            const amt = parseFloatSafe(e.amount);
            const time = new Date(e.ts);
            if(e.ts >= weekCut) weekSum += amt;
            if(e.ts >= monthCut) monthSum += amt;
            // if same day as now
            const d1 = new Date(e.ts).toDateString();
            const d2 = new Date(now).toDateString();
            if(d1 === d2) todaySum += amt;
            const li = document.createElement('li');
            li.textContent = `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`;
            const span = document.createElement('span'); span.textContent = formatCurrency(amt);
            li.appendChild(span);
            incomeList && incomeList.appendChild(li);
        });
        todayAmountEl && (todayAmountEl.textContent = formatCurrency(todaySum));
        weekAmountEl && (weekAmountEl.textContent = formatCurrency(weekSum));
        monthAmountEl && (monthAmountEl.textContent = formatCurrency(monthSum));
    }

    function showAdminDashboard(){
        if(adminDashboard) adminDashboard.classList.remove('hidden');
        renderDashboard();
    }
    function hideAdminDashboard(){
        if(adminDashboard) adminDashboard.classList.add('hidden');
    }

    // expose on admin mark/unmark
    if(sessionStorage && sessionStorage.getItem('nkol_admin') === 'logged') showAdminDashboard();

    if(addIncomeBtn){
        addIncomeBtn.addEventListener('click', ()=>{
            const v = parseFloatSafe(incomeAmount && incomeAmount.value || 0);
            if(!v || v <= 0){ incomeStatus.textContent = 'Enter a positive amount.'; return; }
            const entries = loadEntries();
            entries.push({ts: Date.now(), amount: v});
            saveEntries(entries);
            incomeAmount.value = '';
            incomeStatus.textContent = 'Saved.';
            renderDashboard();
            setTimeout(()=> incomeStatus.textContent = '', 1500);
        });
    }

    if(clearIncomeBtn){
        clearIncomeBtn.addEventListener('click', ()=>{
            if(!confirm('Clear all saved income entries?')) return;
            saveEntries([]);
            renderDashboard();
        });
    }

    // update visibility when admin status changes
    const originalMarkAdmin = markAdmin;
    markAdmin = function(){ originalMarkAdmin && originalMarkAdmin(); showAdminDashboard(); }
    const originalUnmarkAdmin = unmarkAdmin;
    unmarkAdmin = function(){ originalUnmarkAdmin && originalUnmarkAdmin(); hideAdminDashboard(); }
});