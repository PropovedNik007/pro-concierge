import{k as j,y as q,z as g,A as C,h as T,o as V,ac as G,H as X,v as Z,l as J,w as L,x as Q,V as W,d as k,a6 as w,B as ee,X as re,S as se,a0 as y,al as ne,am as ae,an as z,ao as te,g as d,b as ie,ap as N,aq as P,ar as ue,as as fe,at as B,au as le,av as H,aw as ce,ax as oe,aa as F,ak as _e,C as M,ay as pe,R as de,az as ve,a5 as m,aA as K,a4 as he,q as Pe}from"./runtime.Cqpx5nLn.js";import{p as be}from"./preload-helper.CpzpPxVf.js";import{c as Ee}from"./store.DmgX54Oa.js";function Ie(e,r,s,n=null,t=!1){T&&V();var a=e,u=null,f=null,l=null,o=t?G:0;j(()=>{if(l===(l=!!r()))return;let _=!1;if(T){const c=a.data===X;l===c&&(a=Z(),J(a),L(!1),_=!0)}l?(u?q(u):u=g(()=>s(a)),f&&C(f,()=>{f=null})):(f?q(f):n&&(f=g(()=>n(a))),u&&C(u,()=>{u=null})),_&&L(!0)},o),T&&(a=Q)}function Y(e,r){return e===r||(e==null?void 0:e[re])===r}function Oe(e={},r,s,n){return W(()=>{var t,a;return k(()=>{t=a,a=[],w(()=>{e!==s(...a)&&(r(e,...a),t&&Y(s(...t),e)&&r(null,...t))})}),()=>{ee(()=>{a&&Y(s(...a),e)&&r(null,...a)})}}),e}const me={get(e,r){if(!e.exclude.includes(r))return d(e.version),r in e.special?e.special[r]():e.props[r]},set(e,r,s){return r in e.special||(e.special[r]=Se({get[r](){return e.props[r]}},r,z)),e.special[r](s),N(e.version),!0},getOwnPropertyDescriptor(e,r){if(!e.exclude.includes(r)&&r in e.props)return{enumerable:!0,configurable:!0,value:e.props[r]}},deleteProperty(e,r){return e.exclude.includes(r)||(e.exclude.push(r),N(e.version)),!0},has(e,r){return e.exclude.includes(r)?!1:r in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(r=>!e.exclude.includes(r))}};function De(e,r){return new Proxy({props:e,exclude:r,special:{},version:se(0)},me)}const we={get(e,r){let s=e.props.length;for(;s--;){let n=e.props[s];if(P(n)&&(n=n()),typeof n=="object"&&n!==null&&r in n)return n[r]}},set(e,r,s){let n=e.props.length;for(;n--;){let t=e.props[n];P(t)&&(t=t());const a=y(t,r);if(a&&a.set)return a.set(s),!0}return!1},getOwnPropertyDescriptor(e,r){let s=e.props.length;for(;s--;){let n=e.props[s];if(P(n)&&(n=n()),typeof n=="object"&&n!==null&&r in n){const t=y(n,r);return t&&!t.configurable&&(t.configurable=!0),t}}},has(e,r){for(let s of e.props)if(P(s)&&(s=s()),s!=null&&r in s)return!0;return!1},ownKeys(e){const r=[];for(let s of e.props){P(s)&&(s=s());for(const n in s)r.includes(n)||r.push(n)}return r}};function qe(...e){return new Proxy({props:e},we)}function $(e){for(var r=M,s=M;r!==null&&!(r.f&(ue|fe));)r=r.parent;try{return B(r),e()}finally{B(s)}}function Se(e,r,s,n){var D;var t=(s&le)!==0,a=!H||(s&ce)!==0,u=(s&oe)!==0,f=(s&pe)!==0,l=!1,o;u?[o,l]=Ee(()=>e[r]):o=e[r];var _=(D=y(e,r))==null?void 0:D.set,c=n,S=!0,x=!1,I=()=>(x=!0,S&&(S=!1,f?c=w(n):c=n),c);o===void 0&&n!==void 0&&(_&&a&&ne(),o=I(),_&&_(o));var p;if(a)p=()=>{var i=e[r];return i===void 0?I():(S=!0,x=!1,i)};else{var O=$(()=>(t?F:_e)(()=>e[r]));O.f|=ae,p=()=>{var i=d(O);return i!==void 0&&(c=void 0),i===void 0?c:i}}if(!(s&z))return p;if(_){var U=e.$$legacy;return function(i,v){return arguments.length>0?((!a||!v||U||l)&&_(v?p():i),i):p()}}var b=!1,R=!1,E=de(o),h=$(()=>F(()=>{var i=p(),v=d(E);return b?(b=!1,R=!0,v):(R=!1,E.v=i)}));return t||(h.equals=te),function(i,v){if(ve&&(b=R,p(),d(E)),arguments.length>0){const A=v?d(h):a&&u?be(i):i;return h.equals(A)||(b=!0,ie(E,A),x&&c!==void 0&&(c=A),w(()=>d(h))),i}return d(h)}}function ge(e){m===null&&K(),H&&m.l!==null?Re(m).m.push(e):he(()=>{const r=w(e);if(typeof r=="function")return r})}function xe(e,r,{bubbles:s=!1,cancelable:n=!1}={}){return new CustomEvent(e,{detail:r,bubbles:s,cancelable:n})}function Ce(){const e=m;return e===null&&K(),(r,s,n)=>{var a;const t=(a=e.s.$$events)==null?void 0:a[r];if(t){const u=Pe(t)?t.slice():[t],f=xe(r,s,n);for(const l of u)l.call(e.x,f);return!f.defaultPrevented}return!0}}function Re(e){var r=e.l;return r.u??(r.u={a:[],b:[],m:[]})}export{Oe as b,Ce as c,Ie as i,De as l,ge as o,Se as p,qe as s};