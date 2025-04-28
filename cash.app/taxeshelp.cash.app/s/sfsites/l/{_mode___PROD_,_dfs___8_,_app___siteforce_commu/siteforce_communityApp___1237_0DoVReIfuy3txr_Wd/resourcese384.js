'undefined'===typeof Aura&&(Aura={});
(function() { 
	 function initAccessResources() {
			 $A.componentService.addModule('markup://force:customPerms', 'force/customPerms', ['exports'], null, {}); 
			 $A.componentService.addModule('markup://force:userPerms', 'force/userPerms', ['exports'], null, {}); 
	 };
	 if(Aura.frameworkJsReady)initAccessResources();else{Aura.beforeFrameworkInit=Aura.beforeFrameworkInit||[],Aura.beforeFrameworkInit.push(initAccessResources)}
})(); 
Aura.StaticResourceMap = {"ChartJS":{"datadetect":1655397151000},"ContactIcons":{"":1707868327000},"SNA_Taxes_Help1_sf_cdn_E0YGj":{"":1732110065000},"fsc_Quickchoice_Images":{"":1670541268000},"CashSans":{"":1732108450000},"CATLogos":{"":1732108515000},"forceignore2":{"sf_devops":1665507164000},"forceignore1":{"sf_devops":1665507164000},"CashMarketFont":{"":1629910236000},"nrecaptcha":{"niantec":1634303094000},"SuggestedLinks":{"":1707868327000},"FooterIcons":{"":1684945057000},"SiteSamples":{"":1629910241000},"PrototypeLib":{"":1637002830000},"Favicon":{"":1690296060000},"devopsCenter":{"sf_devops":1744814756000},"DOCeForceIgnore":{"sf_devops":1665507164000}};

(function() {
function initResourceGVP() {
if (!$A.getContext() || !$A.get('$Resource')) {
$A.addValueProvider('$Resource',
{
merge : function() {},
isStorable : function() { return false; },
get : function(resource) {
var modStamp, rel, abs, name, ns;
var nsDelim = resource.indexOf('__');
if (nsDelim >= 0) { ns = resource.substring(0, nsDelim); name = resource.substring(nsDelim + 2); } else { name = resource; }
var srMap = Aura.StaticResourceMap[name];
modStamp = srMap && srMap[ns = ns || Object.keys(srMap)[0]];
if (!modStamp) { return; }
rel = $A.get('$SfdcSite.pathPrefix');
abs = $A.get('$Absolute.url');
return [(abs || rel || ''), '/resource/', modStamp, '/', ns === '' ? name : ns + '__' + name].join('');
}
});
}
}
if(Aura.frameworkJsReady)initResourceGVP();else{Aura.beforeFrameworkInit=Aura.beforeFrameworkInit||[],Aura.beforeFrameworkInit.push(initResourceGVP)}
})();