let assert = require('assert'),
	ca = require('../src/js/main.js');

let equal = assert.strictEqual;

describe('单项测试', () => {
	describe('加法运算', () => {
			it('int型加法运算', () => {
				var num1, num2;
				for(let i = 0; i < 10; i++) {
					num1 = Math.random()*1000|0;
					num2 = Math.random()*1000|0;
					equal(ca(` ${num1} + ${num2} `), +(num1 + num2).toFixed(16));
				}
			});
			it('float型加法运算', () => {
				var num1, num2;
				for(let i = 0; i < 10; i++) {
					num1 = Math.random();
					num2 = Math.random();
					equal(ca(` ${num1} + ${num2} `), +(num1 + num2).toFixed(16));
				}
			});
			it('float型与int形混合加法运算', () => {
				var num1 = Math.random(), 
					num2 = Math.random() / Math.random() | 0;
				for(let i = 0; i < 20; i++) {
					equal(ca(`${num1}+${num2}`), num1 + num2);
				}
			});
			it('float型精度丢失', () => {
				equal(ca('0.1+0.2'), 0.3);
			})
	})
})