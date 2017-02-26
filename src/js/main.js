let cacu = require('./caculate.js');

var isRun = false;

function caculate() {
	if(isRun) return;
	isRun = true;
	var answer = $('.content-answer'),
		res = cacu($('.content-question').val());
	if(typeof res === 'number') {
		answer.removeClass('error').addClass('correct');
		if(res !== res) answer.text('运算结果为: NaN, 无意义的运算').slideDown();
		else if(/Infinity/.test(res.toString())) answer.text('无穷：'+res.toString().replace(/Infinity/, 'n')).slideDown();
		else answer.text(`您的运算结果为：${res}`).slideDown();
	}
	else answer.removeClass('correct').addClass('error').text(res).slideDown();
	isRun = false;
}


$('.caculate-btn').click(caculate);

$('.content-question').keyup(function(e) {
	if(e.keyCode === 13) caculate();
	else {
		if(!isRun) $('.content-answer').slideUp();
	}
})