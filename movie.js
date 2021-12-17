console.log("movie.js")

class Movie {
    constructor(name, infoContainer, container) {
        console.log('Creating movie called', name, 'with info container', infoContainer, ' and outer container', container)
        this._name = name
        this._infoContainer = infoContainer
        this._container = container
    }
    get name() {
        return this._name
    }
    get infoContainer() {
        return this._infoContainer
    }
    get container() {
        return this._container
    }
}
