// if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,a)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>n(e,t),o={module:{uri:t},exports:c,require:r};s[t]=Promise.all(i.map((e=>o[e]||r(e)))).then((e=>(a(...e),c)))}}define(["./workbox-5afaf374"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Categories.JPG",revision:"4c5c5e64a01e14f660e2fafec37dba63"},{url:"/Draku-Homepage.JPG",revision:"945cd6b017823a956185dc4feeba98e3"},{url:"/Overview.JPG",revision:"e92d5b784146afd9d5512c9d2d94891a"},{url:"/_next/static/ZgyUmW9bYYM1zLhhWbJOj/_buildManifest.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/ZgyUmW9bYYM1zLhhWbJOj/_middlewareManifest.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/ZgyUmW9bYYM1zLhhWbJOj/_ssgManifest.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/133-d5833efdec30ea55.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/36bcf0ca-399d6519f7b3fb18.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/478-221b0b8235f8daee.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/576-24e79542587f0420.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/651.243d23442247d286.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/721-affe542ed1b53ce8.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/framework-5f4595e5518b5600.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/main-01157a903e3a8de8.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/_app-66fd3c827c9e2748.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/_error-2f883067a14f4c4a.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/index-5129c2f86d397346.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/login-8005bde46b156272.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/logout-16f30fd1bb935ebf.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/signup-d689b0e7ef7f6a30.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/users/%5BuserId%5D-aa0cab11becd26bc.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/users/budgetManagement-3f66a65ec4f8e09a.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/users/categoriesManagement-fc0464e329e619eb.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/users/expenses-3a199c16214c5646.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/pages/users/reminder-09e568afdcef3752.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/_next/static/chunks/webpack-d3ae5b9457a1f37a.js",revision:"ZgyUmW9bYYM1zLhhWbJOj"},{url:"/close2.png",revision:"e0ca771efeb621f418a91e1f9ee63f33"},{url:"/close3.png",revision:"234d8be1c27af00c79b749f8dced4d9d"},{url:"/delete.png",revision:"f961f5f45687fd783d3953a891c2fa48"},{url:"/dragon(1).png",revision:"04915598774188f025f7047f0d6d51c2"},{url:"/dragon.png",revision:"9832a79837e05ef055a879d162c1886c"},{url:"/draku_logo.png",revision:"77866193fb5a527e44ab46e94dff9b78"},{url:"/editer.png",revision:"39f632bc885b48316c175eb9926a2cbd"},{url:"/expense.png",revision:"0b67fbc8d5c709546c1eed169d750a98"},{url:"/expense2-hover.png",revision:"2955af932d9669f8bbc249f36a30bfb5"},{url:"/expense2.png",revision:"fc56b20909de58fdc161dc4c73040f7e"},{url:"/favicon.ico",revision:"c30c7d42707a47a3f4591831641e50dc"},{url:"/la-finance.png",revision:"062bdfcaffe1b2fe68f10a57625b0074"},{url:"/manifest.json",revision:"c46c580fa5599d4e3b8810748388dfff"},{url:"/maskable_icon.png",revision:"000cb2d6a479390a6a311ed3e1e2b574"},{url:"/piggy.png",revision:"af6df1b54671d7b94c70f288f28f5174"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"},{url:"/wallet.png",revision:"d6c79d62172fa097147fd8c0c51060c1"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
