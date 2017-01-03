import test from 'ava';
import d from '../';

test('fo with bad value fails', t => {
	t.true(d('v=DMARC1; fo=foo').messages.some(x => /invalid value for 'fo'/i.test(x)));
	t.true(d('v=DMARC1; fo=0,1').messages.some(x => /invalid value for 'fo'/i.test(x)));
});

test('fo with good values pass', t => {
	t.true(d('v=DMARC1; fo=0').messages === undefined);
	t.true(d('v=DMARC1; fo=1').messages === undefined);
	t.true(d('v=DMARC1; fo=d').messages === undefined);
	t.true(d('v=DMARC1; fo=d').messages === undefined);
});
