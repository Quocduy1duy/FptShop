var app=angular.module("myapp",["ngRoute"]);
app.run(function($rootScope,$timeout){
  $rootScope.$on("$routeChangeStart",function(){
    $rootScope.loading=true;
  });
  $rootScope.$on("$routeChangeSuccess",function(){
    $timeout(function(){
      $rootScope.loading=false;
    },200)
  });
  $rootScope.$on("$routeChangeError",function(){
    $rootScope.loading=false;
    alert("Lỗi òi!!")
  });
})
  app.config(function($routeProvider){
    $routeProvider
    .when('/home',{
      templateUrl:'view/home.html',
      controller:'homectrl',
      })
    .when('/giohang',{
      templateUrl:'view/giohang.html',
      controller:'giohangctrl',    
      })
    .when('/login',{
       templateUrl:'view/login.html',
       controller:'loginctrl',    
      }) 
    .when('/chitiet/:masach',{
        templateUrl:'view/chitiet.html',
        controller:'chitietctrl',    
       })
    .when('/doimatkhau',{
        templateUrl:'view/doimatkhau.html',
        controller:'doimatkhauctrl',    
       })   
       .when('/tt',{
        templateUrl:'view/tt.html',
        controller:'ttctrl',    
       })
       .when('/card',{
        templateUrl:'view/card.html',
        controller:'cardctrl',    
       })
    .otherwise({
      redirectTo:'/home',
      })  
  })
  app.controller('myctrl',function($scope,$http,$rootScope){
    $scope.book=[];
    $http.get('js/data.json').then(
       function(res){ // thành công
         //  console.log(res.data);
          $scope.book=res.data;
       },
       function(res){ // thất bại

       }
      )
      $rootScope.giohang=[];
      $rootScope.Account=[
           {
            email:'admin@123',
            password:'123'
           }
      ];
      $rootScope.Login={};
  });
  
  app.controller('chitietctrl',function ($scope,$routeParams,$rootScope){
    //  :masp  ở trên config
  $scope.id=$routeParams.masach;
  $scope.sach={};
  $scope.quantity=1;
  for(var sach of $scope.book){
    if(sach.id==$scope.id){
      $scope.sach=sach;
      break;
    }
  }

  $scope.addgiohang2=function(sach){
    for(let i=0;i<$rootScope.giohang.length;i++){
      if($rootScope.giohang[i].id==sach.id){
        $rootScope.giohang[i].quantity=$rootScope.giohang[i].quantity+$scope.quantity;
        alert("Thêm thành công");
        return;
      }
     }
        sach.quantity=$scope.quantity;
        $rootScope.giohang.push(sach);
        alert("Thêm giỏ hàng thành công")

 }
  

})
app.controller('giohangctrl',function ($scope,$rootScope){
  $scope.tongTien=function(){
    var tong=0;
    for(var i=0;i<$rootScope.giohang.length;i++){
      tong+=(($rootScope.giohang[i].price)-($rootScope.giohang[i].price*$rootScope.giohang[i].giamphantram/100))*$rootScope.giohang[i].quantity;  
    }
    return tong;
   }
  $scope.deletegiohang=function(idsach){
    for(let i=0;i<$rootScope.giohang.length;i++){
       if(idsach==$rootScope.giohang[i].id){
         $rootScope.giohang.splice(i, 1); 
         break;
       }
    }
}
$scope.removeAllgiohang=function(){
  $rootScope.giohang=[];
  
}

})
app.controller('headerctrl',function($scope,$http,$rootScope,$location){
  $rootScope.updatekeyword=function(key){
    $rootScope.keyword=key;
  }
  $scope.Dangxuat=function(){
    $rootScope.Login={};
    alert("Đăng xuất thành công");
    $location.path('/home');
  }
});
app.controller('homectrl',function($scope,$rootScope){
    $scope.page=1;
    $scope.limit=8;
    //trang 1 thì start=0
    //trang 2 thì start=8
    //trang 3 thì start=16
    //trang n thì start=(n-1)*8
    $scope.start=($scope.page-1)* $scope.limit; 
    $scope.totalPage=Math.ceil($scope.book.length/$scope.limit); // trang cuối
    $scope.dsTrang=[];
    for(var i=1;i<=$scope.totalPage;i++){
      $scope.dsTrang.push(i);
    }
    $scope.changePage=function(trang){
        $scope.page=trang;
        $scope.start=($scope.page-1)* $scope.limit
    }
   // giỏ hàng
 $rootScope.addgiohang=function(sp){
  // sp đã có trong giohang-> tăng số lượng
   for(var spgh1 of $rootScope.giohang){
      if(spgh1.id==sp.id){
        spgh1.quantity++;
        alert("Thêm vào giỏ hàng thành công");
        return;
      }
   }
     // sp chưacó trong giohang-> thêm vô
       sp.quantity=1;
       $rootScope.giohang.push(sp); 
       alert("Thêm vào giỏ hàng thành công"); 
 }

  });
app.controller('loginctrl',function ($scope,$routeParams,$rootScope,$location){
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // lấy data từ form đăng ký
  $scope.dangky=function(){
      // bắt lỗi
  if($scope.email.length==0){
    alert("Email không được để trống ");
    return;
  }
  if(!emailPattern.test($scope.email)){
    alert("Email không đúng định dạng");
    return;
  }
  for(let acc of $rootScope.Account){
    if(acc.email==$scope.email){
       alert("Emal đã tồn tại");
       return;
    }
  }
  if($scope.matkhau.length==0){
    alert("Mật khẩu không được để trống");
    return;
  }
  if($scope.matkhau!==$scope.matkhau2){
    alert("Mật khẩu nhập lại không đúng");
    return;
  }
  if(!$scope.dieukhoan){
    alert("Chưa đồng ý điều khoản");
    return;
  }
    $scope.dataform={};
    $scope.dataform.email=$scope.email;
    $scope.dataform.password=$scope.matkhau;
    $rootScope.Account.push($scope.dataform);
    alert("Đăng ký thành công");
     // gán đối tượng login
     $rootScope.Login={};
     $rootScope.Login.email=$scope.email;
     $rootScope.Login.password=$scope.matkhau;
    $location.path('/home');
    // console.log($rootScope.Account)
  }

  $scope.DangNhap=function(){
     if($scope.emaildn.length==0){
      alert("Email không được để trống");
      return;
     }
     if($scope.matkhaudn.length==0){
      alert("Mât khẩu không được để trống");
      return;
     }
     let kiemtra=false;
     console.log($rootScope.Account);
     for(let i=0;i<$rootScope.Account.length;i++){
        if($rootScope.Account[i].email==$scope.emaildn && $rootScope.Account[i].password==$scope.matkhaudn){
            kiemtra=true;
            alert("Đăng nhập thành công ");
            $rootScope.Login={};
            $rootScope.Login.email=$scope.emaildn;
            $rootScope.Login.password=$scope.matkhaudn;
            $location.path('/home');
             break;
        }

     }
     if(!kiemtra){
      alert("Sai tài khoản hoặc mật khẩu")
     }
  }
})
app.controller('doimatkhauctrl',function($scope,$http,$rootScope,$location){
  $scope.DoiMatkhau=function(){
    if($scope.mkmoi.length==0){
      alert("Mật khẩu mới không được để trống");
      return;
    }
    if($scope.mkmoi!==$scope.mkxacmkmoi){
      alert("Xác nhận mật khẩu không đúng");
      return;
    }
    let kiemtra=false;
    for(let tk of $rootScope.Account){
        if(tk.email==$scope.email && tk.password==$scope.mkcu){
             tk.password=$scope.mkmoi;
             alert("Đổi mật khẩu thành công");
             kiemtra=true;
             $rootScope.Login={};
             $rootScope.Login.email=tk.email;
             $rootScope.Login.password=$scope.mkmoi;
             $location.path('/home');
             break;
        }
    }
    if(!kiemtra){
        alert("Sai email hoặc mật khẩu cũ ")
    }
  }
});

  