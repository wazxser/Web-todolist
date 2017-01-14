var user_id = 0;
var list_data;
var reg_flag = 0;

//获取当前日期，格式为2017-01-01
function getNowDate(){
    var now_date = new Date();

    var month = "" + (now_date.getMonth()+1) + "";
    var date = "" + now_date.getDate();

    if( month.length == 1){
        month = "0" + month;
    }

    if( date.length == 1){
        date = "0" + date;
    }

    var str = "" + now_date.getFullYear() + "-";
    str += month + "-";
    str += date;

    return str;
}

//完成按钮对应的点击事件，改变事项的状态为已完成
function complete_click(list_id){
    if (parseInt(list_id)>0){
        $.ajax({
            type: 'GET',
            url: '/api/lists/'+list_id,
            success: function (data) {
                console.log(data);
                getList();
            }
        });
    }
}

//删除按钮对应的点击事件，删除选中的事件
function delete_click(list_id, index){
    sweetAlert({
            title: "确认删除?",
            text: "将删除 " + list_data[index].thing + " 事项",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm){
            if (isConfirm) {
                if (parseInt(list_id)>0){
                    $.ajax({
                        type: 'DELETE',
                        url: '/api/lists/'+list_id,
                        success: function (data) {
                            if(data.affectedRows>0){
                                console.log(data);
                                swal("删除成功!", "", "success");
                                getList();
                            }
                        }
                    });
                }
            } else {
                swal("已取消", "", "error");
            }
        });
}

//得到相应用户的事项列表
function getList() {
    if(user_id != 0){
        $.get('/api/lists?uid='+user_id,function (data,status) {
            var html = "";
            list_data = data;

            for(var index in data){
                var del_button = "<button id='"+data[index].id+"' onclick='delete_click(" + data[index].id +","+ index + ")' class='btn btn-danger' width='10px'>删除</button>";

                if(data[index].status == "完成"){
                    var complete_button = "<button disabled='disabled' id='"+data[index].id+"' onclick='complete_click(" + data[index].id + ")' class='btn btn-success'>完成</button>";

                    html += "<tr class='finish'><td>"+data[index].thing+"</td><td>"+data[index].ctime+"</td><td>"+data[index].deadline+"</td><td>"+data[index].status+"</td><td>"+complete_button+"</td><td>"+del_button+"</td></tr>";
                }
                else{
                    var complete_button = "<button id='"+data[index].id+"' onclick='complete_click(" + data[index].id + ")' class='btn btn-success'>完成</button>";

                    var now_date = getNowDate();
                    var deadline = data[index].deadline;

                    var now_date_month = parseInt( now_date.slice(5, 7).charAt(0) == "0" ? now_date.slice(6, 7) : now_date.slice(5, 7) );
                    var deadline_month = parseInt( deadline.slice(5, 7).charAt(0) == "0" ? deadline.slice(6, 7) : deadline.slice(5, 7) );

                    var now_date_date = parseInt( now_date.slice(8, 10).charAt(0) == "0" ? now_date.slice(9, 10) : now_date.slice(8, 10) );
                    var deadline_date = parseInt( deadline.slice(8, 10).charAt(0) == "0" ? deadline.slice(9, 10) : deadline.slice(8, 10) );

                    if(deadline_month == now_date_month){
                        if(now_date_date >= deadline_date){
                            data[index].status = "已到待办事项最后时间";
                            html += "<tr><td>"+data[index].thing+"</td><td>"+data[index].ctime+"</td><td>"+data[index].deadline+"</td><td style='color: red'>"+data[index].status+"</td><td>"+complete_button+"</td><td>"+del_button+"</td></tr>";
                        }
                        else if( (deadline_date - now_date_date) <= 5){
                            console.log(now_date_date - deadline_date);
                            data[index].status = "剩余不足5天";
                            html += "<tr><td>"+data[index].thing+"</td><td>"+data[index].ctime+"</td><td>"+data[index].deadline+"</td><td style='color: #985f0d'>"+data[index].status+"</td><td>"+complete_button+"</td><td>"+del_button+"</td></tr>";
                        }
                        else{
                            html += "<tr><td>"+data[index].thing+"</td><td>"+data[index].ctime+"</td><td>"+data[index].deadline+"</td><td style='color: #5cb85c'>"+data[index].status+"</td><td>"+complete_button+"</td><td>"+del_button+"</td></tr>";
                        }
                    }
                    else{
                        html += "<tr><td>"+data[index].thing+"</td><td>"+data[index].ctime+"</td><td>"+data[index].deadline+"</td><td style='color: #5cb85c'>"+data[index].status+"</td><td>"+complete_button+"</td><td>"+del_button+"</td></tr>";
                    }
                }
            }
            $('#thing_list').html(html);
        });
    }
    else{
        sweetAlert("请先登录!")
    }
}

$(function () {
    //登录时用户名输入框的键入事件，检查输入的用户名是否存在
    $("#username").keyup(function(){
        $("#user_ok").hide();
        var dan_check = false;
        var username = $("#username").val();

        for(var ch in username){
            if(username[ch] == "'"){
                dan_check = true;
            }
        }

        if(dan_check){
            $("#user_exist").show();
            $("#user_exist").html("请不要输入单引号等不合法信息");
            $("#submit").addClass("disabled");
        }
        else{
            $.get('api/users?username='+username, function(data, status){
                if(data.length == 0){
                    $("#user_exist").show();
                    $("#user_exist").html("用户不存在");
                    $("#submit").addClass("disabled");
                }
                else{
                    $("#user_ok").show();
                    $("#user_ok").html("该用户名可登录！");
                    $("#user_exist").hide();
                    $("#submit").removeClass("disabled");
                }
            });
        }
    });

    //检查是否登录
    if(user_id){
        $("#user_reg").hide();
        $("#add_list").show();
        $("#user_login").hide();
        $("#list").hide();
    }

    //登录时提交按钮对应的事件
    $("#submit").click(function(){
        var username = $("#username").val();
        var password = $("#password").val();

        console.log(username);
        console.log(password);

        if(!username || !password){
            $("#exist").show();
            $("#exist").html("请填写完整信息");
        }
        else{
            $.get('/api/users?username='+username,function (data,status) {
                var flag = true;

                if(data.length > 0){
                    for(var index in data){
                        var pass = data[index].password;
                        if(pass != password){
                            $("#exist").show();
                            $("#exist").html("密码错误");
                            flag = false;
                        }
                    }
                    if(flag){
                        sweetAlert({
                            title: "登录成功",
                            imageUrl: "images/thumbs-up.jpg"
                        });
                        $("#add_submit").removeClass("disabled");
                        $("#user_login").hide();
                        $("#list").show();
                        user_id = data[0].id;
                        getList();
                    }
                }
            });
        }

        return false;
    });

    //添加事项时提交按钮对应的事件
    $("#add_submit").click(function(){
        var add_uid = user_id;
        if(user_id) {
            var add_thing = $("#add_thing").val();
            var add_deadline = $("#add_deadline").val();
            var add_status = "未完成";

            var str = getNowDate();

            var list = {uid: add_uid, thing: add_thing, ctime: str, deadline: add_deadline, status: add_status};

            if (!add_thing || !add_deadline) {
                $("#add_check").show();
                $("#add_check").html("请填写完整信息");
            }
            else {
                $.post("/api/lists", list, function (data, status) {
                    sweetAlert({
                        title: "添加事项成功",
                        imageUrl: "images/thumbs-up.jpg"
                    });                });
                $('#add_thing').val("");
                $('#add_deadline').val("");
                $("#add_check").hide();
            }
        }

        return false;
    });

    //注册时用户名输入框的键入事件，检查输入的用户名
    $("#reg_username").keyup(function(){
        $("#reg_user_ok").hide();
        reg_flag = 0;
        $("#reg_user_check").html("");
        $("#reg_submit").removeClass("disabled");

        var dan_check = false;
        var reg_username = $("#reg_username").val();

        if(!reg_username){
            $("#reg_user_check").show();
            $("#reg_user_check").html("用户名不能为空");
            $("#reg_submit").addClass("disabled");
        }
        else{
            for(var ch in reg_username){
                if(reg_username[ch] == "'"){
                    dan_check = true;
                }
            }

            if(dan_check){
                $("#reg_user_check").show();
                $("#reg_user_check").html("请不要包含单引号等不合法信息");
                $("#reg_submit").addClass("disabled");
            }
            else{
                $.get('/api/users?username='+reg_username,function (data,status) {
                    if(data.length > 0){
                        $("#reg_user_check").show();
                        $("#reg_user_check").html("用户名已存在");
                        $("#reg_submit").addClass("disabled");
                        reg_flag = 1;
                    }
                    else{
                        $("#reg_user_ok").show();
                        $("#reg_user_ok").html("此用户名可以注册！");
                        // $("#reg_user_check").hide();
                        // $("#reg_submit").removeClass("disabled");
                        // reg_flag = true;
                        // console.log(reg_flag);

                        // //注册时检查两次输入密码是否一致
                        // $("#reg_password_again").keyup(function(){
                        //     var reg_password = $("#reg_password").val();
                        //     var reg_again_password = $("#reg_password_again").val();
                        //
                        //     if(reg_again_password != reg_password){
                        //         $("#insure_password").show();
                        //         $("#reg_submit").addClass("disabled");
                        //     }
                        //     else{
                        //         $("#insure_password").hide();
                        //         if(reg_flag == 0){
                        //             $("#reg_submit").removeClass("disabled");
                        //         }
                        //     }
                        // });
                    }
                });
            }
        }
    });

    //注册时提交按钮对应的事件
    $("#reg_submit").click(function (){
        var reg_username = $("#reg_username").val();
        var reg_password = $("#reg_password").val();
        var reg_password_again = $("#reg_password_again").val();

        if(!reg_username){
            $("#reg_exist").show();
            $("#reg_exist").html("用户名不能为空");
        }
        else if(!reg_password || !reg_password_again){
            $("#reg_exist").show();
            $("#reg_exist").html("密码不能为空");
        }
        else if(reg_password != reg_password_again){
            $("#reg_exist").show();
            $("#reg_exist").html("两次输入密码不一致");
        }
        else{
            var ctime = getNowDate();
            var user_list = {username: reg_username, password: reg_password, ctime: ctime};

            $.post("/api/users", user_list, function(data,status) {
                sweetAlert({
                    title: "注册成功，请登录",
                    imageUrl: "images/thumbs-up.jpg"
                });
                $("#user_ok").hide();
                $("#exist").hide();
                $("#user_exist").hide();
                $("#user_reg").hide();
                $("#add_list").hide();
                $("#user_login").show();
                $("#list").hide();
            });
        }

        return false;
    });

    //转至添加事项
    $("#click_to_add").click(function(){
        if(user_id == 0){
            swal("请先登录!");
            $("#add_submit").addClass("disabled");
        }
        $("#add_check").hide();
        $("#list").hide();
        $("#add_list").show();
        $("#user_login").hide();
        $("#user_reg").hide();
    });

    //转至事项查看
    $("#click_to_list").click(function(){
        getList();
        $("#list").show();
        $("#add_list").hide();
        $("#user_login").hide();
        $("#user_reg").hide();

    });

    //转至注册
    $("#click_to_reg").click(function(){
        $("#reg_user_ok").hide();
        $("#reg_username").val("");
        $("#reg_password").val("");
        $("#reg_password_again").val("");
        $("#reg_exist").hide();
        $("#insure_password").hide();
        $("#reg_user_check").hide();
        $("#user_reg").show();
        $("#add_list").hide();
        $("#user_login").hide();
        $("#list").hide();
    });

    //转至登录
    $("#click_to_login").click(function(){
        $("#user_ok").hide();
        $("#username").val("");
        $("#password").val("");
        $("#exist").hide();
        $("#user_exist").hide();
        $("#user_reg").hide();
        $("#add_list").hide();
        $("#user_login").show();
        $("#list").hide();
    });

    //登出操作
    $("#click_to_logout").click(function(){
        user_id = 0;
        $("#exist").hide();
        $("#user_ok").hide();
        $("#user_exist").hide();
        $("#user_reg").hide();
        $("#add_list").hide();
        $("#user_login").show();
        $("#list").hide();
        $("#thing_list").html("");
    });
});