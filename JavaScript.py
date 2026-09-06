// Paste in your main bundle or a small script loaded at end of body

function attachIconCopyHandlers() {
  document.querySelectorAll('[data-copy-text]').forEach(el => {
    el.addEventListener('click', async (ev) => {
      const text = el.getAttribute('data-copy-text') || el.dataset.copyText;
      if (!text) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        // optional: show visual feedback
        el.classList.add('copied');
        setTimeout(()=> el.classList.remove('copied'), 1200);
      } catch (err) {
        console.error('Copy failed', err);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachIconCopyHandlers);
} else {
  attachIconCopyHandlers();
}
