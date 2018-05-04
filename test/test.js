/**
 * Created by ryp on 1/29/16.
 */
var assert = require('assert');
describe('Middle wares', function() {
    describe('#user controller()', function () {
        it('should return -1 when the value is not present', function () {
            console.log("ddd")
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });

        it('should return 1 when the value is present ', function () {
            assert.equal(1, [1,2,3].indexOf(2));
            assert.equal(-1, [1,2,3].indexOf(2));
        });
    });
});