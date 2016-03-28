$.ajax({
    url: 'scripts/mb_data.php',
    type: 'POST',
    dataType: 'JSON',
    success: function(dta) {
        require([
                "esri/map",
                "esri/geometry/Point", "esri/geometry/Polyline", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol","esri/renderers/HeatmapRenderer",
                "esri/Color", "esri/graphic", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer", "esri/graphicsUtils", "esri/geometry/geodesicUtils", "esri/units",
                "esri/dijit/Popup", "esri/dijit/PopupTemplate", "esri/geometry/Extent", "esri/dijit/HomeButton", "esri/dijit/Scalebar",
                "esri/dijit/BasemapToggle", "esri/dijit/Legend", "esri/renderers/UniqueValueRenderer",
                "dojo/dom-class", "dojo/dom-construct", "dojo/on", "dojo/_base/array", "dojo/domReady!"
            ],
            function(
                Map, Point, Polyline, SimpleMarkerSymbol, SimpleLineSymbol, HeatmapRenderer,
                Color, Graphic, FeatureLayer, GraphicsLayer, graphicsUtils, geodesicUtils, Units,
                Popup, PopupTemplate, Extent, HomeButton, Scalebar,
                BasemapToggle, Legend, UniqueValueRenderer,
                domClass, domConstruct, on, array
            ) {
				var data2 = JSON.parse(dta[0]);
                var dataAll = JSON.parse(dta[1]);           
                var names2 = [];
                var lookup = {};
                for (var item, i = 0; item = data2.individuals[i++];) {
                    var name = item.individual_local_identifier;
                    if (!(name in lookup)) {
                        lookup[name] = 1;
                        names2.push(name);
                    }
                }

                var namesAll = [];
                var lookupAll = {};
                for (var item, i = 0; item = dataAll.individuals[i++];) {
                    var name = item.individual_local_identifier;
                    if (!(name in lookupAll)) {
                        lookupAll[name] = 1;
                        namesAll.push(name);
                    }
                }

                var graphData = {
                    data: []
                };
                var name_colors = [
                    [166, 206, 227],
                    [31, 120, 180],
                    [178, 223, 138],
                    [51, 160, 44],
                    [251, 154, 153],
                    [227, 26, 28],
                    [253, 191, 111],
                    [255, 127, 0],
                    [202, 178, 214],
                    [106, 61, 154],
                    [255, 255, 153],
                    [177, 89, 40],
                    [86, 90, 153],
                    [204, 80, 25],
                    [117, 255, 0],
                    [237, 142, 255],
                    [123, 178, 151],
                    [255, 236, 191],
                    [238, 211, 255],
                    [203, 54, 126],
                    [102, 202, 234],
                    [230, 120, 120],
                    [102, 189, 202],
                    [95, 95, 215],
                    [175, 65, 175],
                    [250, 165, 105],
                    [120, 120, 120],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0],
					[0, 255, 0]
					
                ];

                var nameColor = [];
                var nameRecentColor = [];
				var dict = [];
                for (var n = 0; n < namesAll.length; n++) {
                    dict.push({
						'name' : namesAll[n],
						'color' : name_colors[n]
					})
					var tL = [];
                    tL.push(namesAll[n]);
                    tL.push(name_colors[n]);
                    nameColor.push(tL);
                    
                }
				
				for (var n = 0; n < dict.length; n++) {
					if ($.inArray(dict[n].name, names2) > -1 ) {
						var tA = [];
						tA.push(dict[n].name);
						tA.push(dict[n].color);
						nameRecentColor.push(tA);
					}
				}
                var outline = new SimpleLineSymbol(SimpleLineSymbol.Style_Solid).setColor("red").setWidth(3);
                var ol = new SimpleLineSymbol(SimpleLineSymbol.Style_Solid, new Color([255, 0, 0]), 1.5);
                var fill = new SimpleMarkerSymbol(SimpleMarkerSymbol.Style_Circle).setOutline(outline);
                var popup = new Popup({
                    markerSymbol: fill,
                    highlight: true,
                    titleInBody: false
                }, domConstruct.create("div"));
                domClass.add(popup.domNode, "dark");


                var template_AWPE = new PopupTemplate({
                    title: "American White Pelican",
                    fieldInfos: [{
                            fieldName: "Name",
                            label: 'Name:',
                            visible: true
                        }, {
                            fieldName: "date",
                            label: 'Date:',
                            visible: true,
                            format: {
                                dateFormat: 'shortDateShortTime'
                            }
                        }
                    ]
                });
				var template_EP = new PopupTemplate({
                    title: "American White Pelican",
                    fieldInfos: [{
                            fieldName: "Name",
                            label: 'Name:',
                            visible: true
                        }, {
                            fieldName: "date",
                            label: 'Date:',
                            visible: true,
                            format: {
                                dateFormat: 'shortDateShortTime'
                            }
                        }
                    ]
                });               


                // BEGIN MRP (last week points)
                //
                //
                //
                
                var endPts = new GraphicsLayer({
                    id: "End",
                    infoTemplate: template_EP,
                    opacity: 1
                });
                var lines2 = new GraphicsLayer({
                    id: "Lines_AWPE"
                });
                var gg_renderer2 = new UniqueValueRenderer(null, "Name");
                for (i = 0; i < nameRecentColor.length; i++) {
                    gg_renderer2.addValue((nameRecentColor[i][0]), new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, ol, new Color([255, 0, 0])).setColor(new Color([nameRecentColor[i][1][0], nameRecentColor[i][1][1], nameRecentColor[i][1][2]])));
                }
                var featureCollection2 = {
                    "layerDefinition": null,
                    "featureSet": {
                        "features": [],
                        "geometryType": "esriGeometryPoint"
                    }
                };

                featureCollection2.layerDefinition = {
                    "geometryType": "esriGeometryPoint",
                    "objectIdField": "ObjectID",
                    "fields": [{
                        "name": "ObjectID",
                        "alias": "ObjectID",
                        "type": "esriFieldTypeOID"
                    }, {
                        "name": "Name",
                        "type": "esriFieldTypeString",
                        "alias": "Name"
                    }, {
                        "name": "Date",
                        "alias": "Date",
                        "type": "esriFieldTypeDate"
                    }]
                }


                var featureLayer2 = new FeatureLayer(featureCollection2, {
                    mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                    infoTemplate: template_AWPE,
                    id: "Points_AWPE"
                });


                var resultFeatures = data2.individuals;
                var features = [];
                var sms = new SimpleMarkerSymbol();
                var ctr = -1;
                for (var j = 0, il = resultFeatures.length; j < il; j++) {
                    var name = resultFeatures[j].individual_local_identifier;
                    var len = resultFeatures[j].locations
                    for (i = 0; i < len.length; i++) {
                        var ctr = ctr + 1;
                        var x = len[i].location_long;
                        var y = len[i].location_lat;
                        var t = len[i].timestamp;
                        var atts = {
                            "ObjectID": ctr,
                            "Name": name,
                            "Date": t
                        };
                        var xy = new Point(x, y);
                        var graphic = new Graphic(xy);
                        graphic.setAttributes(atts);
                        features.push(graphic);
                    }

                }


                for (var i in features) {
                    featureLayer2.add(features[i]);
                }

                featureLayer2.setRenderer(gg_renderer2);

                for (m = 0; m < nameRecentColor.length; m++) {
                    var dates = [];
                    var coords = [];
                    var sp = [];

                    array.forEach(featureLayer2.graphics, function(feature) {
                        tc = [];
                        var name = feature.attributes.Name;
                        var date = feature.attributes.Date;
                        var coord = feature.geometry;
                        if (nameRecentColor[m][0] == name) {
                            dates.push(date);
                            tc.push(parseFloat(coord.x));
                            tc.push(parseFloat(coord.y));
                            coords.push(tc);
                        }
                    });
                    if (dates.length > 0) {
                        var pl = new Polyline(coords);
                        var recentDist = geodesicUtils.geodesicLengths([pl], Units.MILES);
                        var n = nameRecentColor[m][0];
                        

                        var ln_sym = new SimpleLineSymbol(SimpleLineSymbol.Style_Solid).setColor(new Color([nameRecentColor[m][1][0], nameRecentColor[m][1][1], nameRecentColor[m][1][2]]));
                        var attr2 = {
                            "Name": nameRecentColor[m][0]
                        }
                        var g2 = new Graphic(pl, ln_sym, attr2);
                        lines2.add(g2);
                        bc = dates[0];
                        bc2 = new Date(bc);
                        vd = dates[dates.length - 1];
                        vd2 = new Date(vd);
                    }
                    array.forEach(featureLayer2.graphics, function(feature) {
                        var name = feature.attributes.Name;
                        var date = feature.attributes.Date;
                        if (nameRecentColor[m][0] == name && date == dates[dates.length - 1]) {
                            feature.setSymbol(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE).setOutline(ol).setColor(new Color([nameRecentColor[m][1][0], nameRecentColor[m][1][1], nameRecentColor[m][1][2]])).setSize("14"));
                        } else if (nameRecentColor[m][0] == name) {
                            feature.setSymbol(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE).setOutline(ol).setColor(new Color([nameRecentColor[m][1][0], nameRecentColor[m][1][1], nameRecentColor[m][1][2]])).setSize("5"));
                        }
                    });
                }


                ///// BEGIN ALL POINTS

                var linesAll = new GraphicsLayer({
                    id: "Lines_all",
                    opacity: 1.0
                });
                var gg_rendererAll = new UniqueValueRenderer(null, "Name");
                for (i = 0; i < nameColor.length; i++) {
                    gg_rendererAll.addValue((nameColor[i][0]), new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, ol, new Color([255, 0, 0])).setColor(new Color([nameColor[i][1][0], nameColor[i][1][1], nameColor[i][1][2]])));
                }

                var featureCollectionAll = {
                    "layerDefinition": null,
                    "featureSet": {
                        "features": [],
                        "geometryType": "esriGeometryPoint"
                    }
                };

                featureCollectionAll.layerDefinition = {
                    "geometryType": "esriGeometryPoint",
                    "objectIdField": "ObjectID",
                    "fields": [{
                        "name": "ObjectID",
                        "alias": "ObjectID",
                        "type": "esriFieldTypeOID"
                    }, {
                        "name": "Name",
                        "type": "esriFieldTypeString",
                        "alias": "Name"
                    }, {
                        "name": "Date",
                        "alias": "Date",
                        "type": "esriFieldTypeDate"
                    }]
                }


                var featureLayerAll = new FeatureLayer(featureCollectionAll, {
                    mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                    infoTemplate: template_AWPE,
                    opacity: 0.75,
                    id: "All"
                });
                var resultFeatures = dataAll.individuals;
                var features = [];
                var sms = new SimpleMarkerSymbol();
                var ctr = -1;
                for (var j = 0, il = resultFeatures.length; j < il; j++) {
                    var name = resultFeatures[j].individual_local_identifier;
                    var len = resultFeatures[j].locations
                    for (i = 0; i < len.length; i++) {
                        var ctr = ctr + 1;
                        var x = len[i].location_long;
                        var y = len[i].location_lat;
                        var t = len[i].timestamp;
                        var atts = {
                            "ObjectID": ctr,
                            "Name": name,
                            "Date": t
                        };
                        var xy = new Point(x, y);
                        var graphic = new Graphic(xy);
                        graphic.setAttributes(atts);
                        features.push(graphic);
                    }

                }
				
                var sp = [];
                var ep = [];
                for (var i in features) {
                    featureLayerAll.add(features[i]);
                }
                featureLayerAll.setRenderer(gg_rendererAll);

                var totalDist = [];
                for (m = 0; m < nameColor.length; m++) {
                    var dates = [];
                    var coords = [];

                    array.forEach(featureLayerAll.graphics, function(feature) {
                        var tc = [];

                        var name = feature.attributes.Name;
                        var date = feature.attributes.Date;
                        var coord = feature.geometry;
                        if (nameColor[m][0] == name) {
                            dates.push(date);
                            tc.push(parseFloat(coord.x));
                            tc.push(parseFloat(coord.y));
                            coords.push(tc);
                        }
                    });
                    var ta = [];
                    var te = [];
                    var total_d = [];
                    var len = [];
                    if (dates.length > 0) {
                        var pl = new Polyline(coords);
                        var l = geodesicUtils.geodesicLengths([pl], Units.MILES);
                        var n = nameColor[m][0];
                        totalDist.push("<tr><td>" + nameColor[m][0] + "</td><td>" + Math.round(l[0]) + " miles</td></tr>");
                        total_d.push(coords[0]);
                        total_d.push(coords[coords.length - 1]);
                        var td_line = new Polyline(total_d);
                        var td_val = geodesicUtils.geodesicLengths([td_line], Units.MILES);
                        ta.push(coords[0]);
                        ta.push(nameColor[m][0]);
                        ta.push(dates[0]);
                        sp.push(ta);
                        te.push(coords[coords.length - 1]);
                        te.push(nameColor[m][0]);
                        te.push(dates[dates.length - 1]);
                        ep.push(te);
                        var ln_sym = new SimpleLineSymbol(SimpleLineSymbol.Style_Solid).setWidth(0.7).setColor(new Color([nameColor[m][1][0], nameColor[m][1][1], nameColor[m][1][2]]));
                        var attr2 = {
                            "Name": nameColor[m][0]
                        };
                        var g2 = new Graphic(pl, ln_sym, attr2);
                        linesAll.add(g2);
                        bc = dates[0];
                        bc2 = new Date(bc);
                        vd = dates[dates.length - 1];
                        vd2 = new Date(vd);
                    }
                    array.forEach(featureLayerAll.graphics, function(feature) {
                        var name = feature.attributes.Name;
                        var date = feature.attributes.Date;
                        if (nameColor[m][0] == name && date == dates[dates.length - 1]) {
                            feature.setSymbol(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE).setOutline(ol).setColor(new Color([nameColor[m][1][0], nameColor[m][1][1], nameColor[m][1][2]])).setSize("14"));
                        } else if (namesAll[m] == name) {
                            feature.setSymbol(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE).setOutline(ol).setColor(new Color([nameColor[m][1][0], nameColor[m][1][1], nameColor[m][1][2]])).setSize("5"));
                        }
                    });
                }
                for (x = 0; x < sp.length; x++) {
                    var pt_sym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_DIAMOND).setOutline(ol).setSize("14").setColor(new Color([nameColor[x][1][0], nameColor[x][1][1], nameColor[x][1][2]]));
                    var pt = new Point(sp[x][0][0], sp[x][0][1]);
                    var pt_atts = {
                        "Name": sp[x][1],
                        "date": sp[x][2]
                    };
                    var g3 = new Graphic(pt, pt_sym, pt_atts);
                    
                }

                for (z = 0; z < ep.length; z++) {
                    var pt2_sym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE).setOutline(ol).setSize("12").setColor(new Color([nameColor[z][1][0], nameColor[z][1][1], nameColor[z][1][2]]));
                    var pt2 = new Point(ep[z][0][0], ep[z][0][1]);
                    var pt2_atts = {
                        "Name": ep[z][1],
                        "date": ep[z][2]
                    };
                    var g4 = new Graphic(pt2, pt2_sym, pt2_atts);
                    endPts.add(g4);
                }
                ///////
                //////
                //// Begin Map
				
				var spPop = new PopupTemplate({
                    title: "Starting Location",
                    fieldInfos: [{
                        fieldName: "Date_",
                        label: 'Starting Date:',
                        visible: true
                    }]
                });
				
				 var  startingPts = new esri.layers.FeatureLayer("http://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/AWPE_sp/FeatureServer/0", {
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    infoTemplate: spPop,
                    outFields: ['Type_', 'Date_'],
                    visible: true
                });
				
                var map = new Map("map", {
                    basemap: "dark-gray",
                    sliderPosition: "top-left",
                    zoom: 5,
					autoResize: true,
					minZoom: 3,
                    infoWindow: popup
                });
				

                map.addLayers([linesAll, lines2,startingPts, endPts, featureLayer2]);

                var toggle = new BasemapToggle({
                    map: map,
                    basemap: "hybrid"
                }, "BasemapToggle");

                var legend = new Legend({
                    map: map,
                    layerInfos: [{
                        layer: featureLayerAll,
                        title: "All Tracked Pelicans"
                    },
					{
                        layer: startingPts,
                        title: "Symbols"
                    }],
                    autoUpdate: false
                }, "legend");

                var fullExtent = graphicsUtils.graphicsExtent(featureLayerAll.graphics).expand(2);
                var homeButton = new HomeButton({
                    theme: "HomeButton",
                    map: map,
                    extent: fullExtent,
                    visible: true
                }, "HomeButton");

                var scalebar = new Scalebar({
                    map: map,
                    attachTo: "bottom-left",
                    scalebarUnit: "dual"
                });

                map.on("load", function() {
                    var recentExtent = graphicsUtils.graphicsExtent(featureLayer2.graphics).expand(2);
                    map.setExtent(recentExtent);
                    toggle.startup();
                    legend.startup();
                    homeButton.startup()
                    map.infoWindow.resize(300, 250);
                })




                $(function() {
                    $("#trackToggle").button();
                    $("#ltoggle").button();
                });



                $('#ltoggle').click(function() {
                    $('#legend').slideToggle();
                    if ($(this).is(':checked')) {
                        $(this).button('option', 'label', 'Show Legend');
                    } else {

                        $(this).button('option', 'label', 'Hide Legend');
                    }
                }); 
				
                $('#trackToggle').click(function() {
                    if ($(this).is(':checked')) {
                        $(this).button('option', 'label', 'Show All Locations');
                        linesAll.setOpacity(0.0);
                        startingPts.setOpacity(1.0);
                        endPts.setOpacity(0.0);
						legend.refresh([{
                                layer: featureLayer2,
                                title: 'Pelicans Active in Last Week'
                            },{
                        layer: startingPts,
                        title: "Symbols"
                    }
							]);
                    } else {

                        $(this).button('option', 'label', 'Only Show Last 7 Days');
                        linesAll.setOpacity(1.0);
                        startingPts.setOpacity(1.0);
                        endPts.setOpacity(1.0);
						 legend.refresh([{
                                layer: featureLayerAll,
                                title: 'All Tracked Pelicans'
                            },{
                        layer: startingPts,
                        title: "Symbols"
                    }
							]);  
                    }
                });




                featureLayer2.on("mouse-over", function() {
                    map.setMapCursor("pointer");
                });
                featureLayer2.on("mouse-out", function() {
                    map.setMapCursor("default");
                });

                startingPts.on("mouse-over", function() {
                    if (!$("#trackToggle").is(':checked')) {
                        map.setMapCursor("pointer");
                    }
                });
                startingPts.on("mouse-out", function() {
                    map.setMapCursor("default");
                });
                endPts.on("mouse-over", function() {
                    if (!$("#trackToggle").is(':checked')) {
                        map.setMapCursor("pointer");
                    }
                });
                endPts.on("mouse-out", function() {
                    map.setMapCursor("default");
                });
                $(document).keyup(function(e) {
                    if (e.keyCode == 27) { // escape key maps to keycode `27`
                        map.infoWindow.hide();
                        featureLayer2.clearSelection();
                        $('#legend').show();
                    }
                });
                
                $('#lHide').click(function() {
                    $('#info').hide();
                    $('#legendToggle').show();

                });
                $('#legendToggle').click(function() {
                    $('#legend').show();
                    $('#info').show();
                    $('#legendToggle').hide();

                });

               

                $('#load').slideToggle();
            });
    }
});