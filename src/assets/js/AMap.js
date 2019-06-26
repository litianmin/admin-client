export default {
  MapLoader () {   // <-- 原作者这里使用的是module.exports
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        resolve(window.AMap)
      } else {
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = 'https://webapi.amap.com/maps?v=1.4.4&callback=initAMap&key=8906f77f66bcbd2b82a57d844e270fe7'
        script.onerror = reject
        document.head.appendChild(script)
      }
      window.initAMap = () => {
        resolve(window.AMap)
      }
    })
  },


  // <div id="container" class="map" tabindex="0"></div>
  // <div id="pickerBox">
  //     <input id="pickerInput" placeholder="输入关键字选取地点" />
  //     <div id="poiInfo"></div>
  // </div>

  poiPickerReady (poiPicker, map) {
    window.poiPicker = poiPicker;

    var marker = new AMap.Marker();

    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20)
    });

    //选取了某个POI
    poiPicker.on('poiPicked', function(poiResult) {

        var source = poiResult.source,
            poi = poiResult.item,
            info = {
                source: source,
                id: poi.id,
                name: poi.name,
                location: poi.location.toString(),
                address: poi.address
            };

        marker.setMap(map);
        infoWindow.setMap(map);

        marker.setPosition(poi.location);
        infoWindow.setPosition(poi.location);

        infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
        infoWindow.open(map, marker.getPosition());

        //map.setCenter(marker.getPosition());
    });

    poiPicker.onCityReady(function() {
        poiPicker.suggest('美食');
    });
  }

  // mytest () {
  //   var map = new AMap.Map('container', {
  //     zoom: 10
  //   });

  //   AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

  //       var poiPicker = new PoiPicker({
  //           //city:'北京',
  //           input: 'pickerInput'
  //       });

  //       //初始化poiPicker
  //       poiPickerReady(poiPicker);
  //   });

  //   function poiPickerReady(poiPicker) {

  //       window.poiPicker = poiPicker;

  //       var marker = new AMap.Marker();

  //       var infoWindow = new AMap.InfoWindow({
  //           offset: new AMap.Pixel(0, -20)
  //       });

  //       //选取了某个POI
  //       poiPicker.on('poiPicked', function(poiResult) {

  //           var source = poiResult.source,
  //               poi = poiResult.item,
  //               info = {
  //                   source: source,
  //                   id: poi.id,
  //                   name: poi.name,
  //                   location: poi.location.toString(),
  //                   address: poi.address
  //               };

  //           marker.setMap(map);
  //           infoWindow.setMap(map);

  //           marker.setPosition(poi.location);
  //           infoWindow.setPosition(poi.location);

  //           infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
  //           infoWindow.open(map, marker.getPosition());

  //           //map.setCenter(marker.getPosition());
  //       });

  //       poiPicker.onCityReady(function() {
  //           poiPicker.suggest('美食');
  //       });
  //   }
  // },

}
