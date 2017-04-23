module.exports = function gruntConfig(grunt) {
  grunt.initConfig({
    scsslint: {
      allFiles: [
        './scss/**/*.scss',
      ],
      options: {
        config: './.scss-lint.yml',
        reporterOutput: null,
        colorizeOutput: true,
        exclude: './scss/vendor/**/*.scss',
      },
    },
    sass: {
      dist: {
        options: {
          style: 'compressed',
        },
        files: {
          './styles.min.css': './scss/styles.scss',
        },
      },
    },
    postcss: {
      options: {
        map: false,
        processors: [
          /* eslint-disable import/no-extraneous-dependencies, global-require */
          require('autoprefixer')({
            browsers: [
              'last 2 versions',
              'ie <= 11'],
          }),
          /* eslint-enable import/no-extraneous-dependencies, global-require */
        ],
      },
      dist: {
        src: './styles.min.css',
      },
    },
    eslint: {
      options: {
        configFile: '.eslintrc',
      },
      target: ['./src/**/*.js'],
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
      },
      dist: {
        files: {
          'dist/game.js': 'src/game.js',
        },
      },
    },
    uglify: {
      my_target: {
        files: {
          'dist/game.min.js': ['dist/game.js'],
        },
      },
    },
    watch: {
      scss: {
        files: ['**/*.scss'],
        tasks: ['scsslint', 'sass', 'postcss'],
        options: {},
      },
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['eslint', 'babel', 'uglify'],
        options: {},
      },
    },
  });

  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('scripts', ['eslint', 'babel', 'uglify']);
  grunt.registerTask('scss', ['scsslint', 'sass', 'postcss']);
  grunt.registerTask('default', ['watch']);
};
