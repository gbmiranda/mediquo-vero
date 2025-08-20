/**
 * Google services configuration
 * Centralized configuration for Google Analytics and Google Tag Manager
 */

export const GOOGLE_CONFIG = {
  // Google Analytics Tracking ID
  GA_TRACKING_ID: 'G-SMC2TB0C39',
  
  // Google Tag Manager ID
  GTM_ID: 'GTM-W9DRRQD2',
} as const

export const { GA_TRACKING_ID, GTM_ID } = GOOGLE_CONFIG