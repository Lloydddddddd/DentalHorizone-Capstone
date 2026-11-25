import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.axios.defaults.withCredentials = true;

// Do not pin a static X-CSRF-TOKEN header here. Laravel regenerates the CSRF
// token when the session changes (for example on login), but the value baked
// into <meta name="csrf-token"> is only refreshed on a full page load. Inertia
// navigations keep the old meta tag, so a pinned header goes stale and every
// POST fails with 419 "Page Expired". Axios already sends the up-to-date
// XSRF-TOKEN cookie as the X-XSRF-TOKEN header on every request, which Laravel
// accepts, so we simply let that happen.