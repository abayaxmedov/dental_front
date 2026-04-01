type RuntimeConfig = {
  API_BASE_URL?: string
  API_ORIGIN?: string
}

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig
  }
}

const FALLBACK_API_ORIGIN = 'http://localhost:8000'

const readConfigValue = (value?: string) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

const runtimeConfig = typeof window !== 'undefined' ? window.__APP_CONFIG__ : undefined

const configuredApiBaseUrl =
  readConfigValue(runtimeConfig?.API_BASE_URL)
  ?? readConfigValue(import.meta.env.VITE_API_BASE_URL)
  ?? '/api'

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, '')

export const buildApiUrl = (path: string) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`

export const API_ORIGIN = (() => {
  const configuredOrigin =
    readConfigValue(runtimeConfig?.API_ORIGIN)
    ?? readConfigValue(import.meta.env.VITE_API_ORIGIN)

  if (configuredOrigin) {
    return configuredOrigin.replace(/\/+$/, '')
  }

  if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
    return new URL(API_BASE_URL).origin
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return FALLBACK_API_ORIGIN
})()
