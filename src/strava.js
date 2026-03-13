const CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_STRAVA_CLIENT_SECRET;

const getRedirectURI = () =>
  window.location.origin + window.location.pathname.replace(/\/$/, '');

export const getAuthURL = () => {
  const p = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: getRedirectURI(),
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all',
  });
  return `https://www.strava.com/oauth/authorize?${p}`;
};

export const exchangeCode = async (code) => {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return res.json();
};

export const refreshAccessToken = async (refresh_token) => {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  return res.json();
};

export const fetchActivities = async (access_token, page = 1, per_page = 50) => {
  const res = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${per_page}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  if (!res.ok) throw new Error(`Activities fetch failed: ${res.status}`);
  return res.json();
};

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem('strava_auth');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const storeAuth = (auth) => {
  localStorage.setItem('strava_auth', JSON.stringify(auth));
};

export const clearAuth = () => {
  localStorage.removeItem('strava_auth');
};

export const isTokenExpired = (auth) => {
  if (!auth || !auth.expires_at) return true;
  return Date.now() / 1000 > auth.expires_at - 60;
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const guessTag = (act) => {
  const sport = (act.sport_type || act.type || '').toLowerCase();
  const distKm = act.distance / 1000;
  const paceMpk = act.average_speed > 0 ? (1000 / act.average_speed) / 60 : 99;
  if (!sport.includes('run') && !sport.includes('walk')) return 'CROSS';
  if (act.workout_type === 1) return 'RACE';
  if (distKm >= 18) return 'ULTRA';
  if (distKm >= 12) return 'LONG';
  if (paceMpk < 5.8) return 'TEMPO';
  return 'EASY';
};

export const mapActivity = (act) => {
  const distKm = act.distance / 1000;
  const paceMpk = act.average_speed > 0 ? (1000 / act.average_speed) / 60 : 0;
  const paceStr = paceMpk > 0
    ? `${Math.floor(paceMpk)}:${String(Math.round((paceMpk % 1) * 60)).padStart(2, '0')}`
    : '—';
  const s = act.moving_time;
  const timeStr = s >= 3600
    ? `${Math.floor(s/3600)}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
    : `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const d = new Date(act.start_date_local);
  return {
    id: act.id,
    stravaUrl: `https://www.strava.com/activities/${act.id}`,
    date: `${MONTHS[d.getMonth()]} ${d.getDate()}`,
    name: act.name,
    km: distKm > 0.1 ? parseFloat(distKm.toFixed(2)) : '—',
    time: timeStr,
    pace: distKm > 0.1 ? paceStr : '—',
    hr: act.average_heartrate ? Math.round(act.average_heartrate) : '—',
    tl: act.suffer_score || '—',
    gear: '—',
    tag: guessTag(act),
    elev: Math.round(act.total_elevation_gain || 0),
    calories: act.calories ? Math.round(act.calories) : '—',
  };
};
