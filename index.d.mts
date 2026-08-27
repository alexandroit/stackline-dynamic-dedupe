export declare function activate(extension?: string, subdirs?: number): void
export declare function deactivate(extension?: string): void
export declare function reset(): void

declare const dynamicDedupe: {
  activate: typeof activate
  deactivate: typeof deactivate
  reset: typeof reset
}

export default dynamicDedupe
