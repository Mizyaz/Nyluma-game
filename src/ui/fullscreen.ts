// Fullscreen + landscape for phones and tablets. Everything is optional:
// browsers without the API (e.g. Safari on iPhone) simply keep the page view.

export function fullscreenAvailable(): boolean {
  return typeof document !== 'undefined' && !!document.fullscreenEnabled;
}

export function isFullscreen(): boolean {
  return !!document.fullscreenElement;
}

/** Must be called from a user gesture (tap/click/key). */
export async function enterFullscreen(): Promise<void> {
  if (!fullscreenAvailable() || isFullscreen()) return;
  try {
    await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
    await orientation.lock?.('landscape').catch(() => undefined);
  } catch {
    // Refused (no gesture, embedded frame, policy): keep playing windowed.
  }
}

export async function toggleFullscreen(): Promise<void> {
  if (isFullscreen()) {
    await document.exitFullscreen().catch(() => undefined);
    return;
  }
  await enterFullscreen();
}
