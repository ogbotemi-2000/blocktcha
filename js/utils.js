const Ev = node=>ev=>(cb, obj)=>/^on/.test(ev)?node[ev]=cb:node[node.attachEvent?'attachEvent':'addEventListener'](ev, cb, obj),
      w_Ev = Ev(window), w_Ev_dom = w_Ev('DOMContentLoaded'), w_Ev_rz = w_Ev('resize'),
      cLs =bool=>bool?'add':'remove';

/*self contained component*/
function grow_shrink(e,i,c,n,d,k, cls){
  d=grow_shrink,n={500:'base',640:'sm',768:'md',1024:'lg',1280:'xl'},
  c=document.createElement("div"),
  !d.cached&&(d.cached={}),!d.arr&&(d.arr=[].slice.call((d.el=window.growShrink).querySelectorAll(".fluid"))),
  !d.dump&&(d.dump=d.el.querySelector("a+div>div")),
  (e=(k=Object.keys(n).filter((c,n)=>(i=n,c>e)))[0]), k = new RegExp(k.map(e=>n[e]+':show').join('|')),
  d.vw!==e&&!d.cached[d.vw=e]&&d.arr.forEach((n,r,o)=>{
    (n=n.cloneNode(!0)).classList.add(c.className=d.el.getAttribute('data-classname'));
    if(((cls=n.classList)+'').match(k)) cls.remove('clicked'), (cls+'').replace(/(base|sm|md|lg|xl):show/, function(a) {
      cls.remove(a, 'fluid')
    }), /* n.className=l?"clicked":"",*/ c.appendChild(n), !d.cached[e]&&(d.cached[e]=c)
  }),d.dump.replaceChild(d.cached[e]||c,d.dump.firstChild)}

w_Ev_dom(_=>{
  window.growShrink&&(grow_shrink(innerWidth), w_Ev_rz(_=>{
    grow_shrink(innerWidth)
  }))
})


function byteFormat(num, res='') {
  if(num<1024) {
    res = num+' bytes';
  } else if(1024<=num&&num<1048576) {
    res += num/1024,
    res = res.slice(0, res.indexOf('.')+3) /*3-1 dp*/+' KB'
  } else {
    res += num/1048576,
    res = res.slice(0, res.indexOf('.')+3) /*3-1 dp*/+' MB'
  }
  return res
}

function minMax(obj, isRem, arr=['min','max'], vary, cnst, fn, str) {
  minMax.switch = fn = (value, isRem) => isRem ? value*16 : value/16,
    
  arr.forEach((e, i, arr, max)=>{
    arr[i] = obj[e], max = arr[2+i] = obj['v'+e],
    !i ? vary = (obj[arr[1+i]] - arr[i])/(obj['v'+arr[i+1]] - max) : (cnst = (arr[i] - max * vary)/16, str = `clamp(${fn(arr[i-1], false)}rem, ${cnst.toFixed(3)}rem + ${(100*vary).toFixed(2)}vw, ${fn(arr[i], false)}rem) `)
  });
  return str
}

function relation(parent, child) {
    return [parent.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_CONTAINED_BY,
            parent.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_CONTAINS]
}

  let Abbr={
    dict: function(arr) {
      arr.forEach((str, abbr)=>{
        abbr=str.charAt(0), str.replace(/[A-Z]/g, a=>abbr+=a),
        (this.__dict||={})[abbr] = str
      })
    },
    to  : function(node, arg, flag, dict, arr) {
      dict = this.__dict, str='', arr = Array.isArray(arg)?arg:[arg];
      for(let e, p=[], k=0, j=arr.length; p=[], e=arr[k], k<j; k++) {
        if(typeof e==="object") {
          if(e.at) p=e;
          else { for(let i in e) { (e[i]+' ').repeat(i).split(/\s+/).forEach(e=>e&&p.push(e)) } } 
        }
        else p=[e];
        p.find((str, v, bool)=>((v=node[str]||node[dict[str]])?node=v:/*break*/k=j, /*enforce*/flag&&(node=v), !v))
      }
      return node
    }
   };
  Abbr.dict(['childNodes', 'classList', 'parentNode', 'previousElementSibling', 'nextElementSibling', 'nextSibling', 'firstChild', 'firstElementChild', 'lastChild', 'lastElementChild']);

(function() {  
  function detectInconsistentEval() {
    let length = eval.toString().length;
    let userAgent = navigator.userAgent.toLowerCase();
    let browser;

    if (userAgent.indexOf("edg/") !== -1) {
      browser = "edge";
    } else if (
      userAgent.indexOf("trident") !== -1 ||
      userAgent.indexOf("msie") !== -1
    ) {
      browser = "internet_explorer";
    } else if (userAgent.indexOf("firefox") !== -1) {
      browser = "firefox";
    } else if (
      userAgent.indexOf("opera") !== -1 ||
      userAgent.indexOf("opr") !== -1
    ) {
      browser = "opera";
    } else if (userAgent.indexOf("chrome") !== -1) {
      browser = "chrome";
    } else if (userAgent.indexOf("safari") !== -1) {
      browser = "safari";
    } else {
      browser = "unknown";
    }

    if (browser === "unknown") return false;

    return (
      (length === 33 && !["chrome", "opera", "edge"].includes(browser)) ||
      (length === 37 && !["firefox", "safari"].includes(browser)) ||
      (length === 39 && !["internet_explorer"].includes(browser))
    );
  }
  function byUserAgent(ev, axes) {
    if(navigator.userAgent.includes("Headless") || !navigator.languages.length || navigator.webdriver|| document.$cdc_asdjflasutopfhvcZLmcfl_|| detectInconsistentEval()) return;
    /*events like click can't be so precisely fired by a human as to have the coordinates of the point clicked to be at the top right i.e 0. 0*/
    axes = ['clientX', 'clientY', 'pageX', 'pageY', 'screenX', 'screenY', 'x', 'y'].map(e=>ev[e]).filter(e=>e);
    /*bots powered by selenium may fool browsers by making dispatched events seem user-prompted hence why isTrusted comes second*/
    return !!(axes.length||ev.isTrusted||ev.detail)
  }
  window.byUserAgent = byUserAgent
})()