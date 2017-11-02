import { Domture, DomtureConfig } from 'domture'

export interface TestHarness extends Domture {
  /**
   * Import module or file.
   * @param identifier
   * Module name: `color-map`,
   * Namespace path: `MyCompany.myproduct.component`
   * Relative path (from root): `./src/index.js`
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

export interface TestHarnessConfig extends Pick<DomtureConfig, 'rootDir'>, Partial<Pick<DomtureConfig, 'packageManager' | 'preloadScripts' | 'systemjsConfig' | 'transpiler'>> {
  namespaces: Namespaces
}
