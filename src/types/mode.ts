export type Mode = '1984' | '2084';

/** Transition schedule in ms, shared by lights, model, screen and effects. */
export const TO_2084 = { pullBack: 0, blackout: 400, cyanOn: 1200, magentaOn: 1600, flyIn: 2400, glitch: 2600, done: 4000 } as const;
export const TO_1984 = { pullBack: 0, neonOff: 100, daylight: 1000, flyIn: 1400, glitch: 1600, done: 3000 } as const;
