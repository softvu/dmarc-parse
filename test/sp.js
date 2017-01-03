import test from 'ava';
import d from '../';

test('sp with bad value fails', t => {
	t.true(d('v=DMARC1; sp=foo').messages.some(x => /invalid value for 'sp'/i.test(x)));
});

test('sp with good values pass', t => {
	t.true(d('v=DMARC1; sp=none').messages === undefined);
	t.true(d('v=DMARC1; sp=quarantine').messages === undefined);
	t.true(d('v=DMARC1; sp=reject').messages === undefined);
});
