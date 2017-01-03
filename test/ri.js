import test from 'ava';
import d from '../';

test('ri with a good value succeeds', t => {
	t.true(d('v=DMARC1; ri=5000').messages === undefined);
});

test('ri with string value fails', t => {
	let ret = d('v=DMARC1; ri=foo');
	t.true(ret.messages.some(x => /invalid value for 'ri'/i.test(x)));
});
