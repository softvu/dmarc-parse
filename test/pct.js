import test from 'ava';
import d from '../';

test('pct greater than 100 fails', t => {
	t.true(d('v=DMARC1; pct=101').messages.some(x => /between 0 and 100/.test(x)));
});

test('pct less than 0 fails', t => {
	let ret = d('v=DMARC1; pct=-20');
	t.true(ret.messages.some(x => /invalid value for 'pct'/i.test(x)));
});
