let assert = require('assert'),
	ca = require('../src/js/main.js');

let equal = assert.strictEqual;

const sum = arr => arr.reduce((s, v) => s + v, 0);


describe('简单测试', () => {
	it('加法', () => {
		equal(ca('1+2'), 3);
	});
	it('减法', () => {
		equal(ca('1-2'), -1);
	});
	it('乘法', () => {
		equal(ca('2*2'), 4);
	});
	it('除法', () => {
		equal(ca('4/3'), +(4/3).toFixed(15))
	});
	it('乘方', () => {
		equal(ca('2^3'), 8);
	});
	it('取余', () => {
		equal(ca('3%2'), 1);
	})
	it('绝对值运算', () => {
		equal(ca('abs(-1)'), 1);
	})
	it('均值运算', () => {
		equal(ca('avg(1,2)'), 1.5);
	});	
	it('正弦运算', () => {
		equal(ca('sin(30)'), 0.5);
	})
	it('余弦运算', () => {
		equal(ca('cos(60)'), 0.5);
	})
	it('正切运算', () => {
		equal(ca('tan(45)'), 1);
	});
	it('余切运算', () => {
		equal(ca('cot(45)'), 1);
	});
	it('log底对数运算', () => {
		equal(ca('log(100)'), 2);
	});
	it('ln自然对数', () => {
		equal(ca('ln(100)'), Math.log(100));
	});
	it('e自然常量', () => {
		equal(ca('e'), Math.E);
	});
	it('π自然常量', () => {
		equal(ca('π'), Math.PI);
	});
	// describe('加法运算', () => {
	// 		it('int型加法运算', () => {
	// 			var num1, num2;
	// 			for(let i = 0; i < 10; i++) {
	// 				num1 = Math.random()*1000|0;
	// 				num2 = Math.random()*1000|0;
	// 				equal(ca(` ${num1} + ${num2} `), +(num1 + num2).toFixed(15));
	// 			}
	// 		});
	// 		it('float型加法运算', () => {
	// 			var num1, num2;
	// 			for(let i = 0; i < 10; i++) {
	// 				num1 = Math.random();
	// 				num2 = Math.random();
	// 				equal(ca(` ${num1} + ${num2} `), +(num1 + num2).toFixed(15));
	// 			}
	// 		});
	// 		it('float型与int形混合加法运算', () => {
	// 			var num1 = Math.random(), 
	// 				num2 = Math.random() / Math.random() | 0;
	// 			for(let i = 0; i < 20; i++) {
	// 				equal(ca(`${num1}+${num2}`), +(num1 + num2).toFixed(15));
	// 			}
	// 		});
	// 		it('连续整形加法运算', () => {
	// 			var arr;
	// 			for(let i = 0; i < 10; i++) {
	// 				arr = new Array(Math.random()*10|0).fill(Math.random())
	// 			}
	// 		});
	// })
});

describe('边界情况测试', () => {
	it('float型精度丢失', () => {
		equal(ca('0.1+0.2'), 0.3)
	});
	it('空格不影响运算', () => {
		equal(ca('  0.1   +   0.5   '), 0.6);
	});
});

describe('不合法情况测试', () => {
	it('输入包含非法字符', () => {
		
	})
});