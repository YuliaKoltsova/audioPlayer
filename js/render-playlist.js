import { songsName } from "./player.js";

const playlist = document.querySelector('.playlist__list'); // место в разметке для списка треков
const playlistItemTemplate = document.querySelector('#song').content.querySelector('.song'); // находим шаблон строки плейлиста

// отображение плейлиста на странице
const renderPlaylist = (list) => {
  list.forEach(song => {
    const playlistItem = playlistItemTemplate.cloneNode(true); //клонируем шаблон строки плейлиста
    playlistItem.querySelector('.song__name').textContent = song; // заполняем название песни
    playlist.append(playlistItem); // добавляем элемент списка в плейлист
  })
}

renderPlaylist(songsName); 




