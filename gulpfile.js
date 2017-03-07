const gulp = require('gulp'),
		
	  webpack = require('gulp-webpack'),		
	  rename = require('gulp-rename'),

	  htmlmin = require('gulp-htmlmin'),

	  less = require('gulp-less'),
	  cleanCSS = require('gulp-clean-css'),
	  prefixer = require('gulp-autoprefixer'),

	  sourcemaps = require('gulp-sourcemaps');

gulp.task('htmlTask', _ => {
	return gulp.src('src/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			collapseBooleanAttributes: true,
			collapseInlineTagWhitespace: true,
			conservativeCollapse: true,
			minifyJS: true,
			minifyCSS: true,
			preserveLineBreaks: true,
			sortAttributes: true,
			sortClassName: true
		}))
		.pipe(gulp.dest('public'));
});

gulp.task('cssTask', _ => {
	return gulp.src('src/less/*.less')
		.pipe(sourcemaps.init())
			.pipe(less())
			.pipe(prefixer())
			.pipe(cleanCSS())
			.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/css/'));
});

gulp.task('jsTask', _ => {
	return gulp.src('public/js/core.js')
	    .pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('public/js'));
});


gulp.task('default', ['htmlTask', 'cssTask', 'jsTask'], _ => {})

gulp.watch('src/js/*.js', ['jsTask']);
gulp.watch('src/less/*.less', ['cssTask']);
gulp.watch('src/*.html', ['htmlTask']);