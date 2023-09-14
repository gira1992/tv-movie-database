const tmdbKey = 'f8edf67e74f5a73c3dfddbfd9579b080';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const form = document.querySelector('form')
const input = document.getElementById('text')
const resultContainer = document.querySelector('.container')
const results = document.querySelector('.results')
let addToBooks = []
const homeLink = document.querySelector('#home');

homeLink.addEventListener('click', (e) => {
    e.preventDefault()
    form.style.display = 'block'
    document.querySelector('#trending').innerHTML = 'Trending'
    const lists = document.querySelectorAll('.card-container')
    lists.forEach(list => {
        if (list.classList.contains('added-to-list')) {
            list.style.display = 'none'
        }
    })
    nowShowing()

})


async function trending() {
    const endPoint = '/trending/all/day'
    const requestParams = `?api_key=${tmdbKey}`
    const urlToFetch = tmdbBaseUrl + endPoint + requestParams
    try {
        const response = await fetch(urlToFetch)
        if (response.ok) {
            const data = await response.json()
            console.log(data)
            return data.results
        }
    } catch (error) {
        console.log(error)
    }
}

async function nowShowing() {
    const nowtrending = await trending()
    nowtrending.forEach((trend => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container')
        const trendEl = document.createElement('div');
        trendEl.classList.add('card');
        trendEl.innerHTML = `
            <img src = "https://image.tmdb.org/t/p/original/${trend.poster_path}">
            <div class="description">
                <div class="info">
                <div class="title"> ${trend.title || trend.name}</div>
                <span class ="icon">
                        <i class="fa-solid fa-bookmark fa-xl fill-white"></i>
                    </span>
                <div class="year"> ${trend.release_date || trend.first_air_date} </div>
                </div>
                <p> ${trend.overview} </p>
            <div class="rating"> <span class ="star"> <img src ="./icons8-star-30.png"> </span> ${trend.vote_average.toFixed(1)} </div>
            </div>
        `
        cardContainer.appendChild(trendEl)
        results.appendChild(cardContainer)

    }))
    resultContainer.appendChild(results)
    // ADD TO BOOKMARKS
    const bookmark = document.querySelectorAll('.fa-bookmark')
    for (let i = 0; i < bookmark.length; i++) {
        bookmark[i].addEventListener('click', () => {
            if (bookmark[i].classList.contains('isAdded')) {
                if (addToBooks.includes(nowtrending[i])) {
                    console.log('COPIED')
                    addToBooks.splice(addToBooks.indexOf(nowtrending[i]), 1)
                    bookmark[i].classList.remove('isAdded')
                } else {
                    bookmark[i].classList.remove('isAdded')
                }
            } else {
                bookmark[i].classList.add('isAdded')
                addToBooks.push(nowtrending[i])
            }
            console.log(addToBooks)
        })
    }
    console.log(addToBooks)

}


window.addEventListener('DOMContentLoaded', nowShowing)




// Search 
async function search() {
    const userInput = input.value
    const endPoint = '/search/multi'
    const requestParams = `?query=${userInput}&api_key=${tmdbKey}`
    const urlToFetch = tmdbBaseUrl + endPoint + requestParams
    try {
        const response = await fetch(urlToFetch)
        if (response.ok) {
            const data = await response.json()
            console.log(data)
            return data.results
        }
    } catch (error) {
        console.log(error)
    }
}

async function displaySearch() {
    results.innerHTML = ''
    const movieOrTv = await search()
    const resultsHeader = document.querySelector('#trending')

    movieOrTv.forEach(show => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container')
        const tvEl = document.createElement('div');
        if (show.poster_path !== null) {
            tvEl.classList.add('card');
            tvEl.innerHTML = `
            <img src = "https://image.tmdb.org/t/p/original/${show.poster_path}">
            <div class="description">
                <div class="info">
                <div class="title"> ${show.original_name || show.original_title}</div>
                <span class ="icon">
                <i class="fa-solid fa-bookmark fa-xl fill-white"></i>
            </span>
                </div>
                <p> ${show.overview} </p>
            <div class="rating"> <span class ="star"> <img src ="./icons8-star-30.png"> </span> ${show.vote_average} </div>
            </div>
        `
        } else if (tvEl == null || 'https://image.tmdb.org/t/p/original/undefined') {
            console.log(tvEl)
            tvEl.remove()
        }
        cardContainer.appendChild(tvEl)
        results.appendChild(cardContainer)

    })

    const cards = document.querySelectorAll('.card')
    resultContainer.appendChild(results)
    console.log(cards.length)
    resultsHeader.innerHTML = `Found ${cards.length} results`

    // ADD TO BOOKMARKS
    const bookmark = document.querySelectorAll('.fa-bookmark')
    for (let i = 0; i < bookmark.length; i++) {
        bookmark[i].addEventListener('click', () => {
            if (bookmark[i].classList.contains('isAdded')) {
                if (addToBooks.includes(movieOrTv[i])) {
                    console.log('COPIED')
                    addToBooks.splice(addToBooks.indexOf(movieOrTv[i]), 1)
                    bookmark[i].classList.remove('isAdded')
                } else {
                    bookmark[i].classList.remove('isAdded')
                }
            } else {
                bookmark[i].classList.add('isAdded')
                addToBooks.push(movieOrTv[i])
            }
            console.log(addToBooks)
        })
    }

}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    displaySearch()
    input.value = ''
})

const bookmarkLink = document.querySelector('#bookmark')

bookmarkLink.addEventListener('click', (e) => {
    e.preventDefault()
    form.style.display = 'none'
    results.innerHTML = ''
    const heading = document.querySelector('#trending')
    heading.innerHTML = 'Bookmarks'
    bookmarks(addToBooks)
})

function bookmarks(arr) {
    arr.forEach(show => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container')
        cardContainer.classList.add('added-to-list')
        const tvEl = document.createElement('div');
        tvEl.classList.add('card');
        tvEl.innerHTML = `
            <img src = "https://image.tmdb.org/t/p/original/${show.poster_path}">
            <div class="description">
                <div class="info">
                <div class="title"> ${show.original_name || show.original_title}</div>
                <span class="icon remove">
                <i class="fa-solid fa-x fill-white"></i>
                </span>
                </div>
                <p> ${show.overview} </p>
            <div class="rating"> <span class ="star"> <img src ="./icons8-star-30.png"> </span> ${show.vote_average.toFixed(1)} </div>
            </div>
        `
        cardContainer.appendChild(tvEl)
        results.appendChild(cardContainer)
    })
    
    for(let i = 0; i < addToBooks.length; i++){
        const remove = document.querySelectorAll('.remove')
        remove[i].addEventListener('click',() =>{
            addToBooks.splice(addToBooks.indexOf(addToBooks[i]), 1)
            console.log(addToBooks.indexOf(addToBooks[i]))
            remove[i].parentElement.parentElement.parentElement.remove()
        })
    }
}
