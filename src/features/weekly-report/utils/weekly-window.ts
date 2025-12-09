const LIMA_OFFSET_MINUTES = 5 * 60; // UTC-5

export function getThisFridayWindow(now: Date = new Date()) {
  //
  // When cron runs, `now` IS Friday at 00:00 local time.
  // Convert that "local midnight" to UTC by adding 5 hours.
  //
  const startUtc = new Date(
    now.getTime() + LIMA_OFFSET_MINUTES * 60_000
  );

  // End of window = +7 days
  const endUtc = new Date(startUtc.getTime() + 7 * 24 * 60 * 60 * 1000);

  return { startUtc, endUtc };
}
