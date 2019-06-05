import { Domture, WebpackDomtureConfig } from 'domture'

export interface TestHarness extends Domture {
}

export interface Namespaces {
  [name: string]: string
}

export interface TestHarnessConfig extends WebpackDomtureConfig {
  namespaces: Namespaces
}
