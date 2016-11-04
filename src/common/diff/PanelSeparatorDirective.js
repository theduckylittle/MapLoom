(function() {

  var module = angular.module('loom_panel_separator_directive', []);


  module.directive('loomPanelSeparator',
      function(featureDiffService) {
        return {
          restrict: 'C',
          templateUrl: 'diff/partial/panelseparator.tpl.html',
          scope: {
            icon: '@icon',
            clickfunction: '=',
            panel: '=',
            hover: '='
          },
          link: function(scope, element) {
            scope.featureDiffService = featureDiffService;
            scope.authorsShown = false;
            function updateVariables(event, panel) {
              if (scope.hover) {
                element.closest('.loom-panel-separator').addClass('hoverable');
              }
              scope.arrows = [];
              var i, attr;
              if (featureDiffService.change == 'MODIFIED') {
                scope.geometryChanged = featureDiffService.right.geometry.changetype !== 'NO_CHANGE';
                for (i = 0; i < featureDiffService.right.attributes.length; i++) {
                  attr = featureDiffService.right.attributes[i];
                  if (attr.changetype !== 'NO_CHANGE') {
                    scope.arrows.push({active: true, attributename: attr.attributename});
                  } else {
                    scope.arrows.push({active: false, attributename: attr.attributename});
                  }
                }
              } else {
                scope.geometryChanged = scope.panel.getGeometry() === featureDiffService.merged.getGeometry() &&
                    goog.isDefAndNotNull(scope.panel.geometry) &&
                    goog.isDefAndNotNull(featureDiffService.merged.geometry) &&
                    scope.panel.geometry.changetype === featureDiffService.merged.geometry.changetype;
                for (i = 0; i < scope.panel.attributes.length; i++) {
                  attr = scope.panel.attributes[i];
                  if (featureDiffService.attributesEqual(attr, featureDiffService.merged.attributes[i]) &&
                      attr.changetype !== 'NO_CHANGE') {
                    scope.arrows.push({active: true, attributename: attr.attributename});
                  } else {
                    scope.arrows.push({active: false, attributename: attr.attributename});
                  }
                }
              }
            }

            scope.geometryArrowClick = function() {
              if (scope.hover) {
                featureDiffService.chooseGeometry(scope.panel);
                updateVariables();
              }
            };

            scope.arrowClick = function(index) {
              if (scope.hover) {
                featureDiffService.chooseAttribute(index, scope.panel);
              }
            };

            scope.isAttributeVisible = function(property) {
              var schema = featureDiffService.layer.get('metadata').schema;

              // if there is no schema, show the attribute. only filter out if there is schema and attr is set to hidden
              if (!goog.isDefAndNotNull(schema) || !schema.hasOwnProperty(property)) {
                return true;
              }

              return schema[property].visible;
            };

            var initialize = function() {
              updateVariables();
              scope.authorsShown = false;
            };

            scope.$on('merge-feature-modified', updateVariables);
            scope.$on('feature-diff-performed', initialize);
            scope.$on('update-merge-feature', updateVariables);
            scope.$on('show-authors', function() {
              scope.authorsShown = true;
            });

            scope.$on('hide-authors', function() {
              scope.authorsShown = false;
            });
          }
        };
      }
  );
})();
