// JavaScript Document
var _scope;
var app = angular.module('nowApp',["baseApp"]);
app.controller('listCtrl',['$scope','BaseService',function($scope,BaseService) {
    $scope.userAuth=window.localStorage.auth?JSON.parse(window.localStorage.auth):""; //用户权限  query查询 modify修改  add新增  delete删除  export导出 apply申请   audit审核  view查看
    $scope.sta=0;//列表0 添加1 编辑2
    $scope.base = BaseService;
    $scope.params={pageNum:1,pageSize:10,partnerId:"",chl:"",status:1,mobile:""};
    $scope.sea={partnerId:"",chl:"",status:1,mobile:""};
    $scope.totle=0;
    var baseUrl=$scope.base.basePath();
    var url_list=baseUrl+"/MarketAdminWeb/partnerUserChannel/getPartnerUserList.json";
    var url_info=baseUrl+"/MarketAdminWeb/partnerUserChannel/getPartnerUserById.json";
  //  var url_add=baseUrl+"/MarketAdminWeb/partnerUserChannel/addUser.json";
    var url_edit=baseUrl+"/MarketAdminWeb/userChannel/updatePartnerUser.json";
    var url_del=baseUrl+"/MarketAdminWeb/partnerUserChannel/deletePartnerUser.json";
    $scope.list=[];
   /* $scope.cardType=[{key:0,val:"身份证号"}];
    $scope.status=[{key:0,val:"正常"},{key:1,val:"删除"}];
    $scope.source=[{key:0,val:"自有"},{key:1,val:"拎包有"}];
    $scope.permissionPage = [{name:"注册查询",val:'1'},{name:"首投查询",val:'2'},{name:"投资查询",val:'3'},{name:"充值查询",val:'4'}]
    $scope.sdata={iscompany:1,pages:''}
    $scope.reVal=function(key,list){
        var str="";
        angular.forEach(list,function(data,index,arr){
            if(data.key==key){
                str=data.val;
                return false;
            }
        })
        return str;
    }*/
    $scope.getData=function(){
       $scope.base.post(url_list,$scope.params,function(data){
           if(data&&data.code==0){
            $scope.list=data.data.data;
            $scope.totle=data.data.totalCount;
           //console.log($scope.params);
          }else{
               $scope.list="";
               $scope.totle=0;
          }
       })
    }
    $scope.getData();
    $scope.selFunc=function(type){
        $scope.params.pageNum=1;
        if(type==0){
        	$scope.params={pageNum:1,pageSize:10,partnerId:"",chl:"",status:1,mobile:""};
     	    $scope.sea={partnerId:"",chl:"",status:1,mobile:""};
        }else{
            $scope.params=angular.extend($scope.params,$scope.sea);
        }
        $scope.getData();

    }
  /*  $scope.dataPages = [];
    $scope.checkPermission = function($event,item){
        var checkbox = $event.target;
        var isCk = checkbox.checked ? 1 : 0;
        if (isCk == 1) {
            $scope.dataPages.push(item.val);
        } else {
            var index = getIndex(item.val,$scope.dataPages );
            $scope.dataPages.splice(index, 1);
        }
        $scope.sdata.pages = $scope.dataPages.join(',');
    }
    function getIndex(val, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] == val) {
                return i;
            };
        }
        return -1;
    }*/
    $scope.editFunc=function(item){
               // $scope.sdata=item;
        var checkbox = $('.checkbox input');
        $scope.dataPages = [];
        angular.forEach(checkbox,function(data){//清除上次的checkbox
            $(data).prop("checked","");
        })
        $scope.base.post(url_info,{userId:item.id},function(data){
            if(data&&data.code==0){
                $scope.sdata=item;
                $scope.sdata.channels=data.data.channels;
                if(data.data.pages){
                    $scope.sdata.pages = data.data.pages;
                    //$scope.sdata.pages = '1,2,4,';
                    var arr = $scope.sdata.pages.split(',');
                    angular.forEach(arr,function(data){

                        if(data){
                            $scope.dataPages.push(data);
                            var index = parseInt(data) -1 ;
                            checkbox.eq(index).prop("checked","checked");
                        }
                    })

                }else{
                    $scope.sdata.pages = '';
                }

                $scope.sta=2;
            }else{

                $scope.base.msg(data.msg);
            }
        })

    }
    $scope.delFunc=function(id){
       $scope.base.confirmBox(function(){
           $scope.base.post(url_del,{userId:id},function(data){
               if(data&&data.code==0){
                   $scope.base.msg("操作成功");
                   $scope.getData();
               }else{
                   $scope.base.msg(data.msg);
               }
           })
       },"确定要删除用户么？")
    }
    $scope.back = function(){
        $scope.sta=0;
        $scope.sdata.pages='';
        $scope.dataPages = [];
    }
    $scope.add = function(){
        var checkbox = $('.checkbox input');
        $scope.dataPages = [];
        angular.forEach(checkbox,function(data){//清除上次的checkbox
            $(data).prop("checked","");
        })
        $scope.sta=1;
    }
    $scope.editFunc2=function(id){
        $scope.base.confirmBox(function(){
            $scope.base.post(url_repass,{userId:id},function(data){
                if(data&&data.code==0){
                    $scope.base.msg("操作成功");
                    $scope.getData();
                }else{
                    $scope.base.msg(data.msg);
                }
            })
        },"确定要重置密码么？")
    }
    $scope.subFunc=function(){
        var url;
        if($scope.sta==1){
            url=url_add;
        }else{
            url=url_edit;
        }
        if( $scope.sdata.chl===''||$scope.sdata.chl==null){$scope.base.msg("请填写渠道号");return false;}
        if( $scope.sdata.executeTaskStatus===''||$scope.sdata.executeTaskStatus==null){$scope.base.msg("请填写执行过的任务");return false;}
        if( $scope.sdata.taskType===''||$scope.sdata.taskType==null){$scope.base.msg("请填写任务类型");return false;}
        if( $scope.sdata.mobile===''||$scope.sdata.mobile==null){$scope.base.msg("请填写平台手机号");return false;}
        if( $scope.sdata.status===''||$scope.sdata.status==null){$scope.base.msg("请填写推送状态");return false;}
        if( $scope.sdata.isold===''||$scope.sdata.isold==null){$scope.base.msg("请填写用户类型");return false;}
        /*var data= $scope.sdata;
        if($scope.sta==1){
            data=$scope.base.deepClone($scope.sdata);
            data.password= $.md5(data.password);

        }
        $scope.base.post(url,data,function(data){
            if(data.code==0){
                $scope.base.msg("操作成功");
                $scope.sta=0;
                $scope.getData();
            }else{
                $scope.base.msg(data.msg);
            }
        })*/
    }
     $scope.$watch("params.pageSize", function (newValue, oldValue) {
          if (newValue === oldValue) {
              return;
          }
          $scope.params.offset=0;
          $scope.getData();
      });
      $scope.$watch("params.pageNum", function (newValue, oldValue) {
          if (newValue === oldValue) {
              return;
          }
          $scope.getData();
      });

    $scope.$watch("sta", function (newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        
    });

}])
