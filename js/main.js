var app = angular.module('app', ['ui.router', 'ngFileUpload', 'ui.bootstrap']);

app.constant('SERVER', 'http://www.qiangchen.me/enms/');

app.config(['$stateProvider', '$urlRouterProvider', 'SERVER', function ($stateProvider, $urlRouterProvider, SERVER) {
    $urlRouterProvider.otherwise("/admin");
    $stateProvider
        .state('admin', {
            url: "/admin",
            templateUrl: "admin.html",
            controller: "adminController"
        })
        .state('admin.news', {
            url: "/news",
            templateUrl: "newspaper/newspaper.html",
            controller: "newsController"
        })
        .state('admin.newspage', {
            url: "/newspage",
            templateUrl: "newspage/newspage.html",
            controller: "newspageController"
        })
        .state('admin.article', {
            url: "/article",
            templateUrl: "article/article.html",
            controller: "articleController"
        })
        .state('admin.comment', {
            url: "/comment",
            templateUrl: "comment/comment.html",
            controller: "commentController"
        })
        .state('login', {
            url: "/login",
            templateUrl: "manager/login.html",
            controller: "managerController"
        })
        .state('admin.user', {
            url: "/user",
            templateUrl: "user/user.html",
            controller: "userController"
        })
        .state('admin.manager', {
            url: "/manager",
            templateUrl: "manager/manager.html",
            controller: "managerController"
        })
}]);


app.controller('adminController', ["$scope", '$http', 'SERVER', '$state', 'ajax', function ($scope, $http, SERVER, $state, ajax) {
	
	var params = {
            method: 'POST', url: SERVER + 'back/user/page', data: null
        };
        ajax.http(params).then(function (result) {
            
        });
}]);

/**
 *管理员模块 **********************************************************************开始************************************************************************
 */
app.controller('managerController', ["$scope", '$http', 'SERVER', '$state', 'ajax', function ($scope, $http, SERVER, $state, ajax) {
    $scope.manager = {
        managerName: '',
        password: ''
    };
    $scope.login = function () {
        var params = {method: 'POST', url: SERVER + 'back/manager/login', data: $scope.manager};
        var data = ajax.http(params).then(function (result) {
            $state.go('admin');
        });
    }
}]);
/**
 *管理员模块 ========================================================================结束========================================================================
 */

/**
 *用户管理模块 **********************************************************************开始***********************************************************************
 */

app.controller('userController', ['$scope', '$http', '$state', 'SERVER', '$stateParams', '$uibModal', 'Upload', 'ajax', function ($scope, $http, $state, SERVER, $stateParams, $uibModal, Upload, ajax) {
    $scope.users = []
    $scope.currentPage = "";
    $scope.pageSize = "";
    $scope.totalPageSize = "";

    $scope.user = {
        headImage: '',
        username: '',
        password: '',
        phone: '',
        userStatus: '',
        username_like:'',
        phone_like:''
    }
    page();
    $scope.search = function(){
        page();
    }

    $scope.reset = function(){
        $scope.user.username_like = '';
        $scope.user.phone_like = '';
        $scope.currentPage = 1;
        page();
    }

    $scope.openInfo = function (index) {
        var modalInstance = $uibModal.open({
            templateUrl: 'infoModalContent.html',
            controller: infoModalInstanceCtrl,
            resolve: {
                items: function () {
                    $scope.user = $scope.users[index];
                    return $scope.user;
                }
            }
        });
    };

    var infoModalInstanceCtrl = function ($scope, $uibModalInstance, items) {
        $scope.user = items;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.open = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.user;
                }
            }
        });
    };

    var ModalInstanceCtrl = function ($scope, $uibModalInstance) {
        $scope.user = {
            headImage: '',
            username: '',
            password: '',
            phone: '',
            userStatus: ''
        }
        $scope.ok = function () {
            var params = {method: 'POST', url: SERVER + 'back/user/add', data: $scope.user};
            ajax.http(params).then(function (result) {
                page();
            });
            $uibModalInstance.close($scope.user);
        };

        $scope.uploadFiles = function (file) {
            Upload.upload({
                //服务端接收
                url: SERVER + 'file/upload',
                //上传的同时带的参数
                data: {},
                file: file
            }).success(function (data, status, headers, config) {
                $scope.user = {
                    headImage: data.data,
                    username: $scope.user.username,
                    password: $scope.user.password,
                    phone: $scope.user.phone,
                    userStatus: $scope.user.userStatus
                };
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.openEdit = function (userId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'editModalContent.html',
            controller: editModalInstanceCtrl,
            resolve: {
                items: function () {
                    return userId;
                }
            }
        });
    };

    var editModalInstanceCtrl = function ($scope, $uibModalInstance,items) {
        var params = {method:'POST',url:SERVER+'back/user/query',data:{userId:items}};
        ajax.http(params).then(function(result){
            $scope.user = result;
            console.log($scope.user);
        });
        $scope.ok = function () {
            $scope.user.userId = items;
            var params = {method: 'POST', url: SERVER + 'back/user/update', data: $scope.user};
            ajax.http(params).then(function (result) {
                page();
            });
            $uibModalInstance.close($scope.user);
        };

        $scope.uploadFiles = function (file) {
            Upload.upload({
                //服务端接收
                url: SERVER + 'file/upload',
                //上传的同时带的参数
                data: {},
                file: file
            }).success(function (data, status, headers, config) {
                $scope.user = {
                    headImage: data.data,
                    username: $scope.user.username,
                    password: $scope.user.password,
                    phone: $scope.user.phone,
                    userStatus: $scope.user.userStatus
                };
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.delete = function (userId) {
        if (confirm('确定删除？')) {
            var params = {method: 'POST', url: SERVER + 'back/user/delete', data: {userId: userId}};
            ajax.http(params).then(function (result) {
                page();
            });
        }
    }

    $scope.changePage = function (int) {
        if ((int == 1 && $scope.currentPage == $scope.totalPageSize) || (int == -1 && $scope.currentPage == 1 )) {
            return;
        }
        $scope.currentPage = $scope.currentPage + int;
        page();
    }

    function page() {
        var params = {
            method: 'POST', url: SERVER + 'back/user/page', data: {
                currentPage: $scope.currentPage,
                pageSize: $scope.pageSize,
                username_like:$scope.user.username_like,
                phone_like:$scope.user.phone_like
            }
        };
        ajax.http(params).then(function (result) {
            $scope.users = result.resultData;
            $scope.currentPage = result.currentPage;
            $scope.totalPageSize = result.totalPageSize;
        });
    }
}]);

/**
 *用户管理模块 ========================================================================结束========================================================================
 */

/**
 *评论模块 ************************************************************************开始************************************************************************
 */
app.controller('commentController', ['$scope', '$http', '$state', 'SERVER', '$stateParams', 'ajax', 'Upload', '$uibModal', function ($scope, $http, $state, SERVER, $stateParams, ajax, Upload, $uibModal) {
    $scope.comments = [];
    $scope.currentPage = '';
    $scope.comment = {
        commentId: '',
        username: '',
        commentContent: '',
        ctime: '',
        username_like:'',
        commentContent_like:''
    }

    page();

    $scope.search = function(){
        page();
    }

    $scope.reset = function(){
        $scope.comment.username_like = '';
        $scope.comment.commentContent_like = '';
        $scope.currentPage = 1;
        page();
    }

    $scope.delete = function (commentId) {
        if (confirm('确定删除？')) {
            var params = {method: 'POST', url: SERVER + 'back/comment/delete', data: {commentId: commentId}};
            ajax.http(params).then(function () {
                page();
            });
        }
    }

    $scope.changePage = function (int) {
        if ((int == 1 && $scope.currentPage == $scope.totalPageSize) || (int == -1 && $scope.currentPage == 1 )) {
            return;
        }
        $scope.currentPage = $scope.currentPage + int;
        page();
    }

    function page() {
        var params = {
            method: 'POST', url: SERVER + 'back/comment/page', data: {
                currentPage: $scope.currentPage,
                username_like: $scope.comment.username_like,
                commentContent_like:$scope.comment.commentContent_like
            }
        };
        ajax.http(params).then(function (result) {
            $scope.comments = result.resultData;
            $scope.currentPage = result.currentPage;
            $scope.totalPageSize = result.totalPageSize;
        });
    }
}])
/**
 *评论模块 ========================================================================结束========================================================================
 */

/**
 *文章模块 ************************************************************************开始************************************************************************
 */
app.controller('articleController', ['$scope', '$http', '$state', 'SERVER', '$stateParams', 'ajax', 'Upload', '$uibModal', function ($scope, $http, $state, SERVER, $stateParams, ajax, Upload, $uibModal) {
    $scope.newspages = [];
    $scope.currentPage = '';
    $scope.article = {
        articleId: '',
        title: '',
        newsPageId: '',
        content: '',
        author: '',
        title_like:'',
        author_like:''
    }

    page();

    $scope.search = function(){
        page();
    }

    $scope.reset = function(){
        $scope.article.title_like = '';
        $scope.article.author_like = '';
        $scope.currentPage = 1;
        page();
    }

    $scope.openEdit = function (articleId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'editModalContent.html',
            controller: editModalInstanceCtrl,
            resolve: {
                items: function () {
                    return articleId;
                }
            }
        });
    };

    var editModalInstanceCtrl = function ($scope, $uibModalInstance, items) {
        var params = {method: 'POST', url: SERVER + 'back/article/query', data: {articleId: items}};
        ajax.http(params).then(function (result) {
            $scope.article = result;
        });

        $scope.ok = function () {
            var params = {method: 'POST', url: SERVER + 'back/article/update', data: $scope.article};
            ajax.http(params).then(function (result) {
                page();
            });
            $uibModalInstance.close($scope.article);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.open = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.article;
                }
            }
        });
    };

    var ModalInstanceCtrl = function ($scope, $uibModalInstance) {
        $scope.ok = function () {
            var params = {method: 'POST', url: SERVER + 'back/article/add', data: $scope.article};
            ajax.http(params).then(function (result) {
                page();
            });
            $uibModalInstance.close($scope.article);
        };

        var params = {method: 'POST', url: SERVER + 'back/newspage/list', data: null};
        ajax.http(params).then(function (result) {
            $scope.newspages = result;
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.openInfo = function (index) {
        var modalInstance = $uibModal.open({
            templateUrl: 'infoModalContent.html',
            controller: infoModalInstanceCtrl,
            resolve: {
                items: function () {
                    $scope.article = $scope.articles[index];
                    return $scope.article;
                }
            }
        });
    };

    var infoModalInstanceCtrl = function ($scope, $uibModalInstance, items) {
        $scope.article = items;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.delete = function (articleId, index) {
        if (confirm('确定删除？')) {
            var params = {method: 'POST', url: SERVER + 'back/article/delete', data: {articleId: articleId}};
            ajax.http(params).then(function () {
                page();
            });
        }
    }

    $scope.changePage = function (int) {
        if ((int == 1 && $scope.currentPage == $scope.totalPageSize) || (int == -1 && $scope.currentPage == 1 )) {
            return;
        }
        $scope.currentPage = $scope.currentPage + int;
        page();
    }

    function page() {
        var params = {
            method: 'POST', url: SERVER + 'back/article/page', data: {
                currentPage: $scope.currentPage,
                title_like:$scope.article.title_like,
                author_like:$scope.article.author_like
            }
        };
        ajax.http(params).then(function (result) {
            $scope.articles = result.resultData;
            $scope.currentPage = result.currentPage;
            $scope.totalPageSize = result.totalPageSize;
        });
    }
}])
/**
 *文章模块 ========================================================================结束========================================================================
 */

/**
 *版面模块 ************************************************************************开始************************************************************************
 */
app.controller('newspageController', ['$scope', '$http', '$state', 'SERVER', '$stateParams', 'ajax', 'Upload', '$uibModal', function ($scope, $http, $state, SERVER, $stateParams, ajax, Upload, $uibModal) {
    $scope.newspages = [];
    $scope.newss = [];
    $scope.currentPage = '';
    $scope.newspage = {
        newsPageId: '',
        title: '',
        newsId: '',
        imageContent: '',
        newspageStatus: '',
        ctime: '',
        state: '',
        pageSize: '',
        currentPage: '',
        title_like:''
    }

    page();

    $scope.search = function(){
        page();
    }

    $scope.reset = function(){
        $scope.newspage.title_like = '';
        $scope.currentPage = 1;
        page();
    }

    $scope.openInfo = function (index) {
        var modalInstance = $uibModal.open({
            templateUrl: 'infoModalContent.html',
            controller: infoModalInstanceCtrl,
            resolve: {
                items: function () {
                    $scope.newspage = $scope.newspages[index];
                    return $scope.newspage;
                }
            }
        });
    };

    var infoModalInstanceCtrl = function ($scope, $uibModalInstance, items) {
        $scope.newspage = items;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.open = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.newspage;
                }
            }
        });
    };

    var ModalInstanceCtrl = function ($scope, $uibModalInstance) {
        $scope.ok = function () {
            var params = {method: 'POST', url: SERVER + 'back/newspage/add', data: $scope.newspage};
            ajax.http(params).then(function (result) {
                page();
            });
            $uibModalInstance.close($scope.newspage);
        };

        var params = {method: 'POST', url: SERVER + 'back/news/list', data: null};
        ajax.http(params).then(function (result) {
            $scope.newss = result;
        });

        $scope.uploadFiles = function (file) {
            Upload.upload({
                url: SERVER + 'file/upload',
                data: {},
                file: file
            }).success(function (data, status, headers, config) {
                $scope.newspage = {imageContent: data.data};
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.openEdit = function (newsPageId) {
        $scope.newspage = {
            newsPageId: newsPageId,
            title: '',
            imageContent: '',
            newsPageStatus: '',
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'editContent.html',
            controller: editModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.newspage;
                }
            }
        });
    };

    var editModalInstanceCtrl = function ($scope, $uibModalInstance, items) {
        $scope.newspage = {newsPageId: items.newsPageId};
        var params = {method: 'POST', url: SERVER + 'back/newspage/query', data: $scope.newspage};
        ajax.http(params).then(function (result) {
            $scope.newspage = result;
        });

        $scope.ok = function () {
            $scope.newspage.newsPageId = items.newsPageId;
            var params = {method: 'POST', url: SERVER + 'back/newspage/update', data: $scope.newspage};
            ajax.http(params).then(function (result) {
                $scope.newspage = {
                    newsPageId: '',
                    title: '',
                    imageContent: '',
                    newsPageStatus: '',
                }
                page();
            });
            $uibModalInstance.close($scope.newspage);
        };

        $scope.uploadFiles = function (file) {
            Upload.upload({
                url: SERVER + 'file/upload',
                data: {},
                file: file
            }).success(function (data, status, headers, config) {
                $scope.newspage = {
                    imageContent: data.data,
                    newsPageId: $scope.newspage.newsPageId,
                    title: $scope.newspage.title,
                    newsPageStatus: $scope.newspage.newsPageStatus,
                };
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.delete = function (newsPageId, index) {
        if (confirm('确定删除？')) {
            console.log(newsPageId + "," + index);
            $scope.newspage.newsPageId = newsPageId;
            var params = {method: 'POST', url: SERVER + 'back/newspage/delete', data: $scope.newspage};
            ajax.http(params).then(function () {
                $scope.newspages.splice(index, 1);
            });
        }
    };

    $scope.changePage = function (int) {
        if ((int == 1 && $scope.currentPage == $scope.totalPageSize) || (int == -1 && $scope.currentPage == 1 )) {
            return;
        }
        $scope.currentPage = $scope.currentPage + int;
        page();
    }

    function page() {
        var params = {
            method: 'POST', url: SERVER + 'back/newspage/page', data: {
                currentPage: $scope.currentPage,
                title_like:$scope.newspage.title_like
            }
        };
        ajax.http(params).then(function (result) {
            $scope.newspages = result.resultData;
            $scope.currentPage = result.currentPage;
            $scope.totalPageSize = result.totalPageSize;
        });
    }
}]);
/**
 *版面模块 ========================================================================结束========================================================================
 */

/**
 *期刊模块 ************************************************************************开始************************************************************************
 */
app.controller('newsController', ['$scope', '$http', '$state', 'SERVER', '$stateParams', 'ajax', 'Upload', '$uibModal', function ($scope, $http, $state, SERVER, $stateParams, ajax, Upload, $uibModal) {
    $scope.news = {
        newsId: '',
        newsName: '',
        newCover: '',
        newsStatus: '',
        file: '',
        newsName_like:''
    }

    $scope.newss = []
    $scope.currentPage = "";
    $scope.pageSize = "";
    $scope.totalPageSize = "";
    $scope.totalSize = "";
    $scope.newsName_like = "";

    page();

    $scope.search = function(){
        page();
    }

    $scope.reset = function(){
        $scope.news.newsName_like = '';
        $scope.currentPage = 1;
        page();
    }

    $scope.openInfo = function (index) {
        var modalInstance = $uibModal.open({
            templateUrl: 'infoModalContent.html',
            controller: infoModalInstanceCtrl,
            resolve: {
                items: function () {
                    $scope.news = $scope.newss[index];
                    return $scope.news;
                }
            }
        });
    };

    var infoModalInstanceCtrl = function ($scope, $uibModalInstance, items) {
        $scope.news = items;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.open = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.news;
                }
            }
        });

        modalInstance.opened.then(function () {//模态窗口打开之后执行的函数

        });
    };

    var ModalInstanceCtrl = function ($scope, $uibModalInstance) {
        $scope.ok = function () {
            $scope.news.newsName = $scope.news.newsName.format('yyyy-MM-dd');
            var params = {method: 'POST', url: SERVER + 'back/news/add', data: $scope.news};
            ajax.http(params).then(function (result) {
                page();
            });
            $uibModalInstance.close($scope.news);
        };

        $scope.uploadFiles = function (file) {
            Upload.upload({
                url: SERVER + 'file/upload',
                data: {},
                file: file
            }).success(function (data, status, headers, config) {
                $scope.news = {newCover: data.data};
            }).error(function (data, status, headers, config) {
                console.log('error status: ' + status);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.openEdit = function (newsId) {
        $scope.news = {
            newsId: newsId,
            newsName: '',
            newCover: '',
            newsStatus: '',
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'editContent.html',
            controller: editModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.news;
                }
            }
        });
        modalInstance.opened.then(function () {//模态窗口打开之后执行的函数

        });
    };

    var editModalInstanceCtrl = function ($scope, $uibModalInstance, items) {
        $scope.news = {newsId: items.newsId};
        var params = {method: 'POST', url: SERVER + 'back/news/query', data: $scope.news};
        ajax.http(params).then(function (result) {
            $scope.news = result;
            $scope.news.newsName = new Date($scope.news.newsName);
            console.log($scope.news);
        });

        $scope.ok = function () {
            $scope.news.newsId = items.newsId;
            $scope.news.newsName = $scope.news.newsName.format('yyyy-MM-dd');
            var params = {method: 'POST', url: SERVER + 'back/news/update', data: $scope.news};
            ajax.http(params).then(function (result) {
                page();
            });
            $uibModalInstance.close($scope.news);
        };

        $scope.uploadFiles = function (file) {
            Upload.upload({
                url: SERVER + 'file/upload',
                data: {},
                file: file
            }).success(function (data, status, headers, config) {
                $scope.news = {
                    newCover: data.data,
                    newsName: $scope.news.newsName,
                    newsStatus: $scope.news.newsStatus
                };
            }).error(function (data, status, headers, config) {
                console.log('error status: ' + status);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    $scope.delete = function (newsId, index) {
        if (confirm('确定删除？')) {
            var params = {method: 'POST', url: SERVER + 'back/news/delete', data: {'newsId': newsId}};
            ajax.http(params).then(function (result) {
                $scope.newss.splice(index, 1);
            });
        }
    };

    $scope.changePage = function (int) {
        if ((int == 1 && $scope.currentPage == $scope.totalPageSize) || (int == -1 && $scope.currentPage == 1 )) {
            return;
        }
        $scope.currentPage = $scope.currentPage + int;
        page();
    }

    function page() {
        var params = {
            method: 'POST', url: SERVER + 'back/news/page', data: {
                currentPage: $scope.currentPage,
                pageSize: $scope.pageSize,
                newsName_like: $scope.news.newsName_like
            }
        };
        ajax.http(params).then(function (result) {
            $scope.newss = result.resultData;
            $scope.currentPage = result.currentPage;
            $scope.totalPageSize = result.totalPageSize;
            $scope.totalSize = result.totalSize;
        });
    }
}]);

/**
 *期刊模块 ========================================================================结束========================================================================
 */

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

app.service('ajax', ['$q', '$http', '$state', function ($q, $http, $state) {
    this.http = function (params) {
        var deferred = $q.defer();
        $http(params).success(function (data, status, headers, config) {
            if (data.code == '0') {
                deferred.resolve(data.data, status, headers, config);
            } else if (data.code == '1002') {
                $state.go('login');
            } else {
                alert(data.msg);
            }
        }).error(function (data, status, headers, config) {
            alert('ERROR:' + data);
            deferred.resolve(data.data, status, headers, config);
        })
        return deferred.promise;
    };
}]);

app.config(['$httpProvider', function ($httpProvider) {
    //HTTP 改造
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    $httpProvider.defaults.withCredentials = true;//允许cookie策略
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        if (subValue != null) {
                            fullSubName = name + '.' + subName;
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                }
                else if (value !== undefined) { //&& value !== null
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);