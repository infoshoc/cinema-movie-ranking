console.log("Hello, yesplanet", "yesplanet-add-ranking.js")

class YesPlanetWebsite {
    constructor() {
        this._moviesChangeEventListeners = []

        let container = getSingleElementByClassName(document, "qb-by-cinema")
        console.log(container)
        container._moviesChangeEventListeners = this._moviesChangeEventListeners
        container.addEventListener("DOMNodeInserted", this.onDOMNodeInserted)
    }

    get containers() {
        return document.getElementsByClassName("movie-row")
    }

    get movies() {
        const movieRows = this.containers
        console.log("movie rows: ", movieRows)
        const movies = []

        for (let currentMovieRow of movieRows) {
            let movie = YesPlanetWebsite.movieFromRow(currentMovieRow)

            if (movie === null) {
                console.log("Skipping.")
                continue
            }

            movies.push(movie)
        }

        return movies
    }

    addMoviesChangeEventListener(callback, argument) {
        this._moviesChangeEventListeners.push([callback, argument])
    }

    addSorting(engine) {
        console.log("addSorting(", engine, ")")
        // TODO: fix an arrow
        let option = document.createElement("option")
        option.classList.add("bs-title-option")
        option.innerText = 'Choose an order'
        this._select = document.createElement("select")
        this._select.appendChild(option)
        this._select.classList.add('form-control')
        this._select.classList.add('bootstrap-select')
        this._select.classList.add('btn')
        this._select.classList.add('btn-default')
        this._select.classList.add('dropdown-toggle')
        this._select.addEventListener('change', this.onSortingRankerSelect)
        let div = document.createElement("div")
        div.appendChild(this._select)
        div.classList.add('col-xs-12')
        div.classList.add('col-md-3')
        let header = getSingleElementByClassName(document, 'qb-header')
        let controls = getLast(header.getElementsByClassName('row'))
        controls.appendChild(div)

        this._select._sortingSelectedIndexToRanker = new Map()
        this._select._engine = engine
        console.log("return from addSorting()")
    }

    static movieFromRow(currentMovieRow) {
        console.log("current movie row: ", currentMovieRow)
        let movieContainer = currentMovieRow.children[0]
        console.log("movie container: ", movieContainer)

        let movieName = getSingleElementByClassName(movieContainer, "qb-movie-name")

        if (movieName === null) {
            return
        }

        movieName = movieName.innerText
        console.log("Found movie called: ", movieName)

        let movieInfo = getSingleElementByClassName(movieContainer, "qb-movie-info")

        console.log("Its movie info: ", movieInfo)

        let movie = new Movie(movieName, movieInfo, movieContainer)

        console.log("Constructed movie: ", movie)
        
        return movie
    }

    addSortingRanker(ranker) {
        if (this._select === undefined) {
            console.error("Run addSorting() method before running addSortingRanker().")

            return 
        }

        console.log("addSortingRanker(", ranker, ") to", this._select)
        let numberOfOptions = this._select.getElementsByTagName("option").length
        let option = document.createElement('option')
        option.innerText = ranker.name
        option.value = numberOfOptions
        this._select.appendChild(option)
        this._select._sortingSelectedIndexToRanker[numberOfOptions] = ranker
    }

    onSortingRankerSelect(event) {
        console.log('sorting ranker select event: ', event, this)

        console.log('selected index', this.selectedIndex)
        let ranker = this._sortingSelectedIndexToRanker[this.selectedIndex]
        console.log('ranker', ranker)
        this._engine.sortMovies(ranker)
    }

    onDOMNodeInserted(event) {
        console.log('dom node inserted:', event, event.relatedNode.classList, this)

        if (event.relatedNode.classList.contains('container') && event.srcElement.classList.contains('movie-row')) {
            let movie = YesPlanetWebsite.movieFromRow(event.srcElement)
            console.log("Movie inserted:", movie)
            this._moviesChangeEventListeners.forEach((callbackAndArgument) => callbackAndArgument[0](callbackAndArgument[1], movie))
        }
    }
}

new Engine(new YesPlanetWebsite(), [new IMDBRanker()])