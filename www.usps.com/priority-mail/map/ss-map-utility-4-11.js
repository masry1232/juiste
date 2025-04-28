var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', '/priority-mail/map/pm_map.css');
document.getElementsByTagName('head')[0].appendChild(link);

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("esri.map");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.layers.graphics");
dojo.require("esri.renderer");
dojo.require("esri.tasks.gp");
dojo.require("esri.tasks.query");
dojo.require("dijit.form.Button");
dojo.require("esri.dijit.Print");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.symbols.SimpleMarkerSymbol");
dojo.require("esri.geometry.Point");
dojo.require("esri.graphic");
dojo.require("dojo.dom");
dojo.require("dojo.dom-construct");
dojo.require("dojo.domReady!");
dojo.require("esri.request");
dojo.require("esri.tasks.PrintTemplate");
dojo.require("esri.config");
dojo.require("dojo._base.array");
dojo.require("esri.arcgis.utils");
dojo.require("esri.layers.agsdynamic");
dojo.require("esri.layers.agstiled");
dojo.require("esri.geometry.Extent");
dojo.require("esri.layers.LOD");
dojo.require("esri.dijit.Legend");
dojo.require("esri.tasks.LegendLayer");





var map;
var bufferLayer;
var pinLayer;
var StandardsResults;
var origzip3;
var origzip5;
var gp;
var lookupcount;
var currentZoom = 45254955.38108561;

function init(){
		
	lookupcount = 0;
		
	//buffer layer for lookup results
	bufferLayer = new esri.layers.GraphicsLayer({
   		id: "bufferLayer",
		opacity: 0.7
	});
	//dynamic map
    var psseLayerURL = "https://ssmap.#/arcgis/rest/services/ServiceStandards/PMAP_Projected/MapServer";
    var psseLayer = new esri.layers.ArcGISDynamicMapServiceLayer(psseLayerURL, {
          id: "psseLayer",
		  opacity: 1.0	
    });
	//blue color layer
	var blueLayerUrl = "https://ssmap.#/arcgis/rest/services/ServiceStandards/PMAP_ProjectedColor/MapServer";
  	var blueLayer = esri.layers.ArcGISDynamicMapServiceLayer(blueLayerUrl, { 
        id: "blueLayer",
		opacity: 1.0		
    });


	
	map = new esri.Map("mapDiv", { 
        center: [-98.34960937497242, 38.94989178680422],
        zoom: 1,
		maxScale:353554.3389147311,
		minScale:90509910.76217116,
		logo: false,
        basemap: 'streets'
	});
	
	map.addLayer(psseLayer,0);

	map.addLayer(blueLayer,1);	

	createPrintableButtonArea();
	
	//pin layer
	pinLayer = new esri.layers.GraphicsLayer({
   		id: "pinLayer"
	});

	map.addLayer(bufferLayer,2);

	map.addLayer(pinLayer, 3);

	createmapLegendDiv();
	
	createLoadingImgDiv();
	dojo.connect(map, "onUpdateStart", function() {
    	esri.show(dojo.byId("loadingImg"));					 
    });
    dojo.connect(map, "onUpdateEnd", function() {
    	esri.hide(dojo.byId("loadingImg"));		
    });
	
	dojo.connect( map, "onZoomEnd", function(){	
		currentZoom = map.getScale();
	});
	
}


//Search with origination ZIP	
function execute(originationzip, servicetype){
	//clear existing graphics 
	bufferLayer.clear();
	pinLayer.clear();
	
	if (lookupcount == 0) {		
		removeBlueColor();
		lookupcount = lookupcount + 1;
	}
	

    var origzip = originationzip;
	var classtype = servicetype.toLowerCase();
	// commented out changing zip to zip3 - this will allow zip 5 to exist (Keeping origzip3 var name to avoid changes elsewhere)

	if (origzip.length == 3) {
		origzip3 = origzip;
	} else if (origzip.length > 3) {
        origzip3 = origzip.substr(0, 3);
    }
	origzip5 = origzip;
	
	esri.show(dojo.byId("loadingImg"));
	
	gp = new esri.tasks.Geoprocessor("https://ssmap.#/arcgis/rest/services/ServiceStandards/getStandardsMap/GPServer/getStandardsMap");
	
    gp.setOutputSpatialReference({
        wkid: 102100
    });

    var params = {
        "orig_zip": origzip3,
		"std_class": classtype
    };
	if (classtype.toLowerCase() == "pnd"){
		params = {
        "orig_zip": origzip5,
		"std_class": "pnd"
    };
	}
    gp.execute(params, displayResults, errorHandler);
}

var testResults = null;
var testfeatureSet = null;
function displayResults(results, messages){	
	esri.hide(dojo.byId("loadingImg"));
	
    var defaultSymbol = new esri.symbol.SimpleFillSymbol().setStyle(esri.symbol.SimpleFillSymbol.STYLE_NULL);
    defaultSymbol.outline.setStyle(esri.symbol.SimpleLineSymbol.STYLE_NULL);
  		testResults = results;

  	if (dojo.byId('form-service').value == 'PND'){
	  var renderer = new esri.renderer.UniqueValueRenderer(defaultSymbol, results[0].value.fields[8].name);
	  renderer.addValue("01", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([243, 161, 209, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([243, 161, 209, 1.0])).setWidth(2)));
	  renderer.addValue("02", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([168, 195, 221, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([168, 195, 221, 1.0])).setWidth(2)));
	} else {
	var renderer = new esri.renderer.UniqueValueRenderer(defaultSymbol, results[0].value.fields[1].name);
    renderer.addValue("01", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([168, 195, 221, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("02", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([243, 161, 209, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("03", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([245, 249, 165, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
	
	// add new rederer value for each of the new colors - going up to 10 needs to be added
    renderer.addValue("04", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([223, 188, 248, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("05", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([241, 164, 101, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("06", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([165, 159, 187, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("07", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([124, 165, 190, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("08", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([235, 200, 138, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("09", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([155, 239, 180, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("10", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([176, 116, 140, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("11", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([153, 156, 115, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("12", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([199, 165, 209, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("13", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([159, 148, 239, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("14", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([204, 211, 204, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("15", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([171, 151, 145, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("16", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([210, 248, 206, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("17", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([235, 210, 188, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("18", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([224, 222, 239, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("19", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([208, 161, 161, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("20", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([184, 199, 173, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
    renderer.addValue("21", new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([239, 225, 157, 1.0])).setOutline(new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([118, 26, 18, 1.0])).setWidth(2)));
	}

    bufferLayer.setRenderer(renderer);

    StandardsResults = results[0].value.features;
    dojo.forEach(StandardsResults, function(feature){
		bufferLayer.add(feature); 
    });
  	

	if (dojo.byId('form-service').value == 'PND'){
		addPinLabel5(origzip5);
		map.setExtent(esri.graphicsExtent(bufferLayer.graphics), true);
	} else {
		map.setZoom(1);
		addPinLabel(origzip3);
	}
  callLegend();
}


function errorHandler(err){
    console.log('Oops, error: ', err);
	esri.hide(dojo.byId("loadingImg"));
  	triggerError();
}


function createPrintButtonArea() {
	var divTag = document.createElement("div");
 	divTag.id = "print_buttonmap";
 	document.getElementById("print_button").appendChild(divTag);
	document.getElementById("print_buttonmap").className = "claro";	
}


function createmapLegendDiv(){
 	var divTag = document.createElement("div");
 	divTag.id = "mapLegend";
 	document.getElementById("mapDiv_root").appendChild(divTag);
}


function createLoadingImgDiv(){
 	var divTag = document.createElement("div");
	 divTag.id = "loadingImg";
 	document.getElementById("mapDiv_root").appendChild(divTag);
}

function createPrintableButtonArea() {
	var btn = document.createElement("button"); 
	var btntext = document.createTextNode("Printable Map");
	btn.setAttribute("type", "submit");
	btn.appendChild(btntext);
	btn.onclick = printablemap;
	document.getElementById('print_button').appendChild(btn);
	document.getElementById('print_button').className = "buttonprint";		
}

// ZIP 5
function addPinLabel5(origzip5) {
	var queryTask3 = new esri.tasks.QueryTask("https://ssmap.#/arcgis/rest/services/ServiceStandards/USPS_ZIP5_Centroids_2/MapServer/0/");
   	var query3 = new esri.tasks.Query();
	query3.where = "ZIP = '" + origzip5 + "'";
   	query3.returnGeometry = true;
   	query3.outFields = ["ZIP"];
   	queryTask3.execute(query3, addPinFeatureSetToMap, errorHandler);
}

/* ZIP 3 */

function addPinLabel(origzip3) {
	var queryTask3 = new esri.tasks.QueryTask("https://ssmap.#/arcgis/rest/services/ServiceStandards/ZIP3_Labels/MapServer/0");
   	var query3 = new esri.tasks.Query();
	query3.where = "ZIP3 = '" + origzip3 + "'";
   	query3.returnGeometry = true;
   	query3.outFields = ["ZIP3"];
   	queryTask3.execute(query3, addPinFeatureSetToMap, errorHandler);	
}






//adds pin image for the selected ZIP
function addPinFeatureSetToMap(featureSet) {
	var symbol =  new esri.symbol.PictureMarkerSymbol({  
  	"url":"/priority-mail/map/origination-icon.svg",
 	 "height":30,
  	 "width":24,
  	 "yoffset": 25
	});
	var zipvalue;
	dojo.forEach(featureSet.features, function(feature) {
		if (dojo.byId('form-service').value == 'PND'){
			zipvalue = feature.attributes.ZIP;
		} else {
			zipvalue = feature.attributes.ZIP3;
		}
		pinLayer.add(feature.setSymbol(symbol));
	});
}



// removes the map with blue color
function removeBlueColor() {
	map.removeLayer(map.getLayer(map.layerIds[1]));
	map.addLayer(bufferLayer,1);
	map.addLayer(pinLayer, 2);
}

function printablemap(){
	
	var ZIPS = "ZIPS"
	if (origzip3 === undefined) {
    	var URL = "/priority-mail/map/map_print.html?zoomlevel="+currentZoom+"&ZIP="+ZIPS;
	} else {
   		var URL = "/priority-mail/map/map_print.html?zoomlevel="+currentZoom+"&ZIP="+origzip3;
	} 

	var win = window.open(URL, "map_print", 'width=915, height=800, scrollbars=yes,menubar=yes');
}
dojo.addOnLoad(init);