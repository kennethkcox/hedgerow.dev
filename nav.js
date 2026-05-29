/* Shared nav toggle — no inline handlers needed */
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('navToggle');
  var drawer = document.getElementById('navDrawer');
  if (!btn || !drawer) return;
  btn.addEventListener('click', function () {
    var open = drawer.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  /* Close drawer when any link inside it is activated */
  drawer.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      drawer.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});
