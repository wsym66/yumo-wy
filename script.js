// 账号表：role = admin / vip / normal
  const ACCOUNTS = {
    "予墨":   { pwd: "cxy20161225@", role: "admin" },
    "王振昊": { pwd: "20262026",     role: "vip"   },
    "于":     { pwd: "20262026",     role: "vip"   },
    "崔诚润": { pwd: "2017",         role: "vip"   },
    "徐子喆": { pwd: "161022",       role: "vip"   }，
    "任":{pwd:"123456",role:"vip"}
  };
  const GUEST_CODE = "20206";
  const MC_URL = "https://1.mcjslink.144449.xyz/1.8.8/";

  function showView(id){
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function applyTheme(role){
    // 先清掉
    document.body.classList.remove('vip','gold-bg');
    document.getElementById('adminFab').classList.remove('show');
    document.getElementById('adminPanel').classList.remove('show');
    if(role === 'vip' || role === 'admin'){
      // VIP 和管理员都上金色边框 + 金粒壁纸
      document.body.classList.add('vip','gold-bg');
    }
    if(role === 'admin'){
      document.getElementById('adminFab').classList.add('show');
      buildAccList();
    }
  }

  function enterHome(role){
    applyTheme(role);
    showView('home-view');
  }

  function doLogin(){
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    const err = document.getElementById('errMsg');
    if(!u || !p){ err.textContent = '请输入账号和密码'; return; }
    const acc = ACCOUNTS[u];
    if(acc && acc.pwd === p){
      err.textContent = '';
      enterHome(acc.role);
    } else {
      err.textContent = '账号或密码错误';
    }
  }

  // 访客
  function openGuestModal(){
    document.getElementById('guestCode').value = '';
    document.getElementById('guestErr').textContent = '';
    document.getElementById('guestModal').classList.add('show');
    setTimeout(()=>document.getElementById('guestCode').focus(), 100);
  }
  function checkGuestCode(){
    const v = document.getElementById('guestCode').value.trim();
    if(v === GUEST_CODE){
      document.getElementById('guestModal').classList.remove('show');
      enterHome('normal');
    } else {
      document.getElementById('guestErr').textContent = '进入码错误';
    }
  }
  document.getElementById('guestCode').addEventListener('keydown', e=>{ if(e.key==='Enter') checkGuestCode(); });

  // 退出登录
  function doLogout(){
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.body.classList.remove('vip','gold-bg');
    document.getElementById('adminFab').classList.remove('show');
    document.getElementById('adminPanel').classList.remove('show');
    showView('login-view');
  }

  // 游戏
  function openGame(){
    document.getElementById('game-frame').src = MC_URL;
    document.getElementById('game-view').classList.add('active');
  }
  function closeGame(){
    document.getElementById('game-frame').src = 'about:blank';
    document.getElementById('game-view').classList.remove('active');
    if(document.fullscreenElement){ document.exitFullscreen(); }
  }
  function toggleFullscreen(){
    const el = document.documentElement;
    if(!document.fullscreenElement){
      (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  }

  // 管理员账号列表（除管理员自己）
  function buildAccList(){
    const list = document.getElementById('accList');
    list.innerHTML = '';
    Object.keys(ACCOUNTS).forEach(name=>{
      if(name === '予墨') return; // 不显示管理员自己
      const a = ACCOUNTS[name];
      const div = document.createElement('div');
      div.className = 'acc-item';
      div.innerHTML = '<span>'+name+'</span><span class="pwd">'+a.pwd+'</span>';
      list.appendChild(div);
    });
  }
  function toggleAdminPanel(show){
    document.getElementById('adminPanel').classList.toggle('show', show);
  }

  // 悬浮按钮：点按开菜单，拖动位置
  (function(){
    const fab = document.getElementById('adminFab');
    let startX=0, startY=0, origX=0, origY=0;
    let pressing=false, dragging=false;

    function getPoint(e){
      if(e.touches && e.touches[0]) return {x:e.touches[0].clientX, y:e.touches[0].clientY};
      return {x:e.clientX, y:e.clientY};
    }
    function onStart(e){
      if(fab.classList.contains('show') === false) return;
      const p = getPoint(e);
      pressing = true; dragging = false;
      startX = p.x; startY = p.y;
      const rect = fab.getBoundingClientRect();
      origX = rect.left; origY = rect.top;
      if(e.cancelable) e.preventDefault();
    }
    function onMove(e){
      if(!pressing) return;
      const p = getPoint(e);
      const dx = p.x - startX, dy = p.y - startY;
      if(!dragging && (Math.abs(dx) > 8 || Math.abs(dy) > 8)){
        dragging = true;
      }
      if(dragging){
        fab.style.right = 'auto';
        fab.style.left = Math.max(0, Math.min(window.innerWidth - fab.offsetWidth, origX + dx)) + 'px';
        fab.style.top  = Math.max(0, Math.min(window.innerHeight - fab.offsetHeight, origY + dy)) + 'px';
        if(e.cancelable) e.preventDefault();
      }
    }
    function onEnd(e){
      if(!pressing) return;   // 关键：不是从 fab 按下的触摸，一概不管
      pressing = false;
      if(!dragging){
        // 没拖动 = 点按 → 切换菜单
        document.getElementById('adminPanel').classList.toggle('show');
      }
    }
    fab.addEventListener('mousedown', onStart);
    fab.addEventListener('touchstart', onStart, {passive:false});
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
  })();

  // 回车登录
  document.getElementById('password').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
  document.getElementById('username').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('password').focus(); });
//（注：内容由AI生成）
