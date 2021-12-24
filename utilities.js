console.log("utilities.js")

function getSingleElementByClassName(element, className) {
    const elements = element.getElementsByClassName(className)

    if (elements.length != 1) {
        console.info("Expected 1 ", className, "in", element,", found ", 
        elements.length, ": ", elements)

        // TODO: throw exception
        return null
    }

    return elements[0]
}

function hasClass(node, className) {
    return node.classList !== undefined && node.classList.contains(className)
}

function getLast(a) {
    return a[a.length - 1]
}
