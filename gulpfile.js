const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const ts = require('gulp-typescript');

const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task(
  'start',
  gulp.series(
    'scripts',
    () => {
      const tsResult = tsProject.src().pipe(tsProject());
      return tsResult.js.pipe(gulp.dest('dist'));
    },
    done => {
      nodemon({
        script: 'dist/',
        watch: 'src/',
        tasks: ['scripts'],
        done
      }).on('restart', () => {
        done();
      });

      gulp.watch('src/**/*.ts', gulp.series('scripts'));
    }
  )
);

gulp.task('assets', () => gulp.src(JSON_FILES).pipe(gulp.dest('dist')));

gulp.task('default', gulp.series('assets'));
