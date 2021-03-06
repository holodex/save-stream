/* global describe, it */

var save = require('../');
var assert = require('stream-assert');
var array = require('stream-array');
require('should');

var data = require('./data.js');

describe('save-stream', function () {
    it('should act like pass through stream', function (done) {
        array(data)
            .pipe(save())
            .pipe(assert.length(data.length))
            .pipe(assert.end(done));
    });

    it('should save data into buffer', function (done) {
        var saved = save();
        array(data)
            .pipe(saved)
            .pipe(assert.end(function () {
                saved._buffer.should.have.length(data.length);
                done();
            }));
    });

    it('should load saved data', function (done) {
        var saved = save();
        array(data)
            .pipe(saved)
            .pipe(assert.end(function () {
                saved
                    .load()
                    .pipe(assert.length(data.length))
                    .pipe(assert.end(done));
            }));
    });

    it('should get data, that comes after load call', function (done) {
        var saved = save();
        saved.write(1);
        saved.write(2);
        saved.load()
            .pipe(assert.length(3))
            .pipe(assert.end(done))
        setTimeout(function () {
            saved.write(3);
            saved.end();
        }, 10);
    });

    it('should get data, that is piped after load call', function (done) {
        var saved = save();
        saved.load()
            .pipe(assert.length(data.length))
            .pipe(assert.end(done));
        setTimeout(function () {
            array(data)
                .pipe(saved);
        }, 10);
    })
});
