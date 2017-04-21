module.exports = function gruntConfig(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'compressed',
        },
        files: {
          './styles.css': './scss/styles.scss',
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
        src: './styles.css',
      },
    },
    watch: {
      scss: {
        files: ['**/*.scss'],
        tasks: ['sass', 'postcss'],
        options: {},
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('scss', ['sass', 'postcss']);
  grunt.registerTask('default', ['watch']);
};
