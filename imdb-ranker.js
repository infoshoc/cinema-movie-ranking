console.log("engine.js")

function callback(results) {
    console.log(results)

    let query = results['q']

    if (!('d' in results) || results['d'].length == 0) {
        console.error("No movie found for query", query)
        return
    }

    let movie = results['d'][0]
    let movieId = movie['id']
    let year = movie['y']
    let title = movie['y']

    console.log('MovieID=', movieId, ' year=', year, ' title=', title, ' query=', query)

    // https://www.imdb.com/plugins 
    /*
    <span class="imdbRatingPlugin" data-user="ur106672458" data-title="tt9735462" data-style="p4">
        <a href="https://www.imdb.com/title/tt9735462/?ref_=plg_rt_1">
            <img src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_31x14.png" alt=" Aline (2020) on IMDb" />
        </a>
    </span>
    <script>(function(d,s,id){var js,stags=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return;}js=d.createElement(s);js.id=id;js.src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/js/rating.js";stags.parentNode.insertBefore(js,stags);})(document,"script","imdb-rating-api");</script> 
    */
    let img = document.createElement("img")
    img.src = "https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_31x14.png"
    img.alt = title + "(" + year + ") on IMDb"
    a = document.createElement("a")
    a.href = "https://www.imdb.com/title/" + movieId + "/?ref_=plg_rt_1"
    a.appendChild(img)
    let span = document.createElement("span")
    span.classList.add("imdbRatingPlugin")
    span.dataset.user = "ur106672458"
    span.dataset.title = movieId
    span.dataset.style = "p4"
    span.appendChild(a)
    let script = document.createElement("script")
    script.innerHTML = '(function(d,s,id){var js,stags=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return;}js=d.createElement(s);js.id=id;js.src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/js/rating.js";stags.parentNode.insertBefore(js,stags);})(document,"script","imdb-rating-api");'

    movieInfo = document.getElementsByClassName('imdb-query-' + query)[0]
    console.log("movie info: ", movieInfo)
    movieInfo.appendChild(span)
    movieInfo.appendChild(script)
}

class IMDBRanker {
    rank(movie) {
        console.log('Movie: ', movie)

        let ratingPlugin = getSingleElementByClassName(movie.infoContainer, 'imdbRatingPlugin')

        if (ratingPlugin !== null) {
            console.log('Movie', movie, 'is already rated by', this, ', ratingPlugin')
            return
        }

        let query = this.getQuery(movie.name)

        console.log('Query: ', query)

        movie.infoContainer.classList.add('imdb-query-' + query)
        
        let callbackName = this.getCallbackName(query)

        console.log('Callback name: ', callbackName)

        var script = document.createElement('script')
        script.innerHTML = 'window.' + callbackName +' = ' + callback.toString()
        document.head.appendChild(script)

        jQuery.ajax({
            url: 'https://sg.media-imdb.com/suggests/' + query[0] + '/' + query + '.json',
            dataType: 'jsonp',
            cache: true,
            jsonp: false,
            jsonpCallback: callbackName,
        }).then(function (results) {});
    }

    get name() {
        return "imdb"
    }

    getQuery(name) {
        return name
        .replaceAll(' ', '_')
        .replaceAll("'", '')
        .replaceAll(".", '') // TODO: replace @ callback name
        .replaceAll(':', '') // TODO: replace @ callback name
        .replaceAll('-', '') // TODO: replace @ callback name
        .toLowerCase()
    }

    getCallbackName(query) {
        return 'imdb$' + query
    }

    getRank(movie) {
        console.log("getRank(", movie, ")")
        let ratingPlugin = getSingleElementByClassName(movie.infoContainer, 'imdbRatingPlugin')

        if (ratingPlugin === null) {
            console.error('Not found rank for ', movie, 'by', this)
            return null
        }

        let rating = getSingleElementByClassName(ratingPlugin, 'rating')
        let ratingString = rating.firstElementChild.previousSibling.data
        console.log("rating: ", ratingString)
        let ratingFloat = parseFloat(ratingString)

        return ratingFloat
    }
}