# Issue Triage

Include a minimal repository or fixture tree, Node version, operating system,
package manager, relevant symlink flags, activation order, extension, and
subdirectory depth.

Priority labels:

- `security`: private disclosure required;
- `compatibility`: upstream-observable behavior changed;
- `loader-composition`: interaction with another CommonJS hook;
- `types`: declaration or module-resolution behavior;
- `documentation`: usage or migration clarity.

Native ESM loader requests are evaluated as separate feature proposals because
they cannot be implemented through the compatibility API.
