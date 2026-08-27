# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| 1.x | Yes |
| 0.x upstream releases | No, report to the upstream maintainer |

## Report Privately

Do not open a public issue for a suspected vulnerability. Use GitHub private
vulnerability reporting for
[`alexandroit/stackline-dynamic-dedupe`](https://github.com/alexandroit/stackline-dynamic-dedupe/security/advisories/new).

Include affected versions, Node version, operating system, a minimal
reproduction, expected impact, and any known workaround. We will acknowledge a
complete report as soon as practical and coordinate remediation and disclosure.

## Security Model

The package changes process-wide CommonJS extension hooks. Any code in the same
process can also change those hooks. It is not a sandbox, integrity verifier, or
authorization boundary. Module source and path identity decide reuse; callers
must only load trusted executable code.
