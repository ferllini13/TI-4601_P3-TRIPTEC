var app = angular.module("B2", ["ngRoute", 'angular.filter','ngAutocomplete']);

const SERVER_IP = "http://localhost:3000/";


app.config(function($routeProvider) {
    $routeProvider
    .when("/login", {
        templateUrl : "./../html/Login.html",
        controller : 'loginCtrl'
    })
    .otherwise({
        redirectTo: '/login'
    });
});


app.controller('loginCtrl', function($scope,$location,connectApi){
    $scope.user={};
	$scope.starPage=function(){//condiciones iniciales
		localStorage= null;
        document.getElementById('myForm').clear;                        
    };

    $scope.checkUser =  function(){//verificacion de la existencia de un usuario	
        connectApi.httpPost("login/login/",{user: $scope.user.usr,password:$scope.user.pws}).then(function(data){
            console.log(data.data.resultado)
            if (data.data.resultado==null){
                alert("datos erroneos");
                $location.url("login");
            }
            else {
                console.log("ELSE");
                localStorage.setItem('userName', $scope.user.usr);
		        localStorage.setItem('userId', data.data.resultado.id);
                localStorage.setItem('userRol', data.data.resultado.type);
                localStorage.setItem('user', JSON.stringify(data.data.resultado) );
                if (data.data.resultado.type==0) {$location.url("client");}
                else if (data.data.resultado.type==1) {$location.url("agent");}
            }    
        });
    };
})


app.controller('menuCtrl',function($scope,$location){
    $scope.userName=localStorage.getItem('userName');
	$scope.client=false;
    $scope.admi=false;


    $scope.checkRol=function(){
        $scope.userName=localStorage.getItem('userName');
        console.log( $scope.userName)
        let rol = localStorage.getItem('userRol');

        if (rol==1) {$scope.client=false;$scope.admi=true}
        else if (rol==0) {$scope.admi=false;$scope.client=true}
        else {$scope.admi=false;$scope.client=false}
    };


    $scope.logOut=function(){//cierra sesion y se hacegura de borrar el cache de los datos del usuario
		localStorage.clear();
		localStorage= null;
        $location.url('login');
    };


})


app.directive('menu', function() {
    return {
       templateUrl: 'html/Menu.html',
         controller:"menuCtrl"
   };
})


/////////// hay que corregir la que el mae hace con las respueestas despues de jalarlas , pero este es el get y el post basico 

//sevice que sobrecarga http con el fin de hacerlo accesible desde todos los comtroladores
app.service('connectApi',function($http){


    


	//implementacion del gttp.get
	this.httpGet= function(method){
        console.log("connectApi get!");
		var getPromise=$http.get(SERVER_IP+method).then(function (response){
            console.log(response);
	    	return response;
		});
		return getPromise;
    },
    
    this.httpGetR= function(method,requestJson){
		var getPromise=$http.get(SERVER_IP+method, JSON.stringify(requestJson)).then(function (response){
            console.log(response);
	    	return angular.fromJson(response);
		});
		return getPromise;
	},
	//implementacion del http.post
	this.httpPost= function(method,requestJson){
		var postPromise=$http.post(SERVER_IP+method, JSON.stringify(requestJson)).then(function(response) {
            console.log(response);
	  		return angular.fromJson(response);
       	});
		return postPromise;
    }
    
    //implementacion del http.post
	this.httpPut= function(method,requestJson){
		var postPromise=$http.put(SERVER_IP+method, JSON.stringify(requestJson)).then(function(response) {
            console.log(response);
	  		return angular.fromJson(response);
       	});
		return postPromise;
    }
    

    //implementacion del http.post
	this.httpDelete= function(method){
		var postPromise=$http.delete(SERVER_IP+method).then(function(response) {
            console.log(response);
	  		return angular.fromJson(response);
       	});
		return postPromise;
	}
})

