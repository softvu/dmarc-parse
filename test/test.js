import test from 'ava';
import d from '../';

test('First tag must be: v', t => {
	let ret = d('rua=matoo:bob@bob.com; v=DMARC1');
	// console.log(ret);
	t.true(ret.messages.some(x => /first tag.+?but found: 'rua'/i.test(x)));
});

test('Must have valid DMARC version', t => {
	let ret = d('v=DMARC0');
	// console.log(ret);
	t.true(ret.messages.some(x => /invalid DMARC version/i.test(x)));
});

test('Invalid term fails', t => {
	let ret = d('v=DMARC1; foo=bar');
	// console.log(ret);
	t.true(ret.messages.some(x => /Unknown tag 'foo'/i.test(x)));
});

test('Ignore empty tags', t => {
	let ret = d('v=DMARC1; p=reject; pct=100; rua=mailto:dmarc_y_rua@yahoo.com;');
	t.falsy(ret.messages);
});

test('Ignore empty tags and whitespace', t => {
	let ret = d('v=DMARC1; p=reject; pct=100; rua=mailto:dmarc_y_rua@yahoo.com;  ');
	t.falsy(ret.messages);
});
