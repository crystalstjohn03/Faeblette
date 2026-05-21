/**
 * faeblette — dynamic field notes loader
 * Drop this script at the bottom of any notes/*.html page.
 * It fetches /field-notes.json, excludes the current page,
 * picks 3 recent notes, and renders them into #fb-more-grid.
 */
(function () {
  const NOTES_URL = '../field-notes.json'; // path from notes/ subfolder

  async function loadMoreNotes() {
    const grid = document.getElementById('fb-more-grid');
    if (!grid) return;

    // Determine current slug from the page URL
    const currentFile = window.location.pathname.split('/').pop();

    try {
      const res = await fetch(NOTES_URL);
      if (!res.ok) throw new Error('fetch failed');
      const notes = await res.json();

      // Exclude current page, take up to 3
      const others = notes
        .filter(n => n.url !== currentFile)
        .slice(0, 3);

      grid.innerHTML = others.map(n => `
        <a href="${n.url}" class="fb-more-item">
          <span class="fb-more-item-title">${n.title}</span>
          <span class="fb-more-item-tag">${n.tag}</span>
          <span class="fb-more-item-date">${n.date}</span>
        </a>
      `).join('');

    } catch (e) {
      // Silently hide the section if fetch fails (e.g. local file://)
      const section = document.getElementById('fb-more-section');
      if (section) section.style.display = 'none';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMoreNotes);
  } else {
    loadMoreNotes();
  }
})();
