/* eslint-env node, mocha */

var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:8765'),
    EventSource = require('eventsource');

describe('Testing the JSON API', function() {
    describe('/api/nonexisting', function() {
        it('returns an error when the method is unknown', function(done) {
            api.get('/api/nonexisting')
            .expect(404)
            .end(function(err) {
                if (err) {
                    return done(err);
                }
                done();
            });
        });
    });

    describe('/api/bridgeInfo', function() {
        it('can be subscribed to and returns bridgeInfo', function(done) {
            var es = new EventSource("http://127.0.0.1:8765/api/bridgeInfo");
            es.onmessage = function (m) {
                var result = JSON.parse(m.data);
                result.should.have.property('type', 'bridgeInfo');
                result.should.have.property('data').that.is.an('object');
                result.data.should.have.property('uptime');
                result.data.should.have.property('heap');
                result.data.should.have.property('osInfo');
                result.data.should.have.property('hbVersion');
                done();
            };
        });
    });

    describe('/api/bridgeConfig', function() {
        it('returns a JSON with bridge config', function(done) {
            api.get('/api/bridgeConfig')
            .expect(200)
            .expect('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.a('object');
                res.body.should.have.property('bridgePin');
                res.body.should.have.property('bridgeName');
                res.body.should.have.property('bridgeUsername');
                done();
            });
        });
    });

    describe('/api/installedPlatforms', function() {
        it('returns a JSON with a list of installed platforms', function(done) {
            api.get('/api/installedPlatforms')
            .expect(200)
            .expect('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].should.have.property('platform');
                res.body[0].should.have.property('hbServer_pluginName');
                res.body[0].should.have.property('hbServer_active_flag');
                done();
            });
        });
    });

    describe('/api/accessories', function() {
        it('returns a JSON with a list of installed accessories', function(done) {
            api.get('/api/accessories')
            .expect(200)
            .expect('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
        });
    });

    describe('/api/installedPlugins', function() {
        it('returns a JSON with a list of installed plugins', function(done) {
            api.get('/api/installedPlugins')
            .expect(200)
            .expect('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.a('array');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('version');
                res.body[0].should.have.property('latestVersion');
                res.body[0].should.have.property('isLatestVersion');
                res.body[0].should.have.property('platformUsage');
                res.body[0].should.have.property('accessoryUsage');
                res.body[0].should.have.property('description');
                res.body[0].should.have.property('author');
                res.body[0].should.have.property('homepage');
                res.body[0].should.have.property('homebridgeMinVersion');
                done();
            });
        });
    });
});
