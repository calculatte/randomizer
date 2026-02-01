export function isMobileDevice(win: Window & typeof globalThis): boolean {
    const isTouchDevice: boolean = win.matchMedia("(pointer: coarse)").matches;
    const isSmallScreen: boolean = win.innerWidth <= 768;

    return isTouchDevice && isSmallScreen;
}
