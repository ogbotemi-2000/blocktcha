(function(d,w,h,b) {
	let url		 = '',//'https://blocktcha.vercel.app/',
			crE    = (tag, attrs, values)=>(tag = d.createElement(tag), values&&Object.keys(values).forEach(key=>tag[key]=values[key]), attrs.forEach(attr=>tag.setAttribute(attr.name, attr.value)), tag),
	    wallet = crE('script', [{name:"src", value:"https://cdnjs.cloudflare.com/ajax/libs/stellar-freighter-api/2.0.0/index.min.js"}]),
			styles = crE('style', [{name:'data-blocktcha_styles', value:''}], {
				textContent: `/*styles used in widget*/
.blocktcha_root.text-xs {
    font-size: .75rem;
    line-height: 1rem;
}

	 .blocktcha_root > * {
	    box-sizing: border-box;
	    border-color: rgb(229,231,235);
	 }
	.blocktcha_root {
		padding: 0.5rem;
		font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"
	}
	.blocktcha_root > input {
	  visibility: hidden;
		position: absolute;
		pointer-events: none;
	}
	.blocktcha_root > i {
	  display: inline-block;
		position: relative;
		vertical-align: middle;
	}
	.blocktcha_root > div {
	  z-index:99999;
		left:0px;top:0px;bottom:0px;right:0px;
		position: fixed;
		opacity: 0;
		pointer-events: none;
	}
	.blocktcha_root > button {
		border: 2px solid rgb(107,114,128);
		padding: 0.5rem 1.25rem;
		position: relative;
		border-radius: 100px;
		margin: 0px 1rem;
		cursor: pointer;
	}
	.blocktcha_root > iframe {
		padding-top: 1.25rem;
		overflow: hidden;
		width: 80%;
		left: 0px;
		border-width: 2px;
		position: absolute;
		border-radius: 1.5rem;
	}
	@media(min-width:640px) {
	  .blocktcha_root {
		  position: relative;
		}
		.blocktcha_root > iframe {
		  width: 24rem; 
		}
	}
	/*styles related to compositing */
	.blocktcha_root > iframe {
	  background: white;
	}
	/*utilities*/
	.tooltip {
   --delay: 0s;
    font-family: inherit;
    transition: opacity 0.2s, transform 0.2s ease, visibility 0s;
	--arrow-x: 0%;
	--arrow-y: 0%;
    --arrow-color: currentcolor;
	--arrow-degree: 0deg;
}
.tooltip:not(.vanish-hover) {
  visibility: hidden;
  opacity: 0;
}
.tooltip.no-hover {
 --x: 0px;
 --y: 0%;
 --pad-x: 0px;
 --pad-y: 0px;
 --offset: calc(var(
 --pad-x) + var(--x)), calc(var(--pad-y) + var(--y)), 0px;
 transform: translate3d(var(--offset)) !important;
}
.tooltip.show {
 visibility: visible;
 opacity: 1;
 z-index: 3;
}
.tooltip:not(.show).no-hover.no-focus .tooltip, .tooltip:not(.show).no-hover.no-focus .tooltip.md\:show, .tooltip:not(.show).no-hover.no-focus .tooltip.sm\:show, .tooltip:not(.show).no-hover.no-focus .tooltip.lg\:show, .tooltip:not(.show).no-hover.no-focus .tooltip.xl\:show {
	pointer-events: none;
}
.tooltip.slide-y {
	--y: 20%;
	transition: opacity 0.5s ease, transform 0.3s 0.17s ease-out, visibility 0s 0.12s;
}
.tooltip.slide-y.show {
  --x: 0%;
  --y: 0%;
  z-index: 1;
  transition: opacity 0.5s, transform 0.3s 0.12s ease, visibility 0s 0.06s;
}
.opacity-10 {
  opacity: 0.1;
}
.overlay {
  background: rgb(245,158,11);
	transition: 0.3s ease-out;
}

.bars-7 {
  padding: 8px;
  --c:no-repeat repeating-linear-gradient(90deg,#000 0 calc(100%/7),#0000 0 calc(200%/7));
  background: 
    var(--c),
    var(--c),
    var(--c),
    var(--c);
  background-size: 140% 26%;
  background-repeat: no-repeat;
  animation: b7 .75s infinite linear;
}

@keyframes b7 {
 0%,20%   {background-position:0    calc(0*100%/3),100% calc(1*100%/3),0    calc(2*100%/3),100% calc(3*100%/3)}
 80%,100% {background-position:100% calc(0*100%/3),0    calc(1*100%/3),100% calc(2*100%/3),0    calc(3*100%/3)}
}
`}),
	script = crE('script', [{name:'src', value:`${url}app/blocktcha_init.js`}]),
	utils  = crE('script', [{name:'src', value:`${url}js/utils.js`}]);
	[utils, script, wallet].forEach(node=>h.appendChild(node)),
 	h.prepend(styles);

	function scopeLoaded(scope, callback, document, t) {
		document = scope.document || scope.contentDocument,
		t=scopeLoaded, clearInterval(t.intrvl),
		t.intrvl =setInterval(function() {
			if(document.readyState ==='complete') clearInterval(t.intrvl), callback();
		})
	}
	function destroy(html, flag, root, frame) {
		root = w['_blocktcha_root_'], !flag&&root.classList.add('text-xs'),
		window.blocktcha_init = null,
		(frame = root.querySelector('iframe'))&&frame.remove(),
		root.innerHTML = html
	}
	
	scopeLoaded(w, function(root, frame, domain, attr, overlay, loader, button) {
		domain = w.location.origin.replace(/http(s|):\/\//, '');
		if(!(root = w['_blocktcha_root_'])) return;
		if(!(attr = root.getAttribute('data-sitekey'))) { destroy('No domain specified for widget'); return; }
		if((attr=atob(attr)) != domain) { destroy('Registered domain and site domain are not the same'); return;}

		(button = root.querySelector('button')).appendChild(loader = crE('i', [{name:'class', value:'bars-7'}])),
		root.destroy = destroy,
		root.appendChild(frame=crE('iframe', [{name:'src', value:`${url}widget.html`}])),
		frame.className='tooltip slide-y no-hover no-focus no-focus-within', frame.height=200,
		(overlay = root.querySelector('div'))&&overlay.classList.add('overlay'),

		fetch(`${url}api/check?domain=${attr}`).then(res=>res.json()).then(res=>{
			if(res.error) { destroy(`<strong>${domain}</strong> is not registered in app, do so here - <a href='https://blocktcha.vercel.app'><strong>blocktcha</strong></a>`); return; }
			[crE('input', [{ name: 'name', value: 'blocktcha_hash' }, { name:'style' , value:"pointer-events:none;position:absolute;visibility:hidden"} ]), crE('input', [{ name:'name', value:'siteKey' }, { name:'style' , value:"pointer-events:none;position:absolute;visibility:hidden"} ])].forEach(node=>root.appendChild(node)),
			root.set = (values, form)=>{
				/** obtain form for further operations such as preventing submissions */
				form = [].find.call(d.forms, form=>relation(form, root)[0]),
				values.push(attr),
				root.querySelectorAll('input').forEach((input, i)=>{ input.value = values[i], form.appendChild(input) }),
				fetch(`${url}api/keep`, { method: 'POST', body: `transaction_hash=${values[0]}&domain=${values[1]}` }).then(_=>{
					frame.classList.remove('show'),
					_blocktcha_root_.destroy(`Verified as human<br><a target="_blank" href="https://stellar.expert/explorer/testnet/tx/${values[0]}">Here is your receipt ↗</a>`, true);
				})
			},

			scopeLoaded(frame, _=>setTimeout(_=>{
				loader.remove(),
				root.querySelector('button').onclick=function(event) {
					if(blocktcha_init.inited) return; byUserAgent(event)?blocktcha_init(this):destroy('This is an automaton not a human')
				}
			}, 1e3))
		})
	})
})(document, window, document.head, document.body)