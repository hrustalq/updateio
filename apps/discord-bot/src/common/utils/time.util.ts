export class TimeUtil {
  static getExpiresInSeconds(expiresIn: string): number {
    const units = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // default 1 hour
    const [, value, unit] = match;
    return parseInt(value) * units[unit as keyof typeof units];
  }
}
