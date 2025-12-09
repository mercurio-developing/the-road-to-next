const LIMA_OFFSET_MINUTES = 5 * 60; // UTC-5

export function getThisFridayWindow(now: Date = new Date()) {
  //
  // When cron runs, `now` IS Friday at 00:00 local time.
  // Convert that "local midnight" to UTC by adding 5 hours.
  //
  const endUtc = new Date(now.getTime() + LIMA_OFFSET_MINUTES * 60_000);

  const startUtc = new Date(endUtc.getTime() - 7 * 24 * 60 * 60 * 1000);

  return { startUtc, endUtc };
}
