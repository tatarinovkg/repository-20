(function(){
  const d=document
  const api='https://bot.ovimex72.ru/api/'
  function byId(id){ return d.getElementById(id) }
  function hideLoader(){ const el=byId('loader'); if(el) el.style.display='none' }
  function renderError(title,sub){
    byId('root').innerHTML = `<div class="text-center py-10">
      <h2 class="text-2xl font-bold mb-2">${UI.escapeHTML(title)}</h2>
      <p class="text-slate-500">${UI.escapeHTML(sub||'')}</p>
      <p class="text-xs mt-4"><a class="underline" href="https://t.me/tatarinovkg" target="_blank">Поддержка</a></p>
    </div>`
  }
  async function deleteReview(feedbackID, itemElement){
    const confirmed = await UI.showConfirm('Вы действительно хотите удалить отзыв?')
    if(!confirmed) return
    try{
      const r = await fetch(api+'deleteReview', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ feedbackID })
      })
      if(!r.ok) throw new Error('Ошибка удаления')
      const data = await r.json()
      if(data && data.success){
        if(itemElement && itemElement.parentNode){ itemElement.parentNode.removeChild(itemElement) }
        UI.showToast('Отзыв успешно удалён', 2000)
      }else{
        UI.showToast('Ошибка: ' + (data.error || 'неизвестная ошибка'), 3000)
      }
    }catch(e){
      UI.showToast('Ошибка удаления отзыва', 3000)
    }
  }
  function sectionTitle(text){
    return `<h3 class="text-lg font-semibold text-brand mt-6 mb-2">${UI.escapeHTML(text)}</h3>`
  }
  function kv(label, value){
    if(!value) return ''
    return `<p class="text-sm"><span class="font-medium">${UI.escapeHTML(label)}:</span> ${UI.escapeHTML(String(value))}</p>`
  }
  function render(app, user, data){
    const parts=[]
    parts.push(`<div class="mb-4"><div class="text-xl font-bold">${UI.escapeHTML(user.first_name||'Пользователь')}</div><div class="text-slate-500 text-sm">UID: ${UI.escapeHTML(String(user.id||''))}</div><p class="mt-2 text-sm">Добро пожаловать! Здесь вы можете просматривать информацию о ваших услугах и отзывах.</p></div>`)
    parts.push(sectionTitle('Опубликованные услуги'))
    if(Array.isArray(data.publishedServices) && data.publishedServices.length){
      data.publishedServices.forEach(s=>{
        parts.push(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 py-3 shadow-soft fade-in">
          <div class="font-medium mb-1">Краткое описание услуги: ${UI.escapeHTML(s.shortDescription||'')}</div>
          ${kv('Полное описание услуги', s.service||'')}
          ${kv('Контактное лицо', s.contactPerson||'')}
          ${kv('Контакты', s.contacts||'')}
        </div>`)
      })
    }else{
      parts.push(`<p class="text-sm text-slate-500">Опубликованных услуг не найдено.</p>`)
    }
    parts.push(sectionTitle('Неопубликованные услуги'))
    if(Array.isArray(data.unpublishedServices) && data.unpublishedServices.length){
      data.unpublishedServices.forEach(s=>{
        parts.push(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 py-3 shadow-soft fade-in">
          <div class="font-medium mb-1">Краткое описание услуги: ${UI.escapeHTML(s.shortDescription||'')}</div>
          ${kv('Полное описание услуги', s.service||'')}
          ${kv('Контактное лицо', s.contactPerson||'')}
          ${kv('Контакты', s.contacts||'')}
          ${kv('Желаемая группа', s.group_name||'')}
        </div>`)
      })
    }else{
      parts.push(`<p class="text-sm text-slate-500">Неопубликованных услуг не найдено.</p>`)
    }
    parts.push(sectionTitle('Опубликованные отзывы'))
    if(Array.isArray(data.publishedReviews) && data.publishedReviews.length){
      data.publishedReviews.forEach(r=>{
        const id = r.feedbackID
        parts.push(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 py-3 shadow-soft fade-in" data-review-id="${UI.escapeHTML(String(id))}">
          <div class="font-medium mb-1">${UI.escapeHTML(r.feedbackText || 'Текст отзыва отсутствует')}</div>
          ${kv('Оценка', r.feedbackRating || '—')}
          ${kv('Краткое описание оцениваемой услуги', r.shortDescription)}
          ${kv('Контактное лицо (услуги)', r.contactPerson)}
          <div class="mt-2">
            <button class="w-full px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600" data-role="delete" data-id="${UI.escapeHTML(String(id))}">Удалить отзыв</button>
          </div>
        </div>`)
      })
    }else{
      parts.push(`<p class="text-sm text-slate-500">Опубликованных отзывов не найдено.</p>`)
    }
    parts.push(sectionTitle('Неопубликованные отзывы'))
    if(Array.isArray(data.unpublishedReviews) && data.unpublishedReviews.length){
      data.unpublishedReviews.forEach(r=>{
        parts.push(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 py-3 shadow-soft fade-in">
          <div class="font-medium mb-1">${UI.escapeHTML(r.feedbackText || 'Текст отзыва отсутствует')}</div>
          ${kv('Оценка', r.feedbackRating || '—')}
          ${kv('Краткое описание оцениваемой услуги', r.shortDescription)}
          ${kv('Контактное лицо (услуги)', r.contactPerson)}
        </div>`)
      })
    }else{
      parts.push(`<p class="text-sm text-slate-500">Неопубликованных отзывов не найдено.</p>`)
    }
    app.innerHTML = parts.join('')
    app.addEventListener('click', async (e)=>{
      const t=e.target
      if(t && t.matches('button[data-role="delete"]')){
        const id = Number(t.getAttribute('data-id'))
        const card = t.closest('[data-review-id]')
        await deleteReview(id, card)
      }
    })
  }
  d.addEventListener('DOMContentLoaded', async()=>{
    const tg = window.Telegram ? window.Telegram.WebApp : null
    const appRoot = byId('root')
    if(!tg || !tg.initDataUnsafe || !tg.initDataUnsafe.user){
      byId('loader').style.display='none'
      renderError('Ошибка', 'Откройте приложение через Telegram.')
      return
    }
    try{
      tg.ready(); tg.expand()
      try{
        tg.MainButton.setParams({ text:'Закрыть приложение' })
        tg.MainButton.onClick(()=> tg.close())
        tg.MainButton.show()
      }catch{}
    }catch{}
    const user = tg.initDataUnsafe.user
    try{
      const r = await fetch(api+'getUserData', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ userId: user.id })
      })
      if(!r.ok) throw new Error('Ошибка загрузки данных')
      const data = await r.json()
      render(appRoot, user, data)
    }catch(e){
      renderError('Ошибка', 'Не удалось загрузить данные. Попробуйте позже.')
    }finally{
      hideLoader()
    }
  })
})();
