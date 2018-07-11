window.onload = function() {
    L.map('map-view', {
      layers: MQ.mapLayer(),
      center: [ 40.731701, -73.993411 ],
      zoom: 12
    });
  };