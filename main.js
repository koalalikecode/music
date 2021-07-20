const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const currentSong = $('.song-information h2')
const currentSinger = $('.song-information h5')
const currentCd = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.play-control')
const progress = $('.progress')
const nextBtn = $('.forward-control')
const preBtn = $('.backward-control')
const shuffle = $('.shuffle-control i')
const repeat = $('.playback-control i')
const playlist = $('.playlist')
        
const app = {
    currentIndex : 0,
    isPlaying: false,
    isShuffle : false,
    isRepeat : false,
    songs : [
        {
            name: 'Nàng thơ',
            singer: 'Hoàng Dũng',
            path: '/songs/Nangtho.mp3',
            image: '/images/nangtho.jpg'
        },
    
        {
            name: 'The one that got away',
            singer: 'Taylor Swift',
            path: '/songs/The One That Got Away.mp3',
            image: '/images/the one that got away.jpg'
        },

        {
            name: 'Lover',
            singer: 'Taylor Swift',
            path: '/songs/Lover - Taylor Swift.mp3',
            image: '/images/Lover.jpg'
        },

        {
            name: 'Tháng tư là lời nói dối của em',
            singer: 'Hà Anh Tuấn',
            path: '/songs/Thang Tu La Loi Noi Doi Cua Em.mp3',
            image: '/images/Thangtulaloinoidoicuaem.jpeg'
        },

        {
            name: "Can't Help Falling In Love",
            singer: 'Kina Grannis',
            path: "/songs/Can't Help Falling In Love With You.mp3",
            image: '/images/Cant help falling in love.jpg'
        },

        {
            name: 'Best Part',
            singer: 'Daniel Caesar; H.E.R.',
            path: '/songs/Best Part.mp3',
            image: '/images/Best Part.jpg'
        },

        {
            name: 'Tháng tư là lời nói dối của em',
            singer: 'Hà Anh Tuấn',
            path: '/songs/Thang Tu La Loi Noi Doi Cua Em.mp3',
            image: '/images/Thangtulaloinoidoicuaem.jpeg'
        },

        {
            name: 'Tháng tư là lời nói dối của em',
            singer: 'Hà Anh Tuấn',
            path: '/songs/Thang Tu La Loi Noi Doi Cua Em.mp3',
            image: '/images/Thangtulaloinoidoicuaem.jpeg'
        }
    
    
    ],

    render: function(){
        const html = this.songs.map((song, index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'song-active' :''}" data-index = ${index}>
                    <div class="cd-review" style = "background-image: url('${song.image}">

                    </div>
                    <div class="body">
                        <h3>${song.name}</h3>
                        <p>${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="ti-more"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = html.join('')
    },
    
    eventHandle: function() {
        const _this = this
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.onscroll.scrollTop
            const newCdWidth = cdWidth - scrollTop
            if (scrollTop !== undefined){
                if(newCdWidth > 0){
                    cd.style.width = newCdWidth +'px'
                    cd.style.opacity = newCdWidth/cdWidth
                }
                else{
                    cd.style.width = 0
                }
            }
        }

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()

            }else {
                audio.play()
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true
            playBtn.classList.add("playing")
        }

        audio.onpause = function () {
            _this.isPlaying = false
            playBtn.classList.remove("playing")
            
        }

        audio.ontimeupdate = function() {
            if(audio.duration) {
                progress.value = (audio.currentTime/audio.duration) * 100
            }
        }

        progress.onchange = function(e) {
            const changeValue = e.target.value/100 * audio.duration
            audio.currentTime = changeValue
        }

        nextBtn.onclick = function() {
            if(_this.isShuffle) {
                _this.shuffleControl()
            }else{
                _this.nextSong()

            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }

        preBtn.onclick = function() {
            if( _this.isShuffle) {
                _this.shuffleControl()

            }else{
                _this.preSong()

            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }

        shuffle.onclick = function() {
            _this.isShuffle = !_this.isShuffle
            shuffle.classList.toggle('active', _this.isShuffle)
        }

        repeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeat.classList.toggle('active', _this.isRepeat)
        }
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        playlist.onclick = function(e) {
            const songClick = e.target.closest('.song:not(.song-active)')
            if (songClick || e.target.closest('.option')){
                if(songClick){
                    _this.currentIndex = Number(songClick.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    
                }
            } 
        }
    },

    getCurrentSong : function() {
       return this.songs[this.currentIndex]
    },

    loadCurrentSong : function() {
        
        currentSong.textContent = this.getCurrentSong().name
        currentSinger.textContent = this.getCurrentSong().singer
        currentCd.style.backgroundImage = `url('${this.getCurrentSong().image}')`
        audio.src = this.getCurrentSong().path


        
    }, 
    
    preSong : function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    
    nextSong : function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()

    }, 

    shuffleControl : function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        
    },

    
    scrollToActiveSong : function () {
        $('.song-active').scrollIntoView({
            behavior: "smooth",
            block : "end"
        }
        )
    },

    start: function(){
        this.eventHandle()

        this.render()

        this.loadCurrentSong()


    }
   

}
app.start()


