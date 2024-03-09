const music = new Audio('songs/01 In The Stars.flac');
// music.play();

const songs =[
    {
        id: '1',
        songName:`<ul style="list-style-type: none;">
        <li class="dark">Attention</li>
        <li class="light">Charlie Puth</li>
        </ul>`,
        poster : "images/Taylorswift1 (3).png"
    }
]

master-play.addEventListener('click', () =>{
    if(music.paused || music.currentTime <= 0){
        music
    }
})