import test from 'ava';
import d from '../';

test('ruf with a good email succeeds', t => {
	t.true(d('v=DMARC1; ruf=mailto:word.up@wordup.co').messages === undefined);
});

test('ruf with a good email and report size succeeds', t => {
	t.true(d('v=DMARC1; ruf=mailto:word.up@wordup.co!10m').messages === undefined);
});

test('ruf with a good email with exclamation mark and report size succeeds', t => {
	t.true(d('v=DMARC1; ruf=mailto:word!.up@wordup.co!10m').messages === undefined);
});

test('ruf with bad email fails', t => {
	let ret = d('v=DMARC1; ruf=mailto:bob@bob');
	// console.log(ret);
	t.true(ret.messages.some(x => /invalid email address/i.test(x)));
});

test('ruf with bad mailto fails', t => {
	let ret = d('v=DMARC1; ruf=matoo:bob@bob.com');
	// console.log(ret);
	t.true(ret.messages.some(x => /invalid value for 'ruf'/i.test(x)));
});

test('ruf allows multiple emails', t => {
	let ret = d('v=DMARC1; ruf=mailto:bob@bob.bob , mailto:github@github.com');
	// console.log(ret);
	t.true(ret.messages === undefined);
	t.true(ret.tags.ruf.value.indexOf('bob@bob.bob') > -1 && ret.tags.ruf.value.indexOf('github@github.com') > -1);
});
