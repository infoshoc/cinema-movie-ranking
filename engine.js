console.log("engine.js")

class Engine {
    constructor(website, rankers) {
        this._website = website
        this._rankers = rankers
        
        this.addSorting()
        this._website.addMoviesChangeEventListener(this.onMovieChange, this)
        // TODO: race condition
        this.initMovies()
    }

    initMovies() {
        for (let movie of this._website.movies) {
            this.onMovieChange(this, movie)
        }
    }

    onMovieChange(self, movie) {
        console.log("update", self._website, "with", self._rankers, "on", movie, "added")
        
        for (let ranker of self._rankers) {
            console.log(movie, ranker)
            ranker.rank(movie)
        }

        return self
    }

    addSorting() {
        console.log("add sorting for", this._website)
        this._website.addSorting(this)

        for (let ranker of this._rankers) {
            console.log("add sorting ranker", ranker)
            this._website.addSortingRanker(ranker)
        }
    }

    sortMovies(ranker) {
        let movies = this._website.movies

        console.log("movies", movies)

        let ratedMovies = []
        
        for (let movie of movies) {
            ratedMovies.push(new RatedMovie(ranker.getRank(movie), movie))
        }

        console.log("rated movies", ratedMovies)
        ratedMovies.sort(this.compareRatedMovies)
        console.log("sorted rated movies", ratedMovies)

        let containers = this._website.containers

        if (containers === null) {
            console.error('Implement support for websites without containers for movies like ', this._website)

            // TODO: throw
            return
        } 

        if (containers.length != ratedMovies.length) {
            console.error("Number of containers", containers.length, "differs from the number of movies.", ratedMovies.length)

            // TODO: throw
            return 
        }

        ratedMovies.forEach((ratedMovie, index) => {
            console.log("On the", index, "place", ratedMovie)
            let container = containers[index]
            ratedMovie.container.remove()
            container.appendChild(ratedMovie.container)
        })
    }    

    compareRatedMovies(a, b) {
        if (b.rating === null) {
            return -1
        }
        if (a.rating === null) {
            return 1
        }

        if (a.rating >= b.rating) {
            return -1;
        }
        
        return 1
    }
}