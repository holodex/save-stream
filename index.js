var through = require('through2');

module.exports = function () {
    var buffer = [];
    var finished = false;
    var piping = false;
    var dests = 0;
    var passThrough = through.obj(function (obj, enc, cb) {
        buffer.push(obj);
        if (piping || dests > 0) {
            cb(null, obj);
        } else {
            cb(null)
        }
    }, function (cb) {
        finished = true;
        cb();
    });

    passThrough._buffer = buffer;

    passThrough.on('pipe', function () { dests++ })
    passThrough.on('unpipe', function () { dests-- })

    passThrough.load = function () {
        var loaded = through.obj();
        buffer.map(loaded.write, loaded);
        if (finished) {
            loaded.end();
        } else {
            piping = true
            passThrough.pipe(loaded);
        }
        return loaded;
    };

    return passThrough;
};
