(function() {
  let struct={retries:0, source:'parent'}, mthd, requestAddress, stored={}, widget, frameHs = [410, 420];
	function init(node, overlay) {
		widget = _blocktcha_root_.querySelector('iframe'), init.inited||=!0,
		widget.classList.add('show'), (overlay = _blocktcha_root_.querySelector('div'))&&overlay.classList.add('opacity-10');
		setTimeout(begin, 300), setTimeout(_=>widget.height=frameHs[0], 1200)
	}

	window.onmessage = function(ev, data, mthd) {
		if((data=ev.data).source!=='frame') return;
		/* to retry requesting address from detected freighter wallet upon failure*/
		data[mthd='requestAddress']&&requestAddress(stored[mthd], true),

		data.close&&(widget.classList.remove('show'), blocktcha_init.inited=!data.verified/**allow retries if unverified */),
		data.verified&&(console.log("data", data), _blocktcha_root_.set([data.result.transaction_hash]))
	}
	/*the freighterApi.isConnected method sometimes resolves to an intial false hence why struct.retries is used to retry at most 3 times */
	let begin=_=>setTimeout(_=>{
		widget.contentWindow.postMessage({source:'parent', init:!0}, '*'),
		window.freighterApi&&window.freighterApi[mthd='isConnected']().then(bool=>/*added a delay to make for gradual UX*/new Promise(resolve=>setTimeout(_=>resolve(bool), 500)))
		.then(bool=>(!bool&&struct.retries<3&&(++struct.retries, begin()), struct[mthd] = bool)&&(widget.contentWindow.postMessage(struct, '*'), bool))
		.then(bool=>{
			delete struct[mthd],/*remove previously checked operation to avoid redundancy*/
			bool&&window.freighterApi[mthd='setAllowed']().then(function(allowed) {
				(struct[mthd] = allowed)&&widget.contentWindow.postMessage(struct, '*');
				return allowed;
			})
			.then(requestAddress = async (allowed, flag)=>{
				stored.requestAddress = allowed,/*keep the value for the sake of retries*/
				delete struct[mthd];/*remove previously checked operation to avoid redundancy*/
				if(allowed) {
					let pK, err;
					try {
						pK = await window.freighterApi[mthd='requestAccess']()
					} catch(e) {err = e }
					struct[mthd] = err?'::FAILED::':pK
					// !flag&&(struct[mthd] = '::FAILED::')
					if(!err&&!pK) { /*first time connection sometimes return empty response as address, retry if it does*/return requestAddress(allowed) }
					setTimeout(_=>widget.contentWindow.postMessage(struct, '*'), flag?1000:6000/*wait until status texts are animated in the frame*/)
				}
			})
		})
	}, 1000/*a bit of delay to provide room for extension to behave properly*/);
	window.blocktcha_init = init
})()