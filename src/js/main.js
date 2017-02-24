;( (window, document, undefined) => {

	function caculate (str) {

	}

	// 一个储存自己数学方法的仓库
	var util = {
		avg: arr => arr.map(Number).reduce((s, v) => s + v, 0) / arr.length,

		cot: num => Math.cos(num) / Math.sin(num),
		//存在浮点型精度问题。
		log: (num1, num2) => Math.log(num1) / Math.log(num2),

		log10: function(num) {
			return this.log(num, 10);
		},
		
		acosh: Math.acosh || num => Math.log(num + Math.sqrt(num * num - 1)),

		asinh: Math.asinh || num => num === -Infinity ? num : Math.log(num + Math.sqrt(num * num + 1)),

		atanh: Math.atanh || num => Math.log((1 + num)/(1 - num)) / 2,

		//可能存在浮点型精度问题
		cbrt: Math.cbrt || num => Math.pow(num, 1/3), 

		sum: (a, b) => a + b,
};
	}
	// 对于JS中Math对象中有的方法进行替换， 没有的方法则自己实现
	var replaceMethods = {
		// 导师给定需要实现的方法。
		'abs': 'Math.abs',
		'avg': util.avg,
		'sin': 'Math.sin',
		'cos': 'Math.cos',
		'tan': 'Math.tan',
		'cot': util.cot,

		// ES6中Math对象上有等同性质的函数Math.log10
		//但是根据MDN(https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/log10)
		//大多浏览器(新版本chrome上支持良好)不予支持, 故自己实现
		'log': util.log10,
		'ln': 

		// 个人实现的方法
		'acos': 'Math.acos',
		'acosh': util.acosh,
		'asin': 'Math.asin',
		'logMutil' : util.log,
		'atan': 'Math.atan',
		'asinh': util.asinh,
		'atanh': util.atanh,
		'atan2': 'Math.atan2',
		'cbrt': util.cbrt,
		'sum': util.sum
	}

})(window, document);