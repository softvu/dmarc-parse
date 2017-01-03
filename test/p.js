import test from 'ava';
import d from '../';

test('p with bad value fails', t => {
	t.true(d('v=DMARC1; p=foo').messages.some(x => /invalid value for 'p'/i.test(x)));
});

test('p with good values pass', t => {
	t.true(d('v=DMARC1; p=none').messages === undefined);
	t.true(d('v=DMARC1; p=quarantine').messages === undefined);
	t.true(d('v=DMARC1; p=reject').messages === undefined);
});
