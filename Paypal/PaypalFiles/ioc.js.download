/*
 * INTEL CONFIDENTIAL
 * Copyright 2016 Intel Corporation.
 *
 * The source code contained or  described herein and all  documents related  to
 * the source code ('Material') are owned by  Intel Corporation or its suppliers
 * or licensors.  Title to the  Material remains with  Intel Corporation  or its
 * suppliers  and   licensors.  The  Material  may  contain  trade  secrets  and
 * proprietary  and   confidential  information of   Intel Corporation   and its
 * suppliers  and licensors,  and is  protected by  worldwide copyright and trade
 * secret laws  and  treaty provisions. No  part of the Material  may  be  used,
 * copied,   reproduced,  modified,  published,  uploaded, posted,  transmitted,
 * distributed,  or disclosed  in any way without  Intel's prior express written
 * permission.
 *
 * No license  under  any patent, copyright,  trade secret or other intellectual
 * property right is granted to or  conferred upon you by disclosure or delivery
 * of the Materials,  either  expressly, by implication, inducement, estoppel or
 * otherwise.  Any  license under such  intellectual  property  rights  must  be
 * express and approved by Intel in writing.
 *
 * Unless otherwise agreed by Intel in writing, you may not remove or alter this
 * notice  or  any other  notice  embedded  in  Materials  by  Intel  or Intel's
 * suppliers or licensors in any way.
 */

function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _typeof=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),HTTPOK=200,HTTPGET="GET",HTTPPOST="POST",DEFAULT_XHR_TIMEOUT=30;(function(){function r(e,t,n,r,i,s){var o="https://192.55.233.1/"+n;e.open(t,o,!0),e.setRequestHeader("Content-Type","application/json"),e.setRequestHeader("x-jwstoken",i),e.timeout=1e3*s,e.send(r)}function i(e,t){if(typeof e!="function")return;if(n!==null){e();return}var i=new XMLHttpRequest;i.onload=function(){if(i.status===HTTPOK){try{var r=JSON.parse(i.response);n=r.ResourceAccessToken}catch(s){}if(n!==null){e();return}}t!==undefined&&t(b)},i.ontimeout=function(){t!==undefined&&t(b);return};try{var o=s(),u=5,a="resourceaccesstoken";r(i,"POST",a,o,"",u)}catch(f){}}function s(){var e=Date.now(),t=e+54e5,n=null,r={"api-key":"AsmApiKey",iat:e,expcr:t,explp:t,"app-name":"Intel FIDO UAF Client",cap:["security/discover","security/processuafoperation","security/checkpolicy","security/notifyuafresult"]};return JSON.stringify(r)}var e=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"discover",value:function(t,s){if(typeof s!="function")return;if(typeof t!="function"){s(h);return}i(function(){var e=new XMLHttpRequest;e.onload=function(){if(e.status===HTTPOK)try{var n=JSON.parse(e.responseText);t(n)}catch(r){s(h)}else{var i=b;try{var o=JSON.parse(e.responseText);o.ErrorCode&&(i=o.ErrorCode)}catch(r){}s(i)}},e.onerror=function(){s(b)};var i="security/discover";r(e,HTTPGET,i,"",n,DEFAULT_XHR_TIMEOUT)},s)}},{key:"processUAFOperation",value:function(t,s,o){if(typeof o!="function")return;if(typeof s!="function"){o(h);return}if((typeof t=="undefined"?"undefined":_typeof(t))!=="object"){o(h);return}i(function(){var e=new XMLHttpRequest;e.onload=function(){if(e.status===HTTPOK)try{var t={uafProtocolMessage:e.responseText};s(t)}catch(n){o(h)}else{var r=b;try{var i=JSON.parse(e.responseText);i.ErrorCode&&(r=i.ErrorCode)}catch(n){}o(r)}},e.onerror=function(){o(b)};try{var i=JSON.stringify(t),u=90,a="security/processuafoperation";r(e,HTTPPOST,a,i,n,u)}catch(f){o(h)}},o)}},{key:"checkPolicy",value:function(t,s){if(typeof s!="function")return;if((typeof t=="undefined"?"undefined":_typeof(t))!=="object"){s(h);return}i(function(){var e=new XMLHttpRequest;e.onload=function(){if(e.status===HTTPOK)s(o);else{var t=b;try{var n=JSON.parse(e.responseText);n.ErrorCode&&(t=n.ErrorCode)}catch(r){}s(t)}},e.onerror=function(){s(b)};try{var i=JSON.stringify(t),u="security/checkpolicy";r(e,HTTPPOST,u,i,n,DEFAULT_XHR_TIMEOUT)}catch(a){s(h)}},s)}},{key:"notifyUAFResult",value:function(t,s){if(typeof t!="number")return;if((typeof s=="undefined"?"undefined":_typeof(s))!=="object")return;i(function(){var e=new XMLHttpRequest;e.onload=function(){e.status===HTTPOK},e.onerror=function(){};try{s.additionalData!==null;var i={uafProtocolMessage:s.uafProtocolMessage,additionalData:t},o="security/notifyuafresult",u=JSON.stringify(i);r(e,HTTPPOST,o,u,n,DEFAULT_XHR_TIMEOUT)}catch(a){}})}}]),e}(),t=new e,n=null,o=0,u=1,a=2,f=3,l=4,c=5,h=6,p=7,d=9,v=12,m=13,g=14,y=15,b=255;Object.defineProperty(navigator,"fido",{get:function(){return Object.defineProperty(navigator,"uaf",{configurable:!1,writable:!0,value:t})},configurable:!1}),Object.freeze(navigator.fido.uaf)})();