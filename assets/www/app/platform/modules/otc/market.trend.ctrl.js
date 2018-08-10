(function () {
    'use strict';

    angular.module('app').controller('MarketTrendCtrl', MarketTrendCtrl);
    MarketTrendCtrl.$inject = ['$rootScope', '$scope', '$sessionStorage', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'OtcService', 'MarketService', '$stateParams'];
    function MarketTrendCtrl($rootScope, $scope, $sessionStorage, $ionicLoading, $ionicPopup, $ionicNativeTransitions, OtcService, MarketService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.defaultColor = 1;


        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        };
        vm.title = [
            { name:'5分钟' },
            { name:'4小时' },
            { name:'天' },
            { name:'周' }
        ];

        vm.translatex = {
            'transform':'translateX(0%)',
            'width':100/vm.title.length + '%'
        };
        vm.model = {
            upDown:'',
            rate:'',
            market:'',
            zeroPrice:'',
            highestPrice:'',//最高价
            lowestPrice:'',//最低价
            turnoverTotal:'',//总成交量
            xaxisDatas:[1],
            yaxisLineDatas:[1],
            yaxisBarDatas:[1]
        }
        vm.doRefreshChart = doRefreshChart;
        initPage();

        var myChart;
        function initPage(){
            myChart = echarts.init(document.getElementById('div_trend'));
            myChart.setOption(getOption());
            initMarket();

        }
        /**
         * 获取消费的账户信息
         */
        function initMarket(){
            myChart.showLoading();
            MarketService.getCurrentMarket()
                .success(function(data){
                    vm.model = data;
                    vm.model.xaxisDatas = parseXaxisDatas(4, vm.model.xaxisDatas);
                    initChartDatas();
                }).error(function (error) {
            }).finally(function () {
            });
        }

        function doRefreshChart(flag){
            // var period=angular.element(document.getElementById('div_period')).find('div');
            // angular.forEach(period, function (item) {
            //     var aritem = angular.element(item);
            //     if(aritem.attr('class') != 'tab_div activated'){
            //         aritem.attr('class','tab_div');
            //     }else{
            //         aritem.attr('class',aritem.attr('class')+' tab_activated');
            //     }
            // });
            vm.defaultColor = flag;
            var n =  parseInt(flag-1) * 100;
            vm.translatex = {
                'transform':'translateX('+ n +'%)',
                'animation': 'mymove .45s linear forwards'
            };
            myChart.showLoading();
            MarketService.getTrendDatas(flag)
                .success(function(data){
                    vm.model.xaxisDatas = parseXaxisDatas(flag, data.xaxisDatas);
                    vm.model.yaxisLineDatas = data.yaxisLineDatas;
                    vm.model.yaxisBarDatas = data.yaxisBarDatas;
                    initChartDatas();
                }).error(function (error) {
            }).finally(function () {
            });
        }

        function initChartDatas(){
            myChart.hideLoading();
            myChart.setOption({
            xAxis: {
                axisTick:{show:false},
                data: vm.model.xaxisDatas
            },
            series: [
                {
                    name:'价格走势',
                    type:'line',
                    data:vm.model.yaxisLineDatas,
                    lineStyle:{
                        color:'#F68063',
                        width:2
                    },
                    itemStyle:{
                        color:'#F68063'
                    },
                    markPoint:{
                        symbolSize:0
                    }
                },
                {
                    name:'成交量',
                    type:'bar',
                    yAxisIndex: 1,
                    data:vm.model.yaxisBarDatas,
                    itemStyle:{
                        color:'#a8d9ff',
                        borderWidth:0,
                        borderColor:'#a8d9ff'
                    }
                }]
             });
        }

        function getOption(){
            var option = {
                grid: {
                    top: 40,
                    left: 50,
                    right: 5,
                    height: 200,
                    show:false
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: 'red'
                        }
                    }
                },
                legend: {
                    data:['价格走势','成交量'],
                    bottom:50
                },
                dataZoom: [{
                    type: 'inside',
                    throttle: 50
                }],
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisTick:{show:false}
                    }
                ],
                yAxis: [
                    {
                        splitLine:{show: false},
                        axisTick:{show:false},
                        type: 'value',
                        interval: 10,
                        axisLabel: {
                            formatter: '{value}.0'
                        }
                    },
                    {
                        show:false
                    }
                ],
                series: [
                    {
                        name:'价格走势',
                        type:'line',
                        data:[]
                    },
                    {
                        name:'成交量',
                        type:'bar',
                        yAxisIndex: 1,
                        data:[]
                    }

                ]
            };
            return option;
        }

        /**
         * 转日期格式
         * @param flag
         * @param srcX
         * @returns {Array}
         */
        function parseXaxisDatas(flag,srcX){
            var newX = [];
            angular.forEach(srcX, function (item) {
                if(1 == flag){
                    newX.push(item.substring(11,item.length-3));
                } else if(2 == flag){
                    newX.push(item.substring(5,item.length-6));
                } else if(3 == flag || 4 == flag){
                    newX.push(item.substring(5,item.length-9));
                }
            });
            return newX;
        }
    }
})();