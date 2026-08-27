import { APP_LOCALES, LOCALE_STORAGE_KEY } from "./instance";

export const LOCALE_BOOT_SCRIPT = `(function(){var k=${JSON.stringify(LOCALE_STORAGE_KEY)};var l=${JSON.stringify(APP_LOCALES)};var v="en";try{var s=localStorage.getItem(k);if(l.indexOf(s)!==-1)v=s}catch(e){}document.documentElement.lang=v;document.documentElement.setAttribute("data-locale",v);if(v!=="en"){document.documentElement.setAttribute("data-i18n-pending","");var t=document.createElement("style");t.id="smartx-i18n-boot";t.textContent="html[data-i18n-pending] body{opacity:0}";document.documentElement.appendChild(t)}})();`;
