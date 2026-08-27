export as namespace dynamicDedupe

declare namespace dynamicDedupe {
  function activate(extension?: string, subdirs?: number): void
  function deactivate(extension?: string): void
  function reset(): void
}

export = dynamicDedupe
