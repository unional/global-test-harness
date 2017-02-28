export interface TestHarness {
  /**
   * Window and any global namespaces.
   */
  window: Window & { [index: string]: any }
  /**
   * Import module or file.
   * @param identifier Module name or case-insensitive namespace path (`pan/base/grid`)
   * or relative path (`./js/pan/base/grid`)
   */
  import(identifier: string): Promise<any>
  /**
   * Get the specified target from global namespace.
   * @param path Path to the target, e.g. 'Pan.base.grid'
   */
  get(path: string): any
}

export interface Namespaces {
  [name: string]: {
    /**
     * Optional main entry point for the namespace root.
     */
    main?: string
    path: string
  }
}
export interface TestHarnessConfig {
  root: string,
  namespaces: Namespaces
}