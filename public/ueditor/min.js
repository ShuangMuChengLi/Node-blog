var compressor = require('node-minify');

// Using Google Closure Compiler
compressor.minify({
    compressor: 'uglifyjs',
    input: 'ueditor.all.js',
    output: 'ueditor.all.min.js',
    callback: function (err, min) {}
});
