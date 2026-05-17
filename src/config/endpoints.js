const LOCAL_ORIGIN = 'http://localhost:8080'
const PROD_ORIGIN = 'https://sphere-t364.onrender.com'

const isLocalFrontend = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
)

const backendOrigin = isLocalFrontend ? LOCAL_ORIGIN : PROD_ORIGIN

export const API_BASE_URL = `${backendOrigin}/api`
export const WEBSOCKET_URL = `${backendOrigin}/ws`
export const GOOGLE_OAUTH_URL = `${backendOrigin}/oauth2/authorization/google`

export const ENDPOINTS = {
  local: {
    origin: LOCAL_ORIGIN,
    apiBaseUrl: `${LOCAL_ORIGIN}/api`,
    websocketUrl: `${LOCAL_ORIGIN}/ws`,
    googleOAuthUrl: `${LOCAL_ORIGIN}/oauth2/authorization/google`,
  },
  production: {
    origin: PROD_ORIGIN,
    apiBaseUrl: `${PROD_ORIGIN}/api`,
    websocketUrl: `${PROD_ORIGIN}/ws`,
    googleOAuthUrl: `${PROD_ORIGIN}/oauth2/authorization/google`,
  },
}
