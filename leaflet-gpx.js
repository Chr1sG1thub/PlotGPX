/*!
 * leaflet-gpx - A plugin to display GPX tracks on Leaflet maps
 * Copyright (c) 2014, Mikael Petazzoni
 * https://github.com/mpetazzoni/leaflet-gpx
 */
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["leaflet"], factory);
  } else if (typeof exports === "object") {
    module.exports = factory(require("leaflet"));
  } else {
    factory(window.L);
  }
}(function(L) {
  "use strict";
  L.GPX = L.FeatureGroup.extend({
    options: {
      async: true,
      marker_options: {
        startIconUrl: "images/pin-icon-start.png",
        endIconUrl: "images/pin-icon-end.png",
        shadowUrl: "images/pin-shadow.png",
        wptIconUrls: {
          '': "images/pin-icon.png",
          "0": "images/pin-icon.png",
          "1": "images/pin-icon-1.png",
          "2": "images/pin-icon-2.png",
          "3": "images/pin-icon-3.png",
          "4": "images/pin-icon-4.png",
          "5": "images/pin-icon-5.png",
          "6": "images/pin-icon-6.png",
          "7": "images/pin-icon-7.png",
          "8": "images/pin-icon-8.png",
          "9": "images/pin-icon-9.png"
        }
      }
    },
    initialize: function(gpx, options) {
      L.Util.setOptions(this, options);
      this._gpx = gpx;
      this._layers = {};
      this._firefox = typeof InstallTrigger !== "undefined";
      this._load();
    },
    load: function(url, options) {
      options = options || {};
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = L.bind(function() {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status === 200) {
          this._parse(xhr.responseText);
          this.fire("loaded");
        } else if (xhr.status >= 400) {
          this.fire("error", { status: xhr.status });
        }
      }, this);
      xhr.open("GET", url, true);
      xhr.send(null);
    },
    _load: function() {
      if (typeof this._gpx === "string") {
        this.load(this._gpx);
      } else {
        this._parse(this._gpx);
        this.fire("loaded");
      }
    },
    _parse: function(gpx) {
      var xml = new DOMParser().parseFromString(gpx, "text/xml");
      var trksegs = xml.getElementsByTagName("trkseg");
      for (var i = 0; i < trksegs.length; i++) {
        var trkpts = trksegs[i].getElementsByTagName("trkpt");
        var latlngs = [];
        for (var j = 0; j < trkpts.length; j++) {
          var lat = parseFloat(trkpts[j].getAttribute("lat"));
          var lon = parseFloat(trkpts[j].getAttribute("lon"));
          latlngs.push(L.latLng(lat, lon));
        }
        var polyline = L.polyline(latlngs, { color: "blue", weight: 3, opacity: 0.75 });
        this.addLayer(polyline);
      }
    }
  });
  L.gpx = function(gpx, options) {
    return new L.GPX(gpx, options);
  };
}));