const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $(".playlist");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $('.btn-repeat');
const player = $(".player");
const progress = $("#progress");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
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
      image: "./asset/imgs/PhongDaHanh.png",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
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
  definedProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const _this = this;
    //Xử lí phóng to hoặc thu nhỏ cd
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0 + "px";
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xử lí CD quay và dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    //Xử lí khi play
    playBtn.onclick = function () {
      if (!_this.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }

      //Khi song được play
      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
        progress.value = 0;
      };

      //Khi song bị pause
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      };
    };
    
    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
        // audio.play();
      }
    };
    
    // Xử lí khi tua song
    progress.onchange = function (e) {
      audio.currentTime = Math.floor((e.target.value / 100) * audio.duration);
    };

    //Xử lí khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    //Xử lí khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    //Xử lí khi random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    //Xử lí khi repeat song
    repeatBtn.onclick = function() {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle('active', _this.isRepeat);
    };

    //Xử lí khi end music
    audio.onended = function() {
      if(_this.isRepeat) {
        audio.play();
      }
      else{
        nextBtn.click();
      }
    };

    //Lắng nghe hành vi click vào playlist
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)');
      if (songNode && !e.target.closest('.option')) {
        // if(e.target.closest('.song:not(.active)')) {

        // }
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      };
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    this.currentIndex %= this.songs.length;
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    this.currentIndex =
      (this.currentIndex + this.songs.length) % this.songs.length;
    this.loadCurrentSong();
  },
  randomSong: function () {
    const initialIndex = this.currentIndex;
    do {
      this.currentIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === initialIndex);
    this.loadCurrentSong();
  },
  scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    },300)
  },
  start: function () {
    //Định Nghĩa Các Thuộc Tính Cho Object
    this.definedProperties();

    //Lắng nghe các sự kiện
    this.handleEvent();

    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    //Render lại các bài hát
    this.render();
  },
};

app.start();
