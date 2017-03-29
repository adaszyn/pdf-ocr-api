function mapUznRowToString([width, height, x, y, type]) {
    return `${width}\t${height}\t${x}\t${y}\t${type}`
}

function uznSectionsToString(uznSections) {
    const textWithNewlines = uznSections.reduce((result, row) => result + mapUznRowToString(row) + '\n', '')
    return textWithNewlines.substr(0, textWithNewlines.length - 1)
}

function mapSingleSection(section, imageWidth, imageHeight) {
    const [x, y, width, height, text] = section
    return [
        parseInt(x * imageWidth),
        parseInt(y * imageHeight),
        parseInt(width * imageWidth),
        parseInt(height * imageHeight),
        `"${text}"`
    ]
}

function relativeSectionsToAbsolute(sections, imageWidth, imageHeight) {
    return sections.reduce((all, section) => {
        return all.concat([mapSingleSection(section, imageWidth, imageHeight)])
    }, [])
}

module.exports = {
    uznSectionsToString,
    relativeSectionsToAbsolute
}