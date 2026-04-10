/**
 * Represents a source of context information
 */
export interface ContextSource {
  /**
   * Gets the name identifier for this context source
   */
  getName(): string;

  /**
   * Collects context data from this source
   * @returns Promise that resolves to context data
   */
  collect(): Promise<ContextData>;
}

/**
 * Data collected from a context source
 */
export interface ContextData {
  /**
   * Type identifier for this context data
   */
  type: string;

  /**
   * Source identifier
   */
  source: string;

  /**
   * Timestamp when data was collected
   */
  timestamp: string;

  /**
   * The actual context data
   */
  data: Record<string, unknown>;
}

