const {expect} = require('chai')
const {uznSectionsToString} = require('./uzn-util')

describe('uznDescriptionToString', () => {
    it('should return string representation of an given array', () => {
        const testSectionsArray = [
            [1,1,1,1, 'Latin'],
        ]
        expect(uznSectionsToString(testSectionsArray)).to.be.eql('1\t1\t1\t1\tLatin')
    });

    it('should return string representation of an given multidimensional array', () => {
        const testSectionsArray = [
            [1, 1, 1, 1, 'Latin'],
            [2, 2, 2, 2, 'Latin'],
            [3, 3, 3, 3, 'Latin'],
        ]
        expect(uznSectionsToString(testSectionsArray))
            .to.be.eql('1\t1\t1\t1\tLatin\n2\t2\t2\t2\tLatin\n3\t3\t3\t3\tLatin')

    })
})