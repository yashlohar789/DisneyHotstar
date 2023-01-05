const apiKey = "cc05e89fcca986fd4df22caa64b44c42";
const baseURL = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPath = {
    fetchLatestMovies:`${baseURL}/trending/all/day?api_key=${apiKey}`,
    fetchMovies: category => `${baseURL}/movie/${category}?api_key=${apiKey}&language=en-US&page=1`,
    fetchYoutubeVideo:id => `${baseURL}/movie/${id}/videos?api_key=${apiKey}&language=en-US`,
    fetchPopularTVShows:`${baseURL}/tv/popular?api_key=${apiKey}&language=en-US&page=1`,
}

function init() {
    fetchLatestMovie(apiPath.fetchLatestMovies);
    fetchAll(apiPath.fetchLatestMovies,'Trending',"Trending");
    fetchAll(apiPath.fetchMovies("popular"),'Popular','Popular Movies');
    fetchAll(apiPath.fetchPopularTVShows,"Shows",'Popular TV Shows');
    fetchAll(apiPath.fetchMovies("upcoming"),'Upcoming','Upcoming In Theatres');
    fetchAll(apiPath.fetchMovies("now_playing"),'Now',"Now Playing");
}

//Fetch latest banner section


const fetchLatestMovie = (url) => {
    fetch(url)
    .then(res => res.json())
    .then( latest => {
        const random = parseInt(Math.random()*20);
        showLatestMovie(latest.results[random]);
    }).catch(err => {
        console.log(err);
    })
}

//Show the bannner section

const showLatestMovie = latest => {
     document.querySelector(".header")
    .style.backgroundImage = `linear-gradient(90deg, rgba(3,37,22,0.6643032212885154) 69%, rgba(3,37,35,0.28335084033613445) 100%),
    url(${imgPath}${latest.backdrop_path})`;

    const info =` <img class="poster" src="${imgPath}${latest.poster_path}" alt="">
            <div class="hero-content">
                <p class="trending">Now Trending in Theatres</p>
                <h1 class="movie-name">${(latest.original_title)? latest.original_title : latest.name}<span class="year"> (2022)</span></h1>
                <p class="release">Realease on : ${latest.release_date}</p>
                <div class="hero-details flex">
                    <div class="rating flex">
                        <div class="rating-box">
                            <p class="popularity">${parseInt(latest.popularity)}</p>
                        </div>
                        <p class="user-score">User Score</p>
                    </div>

                    <div class="list flex"><img src="img/list.png" alt=""></div>
                    <div class="list flex"><img src="img/heart.png" alt=""></div>
                    <div class="list flex"><img src="img/bookmark.png" alt=""></div>
                    <div class="list flex"><img src="img/star.png" alt=""></div>
                   
                </div>
                <p class="desc">${latest.overview}</p>
                <button onclick ="play(${(latest.id)})" class="btn flex"><img src="img/play.png" alt="">Play Trailer</button>
                </div>`;

             document.querySelector(".hero-section").insertAdjacentHTML("afterbegin",info);
}


//fectch latest Movies
const fetchAll = (url,className,heading) => {
    fetch(url)
    .then(res => res.json())
    .then( latest => {
         showMovies(latest.results,className,heading);
    }).catch(err => {
        console.log(err);
    })
}

const play = (id) => {
     fetch(apiPath.fetchYoutubeVideo(id))
     .then(video => video.json())
     .then(video => {
        console.log(video)
           document.querySelector(".modal").innerHTML="";
           document.querySelector(".modal-window").style.display="block";
           const html= `<iframe class="video" width="560" height="315" src="https://www.youtube.com/embed/${video.results[0].key}?start=1" 
           title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
           encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

           document.querySelector(".modal").innerHTML+= html;
     }).catch(err => {
        console.log(err);
    })

}


//Show the latest Movies

const showMovies = (latest,className,heading) => {

        const html = `<div class="wrapper container">
                    <h1 class="wrapper-heading">${heading}</h1>
                    <div class="boxes ${heading} flex"></div>
                  </div>`;

                  const main = document.querySelector(".main");
                  main.insertAdjacentHTML("beforeend",html);

                  latest.forEach(latest => {

                      const poster= `<img class="movie" src="${imgPath}${latest.poster_path}" alt="${latest.original_title}" onclick ="play(${(latest.id)})">`;
                      document.querySelector(`.${className}`).insertAdjacentHTML("beforeend",poster);
                  }); 
}


//Page loading

window.addEventListener("load", e => {
    e.preventDefault()
    init();

    const nav = document.querySelector(".header-navigation");

    window.addEventListener("scroll", () => {
        if(window.scrollY > nav.clientHeight){
            nav.classList.add("bg-active");
        }else {
            nav.classList.remove("bg-active");
        }
    })

    const close= document.querySelector('.close');
    const modal = document.querySelector(".modal-window");
    const video = document.querySelector(".video");
    
    close.addEventListener("click",() => {
        modal.style.display="none";
   })
});

