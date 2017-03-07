let assert = require('assert'),
	ca = require('../src/js/core.js');
	//create = ca.create;

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
});
describe('复合测试', () => {
		it('int型加法运算', () => {
			var num1, num2;
			for(let i = 0; i < 10; i++) {
				num1 = Math.random()*1000|0;
				num2 = Math.random()*1000|0;
				equal(ca(` ${num1} + ${num2} `), +(num1 + num2).toFixed(15));
			}
		});
		it('float型加法运算', () => {
			var num1, num2;
			for(let i = 0; i < 10; i++) {
				num1 = Math.random();
				num2 = Math.random();
				equal(ca(` ${num1} + ${num2} `), +(num1 + num2).toFixed(15));
			}
		});
		it('float型与int形混合加法运算', () => {
			var num1 = Math.random(), 
				num2 = Math.random() / Math.random() | 0;
			for(let i = 0; i < 20; i++) {
				equal(ca(`${num1}+${num2}`), +(num1 + num2).toFixed(15));
			}
		});
		it('连续整形加法运算', () => {
			var arr;
			for(let i = 0; i < 10; i++) {
				arr = new Array(Math.random()*10|0).fill(Math.random())
			}
		});
		it('加减乘除余综合运算', () => {
			equal(ca('1+2*3-4/4'), 6);
			equal(ca('5*4-3+6*3%2'), 5*4-3+6*3%2);
			equal(ca('9.2*3%3-3*5*3-3-9+5/3'), 9.2*3%3-3*5*3-3-9+5/3);
			equal(ca('6*5/32*3-1*3+2*4%3'), 6*5/32*3-1*3+2*4%3);
			equal(ca('2.32*2.12/32.33+1'), +(2.32*2.12/32.33+1).toFixed(15));
		});
		it('加减乘除余幂综合运算', () => {
			equal(ca('1^2+2*3-4/4'), 6);
			equal(ca('5*4-3+6*3%2^2'), 5*4-3+6*3%Math.pow(2,2));
			equal(ca('9.2*3%3-3*5*3^2-3-9+5/3'), 9.2*3%3-3*5*Math.pow(3,2)-3-9+5/3);
			equal(ca('6*5/32*3-1^3*3+2*4%3'), 6*5/32*3-1*3+2*4%3);
			equal(ca('2.32^4*2.12/32.33+1'), +(Math.pow(2.32,4)*2.12/32.33+1).toFixed(15));
		})
});

describe('常量测试', () => {
	it(' 简单常量', () => {
		equal(ca('e+1'), +(Math.E+1).toFixed(15));
	});
	it(' 复合常量', () => {
		equal(ca('π*e+1'), +(Math.PI*Math.E+1).toFixed(15));
	});
});

describe('方法测试', () => {
	it(' 简单方法', () => {
		equal(ca('pow(2,3) + pow(2,3)'), Math.pow(2,3)+Math.pow(2,3));
	});
	it('嵌套方法', () => {
		equal(ca('pow(pow(2,3),3)'), Math.pow(Math.pow(2,3),3));
	})
})
describe('边界情况测试', () => {
	it('float型精度丢失', () => {
		equal(ca('0.1+0.2'), 0.3)
	});
	it('空格不影响运算', () => {
		equal(ca('  0.1   +   0.5   '), 0.6);
	});
	it('连续幂运算', () => {
		equal(ca('2^3^4'), Math.pow(Math.pow(2, 3),4));
	});
	it('嵌套幂运算', () => {
		equal(ca('(2+1)^(3-1)^4'), Math.pow(Math.pow((2+1), (3-1)),4));
	});
});

describe('复杂情况', () => {
	it('复合幂运算', () => {
		equal(ca('1 + 3 + 2^(3^2)'), 516);
	});
	it('复合幂运算', () => {
		equal(ca('1 + 3 + sin(5 *(8 + 1))'), +(1 + 3 + Math.sin(5 *(8 + 1) * Math.PI / 180)).toFixed(15));
	});
})

// describe('不合法情况测试', () => {
// 	it('输入包含非法字符', () => {
// 		equal(typeof ca(':1+1'), 'string');
// 		equal(typeof ca('1~1'), 'string');
// 		equal(typeof ca('/'), 'string');
// 		equal(typeof ca('[1+1'), 'string');
// 		equal(typeof ca('[1+1]]'), 'string');
// 		equal(typeof ca('1|1'), 'string');
// 		equal(typeof ca('1++1'), 'string');
// 		equal(typeof ca('1--'), 'string');
// 		equal(typeof ca('1++'), 'string');
// 		equal(typeof ca('1 2 3'), 'string');
// 	});
// 	it('输入包含不存在的方法或常量', () => {
// 		equal(typeof ca('a'), 'string');
// 		equal(typeof ca('method()'), 'string');
// 		equal(typeof ca('test'), 'string');
// 		equal(typeof ca('e()'), 'string');
// 		equal(typeof ca('mmm'), 'string');
// 	});
// 	it('常量错误的当方法使用', () => {
// 		equal(typeof ca('e()'), 'string');
// 		equal(typeof ca('π()'), 'string');
// 	});
// 	it('方法错误的当常量使用', () => {
// 		equal(typeof ca('pow'), 'string');
// 		equal(typeof ca('sin'), 'string');
// 	});
// });
