var app = angular.module("myApp", []);
var calUtil = {
    //当前日历显示的年份
    showYear: 2018,
    //当前日历显示的月份
    showMonth: 2,
    //当前日历显示的天数
    showDays: 1,
    eventName: "load",

    setMonthAndDay: function() {
        switch (calUtil.eventName) {
            case "load":
                var current = new Date();
                calUtil.showYear = current.getFullYear();
                calUtil.showMonth = current.getMonth() + 1;
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
        aMonth[0][0] = "日";
        aMonth[0][1] = "一";
        aMonth[0][2] = "二";
        aMonth[0][3] = "三";
        aMonth[0][4] = "四";
        aMonth[0][5] = "五";
        aMonth[0][6] = "六";
        for (d = iDayOfFirst; d < 7; d++) {
            aMonth[1][d] = iVarDate;
            iVarDate++;
        }
        for (w = 2; w < 7; w++) {
            for (d = 0; d < 7; d++) {
                if (iVarDate <= iDaysInMonth) {
                    aMonth[w][d] = iVarDate;
                    iVarDate++;
                }
            }
        }
        var date = new Array(7);
        for (var i = 0; i < 7; i++) {
            date[i] = new Array(7);
        }
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                date[i][j] = {
                    "day": aMonth[i][j],
                    "signed": "CalendarCell",
                };
                if (this.ifHasSigned(signsList, aMonth[i][j], iYear, iMonth)) {
                    date[i][j].signed = "signedCalendarCell";
                }
            }
        }
        return date;
    },
    ifHasSigned: function(signsList, day, iYear, iMonth) {
        var signed = false;
        $.each(signsList, function(index, item) {
            if (item.signDay == day && item.signYear == iYear && item.signMonth == iMonth) {
                signed = true;
                return false;
            }
        });
        return signed;
    },
};

app.controller("myCtrl", function($scope) {
    // { "signYear": "2018", "signMonth": "4", "signDay": "10" },
    //        { "signYear": "2018", "signMonth": "4", "signDay": "11" },
    //        { "signYear": "2018", "signMonth": "4", "signDay": "12" },
    //        { "signYear": "2018", "signMonth": "4", "signDay": "13" },
    var signsList = [];
    //var a = [];
    $scope.qiandao = function() {
        var current = new Date();
        var year = current.getFullYear();
        var month = current.getMonth() + 1;
        var day = current.getDate();
        var signList = { "signYear": year, "signMonth": month, "signDay": day };
        signsList.push(signList);
        calUtil.setMonthAndDay();
        $scope.date = calUtil.bulidCal(calUtil.showYear, calUtil.showMonth, signsList);
        var dates = calUtil.bulidCal(calUtil.showYear, calUtil.showMonth, signsList);
        // console.log(month+"  "+year+" "+day);
         console.log(signsList);
        $scope.clickable = true;
        //$scope.taped = true;
    };
    calUtil.setMonthAndDay(); //获取当前年月日
    $scope.date = calUtil.bulidCal(calUtil.showYear, calUtil.showMonth, signsList); //根据当前年月日渲染日历
    $scope.showYear = calUtil.showYear;
    $scope.showMonth = calUtil.showMonth;

    $scope.onPreClick = function() {
        calUtil.eventName = "prev";
        calUtil.setMonthAndDay();
        $scope.date = calUtil.bulidCal(calUtil.showYear, calUtil.showMonth, signsList); //根据当前年月日渲染日历
        $scope.showYear = calUtil.showYear;
        $scope.showMonth = calUtil.showMonth;

    };
    $scope.onNextClick = function() {
        calUtil.eventName = "next";
        calUtil.setMonthAndDay();
        $scope.date = calUtil.bulidCal(calUtil.showYear, calUtil.showMonth, signsList); //根据当前年月日渲染日历
        $scope.showYear = calUtil.showYear;
        $scope.showMonth = calUtil.showMonth;
    };

    //点击签到，获取到当前日期，然后将其push到signsList

    //console.log($scope.showYear + "  444  " + $scope.showMonth);
    //$scope.a = 10
});