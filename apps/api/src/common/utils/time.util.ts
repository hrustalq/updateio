export class TimeUtil {
  static getExpiresInSeconds(expiresIn: string | number): number {
    if (typeof expiresIn === 'number') {
      return expiresIn;
    }
    return this.parseDuration(expiresIn) / 1000;
  }

  /**
   * Parse duration string to milliseconds
   * @param duration string in format like '7d', '24h', '60m', '60s'
   * @returns number of milliseconds
   * @throws Error if invalid duration format
   */
  static parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) {
      throw new Error(
        'Invalid duration format. Expected format: {number}[d|h|m|s]',
      );
    }

    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    const multipliers = {
      d: 24 * 60 * 60 * 1000, // days to ms
      h: 60 * 60 * 1000, // hours to ms
      m: 60 * 1000, // minutes to ms
      s: 1000, // seconds to ms
    };

    return numValue * multipliers[unit as keyof typeof multipliers];
  }
}
