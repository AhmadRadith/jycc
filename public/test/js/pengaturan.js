const initPengaturanPage = () => {
  const api = async (url, options = {}) => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include',
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(data?.error || res.statusText);
      error.status = res.status;
      error.payload = data;
      throw error;
    }
    return data;
  };

  const renderSessions = (sessions, container) => {
    if (!container) return;
    container.innerHTML = '';
    if (!Array.isArray(sessions) || sessions.length === 0) {
      container.innerHTML = '<p class="text-sm text-slate-500 dark:text-gray-400">There are no other active sessions.</p>';
      return;
    }
    sessions.forEach((session) => {
      const item = document.createElement('div');
      item.className = 'flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition dark:border-white/10 dark:bg-gray-900/70 md:flex-row md:items-center md:justify-between';
      item.innerHTML = `
        <div>
          <p class="text-sm font-medium text-slate-900 dark:text-white">${session.device || 'Unknown device'}</p>
          <p class="text-xs text-slate-500 dark:text-gray-400">${session.ip || 'Unknown IP'}${session.lastSeen ? ' - ' + session.lastSeen : ''}</p>
        </div>
        <button class="mt-2 inline-flex items-center justify-center rounded-md bg-rose-500/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-500 md:mt-0" data-session-id="${session.id}">
          Sign out device
        </button>
      `;
      container.appendChild(item);
    });
  };

  const profileForm = document.forms.profile;
  const passwordForm = document.forms.password;
  const avatarForm = document.forms.avatar;
  const sessionsContainer = document.querySelector('[data-sessions-list]');
  const signOutAllBtn = document.querySelector('[data-signout-all]');
  const signOutCurrentBtn = document.querySelector('[data-signout-current]');
  const toast = document.querySelector('[data-toast]');

  const showToast = (message, intent = 'success') => {
    if (!toast) return;
    toast.textContent = message;
    toast.dataset.intent = intent;
    toast.classList.remove('hidden', 'opacity-0');
    toast.classList.add('opacity-100');
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.classList.add('hidden'), 250);
    }, 2500);
  };

  const loadProfile = async () => {
    try {
      const data = await api('/api/pengaturan/profile');
      const user = data?.user;
      if (!user || !profileForm) {
        return;
      }
      profileForm.elements.username.value = user.username || '';
      profileForm.elements.fullName.value = user.fullName || '';
      if (avatarForm) {
        if (avatarForm.elements.profileImage) {
          avatarForm.elements.profileImage.value = user.profileImage || '';
        }
        const preview = avatarForm.querySelector('[data-avatar-preview]');
        if (preview && user.profileImage) {
          preview.src = user.profileImage;
        }
      }
    } catch (err) {
      console.error('Unable to load profile', err);
      showToast('Failed to load profile information.', 'error');
    }
  };

  const handleSubmit = (form, { endpoint, method = 'POST', onSuccess }) => {
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector('[type=submit]');
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      submitBtn?.setAttribute('disabled', 'disabled');
      submitBtn?.classList.add('opacity-60');
      try {
        const data = await api(endpoint, {
          method,
          body: JSON.stringify(payload),
        });
        showToast('Changes saved successfully.');
        if (typeof onSuccess === 'function') {
          onSuccess(data);
        }
      } catch (err) {
        console.error('Failed request', err);
        showToast(err.message || 'Something went wrong.', 'error');
      } finally {
        submitBtn?.removeAttribute('disabled');
        submitBtn?.classList.remove('opacity-60');
      }
    });
  };

  handleSubmit(profileForm, {
    endpoint: '/api/pengaturan/profile',
    onSuccess: ({ user }) => {
      if (!profileForm || !user) return;
      profileForm.elements.username.value = user.username || '';
      profileForm.elements.fullName.value = user.fullName || '';
      loadProfile();
    },
  });

  handleSubmit(passwordForm, {
    endpoint: '/api/pengaturan/password',
  });

  handleSubmit(avatarForm, {
    endpoint: '/api/pengaturan/avatar',
    onSuccess: ({ user }) => {
      const preview = avatarForm?.querySelector('[data-avatar-preview]');
      if (preview && user?.profileImage) {
        preview.src = user.profileImage;
      }
      loadProfile();
    },
  });

  const refreshSessions = async () => {
    try {
      const data = await api('/api/pengaturan/sessions');
      renderSessions(data.sessions || [], sessionsContainer);
    } catch (err) {
      console.error('Unable to load sessions', err);
      renderSessions([], sessionsContainer);
      showToast('Failed to load active sessions.', 'error');
    }
  };

  sessionsContainer?.addEventListener('click', async (event) => {
    const target = event.target.closest('[data-session-id]');
    if (!target) return;
    const sessionId = target.dataset.sessionId;
    target.setAttribute('disabled', 'disabled');
    try {
      await api(`/api/pengaturan/sessions/${sessionId}`, { method: 'DELETE' });
      await refreshSessions();
      showToast('Session signed out.');
    } catch (err) {
      console.error('Unable to remove session', err);
      showToast('Failed to sign out session.', 'error');
    } finally {
      target.removeAttribute('disabled');
    }
  });

  signOutAllBtn?.addEventListener('click', async () => {
    signOutAllBtn.setAttribute('disabled', 'disabled');
    try {
      await api('/api/pengaturan/sessions', { method: 'DELETE' });
      await refreshSessions();
      showToast('All other sessions signed out.');
    } catch (err) {
      console.error('Unable to sign out all sessions', err);
      showToast('Failed to sign out sessions.', 'error');
    } finally {
      signOutAllBtn.removeAttribute('disabled');
    }
  });

  signOutCurrentBtn?.addEventListener('click', async () => {
    signOutCurrentBtn.setAttribute('disabled', 'disabled');
    try {
      await api('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Unable to sign out current device', err);
      showToast('Failed to sign out.', 'error');
    } finally {
      signOutCurrentBtn.removeAttribute('disabled');
    }
  });

  loadProfile();
  refreshSessions();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPengaturanPage, { once: true });
} else {
  initPengaturanPage();
}
