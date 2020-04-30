import test from 'ava';
import d from '../';

test('rua with a good email succeeds', t => {
	t.true(d('v=DMARC1; rua=mailto:word.up@wordup.co').messages === undefined);
});

test('rua with a good email and report size succeeds', t => {
	t.true(d('v=DMARC1; rua=mailto:word.up@wordup.co!10m').messages === undefined);
});

test('rua with a good email with exclamation mark and report size succeeds', t => {
	t.true(d('v=DMARC1; rua=mailto:word!.up@wordup.co!10m').messages === undefined);
});

test('rua with bad email fails', t => {
	let ret = d('v=DMARC1; rua=mailto:bob@bob');
	// console.log(ret);
	t.true(ret.messages.some(x => /invalid email address/i.test(x)));
});

test('rua with bad mailto fails', t => {
	let ret = d('v=DMARC1; rua=matoo:bob@bob.com');
	// console.log(ret);
	t.true(ret.messages.some(x => /invalid value for 'rua'/i.test(x)));
});

test('rua allows multiple emails', t => {
	let ret = d('v=DMARC1; rua=mailto:bob@bob.bob , mailto:github@github.com');
	// console.log(ret);
	t.true(ret.messages === undefined);
	t.true(ret.tags.rua.value.indexOf('bob@bob.bob') > -1 && ret.tags.rua.value.indexOf('github@github.com') > -1);
});
