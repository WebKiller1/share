document.addEventListener("DOMContentLoaded", function(){
    document.body.style.display = "block";
});
function validateMobile(mobileNumber,verifyNumber, ID) {
	var mobile = document.getElementById(mobileNumber);
	if(mobile.value.length==0) { 
	   displayError(ID, '请输入手机号码！')	  
	   return false; 
	}     
	if(mobile.value.length!=11) { 
	   displayError(ID, '请输入有效的手机号码！')
	   return false;
    }
	var verifyNumber = document.getElementById(verifyNumber);
	if(verifyNumber.value.length==0) {

		displayError(ID, '请输验证码！')
		return false;
	}
	if(verifyNumber.value.length!=4) {

		displayError(ID, '请输入有效验证码！')
		return false;
	}

	var msg = subData();
}
function subData(){
	$.getJSON("recivedRedBag",{
	    	  "sign":$("#sign").val(),
	    	  "mobile":$("#phoneNumber").val(),
	    	  "verifyCode":$("#verifyNumber").val()
	      }, function(data) { 
	    	  var data2 = data.data;
	      console.log(data2);                        
	           if(data2.status == "success"){
	              $("#text").html(data2.ticketName); 
	              $("#comment").html(data2.comment);
	              $("#class").html(data2.exceedTime);
	              return true;
	          } else if (data2.status == "false") {
	        	  
	              $("#text").html(data2.errMsg);    
	              return true;
	          }
	      });
}
function makeCode(width, text, qrcode) {
	var qrcode = new QRCode(document.getElementById(qrcode), {
		width : width,
		height : width
	});
	var elText = document.getElementById(text);
	qrcode.makeCode(elText.value);
}
//Display an Error message in a place identified by ID
function displayError(ID, errMsg){
	//alert(ID);
	//alert(errMsg);
	var msgSlot = document.getElementById(ID);
	msgSlot.innerHTML = errMsg;
	msgSlot.style.display = '';
	return;
}
var countdown=60;
function setTime(obj,ID) {

	var mobile = document.getElementById('phoneNumber');
	if(mobile.value.length==0) {
		displayError(ID, '请输入手机号码！')
		return false;
	}
	if(mobile.value.length!=11) {
		// alert(mobile.value.length);
		// alert('请输入有效的手机号码！');
		displayError(ID, '请输入有效的手机号码！')
		return false;
	}



//验证码问题
if(countdown == 60) {
		var mobileInfo = { "mobile":mobile.value};
		$.ajax({
			type: "POST",
			dataType:'json',
			url:'redbagRegisterSMS',
			data:JSON.stringify(mobileInfo),
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader("Content-Type", "application/json");
			},
			error: function(jqXHR, textStatus, errorMessage) {
				displayError(ID, errorMessage)
				console.log(errorMessage); // Optional
			},
			success: function(data) {
				console.log(data)
			}
		});
	}
    if (countdown == 0) {
        obj.removeAttribute("disabled");
        obj.value="获取验证码";
        countdown = 60;
        return;
    } else {
        obj.setAttribute("disabled", true);
        obj.value="重新发送("+ countdown +")";
        countdown--;
    }
    setTimeout(function() { 
               setTime(obj) }
               ,1000)
}