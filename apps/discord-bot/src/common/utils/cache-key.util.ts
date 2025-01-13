export class CacheKeyBuilder {
  private static readonly SEPARATOR = ':';
  private parts: string[] = [];

  constructor(prefix: string) {
    this.parts.push(prefix);
  }

  /**
   * Add a namespace to the cache key
   */
  namespace(value: string): this {
    this.parts.push(value);
    return this;
  }

  /**
   * Add an identifier to the cache key
   */
  identifier(value: string | number): this {
    this.parts.push(value.toString());
    return this;
  }

  /**
   * Build the final cache key
   */
  build(): string {
    return this.parts.join(CacheKeyBuilder.SEPARATOR);
  }

  /**
   * Create a pattern for finding related keys
   */
  pattern(): string {
    return `${this.build()}*`;
  }

  /**
   * Create a new CacheKeyBuilder instance
   */
  static create(prefix: string): CacheKeyBuilder {
    return new CacheKeyBuilder(prefix);
  }
}
