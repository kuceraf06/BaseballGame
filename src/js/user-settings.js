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

function applyVolumeSettings() {
  if (typeof allSounds === 'undefined') return;
  allSounds.forEach(sound => {
    sound.volume = isMuted ? 0 : globalVolume;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const settingsLogo = document.querySelector('.settingsLogo');
  const settingsModal = document.getElementById('settingsModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  const confirmCloseModal = document.getElementById('confirmCloseModal');
  const cancelCloseBtn = document.getElementById('cancelCloseBtn');
  const confirmCloseBtn = document.getElementById('confirmCloseBtn');

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

  if (!settingsLogo || !settingsModal) return;

  const savedStopKey = localStorage.getItem('stopPitchKey');
  if (savedStopKey) stopPitchKey = savedStopKey;
  if (stopPitchKeyInput) {
    function updateStopPitchInputDisplay(key) {
      stopPitchKeyInput.value = key === ' ' ? 'Space' : key;
    }
    updateStopPitchInputDisplay(stopPitchKey);
    stopPitchKeyInput.addEventListener('focus', () => stopPitchKeyInput.value = 'Press key');
    stopPitchKeyInput.addEventListener('keydown', e => {
      e.preventDefault();
      newStopPitchKey = e.key;
      updateStopPitchInputDisplay(newStopPitchKey);
      unsavedChanges = true;
      stopPitchKeyInput.blur();
    });
    stopPitchKeyInput.addEventListener('blur', () => updateStopPitchInputDisplay(newStopPitchKey ?? stopPitchKey));
  }

  const savedSwingKey = localStorage.getItem('swingKey');
  if (savedSwingKey) swingKey = savedSwingKey;
  if (swingKeyInput) {
    function updateSwingKeyInputDisplay(key) {
      swingKeyInput.value = key === ' ' ? 'Space' : key;
    }
    updateSwingKeyInputDisplay(swingKey);
    swingKeyInput.addEventListener('focus', () => swingKeyInput.value = 'Press key');
    swingKeyInput.addEventListener('keydown', e => {
      e.preventDefault();
      newSwingKey = e.key;
      updateSwingKeyInputDisplay(newSwingKey);
      unsavedChanges = true;
      swingKeyInput.blur();
    });
    swingKeyInput.addEventListener('blur', () => updateSwingKeyInputDisplay(newSwingKey ?? swingKey));
  }

  const savedthrowTo1BKeyKey = localStorage.getItem('throwTo1BKey');
  if (savedthrowTo1BKeyKey) throwTo1BKey = savedthrowTo1BKeyKey;
  if (throwTo1BKeyInput) {
    function updatethrowTo1BKeyInputDisplay(key) {
      throwTo1BKeyInput.value = key === ' ' ? '1' : key;
    }
    updatethrowTo1BKeyInputDisplay(throwTo1BKey);
    throwTo1BKeyInput.addEventListener('focus', () => throwTo1BKeyInput.value = 'Press key');
    throwTo1BKeyInput.addEventListener('keydown', e => {
      e.preventDefault();
      newThrowTo1BKey = e.key;
      updatethrowTo1BKeyInputDisplay(newThrowTo1BKey);
      unsavedChanges = true;
      throwTo1BKeyInput.blur();
    });
    throwTo1BKeyInput.addEventListener('blur', () => updatethrowTo1BKeyInputDisplay(newThrowTo1BKey ?? throwTo1BKey));
  }

  const savedthrowTo2BKeyKey = localStorage.getItem('throwTo2BKey');
  if (savedthrowTo2BKeyKey) throwTo2BKey = savedthrowTo2BKeyKey;
  if (throwTo2BKeyInput) {
    function updatethrowTo2BKeyInputDisplay(key) {
      throwTo2BKeyInput.value = key === ' ' ? '1' : key;
    }
    updatethrowTo2BKeyInputDisplay(throwTo2BKey);
    throwTo2BKeyInput.addEventListener('focus', () => throwTo2BKeyInput.value = 'Press key');
    throwTo2BKeyInput.addEventListener('keydown', e => {
      e.preventDefault();
      newThrowTo2BKey = e.key;
      updatethrowTo2BKeyInputDisplay(newThrowTo2BKey);
      unsavedChanges = true;
      throwTo2BKeyInput.blur();
    });
    throwTo2BKeyInput.addEventListener('blur', () => updatethrowTo2BKeyInputDisplay(newThrowTo2BKey ?? throwTo2BKey));
  }

  const savedthrowTo3BKeyKey = localStorage.getItem('throwTo3BKey');
  if (savedthrowTo3BKeyKey) throwTo3BKey = savedthrowTo3BKeyKey;
  if (throwTo3BKeyInput) {
    function updatethrowTo3BKeyInputDisplay(key) {
      throwTo3BKeyInput.value = key === ' ' ? '1' : key;
    }
    updatethrowTo3BKeyInputDisplay(throwTo3BKey);
    throwTo3BKeyInput.addEventListener('focus', () => throwTo3BKeyInput.value = 'Press key');
    throwTo3BKeyInput.addEventListener('keydown', e => {
      e.preventDefault();
      newThrowTo3BKey = e.key;
      updatethrowTo3BKeyInputDisplay(newThrowTo3BKey);
      unsavedChanges = true;
      throwTo3BKeyInput.blur();
    });
    throwTo3BKeyInput.addEventListener('blur', () => updatethrowTo3BKeyInputDisplay(newThrowTo3BKey ?? throwTo3BKey));
  }

  const savedSettingsKey = localStorage.getItem('settingsToggleKey');
  if (savedSettingsKey) settingsToggleKey = savedSettingsKey;
  if (settingsToggleKeyInput) {
    function updateSettingsToggleInputDisplay(key) {
      settingsToggleKeyInput.value = key === ' ' ? 'Space' : key;
    }
    updateSettingsToggleInputDisplay(settingsToggleKey);
    settingsToggleKeyInput.addEventListener('focus', () => settingsToggleKeyInput.value = 'Press key');
    settingsToggleKeyInput.addEventListener('keydown', e => {
      e.preventDefault();
      newSettingsToggleKey = e.key;
      updateSettingsToggleInputDisplay(newSettingsToggleKey);
      unsavedChanges = true;
      settingsToggleKeyInput.blur();
    });
    settingsToggleKeyInput.addEventListener('blur', () => updateSettingsToggleInputDisplay(newSettingsToggleKey ?? settingsToggleKey));
  }

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
        if (volumeSlider) volumeSlider.value = 0;
      } else {
        globalVolume = lastVolume;
        if (volumeSlider) volumeSlider.value = lastVolume;
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

  function openSettings() {
    settingsModal.style.display = 'flex';
    savedVolumeBeforeModal = globalVolume;
    savedMutedBeforeModal = isMuted;

    if (typeof showHitZone !== 'undefined' && strikeZoneSwitch) strikeZoneSwitch.checked = !!showHitZone;
    updateStopPitchInputDisplay(stopPitchKey);
    updateSwingKeyInputDisplay(swingKey);
    updatethrowTo1BKeyInputDisplay(throwTo1BKey);
    updatethrowTo2BKeyInputDisplay(throwTo2BKey);
    updatethrowTo3BKeyInputDisplay(throwTo3BKey);
    updateSettingsToggleInputDisplay(settingsToggleKey);
    if (volumeSlider) volumeSlider.value = globalVolume;
    updateVolumeIcon();
    newStopPitchKey = null;
    newSwingKey = null;
    newThrowTo1BKey = null;
    newThrowTo2BKey = null;   
    newThrowTo3BKey = null;
    newSettingsToggleKey = null;
    unsavedChanges = false;
  }

  function closeSettings() {
    if (unsavedChanges) {
      confirmCloseModal.style.display = 'flex';
      return;
    }
    settingsModal.style.display = 'none';
    newStopPitchKey = null;
    newSwingKey = null;
    newThrowTo1BKey = null;
    newThrowTo2BKey = null;
    newThrowTo3BKey = null;
    newSettingsToggleKey = null;
    unsavedChanges = false;
    updateStopPitchInputDisplay(stopPitchKey);
    updateSwingKeyInputDisplay(swingKey);
    updatethrowTo1BKeyInputDisplay(throwTo1BKey);
    updatethrowTo2BKeyInputDisplay(throwTo2BKey);
    updatethrowTo3BKeyInputDisplay(throwTo3BKey);
    updateSettingsToggleInputDisplay(settingsToggleKey);
  }

  settingsLogo.addEventListener('click', openSettings);
  closeModalBtn.addEventListener('click', closeSettings);
  settingsModal.addEventListener('click', e => { if (e.target === settingsModal) closeSettings(); });
  if (strikeZoneSwitch) strikeZoneSwitch.addEventListener('change', () => unsavedChanges = true);

  if (cancelCloseBtn) cancelCloseBtn.addEventListener('click', () => confirmCloseModal.style.display = 'none');
  if (confirmCloseBtn) confirmCloseBtn.addEventListener('click', () => {
    globalVolume = savedVolumeBeforeModal;
    isMuted = savedMutedBeforeModal;
    if (volumeSlider) volumeSlider.value = globalVolume;
    applyVolumeSettings();
    updateVolumeIcon();

    newStopPitchKey = null;
    newSwingKey = null;
    newThrowTo1BKey = null;
    newThrowTo2BKey = null;
    newThrowTo3BKey = null;
    newSettingsToggleKey = null;
    unsavedChanges = false;

    settingsModal.style.display = 'none';
    confirmCloseModal.style.display = 'none';

    updateStopPitchInputDisplay(stopPitchKey);
    updateSwingKeyInputDisplay(swingKey);
    updatethrowTo1BKeyInputDisplay(throwTo1BKey);
    updatethrowTo2BKeyInputDisplay(throwTo2BKey);
    updatethrowTo3BKeyInputDisplay(throwTo3BKey);
    updateSettingsToggleInputDisplay(settingsToggleKey);
  });

  function saveSettings() {
    if (typeof strikeZoneSwitch !== 'undefined') {
      showHitZone = !!strikeZoneSwitch.checked;
      localStorage.setItem('showHitZone', JSON.stringify(showHitZone));
    }
    if (newStopPitchKey !== null) { stopPitchKey = newStopPitchKey; localStorage.setItem('stopPitchKey', stopPitchKey); newStopPitchKey = null; }
    if (newSwingKey !== null) { swingKey = newSwingKey; localStorage.setItem('swingKey', swingKey); newSwingKey = null; }
    if (newThrowTo1BKey !== null) { throwTo1BKey = newThrowTo1BKey; localStorage.setItem('throwTo1BKey', throwTo1BKey); newThrowTo1BKey = null; }
    if (newThrowTo2BKey !== null) { throwTo2BKey = newThrowTo2BKey; localStorage.setItem('throwTo2BKey', throwTo2BKey); newThrowTo2BKey = null; }
    if (newThrowTo3BKey !== null) { throwTo3BKey = newThrowTo3BKey; localStorage.setItem('throwTo3BKey', throwTo3BKey); newThrowTo3BKey = null; }
    if (newSettingsToggleKey !== null) { settingsToggleKey = newSettingsToggleKey; localStorage.setItem('settingsToggleKey', settingsToggleKey); newSettingsToggleKey = null; }

    localStorage.setItem('globalVolume', globalVolume);
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
    applyVolumeSettings();

    unsavedChanges = false;
    updateStopPitchInputDisplay(stopPitchKey);
    updateSwingKeyInputDisplay(swingKey);
    updatethrowTo1BKeyInputDisplay(throwTo1BKey);
    updatethrowTo2BKeyInputDisplay(throwTo2BKey);
    updatethrowTo3BKeyInputDisplay(throwTo3BKey);
    updateSettingsToggleInputDisplay(settingsToggleKey);
  }

  if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);
  if (saveCloseSettingsBtn) saveCloseSettingsBtn.addEventListener('click', () => {
    saveSettings();
    settingsModal.style.display = 'none';
  });

  const savedHitZone = localStorage.getItem('showHitZone');
  if (savedHitZone !== null) {
    try { showHitZone = JSON.parse(savedHitZone); } catch (err) {}
  }

  document.addEventListener('keydown', e => {
    if (e.key === swingKey && !pickoffInProgress && gameState === 'offense' && ball.active) triggerSwing();
  });
  document.addEventListener('keydown', e => {
    const active = document.activeElement;
    if (active === stopPitchKeyInput || active === swingKeyInput || active === settingsToggleKeyInput || active === throwTo1BKeyInput || active === throwTo2BKeyInput || active === throwTo3BKeyInput) return;
    if (e.key === settingsToggleKey) {
      const isOpen = window.getComputedStyle(settingsModal).display !== 'none';
      if (isOpen) closeSettings();
      else openSettings();
    }
  });

  applyVolumeSettings();
});
