import autoprefixer from "autoprefixer"
import browserSync from "browser-sync"
import { deleteAsync } from "del"
import gulp from "gulp"
import cleanCSS from "gulp-clean-css"
import esbuild from "gulp-esbuild"
import fileInclude from "gulp-file-include"
import flatten from "gulp-flatten"
import htmlmin from "gulp-htmlmin"
import newer from "gulp-newer"
import { onError } from "gulp-notify"
import plumber from "gulp-plumber"
import postcss from "gulp-postcss"
import rename from "gulp-rename"
import replace from "gulp-replace"
import gulpSass from "gulp-sass"
import ts from "gulp-typescript"
import webp from "gulp-webp"
import dartSass from "sass"

const tsProject = ts.createProject("tsconfig.json")
const sass = gulpSass(dartSass)
const bs = browserSync.create()

const paths = {
	html: { src: "src/**/*.html", watch: "src/**/*.html", dest: "docs" },
	scss: { src: "src/scss/*.scss", watch: "src/**/*.scss", dest: "docs/css" },
	img: { src: "src/**/*.{jpg,jpeg,png,gif}", dest: "docs/img" },
	svg: { src: "src/**/*.svg", dest: "docs/img" },
	ts: { src: "src/**/*.ts", watch: "src/**/*.ts", dest: "docs/js" },
}

// TS
export const tsTask = () => {
	return gulp
		.src(paths.ts.src)
		.pipe(plumber({ errorHandler: onError("TS Error: <%= error.message %>") }))
		.pipe(
			esbuild({
				outfile: "main.min.js", // один файл
				bundle: true, // собираем все импорты
				minify: true, // минификация
				sourcemap: true, // sourcemap
				platform: "browser", // для браузера
				format: "iife", // обычный <script>, без import/export
				target: ["es2017"], // ES2017+
			})
		)
		.pipe(gulp.dest(paths.ts.dest))
}

// HTML
export const html = () =>
	gulp
		.src(paths.html.src)
		.pipe(
			plumber({
				errorHandler: onError({
					title: "SCSS Error",
					message: "<%= error.message %>",
				}),
			})
		)
		.pipe(fileInclude({ prefix: "@@", basepath: "@file" }))
		.pipe(replace(/src=["'].*?\/([^\/]+?\.(?:jpg|jpeg|png|gif|svg))["']/g, 'src="./img/$1"'))
		// .pipe(
		// 	pictureHTML({
		// 		extensions: [".jpg", ".png", ".jpeg"],
		// 		source: [".webp"],
		// 		noPicture: ["no-picture"],
		// 		noPictureDel: false,
		// 	})
		// )
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(paths.html.dest))
		.pipe(bs.stream())

// SCSS
export const scssTask = () =>
	gulp
		.src(paths.scss.src)
		.pipe(
			plumber(
				plumber({
					errorHandler: onError({
						title: "SCSS Error",
						message: "<%= error.message %>",
					}),
				})
			)
		)
		.pipe(sass.sync().on("error", sass.logError))
		.pipe(postcss([autoprefixer({ overrideBrowserslist: ["last 2 versions"], grid: true })]))
		.pipe(cleanCSS({ level: 2 }))
		.pipe(rename({ extname: ".min.css" }))
		.pipe(gulp.dest(paths.scss.dest))
		.pipe(bs.stream())

// Images
export const images = () => {
	return (
		gulp
			.src(paths.img.src, { encoding: false })
			.pipe(newer(paths.img.dest))
			// .pipe(
			// 	sharpResponsive({
			// 		formats: [
			// 			{
			// 				width: 425,
			// 				rename: { suffix: "-sm" },
			// 				format: "webp",
			// 				quality: 75,
			// 			},
			// 		],
			// 	})
			// )
			.pipe(flatten())
			.pipe(gulp.dest(paths.img.dest))
	)
}
export const imagesWebp = () =>
	gulp
		.src(paths.img.src, { encoding: false })
		.pipe(newer(paths.img.dest))
		.pipe(webp())
		.pipe(flatten())
		.pipe(gulp.dest(paths.img.dest))

// SVG Sprite
export const svg = () =>
	gulp
		.src(paths.svg.src)
		.pipe(newer(paths.svg.dest))
		.pipe(flatten())
		.pipe(gulp.dest(paths.svg.dest))

// Clean
export const clean = () => deleteAsync("dist")

// Server
export const serve = () => {
	bs.init({ server: { baseDir: "docs" }, notify: false })
	gulp.watch(paths.html.watch, html)
	gulp.watch(paths.scss.watch, scssTask)
	gulp.watch(paths.img.src, gulp.series(images, imagesWebp))
	gulp.watch(paths.ts.watch, tsTask), gulp.watch(paths.svg.src, svg)
}

// Tasks
export const build = gulp.series(
	clean,
	gulp.parallel(html, scssTask, tsTask, images, imagesWebp, svg)
)
export const dev = gulp.series(build, serve)

export default dev
