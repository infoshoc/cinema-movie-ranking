console.log("rated-movie.js")

class RatedMovie {
    constructor(rating, movie) {
        this.rating = rating
        this._movie = movie
    }

    get container() {
        return this._movie.container
    }
}
