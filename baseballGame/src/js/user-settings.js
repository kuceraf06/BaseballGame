let menuOpen = false;
let settingsOpen = false;
let savedWindowModeBeforeModal = null;

let strikeZoneSwitch;
let saveSettingsBtn;
let saveCloseSettingsBtn;
let stopPitchKeyInput;
let stopPitchKey = 'Space';
let newStopPitchKey = null;

let swingKeyInput;
let swingKey = 'Space';
let newSwingKey = null;

let settingsToggleKeyInput;
let settingsToggleKey = 'Escape';
let newSettingsToggleKey = null;

let throwTo1BKeyInput;
let throwTo1BKey = '1';
let newThrowTo1BKey = null;

let throwTo2BKeyInput;
let throwTo2BKey = '2';
let newThrowTo2BKey = null;

let throwTo3BKeyInput;
let throwTo3BKey = '3';
let newThrowTo3BKey = null;

let unsavedChanges = false;

let volumeSlider;
let volumeIcon;
let globalVolume = 1.0;
let isMuted = false;

let lastVolume = globalVolume;
let savedVolumeBeforeModal;
let savedMutedBeforeModal;

let currentExitAction = null;

// Make sure keys are available on window as well so other scripts can read them:
// keep local let-s in sync with window.*
window.stopPitchKey = stopPitchKey;
window.swingKey = swingKey;
window.settingsToggleKey = settingsToggleKey;
window.throwTo1BKey = throwTo1BKey;
window.throwTo2BKey = throwTo2BKey;
window.throwTo3BKey = throwTo3BKey;

function normalizeKeyName(k) {
  if (k === undefined || k === null) return k;
  // normalize common variants (Space, spacebar, ' ' -> Space; Esc -> Escape)
  if (k === ' ' || k === 'Spacebar') return 'Space';
  if (k.toLowerCase && k.toLowerCase() === 'esc') return 'Escape';
  // Some browsers return 'Space' already, digits '1' etc. Keep as-is.
  return k;
}

function setKeyVar(name, value) {
  const v = normalizeKeyName(value);
  switch (name) {
    case 'stopPitchKey':
      stopPitchKey = v;
      window.stopPitchKey = v;
      break;
    case 'swingKey':
      swingKey = v;
      window.swingKey = v;
      break;
    case 'settingsToggleKey':
      settingsToggleKey = v;
      window.settingsToggleKey = v;
      break;
    case 'throwTo1BKey':
      throwTo1BKey = v;
      window.throwTo1BKey = v;
      break;
    case 'throwTo2BKey':
      throwTo2BKey = v;
      window.throwTo2BKey = v;
      break;
    case 'throwTo3BKey':
      throwTo3BKey = v;
      window.throwTo3BKey = v;
      break;
    default:
      // also set on window for unknown names
      window[name] = v;
  }
}

// Load saved keybindings and volume early so other modules get correct values immediately
(function loadSavedKeyBindings() {
  try {
    const mapping = {
      stopPitchKey,
      swingKey,
      settingsToggleKey,
      throwTo1BKey,
      throwTo2BKey,
      throwTo3BKey
    };

    ['stopPitchKey','swingKey','settingsToggleKey','throwTo1BKey','throwTo2BKey','throwTo3BKey'].forEach(k => {
      const saved = localStorage.getItem(k);
      const val = saved ? normalizeKeyName(saved) : normalizeKeyName(mapping[k]);
      setKeyVar(k, val);
    });

    const sv = localStorage.getItem('globalVolume');
    const sm = localStorage.getItem('isMuted');
    if (sv !== null) globalVolume = parseFloat(sv);
    if (sm !== null) isMuted = JSON.parse(sm);

    // Make sure sounds reflect saved settings (if allSounds exists)
    if (typeof applyVolumeSettings === 'function') applyVolumeSettings();

    // notify other modules that controls are available
    try {
      const ev = new CustomEvent('controls-updated', {
        detail: {
          stopPitchKey, swingKey, throwTo1BKey, throwTo2BKey, throwTo3BKey, settingsToggleKey
        }
      });
      window.dispatchEvent(ev);
    } catch (err) {}
  } catch (err) {
    // silent fail if localStorage not accessible
  }
})();

function applyVolumeSettings() {
  if (typeof allSounds === 'undefined') return;
  allSounds.forEach(sound => {
    sound.volume = isMuted ? 0 : globalVolume;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const menuLogo = document.querySelector('.menuLogo');
  const menuModal = document.getElementById('menuModal');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const closeMenuCross = document.getElementById('closeMenuCross');
  const menuSettingsBtn = document.querySelector('#menuModal .menuBtn:nth-child(3)');
  const exitAppBtn = document.getElementById('exitAppBtn');
  const settingsLogo = document.querySelector('.settingsLogo');
  const settingsModal = document.getElementById('settingsModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const userLogo = document.querySelector('.accountLogo');
  const userModal = document.getElementById('userModal');
  const closeUserModalBtn = document.getElementById('closeUserModal');
  const logoutBtn = document.getElementById('logoutBtn');

  const backToMenuBtn = document.getElementById('backToMenuBtn');
  const resetSettingsBtn = document.getElementById('resetSettings');

  const confirmCloseModal = document.getElementById('confirmCloseModal');
  const cancelCloseBtn = document.getElementById('cancelCloseBtn');
  const confirmCloseBtn = document.getElementById('confirmCloseBtn');

  const confirmExitModal = document.getElementById('confirmExitModal');
  const cancelExitBtn = document.getElementById('cancelExitBtn');
  const confirmExitBtn = document.getElementById('confirmExitBtn');
  const confirmExitText = confirmExitModal.querySelector('p');

  strikeZoneSwitch = document.getElementById('strikeZoneSwitch');
  saveSettingsBtn = document.getElementById('saveSettingsBtn');
  saveCloseSettingsBtn = document.getElementById('saveCloseSettingsBtn');
  stopPitchKeyInput = document.getElementById('stopPitchKeyInput');
  swingKeyInput = document.getElementById('swingKeyInput');
  settingsToggleKeyInput = document.getElementById('settingsToggleKeyInput');

  throwTo1BKeyInput = document.getElementById('throwTo1BKeyInput');
  throwTo2BKeyInput = document.getElementById('throwTo2BKeyInput');
  throwTo3BKeyInput = document.getElementById('throwTo3BKeyInput');

  volumeSlider = document.getElementById('volumeSlider');
  volumeIcon = document.getElementById('volumeIcon');

  function showConfirmExitModal(message, onConfirm) {
    confirmExitText.innerHTML = message;
    currentExitAction = onConfirm;
    confirmExitModal.style.display = 'flex';
  }

  // --- CANCEL BUTTON ---
  cancelExitBtn.onclick = () => {
    confirmExitModal.style.display = 'none';
    currentExitAction = null;
  };

  // --- CONFIRM BUTTON ---
  confirmExitBtn.onclick = () => {
    confirmExitModal.style.display = 'none';
    if (typeof currentExitAction === 'function') currentExitAction();
    currentExitAction = null;
  };

  // ========= MENU OVLÁDÁNÍ =========
  function openMenu() {
    menuModal.style.display = 'flex';
    menuOpen = true;
  }

  function closeMenu() {
    menuModal.style.display = 'none';
    menuOpen = false;
  }

  menuModal.addEventListener('click', e => {
    if (e.target === menuModal) closeMenu();
  });
  
  function toggleMenu() {
    if (menuOpen) closeMenu();
    else openMenu();
  }

  if (menuLogo) menuLogo.addEventListener('click', openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
  if (closeMenuCross) closeMenuCross.addEventListener('click', closeMenu);
  if (settingsLogo) {
    settingsLogo.addEventListener('click', () => {
      if (menuOpen) closeMenu();
      openSettings();
    });
  }

  if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', () => {
      settingsModal.style.display = 'none';
      settingsOpen = false;
      openMenu();
    });
  }

  // Tlačítko z menu otevře settings
  if (menuSettingsBtn) {
    menuSettingsBtn.addEventListener('click', () => {
      closeMenu();
      openSettings();
    });
  }

  function openUserModal() {
    if (menuOpen) closeMenu();
    if (settingsOpen) closeSettings();
  
    userModal.style.display = 'flex';
  }
  
  function closeUserModal() {
    userModal.style.display = 'none';
  }
  
  if (userLogo) userLogo.addEventListener('click', openUserModal);
  if (closeUserModalBtn) closeUserModalBtn.addEventListener('click', closeUserModal);
  
  userModal.addEventListener('click', e => {
    if (e.target === userModal) closeUserModal();
  });
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      closeUserModal();
      showConfirmExitModal(
        'Do you really want to logout? <br>Game progress will be lost.',
        () => {
          // --- LOGIKA ODHLÁŠENÍ ---
          logoutUser(); // smaže tokeny, proměnné, atd.

          // --- UKONČENÍ HRY ---
          try {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('app-quit');
          } catch (err) {
            console.warn('Electron IPC not available, fallback for browser mode');
            window.location.reload();
          }
        }
      );
    });
  }

  // ========= EXIT BUTTON (Electron) =========
  try {
    const { ipcRenderer } = require('electron');

    if (exitAppBtn) {
      exitAppBtn.addEventListener('click', () => {
        showConfirmExitModal(
          'The game is in progress. Exit now? <br>Game progress will be lost.',
          () => {
            try {
              const { ipcRenderer } = require('electron');
              ipcRenderer.send('app-quit');
            } catch (err) {
              console.warn('Electron IPC not available, fallback for browser mode');
              window.location.reload();
            }
          }
        );
      });
    }

    if (cancelExitBtn) {
      cancelExitBtn.addEventListener('click', () => {
        confirmExitModal.style.display = 'none';
      });
    }

    if (confirmExitBtn) {
      confirmExitBtn.addEventListener('click', () => {
        confirmExitModal.style.display = 'none';
        ipcRenderer.send('app-quit');
      });
    }
  } catch (err) {
    console.warn('Electron IPC not available (likely running in browser). Exit button disabled.');
  }

  try {
  const { ipcRenderer } = require('electron');

  const minimizeBtn = document.getElementById('minimizeBtn');
  const desktopBtn = document.getElementById('desktopBtn');
  const closeBtn = document.getElementById('closeBtn');

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
      ipcRenderer.send('window-minimize');
    });
  }

  if (desktopBtn) {
    const desktopIcon = desktopBtn.querySelector('i');
    let isFullscreen = true; // počáteční stav

    function updateFullscreenIcon() {
      if (isFullscreen) {
        desktopIcon.className = 'bx bx-exit-fullscreen'; // fullscreen aktivní
      } else {
        desktopIcon.className = 'bx bx-fullscreen'; // fullscreen vypnutý
      }
    }

    // kliknutí na tlačítko přepíná stav
    desktopBtn.addEventListener('click', () => {
      ipcRenderer.send('window-hide'); // main process přepne fullscreen/zmenšené

      isFullscreen = !isFullscreen; // přepnutí stavu
      updateFullscreenIcon();       // aktualizace ikony
    });

    // inicialní nastavení ikony
    updateFullscreenIcon();
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      ipcRenderer.send('window-close');
    });
  }

  } catch (err) {
    console.warn('Electron IPC not available. Window controls disabled.');
  }

  document.addEventListener('keydown', e => {
    const active = document.activeElement;
    if (
      active === stopPitchKeyInput ||
      active === swingKeyInput ||
      active === settingsToggleKeyInput ||
      active === throwTo1BKeyInput ||
      active === throwTo2BKeyInput ||
      active === throwTo3BKeyInput
    ) return;
  
    // blokace ESC při otevřených potvrzovacích modalech
    const confirmCloseVisible = document.getElementById('confirmCloseModal')?.style.display === 'flex';
    const confirmResetVisible = document.getElementById('confirmResetModal')?.style.display === 'flex';
    const confirmExitVisible = document.getElementById('confirmExitModal')?.style.display === 'flex';
    if (confirmCloseVisible || confirmResetVisible || confirmExitVisible) return;

    // normalize to respect custom binds
    const keyName = normalizeKeyName(e.key);

    if (keyName === settingsToggleKey) {
      // --- PRIORITA: pokud je otevřen profil hráče, zavři ho ---
      if (userModal && userModal.style.display === 'flex') {
        closeUserModal();
        return;
      }

      // --- POTOM: pokud je otevřeno settings, zavři je ---
      if (settingsOpen) {
        closeSettings();
        return;
      }

      // --- POTOM: toggle menu ---
      toggleMenu();
    }
  });
  
  if (resetSettingsBtn) {
    const confirmResetModal = document.getElementById('confirmResetModal');
    const cancelResetBtn = document.getElementById('cancelResetBtn');
    const confirmResetBtn = document.getElementById('confirmResetBtn');
  
    resetSettingsBtn.addEventListener('click', () => {
      confirmResetModal.style.display = 'flex';
    });
  
    cancelResetBtn.addEventListener('click', () => {
      confirmResetModal.style.display = 'none';
    });
  
    // IMPORTANT: change here so "Reset binds" does NOT immediately persist.
    // Instead we fill the inputs and set the temporary new* variables so the user must click "Save" to persist.
    confirmResetBtn.addEventListener('click', () => {
      confirmResetModal.style.display = 'none';

      // --- prepare defaults but DO NOT call setKeyVar or write to localStorage ---
      const defaults = {
        stopPitchKey: 'Space',
        swingKey: 'Space',
        throwTo1BKey: '1',
        throwTo2BKey: '2',
        throwTo3BKey: '3',
        settingsToggleKey: 'Escape'
      };

      // set the "new" variables so saveSettings() will persist them when user clicks Save
      newStopPitchKey = defaults.stopPitchKey;
      newSwingKey = defaults.swingKey;
      newThrowTo1BKey = defaults.throwTo1BKey;
      newThrowTo2BKey = defaults.throwTo2BKey;
      newThrowTo3BKey = defaults.throwTo3BKey;
      newSettingsToggleKey = defaults.settingsToggleKey;

      // update input fields to reflect the reset (visual only until Save)
      if (stopPitchKeyInput) stopPitchKeyInput.value = newStopPitchKey;
      if (swingKeyInput) swingKeyInput.value = newSwingKey;
      if (throwTo1BKeyInput) throwTo1BKeyInput.value = newThrowTo1BKey;
      if (throwTo2BKeyInput) throwTo2BKeyInput.value = newThrowTo2BKey;
      if (throwTo3BKeyInput) throwTo3BKeyInput.value = newThrowTo3BKey;
      if (settingsToggleKeyInput) settingsToggleKeyInput.value = newSettingsToggleKey;

      // mark unsaved so the user must press Save; closing will trigger the "unsaved changes" dialog
      unsavedChanges = true;
    });
  }  

  // ========= KEYBINDY =========
  function setupKeyInput(input, savedKeyName, defaultKey, onChange) {
    const saved = localStorage.getItem(savedKeyName);
    let keyVar = normalizeKeyName(saved || defaultKey);

    // ensure globals/window are updated at initialization
    setKeyVar(savedKeyName, keyVar);

    function displayKey(k) {
      if (!input) return;
      input.value = (k === ' ' ? 'Space' : (k === 'Space' ? 'Space' : k));
    }
    displayKey(keyVar);

    input.addEventListener('focus', () => { if (input) input.value = 'Press key'; });
    input.addEventListener('keydown', e => {
      e.preventDefault();
      // normalize captured key
      const rawKey = e.key;
      const newKey = normalizeKeyName(rawKey);
      onChange(newKey);
      displayKey(newKey);
      unsavedChanges = true;
      input.blur();
    });
    input.addEventListener('blur', () => {
      const fromOnChange = onChange();
      displayKey(fromOnChange || window[savedKeyName] || keyVar);
    });

    return { get: () => keyVar, set: k => { keyVar = normalizeKeyName(k); setKeyVar(savedKeyName, keyVar); } };
  }

  // Stop pitch
  if (stopPitchKeyInput) {
    setupKeyInput(stopPitchKeyInput, 'stopPitchKey', stopPitchKey, (v) => {
      if (v) newStopPitchKey = v;
      return newStopPitchKey ?? stopPitchKey;
    });
  }

  // Swing
  if (swingKeyInput) {
    setupKeyInput(swingKeyInput, 'swingKey', swingKey, (v) => {
      if (v) newSwingKey = v;
      return newSwingKey ?? swingKey;
    });
  }

  // Throw 1B
  if (throwTo1BKeyInput) {
    setupKeyInput(throwTo1BKeyInput, 'throwTo1BKey', throwTo1BKey, (v) => {
      if (v) newThrowTo1BKey = v;
      return newThrowTo1BKey ?? throwTo1BKey;
    });
  }

  // Throw 2B
  if (throwTo2BKeyInput) {
    setupKeyInput(throwTo2BKeyInput, 'throwTo2BKey', throwTo2BKey, (v) => {
      if (v) newThrowTo2BKey = v;
      return newThrowTo2BKey ?? throwTo2BKey;
    });
  }

  // Throw 3B
  if (throwTo3BKeyInput) {
    setupKeyInput(throwTo3BKeyInput, 'throwTo3BKey', throwTo3BKey, (v) => {
      if (v) newThrowTo3BKey = v;
      return newThrowTo3BKey ?? throwTo3BKey;
    });
  }

  // Settings toggle key (zatím neotvírá settings přes esc!)
  if (settingsToggleKeyInput) {
    setupKeyInput(settingsToggleKeyInput, 'settingsToggleKey', settingsToggleKey, (v) => {
      if (v) newSettingsToggleKey = v;
      return newSettingsToggleKey ?? settingsToggleKey;
    });
  }

  // ========= VOLUME =========
  const savedVolume = localStorage.getItem('globalVolume');
  const savedMuted = localStorage.getItem('isMuted');
  if (savedVolume !== null) globalVolume = parseFloat(savedVolume);
  if (savedMuted !== null) isMuted = JSON.parse(savedMuted);

  if (volumeSlider) {
    volumeSlider.value = globalVolume;
    volumeSlider.addEventListener('input', e => {
      globalVolume = parseFloat(e.target.value);
      if (globalVolume > 0) isMuted = false;
      applyVolumeSettings();
      updateVolumeIcon();
      unsavedChanges = true;
    });
  }

  if (volumeIcon) {
    updateVolumeIcon();
    volumeIcon.addEventListener('click', () => {
      isMuted = !isMuted;
      if (isMuted) {
        lastVolume = globalVolume > 0 ? globalVolume : lastVolume;
        globalVolume = 0;
        volumeSlider.value = 0;
      } else {
        globalVolume = lastVolume;
        volumeSlider.value = lastVolume;
      }
      applyVolumeSettings();
      updateVolumeIcon();
      unsavedChanges = true;
    });
  }

  function updateVolumeIcon() {
    if (!volumeIcon) return;
    if (isMuted || globalVolume === 0) {
      volumeIcon.classList.remove('bx-volume-full');
      volumeIcon.classList.add('bx-volume-mute');
    } else {
      volumeIcon.classList.remove('bx-volume-mute');
      volumeIcon.classList.add('bx-volume-full');
    }
  }

  // ========= SETTINGS MODAL =========
  async function openSettings() {
    settingsModal.style.display = 'flex';
    settingsOpen = true;
    savedVolumeBeforeModal = globalVolume;
    savedMutedBeforeModal = isMuted;

    try {
        const { ipcRenderer } = require('electron');
        savedWindowModeBeforeModal = await ipcRenderer.invoke('get-window-mode');
        
        // zde nastav aktuální hodnotu selectu
        const windowModeSelect = document.getElementById('windowModeSelect');
        if (windowModeSelect && savedWindowModeBeforeModal) {
            windowModeSelect.value = savedWindowModeBeforeModal;

            windowModeSelect.addEventListener('change', () => {
              unsavedChanges = true;
            });
        }
    } catch (err) {
        console.warn('Electron IPC not available for window mode save:', err);
        savedWindowModeBeforeModal = null;
    }

    if (typeof showHitZone !== 'undefined' && strikeZoneSwitch) strikeZoneSwitch.checked = !!showHitZone;
    unsavedChanges = false;
  }

  function closeSettings() {
    if (unsavedChanges) {
      confirmCloseModal.style.display = 'flex';
      return;
    }
    settingsModal.style.display = 'none';
    settingsOpen = false;
    newStopPitchKey = null;
    newSwingKey = null;
    newThrowTo1BKey = null;
    newThrowTo2BKey = null;
    newThrowTo3BKey = null;
    newSettingsToggleKey = null;
    unsavedChanges = false;
  }

  closeModalBtn.addEventListener('click', closeSettings);
  settingsModal.addEventListener('click', e => { if (e.target === settingsModal) closeSettings(); });
  if (strikeZoneSwitch) strikeZoneSwitch.addEventListener('change', () => unsavedChanges = true);

  if (cancelCloseBtn) cancelCloseBtn.addEventListener('click', () => confirmCloseModal.style.display = 'none');
  if (confirmCloseBtn) confirmCloseBtn.addEventListener('click', () => {
    // --- obnov keybindy z localStorage nebo původních proměnných ---
    setKeyVar('stopPitchKey', localStorage.getItem('stopPitchKey') || 'Space');
    setKeyVar('swingKey', localStorage.getItem('swingKey') || 'Space');
    setKeyVar('throwTo1BKey', localStorage.getItem('throwTo1BKey') || '1');
    setKeyVar('throwTo2BKey', localStorage.getItem('throwTo2BKey') || '2');
    setKeyVar('throwTo3BKey', localStorage.getItem('throwTo3BKey') || '3');
    setKeyVar('settingsToggleKey', localStorage.getItem('settingsToggleKey') || 'Escape');
  
    if (stopPitchKeyInput) stopPitchKeyInput.value = stopPitchKey;
    if (swingKeyInput) swingKeyInput.value = swingKey;
    if (throwTo1BKeyInput) throwTo1BKeyInput.value = throwTo1BKey;
    if (throwTo2BKeyInput) throwTo2BKeyInput.value = throwTo2BKey;
    if (throwTo3BKeyInput) throwTo3BKeyInput.value = throwTo3BKey;
    if (settingsToggleKeyInput) settingsToggleKeyInput.value = settingsToggleKey;

    try {
      const { ipcRenderer } = require('electron');
      if (savedWindowModeBeforeModal) {
        ipcRenderer.send('set-window-mode', { mode: savedWindowModeBeforeModal });
      }
    } catch (err) {
      console.warn('Electron IPC not available for restoring window mode:', err);
    }
  
    // --- reset všech nových dočasných kláves ---
    newStopPitchKey = null;
    newSwingKey = null;
    newThrowTo1BKey = null;
    newThrowTo2BKey = null;
    newThrowTo3BKey = null;
    newSettingsToggleKey = null;
  
    // --- zbytek původního kódu ---
    globalVolume = savedVolumeBeforeModal;
    isMuted = savedMutedBeforeModal;
    if (volumeSlider) volumeSlider.value = globalVolume;
    applyVolumeSettings();
    updateVolumeIcon();
    settingsModal.style.display = 'none';
    confirmCloseModal.style.display = 'none';
    settingsOpen = false;
    unsavedChanges = false;
  });

  function saveSettings() {
    if (typeof strikeZoneSwitch !== 'undefined') {
        showHitZone = !!strikeZoneSwitch.checked;
        localStorage.setItem('showHitZone', JSON.stringify(showHitZone));
    }
    if (newStopPitchKey !== null) { setKeyVar('stopPitchKey', newStopPitchKey); localStorage.setItem('stopPitchKey', stopPitchKey); newStopPitchKey = null; }
    if (newSwingKey !== null) { setKeyVar('swingKey', newSwingKey); localStorage.setItem('swingKey', swingKey); newSwingKey = null; }
    if (newThrowTo1BKey !== null) { setKeyVar('throwTo1BKey', newThrowTo1BKey); localStorage.setItem('throwTo1BKey', throwTo1BKey); newThrowTo1BKey = null; }
    if (newThrowTo2BKey !== null) { setKeyVar('throwTo2BKey', newThrowTo2BKey); localStorage.setItem('throwTo2BKey', throwTo2BKey); newThrowTo2BKey = null; }
    if (newThrowTo3BKey !== null) { setKeyVar('throwTo3BKey', newThrowTo3BKey); localStorage.setItem('throwTo3BKey', throwTo3BKey); newThrowTo3BKey = null; }
    if (newSettingsToggleKey !== null) { setKeyVar('settingsToggleKey', newSettingsToggleKey); localStorage.setItem('settingsToggleKey', settingsToggleKey); newSettingsToggleKey = null; }

    // also persist current keys in case nothing changed but they weren't in localStorage
    localStorage.setItem('stopPitchKey', stopPitchKey);
    localStorage.setItem('swingKey', swingKey);
    localStorage.setItem('throwTo1BKey', throwTo1BKey);
    localStorage.setItem('throwTo2BKey', throwTo2BKey);
    localStorage.setItem('throwTo3BKey', throwTo3BKey);
    localStorage.setItem('settingsToggleKey', settingsToggleKey);

    localStorage.setItem('globalVolume', globalVolume);
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
    applyVolumeSettings();

     try {
      const { ipcRenderer } = require('electron');
      const windowModeSelect = document.getElementById('windowModeSelect');
      if (windowModeSelect) {
        const selectedMode = windowModeSelect.value;
        ipcRenderer.send('set-window-mode', { mode: selectedMode });
      }
    } catch (err) {
      console.warn('Electron IPC not available for window mode control:', err);
    }

    // dispatch an event so other modules can react to key changes if they listen
    try {
      const ev = new CustomEvent('controls-updated', {
        detail: {
          stopPitchKey, swingKey, throwTo1BKey, throwTo2BKey, throwTo3BKey, settingsToggleKey
        }
      });
      window.dispatchEvent(ev);
    } catch (err) {}

    unsavedChanges = false;
  }

  if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);
  if (saveCloseSettingsBtn) saveCloseSettingsBtn.addEventListener('click', () => {
    saveSettings();
    settingsModal.style.display = 'none';
    settingsOpen = false;
  });

  const savedHitZone = localStorage.getItem('showHitZone');
  if (savedHitZone !== null) {
    try { showHitZone = JSON.parse(savedHitZone); } catch (err) {}
  }

  // ========= SWING ACTION =========
  // Normalize incoming key events before comparing so 'Space' works reliably
  document.addEventListener('keydown', e => {
    // If an input is focused, ignore (already guarded earlier when setting inputs)
    const active = document.activeElement;
    if (active === stopPitchKeyInput ||
        active === swingKeyInput ||
        active === settingsToggleKeyInput ||
        active === throwTo1BKeyInput ||
        active === throwTo2BKeyInput ||
        active === throwTo3BKeyInput) return;

    const keyName = normalizeKeyName(e.key);

    // swing action
    if (keyName === swingKey && !pickoffInProgress && gameState === 'offense' && ball.active) {
      if (typeof triggerSwing === 'function') triggerSwing();
    }

    // stop pitch action
    if (keyName === stopPitchKey) {
      if (typeof stopPitch === 'function') stopPitch();
    }

    // throw to bases - allow arbitrary binds (not just digits)
    if (keyName === throwTo1BKey) {
      if (typeof throwToBase === 'function') throwToBase(1);
      if (typeof pickoffTo1B === 'function') pickoffTo1B();
    }
    if (keyName === throwTo2BKey) {
      if (typeof throwToBase === 'function') throwToBase(2);
      if (typeof pickoffTo2B === 'function') pickoffTo2B();
    }
    if (keyName === throwTo3BKey) {
      if (typeof throwToBase === 'function') throwToBase(3);
      if (typeof pickoffTo3B === 'function') pickoffTo3B();
    }
  });

  applyVolumeSettings();
});