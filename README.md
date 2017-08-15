# dmarc-parse [![Build Status](https://travis-ci.org/softvu/dmarc-parse.svg?branch=master)](https://travis-ci.org/softvu/dmarc-parse) [![Coverage Status](https://coveralls.io/repos/github/softvu/dmarc-parse/badge.svg?branch=master)](https://coveralls.io/github/softvu/dmarc-parse?branch=master) [![Dependency Status](https://dependencyci.com/github/softvu/dmarc-parse/badge)](https://dependencyci.com/github/softvu/dmarc-parse) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
> Parse and validate the syntax of DMARC (Domain-based Message Authentication, Reporting, and Conformance) DNS strings

# Install

		npm install --save dmarc-parse

# Usage

```javascript
const dmarc = require('dmarc-parse');

let tags = dmarc('v=DMARC1; p=reject; rua=mailto:mailauth-reports@google.com');

// tags == {
//     tags: {
//         v: {
//             description: 'Protocol version',
//             value: 'DMARC1'
//         },
//         p: {
//             description: 'Policy to apply to email that fails the DMARC check. Can be "none", "quarantine", or "reject". "none" is used to collect feedback and gain visibility into email streams without impacting existing flows.',
//             value: 'reject'
//         },
//         rua: {
//             description: 'Addresses to which aggregate feedback is to be sent (comma-separated plain-text list of DMARC URIs',
//             value: 'mailto:mailauth-reports@google.com'
//         }
//     }
// }
```

# Debugging

	  npm install -g inspect-process
		inspect node_modules/ava/profile.js some/test/file.js

# Watching Tests

		ava --watch

or

		npm test -- --watch

# License

MIT © [SoftVu](https://softvu.com)
