import { saveToLocalStorage } from "./save-to-local-storage.js";


const player = document.querySelector('.audio-player__player'); // контейнер плеера
const playlist = document.querySelector('.playlist__list');

const playButton = document.querySelector('.audio-player__control'); // кнопка воспроизведения трека
const previousButton = document.querySelector('.audio-player__previous-song'); // кнопка воспроизведения предыдущего трека
const nextButton = document.querySelector('.audio-player__next-song'); // кнопка воспроизведения следующего трека

const progressLine = document.querySelector('.audio-player__progress'); // прогресс фон
const progress = document.querySelector('.audio-player__progress-fill-line'); // прогресс

const nameSong = document.querySelector('.audio-player__name-song'); // название песни
const audio = document.querySelector('.audio-player__song'); // аудиофайл в разметке 

const playIcon = document.querySelector('.audio-player__control-play'); // иконка play
const pauseButton = document.querySelector('.audio-player__control-pause'); // иконка pause

const songStartTime = document.querySelector('.audio-player__time-start'); // текущее время песни
const songEndTime = document.querySelector('.audio-player__time-end'); // длительность песни

const volume = document.querySelector('.audio-player__volume-input'); //инпут громкости
const wavesContainer = document.querySelector('.audio-player__waves');

const wavesurfer = WaveSurfer.create({
  container: wavesContainer,
  waveColor: '#4F4A85',
  progressColor: '#383351',
})

// Названия песен
const songsName = ['Iamalex - Meadow (feat. Azula & Dayle)',
              'Joytastic Sarah - Fly Me To The Moon',
              'Lofi Fruits Music - Stan (feat. Chill Fruits Music)',
              'Lofi Fruits Music - Yellow (feat. Chill Fruits Music)',
              'Sapientdream - Past Lives (feat. Slushii)']; 

// Песня при загрузке страницы
let songIndex;
// проверяем есть ли в localStorage информация по ключу currentSong и если есть, то начинаем проигрыание с этой песни
if (localStorage.getItem('currentSong')) { 
  songIndex = JSON.parse(localStorage.getItem('currentSong'));
} else {
  songIndex = 0;
}

// иконка в плеере по умолчанию
playIcon.style.display = 'block';
pauseButton.style.display = 'none';

//преобразуем секунды в минуты и секунды для записи в плеер при загрузке песни
const secondsToMinutesAndSeconds = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(0);
  // Добавляем нули перед минутами и секундами, если они менее 10
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

//изменяем продолжительность песни на странице
const updateTime = () => {
  const duration = audio.duration; // длина трека
  const time = secondsToMinutesAndSeconds(duration); // преобразуем секунды в минуты и секунды
  songEndTime.textContent = time; // отображаем на странице
}

const loadSong = (songsName) => {
  nameSong.innerHTML = songsName; // записывам название текущей песни
  audio.src = `./assets/audio/${songsName}.mp3`; // добавляем путь к текущей песне
  wavesurfer.load(`./assets/audio/${songsName}.mp3`); // добавляем аудиозапись для звуковой волны
  wavesurfer.setVolume(0);
}

// при загрузке страницы для текущей аудиозаписи: 1) отобразим длительность 2) отобразим название 3) укажем путь 
window.addEventListener('load', updateTime);
loadSong(songsName[songIndex]); 

// Проигрывать 
const playSong = () => {
  audio.play(); 
  player.classList.add('play');
  wavesurfer.play();
}

// Пауза
const pauseySong = () => {
  audio.pause(); 
  player.classList.remove('play');
  wavesurfer.pause();
}

playButton.addEventListener('click', () => { // вешаем обработчик клика на кнопку воспроизвести/пауза
  const isPlaying = player.classList.contains('play');
  if (isPlaying) {
    pauseySong();
    playIcon.style.display = 'block';
    pauseButton.style.display = 'none';

  } else {
    playSong();
    playIcon.style.display = 'none';
    pauseButton.style.display = 'block';
  }
})

// следующая песня
const playNextSong = () => {
  songIndex++;

  if (songIndex > songsName.length - 1 || songIndex < 0) {
    songIndex = 0;
  }

  saveToLocalStorage('currentSong', songIndex); // сохраняем в localSorage индекс песни, на которой пользователь остановил прослушивание

  loadSong(songsName[songIndex]);
  playIcon.style.display = 'block';
  pauseButton.style.display = 'none';

}

nextButton.addEventListener('click', playNextSong);

// предыдущая песня
const playPreviousSong = () => {
  songIndex--;

  if (songIndex < 0 || songIndex >= songsName.length - 1) {
    songIndex = songsName.length - 1;
  }
  
  saveToLocalStorage('currentSong', songIndex); // сохраняем в localSorage индекс песни, на которой пользователь остановил прослушивание

  loadSong(songsName[songIndex]);
  playIcon.style.display = 'block';
  pauseButton.style.display = 'none';
}

previousButton.addEventListener('click', playPreviousSong);

//прогресс
const updateProgress = (evt) => {
  const {duration, currentTime} = evt.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  const normalTime = secondsToMinutesAndSeconds(currentTime);
  songStartTime.textContent = normalTime;
}

audio.addEventListener('timeupdate', updateProgress)

// перемотка песни
const setProgress = (evt) => {
  const width = progressLine.clientWidth; // длина блока с прогрессом
  const click = evt .offsetX; // место, куда кликнули
  const duration = audio.duration; // длина трека

  audio.currentTime = (click / width) * duration;
}

progressLine.addEventListener('click', setProgress);

// включаем следующую песню, если закончилась предыдущая
audio.addEventListener('ended', () => {
  playNextSong();
  progress.style.width = 0;
});

// выбор песни в плейлисте
const chooseSong = (evt) => {
  if (evt.target.classList.contains('song__name') || evt.target.classList.contains('song__play-button') || evt.target.classList.contains('song__play-icon')) {
    const currentNameSong = evt.target.closest('.song').querySelector('.song__name').textContent;
    songIndex = songsName.indexOf(currentNameSong);
    loadSong(songsName[songIndex]);
  }
}

playlist.addEventListener('click', chooseSong);

//громкость
const changeVolume = () => {
  audio.volume = volume.value;
}

volume.addEventListener('input', changeVolume)

// Добавляем обработчики событий для управления воспроизведением
audio.addEventListener('seeking', () => {
  wavesurfer.seekTo(audio.currentTime / audio.duration);
});

audio.addEventListener('ended', () => {
  wavesurfer.stop();
});

export {songsName}