jQuery(document).ready(function() {
		//验证判断开始
		var errMsg;
		$.each($("input"), function (i, val) {
			$(val).blur(function () {
				if ($(val).attr("name") == "nickname") {
					$('.nickMsg').remove();
					var nickName = val.value;
					var regName = /[\u4e00-\u9fa5]{2,6}/
					if (nickName == "" || nickName.trim() == "") {
						errMsg = "<span class='nickMsg' style='color:red;'>昵称不能为空</span>";
					} else if (!regName.test(nickName)) {
						errMsg = "<span class='nickMsg' style='color:red;'>由2-6个汉字组成</span>";
					} else {
						errMsg = "<span class='nickMsg' style='color:red;'>OK！</span>";
					}
					$(this).parent().append(errMsg);
				}
				else if($(val).attr("name") == "school") {
				 $(".schoolMsg").remove();
				 var school = val.value;
				 var regschool = /[\u4e00-\u9fa5]{2,6}/;
				 if (school == "" || school.trim() == "") {
					 errMsg = "<span class='schoolMsg' style='color:red;'>学校不能为空</span>";
				 } else if (!regschool.test(school)) {
					 errMsg = "<span class='schoolMsg' style='color:red;'>由2-6个汉字组成</span>";
				 } else {
					 errMsg = "<span class='schoolMsg' style='color:red;'>OK！</span>";
				 }
				 $(this).parent().append(errMsg);
			 }
				else if ($(val).attr("name") == "form-email") {
					$(".emailMsg").remove();
					var email = val.value;
					var regEmail = /^\w+@\w+((\.\w+)+)$/;
					if (email == "" || email.trim() == "") {
						errMsg = "<span class='emailMsg' style='color:red;'>邮箱不能为空</span>";
					} else if (!regEmail.test(email)) {
						errMsg = "<span class='emailMsg' style='color:red;'>邮箱账号@域名。如good@tom.com、whj@sina.com.cn</span>";
					} else {
						errMsg = "<span class='emailMsg' style='color:red;'>OK！</span>";
					}
					$(this).parent().append(errMsg);
				}
				else if ($(val).attr("name") == "form-password") {
					$(".pwdMsg").remove();
					var pwd = val.value;
					var regPwd = /^\w{4,10}$/;
					if (pwd == "" || pwd.trim() == "") {
						errMsg = "<span class='pwdMsg' style='color:red;'>密码不能为空</span>";
					} else if (!regPwd.test(pwd)) {
						errMsg = "<span class='pwdMsg' style='color:red;'>格式错误</span>";
					} else {
						errMsg = "<span class='pwdMsg' style='color:red;'>OK！</span>";
					}
					$(this).parent().append(errMsg);
				}
				 else if ($(val).attr("name") == "form-repeat-password") {
					$(".pwd2Msg").remove();
					var pwd2 = val.value;
					//console.log(pwd2);
					var pwd = $("input[name='form-password']").val();
					if (pwd2 == "" || pwd2.trim() == "" || pwd2!=pwd) {
						errMsg = "<span class='pwd2Msg' style='color:red;'>两次输入密码不一致</span>";
					} else {
						errMsg = "<span class='pwd2Msg' style='color:red;'>OK！</span>";
					}
					$(this).parent().append(errMsg);
				}
        else if ($(val).attr("name") == "phone") {
           $(".phoneMsg").remove();
           var phone = val.value;
           var regPhone = /[13,15,18]\d{9}/;
           if (phone == "" || phone.trim() == "") {
             errMsg = "<span class='phoneMsg' style='color:red;'>手机号不能为空</span>";
           } else if (!regPhone.test(phone)) {
             errMsg = "<span class='phoneMsg' style='color:red;'>格式错误</span>";
           } else {
             errMsg = "<span class='phoneMsg' style='color:red;'>OK!</span>";
           }
           $(this).parent().append(errMsg);
         }
			});
		});
		//验证判断结束
		//逻辑参考代码start
    $('#bc1').click(function(){
        $('#ffor').submit();
        console.log("我觉得我交上了");
    });
		$('#bc2').click(function(){
        $('#fffor').submit();
        console.log("我觉得我也交上了");
    });
});
//console.log(2333333333333333);
