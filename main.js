const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $(".playlist");
const player = $(".player");
const heading = $("header h2");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progress = $('#progress');
const songDuration = $('.song-duration');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songTime: 0,
  timeInteval: null,
  songs: [
    {
      name: "Có Hẹn Với Thanh Xuân",
      singer: "Monstar",
      path: "./asset/songs/CoHenVoiThanhXuan.mp3",
      image: "./asset/imgs/CoHenVoiThanhXuan.png",
    },
    {
      name: "Anh Tự Do Nhưng Cô Đơn",
      singer: "Trung Quân",
      path: "./asset/songs/AnhTuDoNhungCoDon.mp3",
      image: "./asset/imgs/AnhTuDoNhungCoDon.png",
    },
    {
      name: "Chân Ái",
      singer: "Orange, Khói",
      path: "./asset/songs/ChanAi.mp3",
      image: "./asset/imgs/ChanAi.png",
    },
    {
      name: "Ghé Vào Tai",
      singer: "UMIE",
      path: "./asset/songs/GheVaoTai.mp3",
      image: "./asset/imgs/GheVaoTai.png",
    },
    {
      name: "Nàng Thơ",
      singer: "Hoàng Dũng",
      path: "./asset/songs/NangTho.mp3",
      image: "./asset/imgs/NangTho.png",
    },
    {
      name: "Như Anh Đã Thấy Em",
      singer: "Phúc XP",
      path: "./asset/songs/NhuAnhDaThayEm.mp3",
      image: "./asset/imgs/NhuAnhDaThayEm.png",
    },
    {
      name: "Quả Phụ Tướng",
      singer: "DungHoangPham",
      path: "./asset/songs/QuaPhuTuong.mp3",
      image: "./asset/imgs/QuaPhuTuong.png",
    },
    {
      name: "Rồi Ta Sẽ Ngắm",
      singer: "O.lew",
      path: "./asset/songs/RoiTaSeNgam.mp3",
      image: "./asset/imgs/RoiTaSeNgam.png",
    },
    {
      name: "Phong Dạ Hành",
      singer: "BT x VUHUYNH REMIX",
      path: "./asset/songs/PhongDaHanh.mp3",
      image: "./asset/imgs/PhongDaHanh.jpg",
    },
  ],
  definedProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? "active" : ''}" data-index='${index}'>
            <div class="thumb"
            style="background-image: url(${song.image})">
            </div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>   
        `;
    });
    playlist.innerHTML = htmls.join("");
  },
  convertSecondToMinute: function(second) {
    let minute = Math.floor(second / 60);
    let stringMinute = '0' + minute;
    second -= minute * 60;
    let stringSecond = (second < 10 ? '0' : '') + second;
    return stringMinute + ':' + stringSecond;
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    this.render();
  },
  renderSongTime: function() {
    app.songTime++;
    let stringCurrentTime = app.convertSecondToMinute(app.songTime); 
    songDuration.innerHTML = stringCurrentTime;
  },
  assendingSongTime: function() {
    if(this.isPlaying) {
      this.timeInteval = setInterval(this.renderSongTime, 1100);
    }
    else{
      clearInterval(this.timeInteval);
    }
  },
  resetSongTime: function() {
    songDuration.innerHTML = '00:00'
    this.songTime = 0;
    clearInterval(this.timeInteval);
  },
  handleEvent: function () {
    const _this = this;
    //Xử lí phóng to thu nhỏ cd
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0 + "px";
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xử lí cd quay
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    //Xử lí khi play audio
    playBtn.onclick = function () {
      if (!_this.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    };
    //Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
      progress.value = 0;
      _this.assendingSongTime();
    };

    //Khi song stop
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
      clearInterval(_this.timeInteval);
    };

    //Xử lí tiến độ bài hát thay đổi
    audio.ontimeupdate = function() {
      if(audio.duration) {
        const newValueProgress = audio.currentTime / audio.duration * 100;
        progress.value = newValueProgress;
      }
    }

    //Xử lí khi tua song
    progress.onchange = function(e) {
      // console.log(e.target.value);
      const newTimeSong = e.target.value / 100 * audio.duration;
      audio.currentTime = newTimeSong;
      _this.songTime = Math.round(audio.currentTime);
    }

    //Xử lí khi next song
    nextBtn.onclick = function() {
      if(_this.isRandom) {
        _this.randomSong();
      }
      else{
        _this.nextSong();
      }
      _this.resetSongTime();
      audio.play();
    }

    //Xử lí khi prev song
    prevBtn.onclick = function() {
      _this.prevSong();
      _this.resetSongTime();
      audio.play();
    }

    //Xử lí khi random song
    randomBtn.onclick = function() {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle('active', _this.isRandom);
    }
    
    //Xử lí khi bài hát kết thúc
    audio.onended = function() {
      if(_this.isRepeat) {
        audio.play();
      }
      else{
        nextBtn.click();
      }
      _this.resetSongTime();
    }

    //Xử lí khi repeat song
    repeatBtn.onclick = function() {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle('active', _this.isRepeat);
    }

    //Lắng nghe hành vi click vào playlist
    playlist.onclick = function(e) {
      const songActive = e.target.closest('.song:not(.active)');
      if(songActive && !e.target.closest('.option')) {
        _this.currentIndex = Number(songActive.getAttribute('data-index'));
        _this.loadCurrentSong();
        _this.resetSongTime();
        audio.play();
      }
    }
  },
  nextSong: function() {
    this.currentIndex = (this.currentIndex + 1) % this.songs.length;
    this.loadCurrentSong();
  },
  prevSong: function() {
    this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
    this.loadCurrentSong();
  },
  randomSong: function() {
    let newIndex;
    do{
      newIndex = Math.floor(Math.random() * this.songs.length);
    }while(newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    //Định nghĩa các thuộc tính cho Object
    this.definedProperties();

    //Render các bài hát
    this.render();

    this.handleEvent();

    //Load bài hát đầu tiên và hiện tại lên UI
    this.loadCurrentSong();
  },
};

app.start();
