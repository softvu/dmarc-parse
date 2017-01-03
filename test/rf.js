import test from 'ava';
import d from '../';

test('rf of each good type succeeds', t => {
	t.true(d('v=DMARC1; rf=afrf').messages === undefined);
	t.true(d('v=DMARC1; rf=iodef').messages === undefined);
});

test('rf of multiple good types succeeds', t => {
	t.true(d('v=DMARC1; rf=afrf,iodef').messages === undefined);
	t.true(d('v=DMARC1; rf=afrf,iodef').messages === undefined);
});

test('rf values with whitespace suceed', t => {
	let ret = d('v=DMARC1; rf=    afrf, iodef    ');
	t.true(ret.messages === undefined);
	t.true(ret.tags.rf.value.indexOf('afrf') > -1 && ret.tags.rf.value.indexOf('iodef') > -1, 'Value has both afrf and iodef');
});

test('rf with bad value fails', t => {
	let ret = d('v=DMARC1; rf=foo');
	t.true(ret.messages.some(x => /invalid value for 'rf'/i.test(x)));
});

test('rf with one bad value in multiples fails', t => {
	let ret = d('v=DMARC1; rf=foo,iodef');
	t.true(ret.messages.some(x => /invalid value for 'rf'/i.test(x)));
});
