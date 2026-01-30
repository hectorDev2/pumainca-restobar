/**
 * Constantes de UI
 */

export const UI_CONSTANTS = {
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    "2XL": 1536,
  },
  ANIMATIONS: {
    DURATION_FAST: 150,
    DURATION_NORMAL: 300,
    DURATION_SLOW: 500,
  },
  Z_INDEX: {
    DROPDOWN: 10,
    STICKY: 20,
    FIXED: 30,
    MODAL_BACKDROP: 40,
    MODAL: 50,
    TOOLTIP: 60,
  },
} as const;

export const TOAST_DEFAULTS = {
  DURATION: 5000,
  POSITION: "bottom-right",
} as const;

export const MODAL_DEFAULTS = {
  OVERLAY_OPACITY: 0.5,
  ANIMATION_DURATION: 200,
} as const;
