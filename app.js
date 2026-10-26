(() => {
  'use strict';

  const STORAGE_KEY = 'aniclip.projects.v1';
  const ACTIVE_KEY = 'aniclip.activeProject.v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const uid = () => (crypto && crypto.randomUUID ? crypto.randomUUID() : 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
  const safe = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let projects = readProjects();
  let activeProjectId = localStorage.getItem(ACTIVE_KEY) || '';
  let currentView = 'home';
  let activePlanKey = 'individual:0';
  let toastTimer;
  let pendingConfirm = null;

  const storyTemplates = {
    'Character Awakening': [
      ['The Fall', 'The moment everything changes.', 'BRO SURVIVED THE IMPOSSIBLE 💀'],
      ['No Way Out', 'Show the pressure, danger, or impossible odds.', 'NO ONE WAS COMING TO SAVE HIM.'],
      ['The Turning Point', 'Build toward the moment the character changes.', 'PAIN BUILT A DIFFERENT BEAST.'],
      ['The Awakening', 'Use a verified reveal or power-up moment.', 'THIS IS WHERE IT ALL CHANGED.'],
      ['The Payoff', 'End on a clear, memorable visual beat.', 'NEVER UNDERESTIMATE THE SURVIVOR.']
    ],
    'Origin Story': [
      ['The Beginning', 'Introduce the character and their world.', 'EVERY LEGEND STARTS SOMEWHERE.'],
      ['The Struggle', 'Show the obstacle that shaped them.', 'THEY COUNTED HIM OUT.'],
      ['The Choice', 'Highlight a decision or turning point.', 'HE HAD ONE CHOICE LEFT.'],
      ['The Change', 'Show a verified moment of growth.', 'THAT DAY CHANGED EVERYTHING.'],
      ['The Legacy', 'Close on the character they become.', 'REMEMBER THE NAME.']
    ],
    'Betrayal & Revenge': [
      ['The Trust', 'Establish what the character believed or protected.', 'HE TRUSTED THE WRONG PEOPLE.'],
      ['The Betrayal', 'Use a verified betrayal scene if available.', 'THEY NEVER SAW THIS COMING.'],
      ['The Aftermath', 'Show the consequence without inventing context.', 'LEFT WITH NOTHING.'],
      ['The Comeback', 'Build toward a verified growth or confrontation.', 'HE CAME BACK DIFFERENT.'],
      ['The Payoff', 'Close with a grounded, story-relevant moment.', 'NOW THE TABLES HAVE TURNED.']
    ],
    'Strongest Moments': [
      ['The Setup', 'Establish the challenge or opponent.', 'THEY THOUGHT HE WAS DONE.'],
      ['The Pressure', 'Build tension before the peak.', 'BIG MISTAKE.'],
      ['The Switch', 'Show the shift in momentum.', 'HE WAS HOLDING BACK.'],
      ['The Peak', 'Use a verified strongest moment.', 'BRO IS ON ANOTHER LEVEL.'],
      ['The Stamp', 'Finish with a clear final image.', 'THAT AURA IS UNREAL.']
    ],
    'Emotional Story': [
      ['The Bond', 'Introduce a relationship or emotional stake.', 'THIS MEANT EVERYTHING TO HIM.'],
      ['The Memory', 'Show a verified meaningful memory or connection.', 'HE NEVER FORGOT.'],
      ['The Loss', 'Build the emotional turning point carefully.', 'SOME WOUNDS NEVER HEAL.'],
      ['The Choice', 'Show the character responding to the moment.', 'HE HAD TO KEEP GOING.'],
      ['The Echo', 'End on a resonant, story-supported image.', 'SOMEONE WILL ALWAYS REMEMBER.']
    ],
    'Full Character Journey': [
      ['The Beginning', 'Introduce the character at the start of their journey.', 'THIS IS WHERE IT STARTED.'],
      ['The Obstacle', 'Show a defining struggle.', 'THE ROAD WAS NEVER EASY.'],
      ['The Turning Point', 'Show a verified decision or discovery.', 'EVERYTHING CHANGED HERE.'],
      ['The Transformation', 'Show the visible or emotional change.', 'BUILT THROUGH EVERY LOSS.'],
      ['The Payoff', 'Close with a moment that reflects the journey.', 'LOOK HOW FAR HE CAME.']
    ]
  };

  function readProjects() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  }
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      if (activeProjectId) localStorage.setItem(ACTIVE_KEY, activeProjectId);
      else localStorage.removeItem(ACTIVE_KEY);
      renderHome();
      renderProjects();
      return true;
    } catch (error) {
      showToast('Could not save. Export a backup or free browser storage.');
      return false;
    }
  }
  function normalizeOutputMode(mode) { return ['separate', 'combined', 'both'].includes(mode) ? mode : 'both'; }
  function isYouTubeUrl(value) {
    try {
      const url = new URL(String(value || '').trim());
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
      const host = url.hostname.toLowerCase().replace(/^www\\./, '');
      if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean).length >= 1;
      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
        return Boolean(url.searchParams.get('v')) || /^\\/(shorts|embed|live)\\/[^/]+/.test(url.pathname);
      }
      return false;
    } catch (_) { return false; }
  }
  function activeProject() { return projects.find(project => project.id === activeProjectId) || null; }
  function allPlans(project) {
    if (!project) return [];
    return [
      ...(project.individualPlans || []).map((plan, index) => ({key:'individual:' + index, type:'individual', index, plan})),
      ...(project.combinedPlan ? [{key:'combined', type:'combined', index:0, plan:project.combinedPlan}] : [])
    ];
  }
  function getPlan(project, key = activePlanKey) {
    if (!project) return null;
    if (key === 'combined') return project.combinedPlan || null;
    const match = /^individual:(\d+)$/.exec(key);
    return match ? (project.individualPlans || [])[Number(match[1])] || null : null;
  }
  function setPlan(project, key, plan) {
    if (key === 'combined') project.combinedPlan = plan;
    else {
      const match = /^individual:(\d+)$/.exec(key);
      if (match) project.individualPlans[Number(match[1])] = plan;
    }
  }
  function getPlanLabel(project, key) {
    if (key === 'combined') return 'Combined video';
    const match = /^individual:(\d+)$/.exec(key);
    const index = match ? Number(match[1]) : 0;
    return (project.characters || [project.characterName])[index] || project.characterName || 'Character';
  }
  function makeSegments(storyType, duration, characterName, count = null) {
    const templates = storyTemplates[storyType] || storyTemplates['Character Awakening'];
    const n = count || (duration <= 15 ? 3 : duration <= 20 ? 4 : 5);
    const selected = templates.slice(0, n);
    const each = Math.floor(duration / n);
    let remainder = duration - each * n;
    return selected.map((template, index) => ({
      id: uid(), title: template[0], narrative: template[1], overlay: template[2],
      duration: each + (remainder-- > 0 ? 1 : 0), sourceUrl: '', sourceStatus: 'Unverified',
      timestamp: '', notes: '', character: characterName, order: index + 1
    }));
  }
  function makeProject(form) {
    const characters = [...new Set(form.characters.map(name => name.trim()).filter(Boolean))].slice(0, 5);
    if (!characters.length) characters.push(form.characterName);
    if (!characters.includes(form.characterName)) characters.unshift(form.characterName);
    const normalizedCharacters = characters.slice(0, 5);
    const individualPlans = normalizedCharacters.map(character => ({
      character, duration: form.duration, segments: makeSegments(form.storyType, form.duration, character)
    }));
    const combinedCount = Math.min(normalizedCharacters.length, 5);
    const combinedSegments = makeSegments(form.storyType, form.duration, normalizedCharacters[0], combinedCount);
    combinedSegments.forEach((segment, index) => {
      segment.character = normalizedCharacters[index % normalizedCharacters.length];
      segment.title = segment.character + ' · ' + segment.title;
      segment.narrative = 'Character focus: ' + segment.character + '. ' + segment.narrative;
    });
    const now = new Date().toISOString();
    return {
      schemaVersion: 'ANICLIP Project v1',
      id: uid(), name: form.name, animeTitle: form.animeTitle, characterName: form.characterName,
      characters: normalizedCharacters, storyType: form.storyType, notes: form.notes,
      outputMode: form.outputMode, duration: form.duration, aspectRatio: form.aspectRatio,
      resolution: '1080p target', hook: 'BRO SURVIVED THE IMPOSSIBLE 💀',
      individualPlans, combinedPlan: {character: 'Multi-character', duration: form.duration, segments: combinedSegments},
      status: 'Draft', renderStatus: 'Not rendered', createdAt: now, updatedAt: now
    };
  }
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  function navigate(view) {
    if (!$('#view-' + view)) view = 'home';
    currentView = view;
    $$('.view').forEach(element => element.classList.toggle('active', element.id === 'view-' + view));
    $$('.nav-item[data-view]').forEach(element => element.classList.toggle('active', element.dataset.view === view));
    const labels = {home:'Overview', create:'Create project', story:'Story Builder', sources:'Source review', projects:'My projects', settings:'Settings'};
    $('#pageCrumb').textContent = labels[view] || 'Overview';
    $('#sidebar').classList.remove('open');
    if (view === 'home') renderHome();
    if (view === 'story') renderStory();
    if (view === 'sources') renderSources();
    if (view === 'projects') renderProjects();
    window.scrollTo({top:0, behavior:'smooth'});
  }
  function renderHome() {
    $('#statProjects').textContent = projects.length;
    $('#statSegments').textContent = projects.reduce((sum, project) => sum + allPlans(project).reduce((total, item) => total + (item.plan.segments || []).length, 0), 0);
    const recent = [...projects].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0,3);
    const root = $('#recentProjects');
    if (!recent.length) {
      root.innerHTML = '<div class="empty-state"><span>▣</span><strong>No projects yet</strong><p>Create your first anime story project to see it here.</p></div>';
      return;
    }
    root.innerHTML = recent.map(project => `<div class="project-row"><div class="project-avatar">AN</div><div class="project-row-copy"><strong>${safe(project.name)}</strong><small>${safe(project.animeTitle)} · ${safe(project.storyType)} · Updated ${safe(formatDate(project.updatedAt))}</small></div><span class="status-chip status-draft">${safe(project.status || 'Draft')}</span><div class="project-row-actions"><button class="small-button" data-open-project="${safe(project.id)}">Open story →</button></div></div>`).join('');
  }
  function renderProjects() {
    const root = $('#projectsList');
    const query = ($('#projectSearch')?.value || '').trim().toLowerCase();
    const list = [...projects].filter(project => [project.name, project.animeTitle, project.characterName, ...(project.characters || [])].join(' ').toLowerCase().includes(query)).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    if (!list.length) {
      root.innerHTML = '<div class="empty-state"><span>▣</span><strong>' + (query ? 'No matching projects' : 'Your library is empty') + '</strong><p>' + (query ? 'Try a different search term.' : 'Create a project, then save or export it here.') + '</p></div>';
      return;
    }
    root.innerHTML = list.map(project => `<div class="project-row"><div class="project-avatar">AN</div><div class="project-row-copy"><strong>${safe(project.name)}</strong><small>${safe(project.animeTitle)} · ${safe((project.characters || []).length)} characters · ${safe(project.outputMode)} · ${safe(formatDate(project.updatedAt))}</small></div><span class="status-chip ${project.status === 'Story Ready' ? 'status-ready' : 'status-draft'}">${safe(project.status || 'Draft')}</span><div class="project-row-actions"><button class="small-button" data-open-project="${safe(project.id)}">Open</button><button class="small-button" data-export-project="${safe(project.id)}">Export</button><button class="small-button" data-delete-project="${safe(project.id)}">Delete</button></div></div>`).join('');
  }
  function formatDate(value) {
    try { return new Intl.DateTimeFormat(undefined, {month:'short', day:'numeric'}).format(new Date(value)); }
    catch (_) { return 'recently'; }
  }
  function openProject(id) {
    if (!projects.some(project => project.id === id)) return;
    activeProjectId = id;
    const project = activeProject();
    activePlanKey = project.outputMode === 'combined' ? 'combined' : 'individual:0';
    persist();
    navigate('story');
  }
  function renderStory() {
    const project = activeProject();
    $('#noStory').hidden = Boolean(project);
    $('#storyWorkspace').hidden = !project;
    if (!project) return;
    project.outputMode = normalizeOutputMode(project.outputMode);
    $('#storyPageTitle').textContent = project.name || 'Your story, your cut.';
    $('#storyPageDescription').textContent = project.animeTitle + ' · ' + project.characters.length + ' character(s) · editable starter storyboard';
    $('#summaryAnime').textContent = project.animeTitle.toUpperCase();
    $('#summaryTitle').textContent = project.name;
    $('#summaryMeta').textContent = project.characters.join(', ') + ' · ' + project.storyType + ' · ' + project.duration + ' seconds';
    $('#summaryStatus').textContent = project.status || 'DRAFT';
    $('#hookText').value = project.hook || '';
    $('#storyDuration').value = String(project.duration);
    $('#storyRatio').value = project.aspectRatio || '9:16';
    $('#storyResolution').value = project.resolution || '1080p target';
    $$('#modeSwitch button').forEach(button => button.classList.toggle('selected', button.dataset.mode === project.outputMode));
    renderPlanCards(project);
    renderActiveTimeline(project);
    const plan = getPlan(project, activePlanKey);
    const sourceCount = plan ? plan.segments.filter(segment => segment.sourceUrl && segment.sourceStatus !== 'Unverified').length : 0;
    $('#sourceReadiness').textContent = sourceCount ? sourceCount + ' reviewed' : 'Not reviewed';
  }
  function renderPlanCards(project) {
    const cards = [];
    if (project.outputMode !== 'combined') {
      (project.individualPlans || []).forEach((plan, index) => {
        cards.push({key:'individual:' + index, icon:'▣', title:plan.character, description:project.duration + 's individual video · ' + plan.segments.length + ' story beats', kind:'Individual'});
      });
    }
    if (project.outputMode !== 'separate') {
      cards.push({key:'combined', icon:'◈', title:'Combined character story', description:project.duration + 's total · ' + project.characters.length + ' characters in one sequence', kind:'Combined'});
    }
    if (!cards.some(card => card.key === activePlanKey)) activePlanKey = cards[0]?.key || 'individual:0';
    $('#outputPlanCards').innerHTML = cards.map(card => `<button class="output-plan-card" data-select-plan="${safe(card.key)}" style="text-align:left;color:inherit;cursor:pointer;border-color:${card.key === activePlanKey ? '#657e45' : ''}"><span class="plan-icon">${card.icon}</span><span><strong>${safe(card.title)}</strong><p>${safe(card.description)}</p><span class="tag ${card.key === activePlanKey ? 'tag-lime' : ''}">${card.key === activePlanKey ? 'EDITING THIS PLAN' : card.kind.toUpperCase()}</span></span></button>`).join('');
  }
  function renderActiveTimeline(project) {
    const plan = getPlan(project, activePlanKey);
    if (!plan) return;
    const segments = plan.segments || [];
    const total = segments.reduce((sum, segment) => sum + Number(segment.duration || 0), 0);
    $('#totalTime').textContent = total + 's planned';
    $('#timelineRuler').innerHTML = Array.from({length:Math.max(2, Math.min(7, total + 1))}, (_, index, array) => '<span>' + Math.round(index * total / (array.length - 1)) + 's</span>').join('');
    $('#segmentsList').innerHTML = segments.map((segment, index) => `<article class="segment-card" data-segment-id="${safe(segment.id)}"><div class="segment-head"><span class="segment-index">${String(index+1).padStart(2,'0')}</span><div class="segment-head-copy"><strong>${safe(segment.title)}</strong><small>${safe(segment.character || plan.character || project.characterName)} · ${Number(segment.duration) || 0}s planned · ${safe(segment.sourceStatus || 'Unverified')}</small></div><button class="segment-remove" data-remove-segment="${safe(segment.id)}" aria-label="Remove segment">×</button></div><div class="segment-fields"><label class="field"><span>Story beat</span><input data-segment-field="title" value="${safe(segment.title)}" maxlength="90"></label><label class="field"><span>Duration (sec)</span><input data-segment-field="duration" type="number" min="1" max="${project.duration}" value="${Number(segment.duration) || 1}"></label><label class="field"><span>Narrative purpose</span><textarea data-segment-field="narrative" rows="2">${safe(segment.narrative)}</textarea></label><label class="field"><span>English overlay</span><input data-segment-field="overlay" value="${safe(segment.overlay)}" maxlength="100"></label></div></article>`).join('');
    $('#hookText').value = project.hook || '';
  }
  function saveActivePlanFromUI() {
    const project = activeProject();
    if (!project) return false;
    const plan = getPlan(project, activePlanKey);
    if (!plan) return false;
    const cards = $$('.segment-card');
    cards.forEach(card => {
      const segment = plan.segments.find(item => item.id === card.dataset.segmentId);
      if (!segment) return;
      $$('[data-segment-field]', card).forEach(field => {
        const key = field.dataset.segmentField;
        segment[key] = key === 'duration' ? Math.max(1, Math.min(project.duration, Number(field.value) || 1)) : field.value.trim();
      });
    });
    project.duration = Number($('#storyDuration').value) || project.duration;
    project.outputMode = normalizeOutputMode(project.outputMode);
    rebalance(plan.segments, project.duration);
    plan.duration = project.duration;
    project.hook = $('#hookText').value.trim();
    project.aspectRatio = $('#storyRatio').value;
    project.resolution = $('#storyResolution').value;
    project.updatedAt = new Date().toISOString();
    project.status = 'Story Ready';
    return persist();
  }
  function renderSources() {
    const project = activeProject();
    $('#sourcesEmpty').hidden = Boolean(project);
    $('#sourcesWorkspace').hidden = !project;
    if (!project) return;
    const plan = getPlan(project, activePlanKey) || getPlan(project, 'individual:0');
    if (!plan) return;
    $('#sourceCards').innerHTML = plan.segments.map((segment, index) => `<article class="source-card" data-source-id="${safe(segment.id)}"><div class="source-card-header"><span class="segment-index">${String(index+1).padStart(2,'0')}</span><div><strong>${safe(segment.title)}</strong><small>${safe(segment.character || plan.character || project.characterName)} · ${Number(segment.duration) || 0}s planned</small></div><span class="status-chip status-draft">${safe(segment.sourceStatus || 'Unverified')}</span></div><div class="source-card-grid"><label class="field"><span>Candidate source URL</span><input data-source-field="sourceUrl" type="url" placeholder="https://..." value="${safe(segment.sourceUrl)}"></label><label class="field"><span>Verification status</span><select data-source-field="sourceStatus">${['Unverified','Candidate Found','Details Verified','Timestamp Verified','Media Available','Usage Reviewed','Render Ready','Unavailable'].map(status => '<option' + (segment.sourceStatus === status ? ' selected' : '') + '>' + status + '</option>').join('')}</select></label><label class="field"><span>Timestamp / scene reference</span><input data-source-field="timestamp" placeholder="Only enter after checking the source" value="${safe(segment.timestamp || '')}"></label><label class="field"><span>Review notes</span><input data-source-field="notes" placeholder="What still needs checking?" value="${safe(segment.notes || '')}"></label></div><p class="source-help">A link does not prove media access, scene accuracy, timestamp accuracy, or usage rights. Verify each item yourself.</p></article>`).join('');
  }
  function saveSourceUI() {
    const invalidSource = $('.source-card [data-source-field="sourceUrl"]').find(field => field.value.trim() && !isYouTubeUrl(field.value));
    if (invalidSource) {
      invalidSource.focus();
      showToast('Beta v0.3 accepts YouTube links only (youtube.com or youtu.be).');
      return;
    }
    const project = activeProject();
    if (!project) return;
    const plan = getPlan(project, activePlanKey) || getPlan(project, 'individual:0');
    if (!plan) return;
    $$('.source-card').forEach(card => {
      const segment = plan.segments.find(item => item.id === card.dataset.sourceId);
      if (!segment) return;
      $$('[data-source-field]', card).forEach(field => {
        segment[field.dataset.sourceField] = field.value.trim();
      });
      if (segment.sourceUrl && segment.sourceStatus === 'Unverified') segment.sourceStatus = 'Candidate Found';
    });
    project.updatedAt = new Date().toISOString();
    persist();
    renderSources();
    showToast('Source review saved locally.');
  }
  function exportProject(project) {
    if (!project) return showToast('No project to export yet.');
    downloadJson(project, slug(project.name || 'aniclip-project') + '.json');
    showToast('Project JSON exported.');
  }
  function exportAll() {
    downloadJson({schemaVersion:'ANICLIP Project Collection v1', exportedAt:new Date().toISOString(), projects}, 'aniclip-projects-backup.json');
    showToast('Project backup exported.');
  }
  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function slug(value) {
    return String(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70) || 'aniclip-project';
  }
  function confirmAction(title, message, actionLabel, callback) {
    const dialog = $('#confirmDialog');
    $('#dialogTitle').textContent = title;
    $('#dialogText').textContent = message;
    $('#dialogConfirm').textContent = actionLabel;
    pendingConfirm = callback;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else if (window.confirm(message)) { callback(); pendingConfirm = null; }
  }

  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-view]');
    if (nav) {
      event.preventDefault();
      if (nav.dataset.view === 'create' && nav.dataset.mode) $('#outputMode').value = nav.dataset.mode;
      navigate(nav.dataset.view);
      return;
    }
    const open = event.target.closest('[data-open-project]');
    if (open) { openProject(open.dataset.openProject); return; }
    const exportButton = event.target.closest('[data-export-project]');
    if (exportButton) { exportProject(projects.find(project => project.id === exportButton.dataset.exportProject)); return; }
    const deleteButton = event.target.closest('[data-delete-project]');
    if (deleteButton) {
      const project = projects.find(item => item.id === deleteButton.dataset.deleteProject);
      if (!project) return;
      confirmAction('Delete this project?', 'This removes "' + project.name + '" from this browser. Export a backup first if you need it.', 'Delete project', () => {
        projects = projects.filter(item => item.id !== project.id);
        if (activeProjectId === project.id) { activeProjectId = ''; activePlanKey = 'individual:0'; }
        persist(); renderStory(); renderSources(); showToast('Project deleted.');
      });
      return;
    }
    const planButton = event.target.closest('[data-select-plan]');
    if (planButton) {
      saveActivePlanFromUI();
      activePlanKey = planButton.dataset.selectPlan;
      renderStory();
      return;
    }
    const remove = event.target.closest('[data-remove-segment]');
    if (remove) {
      const project = activeProject(); const plan = getPlan(project, activePlanKey);
      if (!project || !plan) return;
      if (plan.segments.length <= 1) return showToast('Keep at least one story segment.');
      saveActivePlanFromUI();
      plan.segments = plan.segments.filter(segment => segment.id !== remove.dataset.removeSegment);
      plan.segments.forEach((segment, index) => segment.order = index + 1);
      rebalance(plan.segments, project.duration);
      project.updatedAt = new Date().toISOString();
      persist(); renderStory(); showToast('Segment removed.');
      return;
    }
  });


  $('#mobileMenu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  $('#topSettings').addEventListener('click', () => navigate('settings'));
  $('.notice-close')?.addEventListener('click', event => event.currentTarget.closest('.notice').remove());

  $('#projectForm').addEventListener('submit', event => {
    event.preventDefault();
    const charactersRaw = $('#characterList').value.split(/[\n,;]+/).map(name => name.trim()).filter(Boolean);
    const form = {
      name: $('#projectName').value.trim(), animeTitle: $('#animeTitle').value.trim(),
      characterName: $('#characterName').value.trim(), storyType: $('#storyType').value,
      duration: Number($('#duration').value), aspectRatio: $('#aspectRatio').value,
      outputMode: $('#outputMode').value, characters: charactersRaw, notes: $('#storyNotes').value.trim()
    };
    if (!form.name || !form.animeTitle || !form.characterName) return showToast('Fill in the required project fields.');
    if (!charactersRaw.includes(form.characterName)) form.characters.unshift(form.characterName);
    const project = makeProject(form);
    projects.unshift(project);
    activeProjectId = project.id;
    activePlanKey = form.outputMode === 'combined' ? 'combined' : 'individual:0';
    persist();
    navigate('story');
    showToast('Starter story created. Review every beat before use.');
  });

  $('#modeSwitch').addEventListener('click', event => {
    const button = event.target.closest('[data-mode]');
    if (!button) return;
    saveActivePlanFromUI();
    const project = activeProject();
    if (!project) return;
    project.outputMode = button.dataset.mode;
    activePlanKey = button.dataset.mode === 'combined' ? 'combined' : 'individual:0';
    project.updatedAt = new Date().toISOString();
    persist(); renderStory();
  });
  $('#hookText').addEventListener('change', () => { const project = activeProject(); if (project) { project.hook = $('#hookText').value.trim(); project.updatedAt = new Date().toISOString(); persist(); } });
  $('#saveStory').addEventListener('click', () => {
    const ok = saveActivePlanFromUI();
    renderStory();
    if (ok) showToast('Story changes saved locally.');
  });
  $('#storyDuration').addEventListener('change', () => {
    const project = activeProject(); if (!project) return;
    saveActivePlanFromUI();
    const newDuration = Number($('#storyDuration').value);
    const oldDuration = project.duration;
    project.duration = newDuration;
    project.individualPlans.forEach(plan => {
      plan.duration = newDuration;
      const templates = storyTemplates[project.storyType] || storyTemplates['Character Awakening'];
      if (plan.segments.length !== (newDuration <= 15 ? 3 : newDuration <= 20 ? 4 : 5)) {
        plan.segments = makeSegments(project.storyType, newDuration, plan.character);
      } else rebalance(plan.segments, newDuration);
    });
    project.combinedPlan.duration = newDuration;
    const combinedCount = Math.min(project.characters.length, 5);
    if (project.combinedPlan.segments.length !== combinedCount) {
      project.combinedPlan.segments = makeSegments(project.storyType, newDuration, project.characters[0], combinedCount);
      project.combinedPlan.segments.forEach((segment, index) => {
        segment.character = project.characters[index % project.characters.length];
        segment.title = segment.character + ' · ' + segment.title;
      });
    } else rebalance(project.combinedPlan.segments, newDuration);
    project.updatedAt = new Date().toISOString();
    persist(); renderStory();
    if (oldDuration !== newDuration) showToast('Planned timing updated. Review each segment.');
  });
  function rebalance(segments, duration) {
    if (!segments.length) return;
    const base = Math.floor(duration / segments.length);
    let extra = duration - base * segments.length;
    segments.forEach(segment => segment.duration = base + (extra-- > 0 ? 1 : 0));
  }
  $('#storyRatio').addEventListener('change', () => { const project = activeProject(); if (project) { project.aspectRatio = $('#storyRatio').value; project.updatedAt = new Date().toISOString(); persist(); showToast('Aspect ratio preference saved.'); } });
  $('#storyResolution').addEventListener('change', () => { const project = activeProject(); if (project) { project.resolution = $('#storyResolution').value; project.updatedAt = new Date().toISOString(); persist(); } });
  $('#addSegment').addEventListener('click', () => {
    const project = activeProject(); const plan = getPlan(project, activePlanKey);
    if (!project || !plan) return;
    saveActivePlanFromUI();
    plan.segments.push({id:uid(),title:'New story beat',narrative:'Describe the role this moment plays in the story.',overlay:'ADD YOUR OVERLAY',duration:1,sourceUrl:'',sourceStatus:'Unverified',timestamp:'',notes:'',character:plan.character || project.characterName,order:plan.segments.length+1});
    rebalance(plan.segments, project.duration);
    project.updatedAt = new Date().toISOString(); persist(); renderStory(); showToast('Segment added. Update timing to fit your target.');
  });
  $('#exportProjectTop').addEventListener('click', () => exportProject(activeProject()));
  $('#saveSources').addEventListener('click', saveSourceUI);
  $('#exportFromSources').addEventListener('click', () => { saveSourceUI(); exportProject(activeProject()); });
  $('#projectSearch').addEventListener('input', renderProjects);
  $('#importProject').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const incoming = Array.isArray(parsed.projects) ? parsed.projects : [parsed];
      const valid = incoming.filter(project => project && project.schemaVersion === 'ANICLIP Project v1' && project.name && project.id);
      valid.forEach(project => { project.outputMode = normalizeOutputMode(project.outputMode); });
      if (!valid.length) throw new Error('No valid ANICLIP project found.');
      valid.forEach(project => {
        if (projects.some(existing => existing.id === project.id)) project.id = uid();
        project.updatedAt = new Date().toISOString();
        projects.unshift(project);
      });
      activeProjectId = valid[0].id; activePlanKey = 'individual:0'; persist(); renderProjects(); showToast('Imported ' + valid.length + ' project(s).');
    } catch (error) { showToast('Import failed. Choose a valid ANICLIP project JSON.'); }
    event.target.value = '';
  });
  $('#exportAllProjects').addEventListener('click', exportAll);
  $('#clearProjects').addEventListener('click', () => confirmAction('Clear all local projects?', 'This permanently deletes all ANICLIP projects stored in this browser. Export a backup first.', 'Clear all', () => {
    projects = []; activeProjectId = ''; activePlanKey = 'individual:0'; persist(); renderStory(); renderSources(); renderProjects(); showToast('Local projects cleared.');
  }));
  $('#confirmDialog').addEventListener('close', () => {
    if ($('#confirmDialog').returnValue === 'confirm' && pendingConfirm) pendingConfirm();
    pendingConfirm = null;
  });
  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY) { projects = readProjects(); renderHome(); renderProjects(); renderStory(); }
  });

  // Demo mode intentionally uses local templates; no API requests or paid services are made.
  renderHome();
  renderProjects();
  if (activeProject() && activeProjectId) {
    activePlanKey = activeProject().outputMode === 'combined' ? 'combined' : 'individual:0';
  } else {
    activeProjectId = '';
    localStorage.removeItem(ACTIVE_KEY);
  }
})();