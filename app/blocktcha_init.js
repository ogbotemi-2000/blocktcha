(function() {
  let struct={retries:3, source:'parent'}, mthd, requestAddress, stored={}, widget, frameHs = [420, 400], target;
	function init(domain, url, overlay) {
		if(struct.sandboxed) return;// to let the UI flow resume if the widget is closed and opened 
		struct.domain = domain, target = url,
		widget = _blocktcha_root_.querySelector('iframe'), init.inited||=!0,
		widget.classList.add('show'), (overlay = _blocktcha_root_.querySelector('div'))&&overlay.classList.add('opacity-10'),
		setTimeout(begin, 1000), setTimeout(_=>widget.height=frameHs[0], 1200)
	}
	function sandbox() {
		/** called when all interactions with the freighter wallet extension are over */
		widget.setAttribute('sandbox', 'allow-scripts'),
		struct.sandboxed = !0
	}

	window.onmessage = function(ev, data, mthd) {
		if((data=ev.data).source!=='frame') return;
		/* to retry requesting address from detected freighter wallet upon failure*/
		data[mthd='requestAddress']&&requestAddress(stored[mthd], true),

		data.close&&(widget.classList.remove('show'), blocktcha_init.inited=data.verified/**allow retries if unverified */),
		data.verified&&_blocktcha_root_.set([data.result.transaction_hash])
	}
	/*the freighterApi.isConnected method sometimes resolves to an intial false hence why struct.retries is used to retry at most 3 times */
	let begin=hasten=>setTimeout(_=>{
		widget.contentWindow.postMessage({source:'parent', init:!0}, '*'),
		window.freighterApi&&window.freighterApi[mthd='isConnected']().then(bool=>/*added a delay to make for gradual UX*/new Promise(resolve=>setTimeout(_=>resolve(bool), hasten?10:500)))
		.then(bool=>((!bool&&--struct.retries)&&(begin(true), struct.retries)||sandbox(), struct[mthd] = bool)&&(widget.contentWindow.postMessage(struct, target), bool))
		.then(bool=>{
			delete struct[mthd],/*remove previously checked operation to avoid redundancy*/
			bool&&window.freighterApi[mthd='setAllowed']().then(function(allowed) {
				(struct[mthd] = allowed)&&widget.contentWindow.postMessage(struct, target);
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
					setTimeout(_=>widget.contentWindow.postMessage(struct, target), flag?1000:6000/*wait until status texts are animated in the frame*/)
				}
			})
		})
	}, hasten?50:500/*a bit of delay to provide room for extension to behave properly*/);
	window.blocktcha_init = init
})()