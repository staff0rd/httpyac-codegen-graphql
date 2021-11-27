export interface Config {
  /**
   * @default 10
   * @description Allows you choose how many levels of depth selection sets will be generated
   */
  depthLimit?: number;
  /**
   * @default 1
   * @description Allows you choose how many times the circular references can repeat
   */
  circularReferenceDepth?: number;

  /**
   * @description The host that requests will be sent to
   */
  host: string;

  /**
   * @description Variable definitions for any requests that need them
   */
  variables?: {
    [request: string]: { [variable: string]: string };
  };

  /**
   * @default *
   * @description Which requests will be generated
   */
  include?: string | string[];
}
