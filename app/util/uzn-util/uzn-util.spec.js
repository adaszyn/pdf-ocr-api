const {expect} = require('chai')
const {uznSectionsToString, relativeSectionsToAbsolute} = require('./uzn-util')

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

describe('realtiveUznToAbsolute', () => {
    it('should translate relative sections to absolute', () => {
        const relativeSections = [
            [1, 1, 1, 1, 'Latin']
        ]
        const absoluteSections = relativeSectionsToAbsolute(relativeSections, 100, 100)
        expect(absoluteSections).to.deep.equal([
            [100, 100, 100, 100, 'Latin']
        ])
    });
})