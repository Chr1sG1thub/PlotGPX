/*! 
 * Leaflet.PolylineDecorator - add symbols (arrows, patterns) on polylines or polygons
 * https://github.com/bbecquet/Leaflet.PolylineDecorator
 * (c) 2014 Benoit BECQUET
 * License: MIT
 */
(function(factory, window) {
  if (typeof define === "function" && define.amd) {
    define(["leaflet"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(require("leaflet"));
  } else {
    factory(window.L);
  }
})(function(L) {
  "use strict";


  L.Symbol = {};


  L.Symbol.Marker = L.Class.extend({
    options: {
      rotate: true,
      rotateOrigin: "center center",
      markerOptions: {},
      repeat: 0,
      offset: 0
    },
    initialize: function(path, options) {
      L.Util.setOptions(this, options);
      this._path = path;
    },
    buildSymbol: function(map, latLng, angle) {
      var marker = L.marker(latLng, this.options.markerOptions);
      if (this.options.rotate) {
        marker._icon.style.transformOrigin = this.options.rotateOrigin;
        marker._icon.style[L.DomUtil.TRANSFORM + "Origin"] = this.options.rotateOrigin;
        marker._icon.style[L.DomUtil.TRANSFORM] += " rotate(" + angle + "deg)";
      }
      return marker;
    },
    // Assume other necessary methods here...
  });


  L.Symbol.ArrowHead = L.Class.extend({
    includes: L.Evented.prototype,
    options: {
      pixelSize: 10,
      polygon: true,
      pathOptions: {
        stroke: true,
        color: "black",
        weight: 1,
        opacity: 1,
        fill: true,
        fillOpacity: 1
      }
    },
    initialize: function(options) { L.Util.setOptions(this, options); },
    buildSymbol: function(map, latLng, angle) {
      var pixelSize = this.options.pixelSize;
      var pathOptions = this.options.pathOptions;


      var arrowHead = L.polygon(this._buildArrowPoints(pixelSize), pathOptions)
        .setRotationAngle(angle)
        .setLatLng(latLng);


      return arrowHead;
    },
    _buildArrowPoints: function(pixelSize) {
      var r = pixelSize;
      return [
        L.point(0, 0),
        L.point(-r, r / 2),
        L.point(-r * 0.75, 0),
        L.point(-r, -r / 2)
      ];
    }
  });


  L.polylineDecorator = function(paths, options) {
    return new L.PolylineDecorator(paths, options);
  };


  L.PolylineDecorator = L.LayerGroup.extend({
    initialize: function(paths, options) {
      L.LayerGroup.prototype.initialize.call(this);
      this._paths = paths;
      L.Util.setOptions(this, options);
      this._initPatterns();
    },
    onAdd: function(map) {
      this._map = map;
      this._initPatterns();
      this._draw();
      map.on("zoomend", this._draw, this);
      map.on("moveend", this._draw, this);
      this.addTo(map);
    },
    onRemove: function(map) {
      this.clearLayers();
      map.off("zoomend", this._draw, this);
      map.off("moveend", this._draw, this);
    },
    _initPatterns: function() {
      this._patterns = [];
      var patternsOpts = this.options.patterns || [];
      for (var i = 0; i < patternsOpts.length; i++) {
        var pattern = patternsOpts[i];
        var symbol = pattern.symbol;
        this._patterns.push({
          symbol: symbol,
          offset: pattern.offset || 0,
          repeat: pattern.repeat || 0
        });
      }
    },
    _draw: function() {
      // Draw symbols along paths according to patterns
      this.clearLayers();
      this._patterns.forEach(function(pattern) {
        // Assume implementation to draw symbols along the polyline
      });
    }
  });


  return L;
});