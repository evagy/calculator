const gulp = require('gulp'),

	  babel = require('gulp-babel'),
	  uglify = require('gulp-uglify'),

	  htmlmin = require('gulp-htmlmin'),

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
		.pipe(gulp.dest('dist'));
});

gulp.task('cssTask', _ => {
	return gulp.src('src/css/*.css')
		.pipe(prefixer())
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('jsTask', _ => {
	return gulp.src('src/js/*.js')
	  	.pipe(sourcemaps.init())
			.pipe(babel({
				presets: ['es2015']
			}))
			.pipe(uglify())
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('dist/js'));
});


gulp.task('default', ['htmlTask', 'cssTask', 'jsTask'], _ => {})

gulp.watch('js/*.js', ['jsTask']);
gulp.watch('css/*.css', ['cssTask']);
gulp.watch('*.html', ['htmlTask']);