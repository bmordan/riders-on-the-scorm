var web_safe_title=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function u(t,n){t.appendChild(n)}function a(t,n,e){t.insertBefore(n,e||null)}function f(t){t.parentNode.removeChild(t)}function s(t){return document.createElement(t)}function i(t){return document.createTextNode(t)}function l(){return i(" ")}let d;function h(t){d=t}const p=[],g=[],m=[],$=[],y=Promise.resolve();let x=!1;function _(t){m.push(t)}function b(){const t=new Set;do{for(;p.length;){const t=p.shift();h(t),v(t.$$)}for(;g.length;)g.pop()();for(let n=0;n<m.length;n+=1){const e=m[n];t.has(e)||(e(),t.add(e))}m.length=0}while(p.length);for(;$.length;)$.pop()();x=!1}function v(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(_)}}const w=new Set;function C(t,n){-1===t.$$.dirty[0]&&(p.push(t),x||(x=!0,y.then(b)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function E(c,u,a,f,s,i,l=[-1]){const p=d;h(c);const g=u.props||{},m=c.$$={fragment:null,ctx:null,props:i,update:t,not_equal:s,bound:e(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(p?p.$$.context:[]),callbacks:e(),dirty:l};let $=!1;var y,x;m.ctx=a?a(c,g,(t,n,e=n)=>(m.ctx&&s(m.ctx[t],m.ctx[t]=e)&&(m.bound[t]&&m.bound[t](e),$&&C(c,t)),n)):[],m.update(),$=!0,o(m.before_update),m.fragment=!!f&&f(m.ctx),u.target&&(u.hydrate?m.fragment&&m.fragment.l(function(t){return Array.from(t.childNodes)}(u.target)):m.fragment&&m.fragment.c(),u.intro&&((y=c.$$.fragment)&&y.i&&(w.delete(y),y.i(x))),function(t,e,c){const{fragment:u,on_mount:a,on_destroy:f,after_update:s}=t.$$;u&&u.m(e,c),_(()=>{const e=a.map(n).filter(r);f?f.push(...e):o(e),t.$$.on_mount=[]}),s.forEach(_)}(c,u.target,u.anchor),b()),h(p)}function j(n){let e,o,r,c,d,h,p,g,m=n[0].length+"";return{c(){var t,n,u;e=s("h1"),e.textContent=`${k.toUpperCase()}`,o=l(),r=s("h2"),r.textContent=`its ${(new Date).toISOString()}`,c=l(),d=s("h3"),h=i("I have "),p=i(m),g=i(" pages"),t=e,n="class",null==(u="svelte-1lmthx9")?t.removeAttribute(n):t.getAttribute(n)!==u&&t.setAttribute(n,u)},m(t,n){a(t,e,n),a(t,o,n),a(t,r,n),a(t,c,n),a(t,d,n),u(d,h),u(d,p),u(d,g)},p(t,[n]){1&n&&m!==(m=t[0].length+"")&&function(t,n){n=""+n,t.data!==n&&(t.data=n)}(p,m)},i:t,o:t,d(t){t&&f(e),t&&f(o),t&&f(r),t&&f(c),t&&f(d)}}}const k="Hello World";function A(t,n,e){let o;return fetch("pages.json").then(t=>t.json()).then(t=>e(0,o=t)).catch(console.error),e(0,o=[]),[o]}return new class extends class{$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}{constructor(t){super(),E(this,t,A,j,c,{})}}({target:document.getElementById("package")})}();
