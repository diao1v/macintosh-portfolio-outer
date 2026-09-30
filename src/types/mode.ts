export type Mode = '1984' | '2084';

/**
 * Transition schedule in ms, identical in both directions:
 * screen powers off (CRT collapse) → camera pulls back → lights off → new lights on →
 * camera flies back in → screen boots the new system.
 */
export const SWITCH = { powerOff: 0, pullBack: 500, lightsOff: 1700, lightsOn: 2500, flyIn: 3700, boot: 4100, done: 5500 } as const;
export const POWER_OFF_MS = 500;
