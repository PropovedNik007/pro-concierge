import{X as w,Y as j,Z as N,S as y,_ as A,b as g,$ as l,a0 as S,g as E,C as B,a1 as C,a2 as D,q as T}from"./runtime.Cqpx5nLn.js";function b(r,v=null,_){if(typeof r!="object"||r===null||w in r)return r;const m=D(r);if(m!==j&&m!==N)return r;var a=new Map,h=T(r),c=y(0);h&&a.set("length",y(r.length));var o;return new Proxy(r,{defineProperty(i,e,t){(!("value"in t)||t.configurable===!1||t.enumerable===!1||t.writable===!1)&&A();var n=a.get(e);return n===void 0?(n=y(t.value),a.set(e,n)):g(n,b(t.value,o)),!0},deleteProperty(i,e){var t=a.get(e);if(t===void 0)e in i&&a.set(e,y(l));else{if(h&&typeof e=="string"){var n=a.get("length"),s=Number(e);Number.isInteger(s)&&s<n.v&&g(n,s)}g(t,l),k(c)}return!0},get(i,e,t){var u;if(e===w)return r;var n=a.get(e),s=e in i;if(n===void 0&&(!s||(u=S(i,e))!=null&&u.writable)&&(n=y(b(s?i[e]:l,o)),a.set(e,n)),n!==void 0){var f=E(n);return f===l?void 0:f}return Reflect.get(i,e,t)},getOwnPropertyDescriptor(i,e){var t=Reflect.getOwnPropertyDescriptor(i,e);if(t&&"value"in t){var n=a.get(e);n&&(t.value=E(n))}else if(t===void 0){var s=a.get(e),f=s==null?void 0:s.v;if(s!==void 0&&f!==l)return{enumerable:!0,configurable:!0,value:f,writable:!0}}return t},has(i,e){var f;if(e===w)return!0;var t=a.get(e),n=t!==void 0&&t.v!==l||Reflect.has(i,e);if(t!==void 0||B!==null&&(!n||(f=S(i,e))!=null&&f.writable)){t===void 0&&(t=y(n?b(i[e],o):l),a.set(e,t));var s=E(t);if(s===l)return!1}return n},set(i,e,t,n){var O;var s=a.get(e),f=e in i;if(h&&e==="length")for(var u=t;u<s.v;u+=1){var d=a.get(u+"");d!==void 0?g(d,l):u in i&&(d=y(l),a.set(u+"",d))}s===void 0?(!f||(O=S(i,e))!=null&&O.writable)&&(s=y(void 0),g(s,b(t,o)),a.set(e,s)):(f=s.v!==l,g(s,b(t,o)));var P=Reflect.getOwnPropertyDescriptor(i,e);if(P!=null&&P.set&&P.set.call(n,t),!f){if(h&&typeof e=="string"){var x=a.get("length"),R=Number(e);Number.isInteger(R)&&R>=x.v&&g(x,R+1)}k(c)}return!0},ownKeys(i){E(c);var e=Reflect.ownKeys(i).filter(s=>{var f=a.get(s);return f===void 0||f.v!==l});for(var[t,n]of a)n.v!==l&&!(t in i)&&e.push(t);return e},setPrototypeOf(){C()}})}function k(r,v=1){g(r,r.v+v)}function I(r){return r!==null&&typeof r=="object"&&w in r?r[w]:r}function K(r,v){return Object.is(I(r),I(v))}const $="modulepreload",q=function(r,v){return new URL(r,v).href},L={},Y=function(v,_,m){let a=Promise.resolve();if(_&&_.length>0){const c=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),i=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));a=Promise.allSettled(_.map(e=>{if(e=q(e,m),e in L)return;L[e]=!0;const t=e.endsWith(".css"),n=t?'[rel="stylesheet"]':"";if(!!m)for(let u=c.length-1;u>=0;u--){const d=c[u];if(d.href===e&&(!t||d.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${e}"]${n}`))return;const f=document.createElement("link");if(f.rel=t?"stylesheet":$,t||(f.as="script"),f.crossOrigin="",f.href=e,i&&f.setAttribute("nonce",i),document.head.appendChild(f),t)return new Promise((u,d)=>{f.addEventListener("load",u),f.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${e}`)))})}))}function h(c){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=c,window.dispatchEvent(o),!o.defaultPrevented)throw c}return a.then(c=>{for(const o of c||[])o.status==="rejected"&&h(o.reason);return v().catch(h)})};export{Y as _,K as i,b as p};
