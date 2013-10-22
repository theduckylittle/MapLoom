(function() {

  var module = angular.module('loom_layers_directive', []);

  module.directive('loomLayers',
      function($rootScope, mapService) {
        return {
          restrict: 'C',
          replace: true,
          templateUrl: 'layers/partials/layers.tpl.html',
          link: function(scope) {
            scope.mapService = mapService;

            scope.toggleVisibility = function(layer) {
              layer.setVisible(!layer.get('visible'));
            };

            scope.removeLayer = function(layer) {
              mapService.map.removeLayer(layer);
              $rootScope.$broadcast('layerRemoved', layer);
            };

            scope.reorderLayer = function(startIndex, endIndex) {
              var length = mapService.map.getLayers().getArray().length - 1;
              var layer = mapService.map.removeLayer(mapService.map.getLayers().getAt(length - startIndex));
              mapService.map.getLayers().insertAt(length - endIndex, layer);
            };
          }
        };
      }
  );
})();
