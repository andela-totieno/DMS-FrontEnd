angular.module('dms.controllers')
    .controller('DocumentsCtrl', ['$scope', 'Documents', '$mdDialog',
        'Users', '$rootScope', '$mdToast',
        function($scope, Documents, $mdDialog, Users, $rootScope, $mdToast) {

            // Fetch all documents from the server when the app initializes
            $scope.allDocuments = Documents.query();

            // Fetch all documents by the logged in User
            $scope.getUserDocs = function() {
                Users.userDocuments($rootScope.currentUser, function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        $scope.userDocs = res;
                    }
                });
            };
            $scope.getUserDocs();

            // Function to fetch all dcocuments
            $scope.loadAllDocs = function() {
                $scope.allDocuments = Documents.query();
            };

            // Listen to the documentCreated event and run $scope.getUserDocs()
            $rootScope.$on('documentCreated', function() {
                $scope.getUserDocs();
            });

            // Delete user document
            $scope.deleteUserDoc = function(ev, doc) {
                var confirm = $mdDialog.confirm()
                    .title('Confirm if you want to delete the document?!')
                    .textContent('Once you delete the document, ' +
                        'there is no going back!')
                    .ariaLabel('Delete Document')
                    .targetEvent(ev)
                    .ok('Delete')
                    .cancel('Cancel');
                $mdDialog.show(confirm).then(function() {
                    Documents.remove({
                        id: doc._id
                    }, function() {
                        $scope.getUserDocs();
                        $mdToast.show($mdToast.simple()
                            .textContent('Document Deleted').hideDelay(2000));
                    });
                }, function() {
                    $mdToast.show($mdToast.simple()
                        .textContent('Document Retained').hideDelay(2000));
                });
            };

            // Open Create/Update Document
            $scope.openOffscreen = function(ev, doc) {
                $rootScope.isUpdating = true;
                $rootScope.doc = doc;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: '../views/form.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                });
            };

            function DialogController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            }

        }
    ]);
