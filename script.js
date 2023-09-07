const audioPlayer = document.getElementById('audioPlayer');
const songList = document.getElementById('songList');
const searchInput = document.getElementById('searchInput');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const timeline = document.getElementById('timeline');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeatingOne = false;
let isRepeatingAll = false;

const songs = [
    { src: 'music/Sesuatu Di Jogja.mp3', image: 'image/Sesuatu-Di-Jogja.jpg' },
    { src: 'music/Rindu Sendiri.mp3', image: 'image/Rindu-Sendiri.jpg' },
    { src: 'music/Tampar.mp3', image: 'image/Tampar.jpg' },
    { src: 'music/Life Could Be A Dream.mp3', image: 'image/Life-Could-Be-A-Dream.jpg' },
    { src: 'music/Untuk Perempuan Yang Sedang Di Pelukan.mp3', image: 'image/Untuk-Perempuan-Yang-Sedang-Di-Pelukan.jpg' },
    { src: 'music/Saujana.mp3', image: 'image/Saujana.jpg' },
    // Add more songs here
];



// Function to extract song title from file name
function extractSongTitle(filename) {
    return filename.split('/').pop().split('.mp3')[0];
}
// Function to create song list items
function createSongListItem(song, index) {
    const listItem = document.createElement('li');
    listItem.classList.add('song-item');

    const songDetails = document.createElement('div');
    songDetails.classList.add('song-details');

    const songImage = document.createElement('img');
    songImage.src = song.image;
    songImage.alt = extractSongTitle(song.src) + ' Image';
    songImage.classList.add('song-image');

    const songTitle = document.createElement('p');
    songTitle.textContent = extractSongTitle(song.src).replace(/-/g, ' ');

    songDetails.appendChild(songImage);
    songDetails.appendChild(songTitle);

    listItem.appendChild(songDetails);
    listItem.addEventListener('click', () => playSong(song, index));

    return listItem;
}

// Populate song list
songs.forEach((song, index) => {
    const listItem = createSongListItem(song, index);
    songList.appendChild(listItem);
});


// Play selected song
function playSong(song, index) {
    audioPlayer.src = song.src;
    audioPlayer.play();

    currentSongIndex = index;

    const currentSongTitle = document.getElementById('currentSong');
    currentSongTitle.textContent = extractSongTitle(song.src);

    const imageName = extractSongTitle(song.src).replace(/\s+/g, '-').toLowerCase();
    const playerImage = document.querySelector('.player-image img');
    playerImage.src = song.image;

    audioPlayer.addEventListener('timeupdate', () => {
        timeline.value = audioPlayer.currentTime;
        timeline.max = audioPlayer.duration;
    });

    timeline.addEventListener('input', () => {
        audioPlayer.currentTime = timeline.value;
    });

    audioPlayer.addEventListener('ended', () => {
        playNextSong();
        timeline.value = 0; // Reset the timeline to the beginning
    });

}
function getNextSongIndex() {
    if (isShuffled) {
        return Math.floor(Math.random() * songs.length);
    } else {
        return (currentSongIndex + 1) % songs.length;
    }
}

function playNextSong() {
    currentSongIndex = getNextSongIndex();
    playSong(songs[currentSongIndex], currentSongIndex);
}

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

audioPlayer.addEventListener('ended', () => {
    playNextSong();
});

prevBtn.addEventListener('click', () => {
    let newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(songs[newIndex], newIndex);
});

nextBtn.addEventListener('click', () => {
    playNextSong();
});

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredSongs = songs.filter(song =>
        extractSongTitle(song.src).toLowerCase().includes(searchTerm)
    );

    songList.innerHTML = '';
    filteredSongs.forEach((song, index) => {
        const listItem = createSongListItem(song, index);
        songList.appendChild(listItem);
    });
})
shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);

    // Toggle the shuffle icon
    if (isShuffled) {
        shuffleBtn.innerHTML = '<i class="fas fa-random"></i>';
        shuffleSongs();
    } else {
        shuffleBtn.innerHTML = '<i class="fas fa-random"></i>';
        resetShuffledSongs();
    }
});

// Function to toggle repeat mode (one song)
repeatBtn.addEventListener('click', () => {
    isRepeatingOne = !isRepeatingOne;
    isRepeatingAll = false;
    repeatBtn.classList.toggle('active', isRepeatingOne);
});

// Function to toggle repeat mode (all songs)
repeatAllBtn.addEventListener('click', () => {
    isRepeatingAll = !isRepeatingAll;
    isRepeatingOne = false;
    repeatAllBtn.classList.toggle('active', isRepeatingAll);
});

// Function to shuffle the song list
function shuffleSongs() {
    let currentIndex = songs.length, randomIndex, tempValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Swap the elements
        tempValue = songs[currentIndex];
        songs[currentIndex] = songs[randomIndex];
        songs[randomIndex] = tempValue;
    }
}

// Function to reset the shuffled song list to its original order
function resetShuffledSongs() {
    songs.sort((a, b) => a.originalIndex - b.originalIndex);
}