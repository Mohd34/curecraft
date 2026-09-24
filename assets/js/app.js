/**
 * CureCraft Client UI Interaction Engine
 * Handles user input listeners, live reactive calculations, preset selection,
 * clipboard recipe copying, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Toast function
  window.showToast = function(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // Copy to clipboard helper
  window.copyRecipeToClipboard = function(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Formula copied to clipboard!');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast('✓ Formula copied to clipboard!');
    } catch (err) {
      alert('Formula:\n\n' + text);
    }
    document.body.removeChild(ta);
  }
});
