'use strict';

const validator = require('email-validator');

const validators = {
	v: {
		required: true,
		// termPattern: /^v$/,
		description: 'Protocol version',
		validate(term, value) {
			if (value !== 'DMARC1') {
				throw new Error(`Invalid DMARC version: '${value}'`);
			}
		}
	},
	fo: {
		// termPattern: /^fo$/,
		description: 'Forensic reporting options. Possible values: "0" to generate reports if all underlying authentication mechanisms fail to produce a DMARC pass result, "1" to generate reports if any mechanisms fail, "d" to generate report if DKIM signature failed to verify, "s" if SPF failed.',
		validate(term, value) {
			if (!/^([01ds])$/i.test(value)) {
				throw new Error(`Invalid value for '${term}': '${value}', must be one of: 0, 1, d, s`);
			}
		}
	},
	p: {
		description: 'Policy to apply to email that fails the DMARC check. Can be "none", "quarantine", or "reject". "none" is used to collect feedback and gain visibility into email streams without impacting existing flows.',
		validate(term, value) {
			if (!/^(none|quarantine|reject)$/i.test(value)) {
				throw new Error(`Invalid value for '${term}': '${value}', must be one of: none, quarantine, reject`);
			}
		}
	},
	pct: {
		description: `Percentage of messages from the Domain Owner's mail stream to which the DMARC policy is to be applied.`,
		validate(term, value) {
			if (!/^\d+$/.test(value)) {
				throw new Error(`Invalid value for '${term}': ${value}, must be a positive integer`);
			}
			else if (parseInt(value, 10) > 100 || parseInt(value, 10) < 0) {
				throw new Error(`Invalid value for '${term}': ${value}, must be an integer between 0 and 100`);
			}
		}
	},
	rf: {
		description: `Format to be used for message-specific failure reports (colon-separated plain-text list of values)`,
		validate(term, value) {
			// The RFC says the values are colon-separated but a lot of examples/docs around the net show commas... so we'll do both
			let values = value.split(/,|:/).map(x => x.trim());

			for (let val of values) {
				if (!/^(afrf|iodef)$/i.test(val)) {
					throw new Error(`Invalid value for '${term}': '${value}', must be one or more of these values: afrf, iodef. Multiple values must be separated by a comma or colon`);
				}
			}
		}
	},
	ri: {
		description: 'Interval (in seconds) requested between aggregate reports (plain-text 32-bit unsigned integer; default is 86400)',
		validate(term, value) {
			if (!/^\d+$/.test(value)) {
				throw new Error(`Invalid value for '${term}': ${value}, must be an unsigned integer`);
			}
		}
	},
	rua: {
		description: 'Addresses to which aggregate feedback is to be sent (comma-separated plain-text list of DMARC URIs',
		validate(term, value) {
			let values = value.split(/,/).map(x => x.trim());

			for (let val of values) {
				let matches = val.match(/^mailto:(.+)$/i);
				if (!matches) {
					throw new Error(`Invalid value for '${term}': ${value}, must be a list of DMARC URIs such as 'mailto:some.email@somedomain.com'`);
				}
				let email = matches[1];
				const limitRE = /!(.+)$/;
				const index = email.indexOf('@');
				if (index !== -1) {
					const limitMatch = email.substring(index + 1).match(limitRE);
					if (limitMatch) {
						const sizeLimit = limitMatch[0];
						email = email.replace(sizeLimit, '');
					}
				}
				if (!validator.validate(email)) {
					throw new Error(`Invalid email address in '${term}': '${email}'`);
				}
			}
		}
	},
	ruf: {
		description: 'Addresses to which message-specific failure information is to be reported (comma-separated plain-text list of DMARC URIs)',
		validate(term, value) {
			let values = value.split(/,/).map(x => x.trim());

			for (let val of values) {
				let matches = val.match(/^mailto:(.+)$/i);
				if (!matches) {
					throw new Error(`Invalid value for '${term}': ${value}, must be a list of DMARC URIs such as 'mailto:some.email@somedomain.com'`);
				}
				let email = matches[1];
				const limitRE = /!(.+)$/;
				const index = email.indexOf('@');
				if (index !== -1) {
					const limitMatch = email.substring(index + 1).match(limitRE);
					if (limitMatch) {
						const sizeLimit = limitMatch[0];
						email = email.replace(sizeLimit, '');
					}
				}
				if (!validator.validate(email)) {
					throw new Error(`Invalid email address in '${term}': '${email}'`);
				}
			}
		}
	},
	sp: {
		description: 'Requested Mail Receiver policy for all subdomains. Can be "none", "quarantine", or "reject".',
		validate(term, value) {
			if (!/^(none|quarantine|reject)$/i.test(value)) {
				throw new Error(`Invalid value for '${term}': '${value}', must be one of: none, quarantine, reject`);
			}
		}
	},
	aspf: {
		description: 'SPF Alignment mode. Can be "s" or "r".',
		validate(term, value) {
			if (!/^(s|r)$/i.test(value)) {
				throw new Error(`Invalid value for '${term}': '${value}', must be one of: s, r`);
			}
		}
	},
	adkim: {
		description: 'DKIM Alignment mode. Can be "s" or "r".',
		validate(term, value) {
			if (!/^(s|r)$/i.test(value)) {
				throw new Error(`Invalid value for '${term}': '${value}', must be one of: s, r`);
			}
		}
	}
};

function parse(policy) {
  // Steps
  // 1. Split policy string on semicolons into term pairs
  // 2. Process and validate each term pair

	let terms = policy.split(/;/)
								.map(t => t.trim()) // Trim surrounding whitespace
								.filter(x => x !== ''); // Ignore empty tags

	let rules = terms.map(
    x => x.split(/[=]/)
          .map(p => p.trim())
  );

	let retval = {
		tags: {},
		messages: []
	};

	// Make sure `v` is the first tag
	if (!/^v$/i.test(rules[0][0])) {
		retval.messages.push(`First tag in a DMARC policy must be 'v', but found: '${rules[0][0]}'`);
		return retval;
	}

	for (let rule of rules) {
		let term = rule[0];
		let value = rule[1];

		let found = false;

		for (let validatorTerm of Object.keys(validators)) {
			let settings = validators[validatorTerm];

			// Term matches validaor
			let termRegex = new RegExp(`^${validatorTerm}$`, 'i');
			if (termRegex.test(term)) {
				found = true;

				let tag = {
					// tag: term,
					description: settings.description
				};

				if (settings.validate) {
					// eslint-disable-next-line max-depth
					try {
						settings.validate.call(settings, term, value);
						tag.value = value;
						retval.tags[term] = tag;
					}
					catch (err) {
						retval.messages.push(err.message);
					}
				}

				break;
			}
		}

		if (!found) {
			retval.messages.push(`Unknown tag '${term}'`);
		}
	}

	// Remove "messages"
	if (retval.messages.length === 0) {
		delete retval.messages;
	}

	return retval;
}

module.exports = parse;
