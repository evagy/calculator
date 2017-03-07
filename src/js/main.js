let cacu = require('./core.js'),
	errorMessage = require('./errorMessage.js');

var create = cacu.create;

// 处理运算
function dealCacu(input, resultDiv) {
	var	res = cacu(input.val()), 
		errorIndex,
		isSuccess;
	if(typeof res === 'number') {
		isSuccess = true;
		if(res !== res) res = '运算结果为: NaN, 无意义的运算';
		else if(/Infinity/.test(res.toString())) res = '无穷：'+res.toString().replace(/Infinity/, 'n');
		else res = `您的运算结果为：${res}`;
	} else {
		errorIndex = res[2];
		res = `${errorMessage[res[0]]} : ${res[1]}`;
		isSuccess = false;
	}
	showRes(resultDiv, isSuccess, res, errorIndex);
}

// 处理新建常量
function createConstant(input, resultDiv) {
	var name = input.eq(0).val(),
		value = input.eq(1).val(),
		res = create.validVarible(name, value);
	if(res === true) {
		create.createVarible(name, value);
		showRes(resultDiv, true, `创建成功！常量名:${name} 常量值:${value}`);
	} else {
		res = errorMessage[res];
		showRes(resultDiv, false, res);
	}
}

// 处理新建方法
function createMethod(input, resultDiv) {
	var name = input.eq(0).val(),
		value = input.eq(1).val(),
		res = create.validMethod(name, value);
	if(res === true) {
		create.createMethod(name, value);
		showRes(resultDiv, true, `创建成功！方法名:${name} 方法体:${value}`);
	} else {
		res = errorMessage[res];
		showRes(resultDiv, false, res);
	}
}

// 显示结果
function showRes(resultDiv, isSuccess, message, errorIndex) {
	if(isSuccess) resultDiv.removeClass('error').addClass('correct');
	else {
		resultDiv.removeClass('correct').addClass('error');
		if(errorIndex !== undefined) {
			let offset = $('.content-question').offset();
			console.log(offset);
			$('#arrow').css({
				left: offset.left + 34 + errorIndex*11,
				marginTop: offset.top - 30
			}).show();
		}
	}
	resultDiv.text(message).slideDown('slow');
}

// 获得结果， 封装的一个处理计算 和 创建常量及方法的函数
function getRes(elem) {
	var parent = elem.parent(), 
		input = elem.siblings('input'),
		resultDiv = elem.siblings('.result');
	if(parent.hasClass('content')) {
	// 处理运算
		dealCacu(input, resultDiv);
	} else if(parent.hasClass('constant')){
	// 处理新建常量
		createConstant(input, resultDiv);
	} else {
	// 处理新建方法
		createMethod(input, resultDiv);
	}
}

// 绑定按钮的点击事件
$('button').click(function() {
	getRes($(this));
});

// 绑定按键事件，按回车的时候相当于点击按钮， 按其他键的时候则隐藏结果
$('input').keyup(function(e) {
	if(e.keyCode === 13) {
		getRes($(this).parent().find('button'));
	} else {
		$('.result').slideUp('slow');
		$('#arrow').hide();
	}
});

$('input').click(function(){
	$('.result').slideUp('slow');
	$('#arrow').hide();
})