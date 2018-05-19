var app = angular.module("myApp", []);
//一个日历处理工具类
var calUtil = {
    //当前日历显示的年份
    showYear: 2018,
    //当前日历显示的月份
    showMonth: 2,
    //当前日历显示的天数
    showDays: 1,
    eventName: "load",
    //获取当前年月日
    setMonthAndDay: function() {
        switch (calUtil.eventName) {
            case "load":
                var current = new Date();
                calUtil.showYear  = current.getFullYear();
                calUtil.showMonth = current.getMonth() + 1;
				calUtil.showDay   = current.getDate();
                break;
            case "prev":
                var nowMonth = calUtil.showMonth;
                calUtil.showMonth = parseInt(nowMonth) - 1;
                if (calUtil.showMonth == 0) {
                    calUtil.showMonth = 12;
                    calUtil.showYear -= 1;
                }
                break;
            case "next":
                var nowMonth = calUtil.showMonth;
                calUtil.showMonth = parseInt(nowMonth) + 1;
                if (calUtil.showMonth == 13) {
                    calUtil.showMonth = 1;
                    calUtil.showYear += 1;
                }
                break;
        }
    },
    //绑定事件

    //获取当前选择的年月
    getDaysInmonth: function(iMonth, iYear) {
        var dPrevDate = new Date(iYear, iMonth, 0);
        return dPrevDate.getDate();
    },
	//生成日历，一个七行七列的表格
    bulidCal: function(iYear, iMonth, signsList) {
        var aMonth = new Array();
        for (var i = 0; i < 7; i++) {
            aMonth[i] = new Array(7);
        }
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                aMonth[i][j] = "";
            }
        }

        var dCalDate = new Date(iYear, iMonth - 1, 1);
        var iDayOfFirst = dCalDate.getDay(); //本月第一天是星期几
        var iDaysInMonth = calUtil.getDaysInmonth(iMonth, iYear); //这个月多少天
        var iVarDate = 1;
        var d, w;
        aMonth[0][0] = "日";                  //第一行显示星期
        aMonth[0][1] = "一";
        aMonth[0][2] = "二";
        aMonth[0][3] = "三";
        aMonth[0][4] = "四";
        aMonth[0][5] = "五";
        aMonth[0][6] = "六";
        for (d = iDayOfFirst; d < 7; d++) {   //第二行
            aMonth[1][d] = iVarDate;
            iVarDate++;
        }
        for (w = 2; w < 7; w++) {            //第三到第七行
            for (d = 0; d < 7; d++) {
                if (iVarDate <= iDaysInMonth) {
                    aMonth[w][d] = iVarDate;
                    iVarDate++;
                }
            }
        }
        var date = new Array(7);
        for (var i = 0; i < 7; i++) {      //二维对象数组data，记录签到状态
            date[i] = new Array(7);
        }
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                date[i][j] = {
                    "day": aMonth[i][j],
                    "signed": "CalendarCell",
                };
                if (signsList[i*7+j]) {//signsList由后端返回，key值是[0,1,0,1...]的形式
                    date[i][j].signed = "signedCalendarCell";
                }
            }
        }
        return date;
    },
    ifHasSigned: function(sign) {
        var signed = false;
        //$.each(signsList, function(index, item) {
            //if (item.signDay == day && item.signYear == iYear && item.signMonth == iMonth) {
			  if(1===sign){
                signed = true;
                return false;
            }
        //});
        return signed;
    },
};
//网络请求
_app = {
    request:function(param){
        $.ajax({
            url :param.url || '',
            data:param.data || '',
            success:function(res){
                return param.success(res.data);
            },
            error:function(res){
                param.error(res.errMsg);
            },
        });
    },  
}
//param示例
var param = {
	method:'get',
	url:'https://www.baidu.com',
	data:'',
	success:function(res){
		console.log('请求成功');
        return res;
	},
	error:function(msg){
		console.log("网络可能出问题了");
	},
};
app.controller("myCtrl", function($scope) {
    // { "signYear": "2018", "signMonth": "4", "signDay": "10" },
    //        { "signYear": "2018", "signMonth": "4", "signDay": "11" },
    //        { "signYear": "2018", "signMonth": "4", "signDay": "12" },
    //        { "signYear": "2018", "signMonth": "4", "signDay": "13" },
    var signsList = [];
	for(var i=0;i<49;i++){
		signsList[i] = 0;
	}
    //var a = [];
	//点击签到，执行以下
    $scope.qiandao = function() {
		calUtil.setMonthAndDay();  //获取当前的年月日（showYear,showMonth,showDay）
		var year = calUtil.showYear;
        var month =  calUtil.showMonth;
		var day = calUtil.showDay;
        var current = new Date(year,month-1,1); //返回5月1号
		//确定今天日期在表格中的位置
		var iDayOfFirst = current.getDay(); //先获取本月第一天（5月1号）是星期几
		var itoday = day + iDayOfFirst - 1 + 7; //然后今天的日期的所对应的下标就是itoday
		signsList[itoday] = 1;              //对应的元素变1
        //var signList = { "signYear": year, "signMonth": month, "signDay": day };
        //signsList.push(signList);
        $scope.date = calUtil.bulidCal(calUtil.showYear, calUtil.showMonth, signsList);  //绑定当前的日历状态
        // console.log(month+"  "+year+" "+day);
        //console.log($scope.date[3][6].signed);
        // if($scope.clickable){
        //     alert('您已经签到过了');
        // }
        $scope.day = day;
        $scope.clickable = true;
        //$scope.taped = true;
        $scope.count = f_count();
    };
	//获取数据
	var _signsList = _app.request(param);
    //数据示例
    signsList[35] = 1; signsList[34] = 1;signsList[15] = 1;signsList[25] = 1;   
    function f_count(){
        var count = 0;
        for(var i = 0;i<49;i++){
            if(1 === signsList[i]){
                count++;
            }
        };
        return count;
    }
    calUtil.setMonthAndDay(); //获取当前年月日
    $scope.date       = calUtil.bulidCal(calUtil.showYear, calUtil.showMonth, signsList); //根据当前年月日生成日历
	//日历栏上的年月
    $scope.showYear   = calUtil.showYear;
    $scope.showMonth  = calUtil.showMonth;
	
    //上月
    $scope.onPreClick = function() {
        calUtil.eventName = "prev";
        calUtil.setMonthAndDay();
        $scope.date = calUtil.bulidCal(calUtil.showYear, calUtil.showMonth, signsList); //根据当前年月日渲染日历
        //这是日历栏上的年月
		$scope.showYear = calUtil.showYear;
        $scope.showMonth = calUtil.showMonth;

    };
	//下月
    $scope.onNextClick = function() {
        calUtil.eventName = "next";
        calUtil.setMonthAndDay();
        $scope.date = calUtil.bulidCal(calUtil.showYear, calUtil.showMonth, signsList); //根据当前年月日渲染日历
        //日历栏上的年月
		$scope.showYear = calUtil.showYear;
        $scope.showMonth = calUtil.showMonth;
    };

    //点击签到，获取到当前日期，然后将其push到signsList
    //console.log($scope.showYear + "  444  " + $scope.showMonth);
    //$scope.a = 10
});