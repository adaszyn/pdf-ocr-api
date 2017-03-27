function mapUznRowToString ([width, height, x, y, type]) {
    return `${width}\t${height}\t${x}\t${y}\t${type}`
}

function uznSectionsToString(uznSections) {
    const textWithNewlines = uznSections.reduce((result, row) => result + mapUznRowToString(row) + '\n', '')
    return textWithNewlines.substr(0, textWithNewlines.length - 1)
}

module.exports = {
    uznSectionsToString
}