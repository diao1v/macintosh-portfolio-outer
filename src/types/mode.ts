export type Mode = '1984' | '2084';

/**
 * Transition schedule in ms, identical in both directions:
 * screen shuts down and the camera pulls back → lights off → new lights on →
 * camera flies back in → screen boots the new system.
 */
export const SWITCH = { pullBack: 0, lightsOff: 1200, lightsOn: 2000, flyIn: 3200, boot: 3600, done: 5000 } as const;
