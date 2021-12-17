console.log("utilities.js")

function getSingleElementByClassName(element, className) {
    const elements = element.getElementsByClassName(className)

    if (elements.length != 1) {
        console.error("Expected 1 ", className, "in", element,", found ", 
        elements.length, ": ", elements)

        // TODO: throw exception
        return null
    }

    return elements[0]
}

function getLast(a) {
    return a[a.length - 1]
}
