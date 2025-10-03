(function(){
  const d=document
  function showToast(message,duration=3000){
    const overlay=d.createElement('div')
    overlay.className='modal-overlay'
    const box=d.createElement('div')
    box.className='modal'
    box.innerHTML=`<p class="text-base leading-snug">${escapeHTML(message)}</p>
      <p class="text-xs text-slate-500 mt-2">Поддержка: <a class="underline" href="https://t.me/tatarinovkg" target="_blank">https://t.me/tatarinovkg</a></p>`
    overlay.appendChild(box)
    d.body.appendChild(overlay)
    setTimeout(()=>{ try{d.body.removeChild(overlay)}catch{} }, duration)
  }
  function showConfirm(message){
    return new Promise(resolve=>{
      const overlay=d.createElement('div')
      overlay.className='modal-overlay'
      const box=d.createElement('div')
      box.className='modal'
      box.innerHTML=`<p class="text-base leading-snug mb-3">${escapeHTML(message)}</p>
        <div class="grid grid-cols-1 gap-2">
          <button id="cfmYes" class="px-4 py-2 rounded-lg bg-green-500 text-white">Да</button>
          <button id="cfmNo" class="px-4 py-2 rounded-lg bg-red-500 text-white">Нет</button>
        </div>`
      overlay.appendChild(box)
      d.body.appendChild(overlay)
      box.querySelector('#cfmYes').onclick=()=>{ resolve(true); d.body.removeChild(overlay) }
      box.querySelector('#cfmNo').onclick=()=>{ resolve(false); d.body.removeChild(overlay) }
    })
  }
  function escapeHTML(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;') }
  function setThemeIcon(){
    const isDark=d.documentElement.classList.contains('dark')
    const el=d.getElementById('themeIcon')
    if(el) el.textContent = isDark ? '☀️' : '🌙'
  }
  function toggleTheme(){
    const isDark=!d.documentElement.classList.contains('dark')
    d.documentElement.classList.toggle('dark', isDark)
    try{ localStorage.setItem('theme', isDark ? 'dark' : 'light') }catch{}
    setThemeIcon()
  }
  function bootTheme(){
    try{
      const saved=localStorage.getItem('theme')
      const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark = saved ? saved==='dark' : preferDark
      d.documentElement.classList.toggle('dark', isDark)
    }catch{}
    setThemeIcon()
  }
  d.addEventListener('DOMContentLoaded',()=>{
    bootTheme()
    const btn=d.getElementById('themeToggle')
    if(btn) btn.onclick=toggleTheme
  })
  window.UI={ showToast, showConfirm, escapeHTML }
})();
