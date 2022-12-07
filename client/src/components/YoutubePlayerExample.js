// Code from
//https://github.com/TheMcKillaGorilla/YouTubePlaylisterReact/blob/main/src/PlaylisterYouTubePlayer.js
// which we were allowed to use


import React, {useContext, useState, useEffect} from 'react';
import YouTube from 'react-youtube';
import { GlobalStoreContext } from '../store'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import FastRewindIcon from '@mui/icons-material/FastRewind';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopIcon from '@mui/icons-material/Stop';
import FastForwardIcon from '@mui/icons-material/FastForward';

export default function YouTubePlayerExample() {
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let playlist = []

    const {store} = useContext(GlobalStoreContext)
    const [playerStatus, setPlayerStatus] = useState(-1)
    const [ytPlayer, setPlayer] = useState(null)
    const [currentSong, setCurrentSong] = useState(0)

    useEffect(() => {
        if (store.selectedPlaylist && store.selectedPlaylist.publishStatus)
            store.incrementListens(store.selectedPlaylist._id)
    }, [store.selectedPlaylist])

    let playlistName = ""
    let playlistId = ""
    if (store.selectedPlaylist) {
        playlist = store.selectedPlaylist.songs.map(song => song.youTubeId)
        playlistName = store.selectedPlaylist.name
        playlistId = store.selectedPlaylist._id
    }
    

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST

    const playerOptions = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo()
        store.setSongPlaying(currentSong)

    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        setCurrentSong(prev => (prev + 1) % playlist.length)
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        setPlayer(event.target)
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            store.setSongPlaying(currentSong)
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
        setPlayerStatus(playerStatus)
    }

    const handleRewind = (event) => {
        if (ytPlayer && currentSong - 1 >= 0) {
            setCurrentSong(prev => prev - 1)
            loadAndPlayCurrentSong(ytPlayer)
        }
    }

    const handlePlay = event => {
        if (ytPlayer) {
            if (playerStatus === 2) {
                ytPlayer.playVideo()
            }
            else {
                loadAndPlayCurrentSong(ytPlayer)
            }
        }
    }

    const handleStop = event => {
        if (ytPlayer) {
            ytPlayer.pauseVideo()
        }
    }

    const handleFastForward = event => {
        if (ytPlayer && currentSong + 1 <= playlist.length) {
            incSong()
            loadAndPlayCurrentSong(ytPlayer)
        }
    }
    let disableAll = false

    if (playlist.length === 0) {
        disableAll = true
    }

    return (
        <>
            <YouTube
            videoId={playlist[currentSong]}
            opts={playerOptions}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange} />
            <div id="player-info-container">
                <Typography> Playlist: {playlistName}</Typography>
                <Typography> Song #: {currentSong}</Typography>
                <Typography> Title: {store.selectedPlaylist ? store.selectedPlaylist.songs[currentSong].title : ""}</Typography>
                <Typography> Artist: {store.selectedPlaylist ? store.selectedPlaylist.songs[currentSong].artist : ""}</Typography>
                <div id="media-controller-container">
                    <Button onClick={handleRewind} disabled={currentSong === 0 || disableAll}>
                        <FastRewindIcon />
                    </Button>
                    <Button onClick={handleStop} disabled={playerStatus === 2  || disableAll}>
                        <StopIcon />
                    </Button>
                    <Button onClick={handlePlay} disabled={playerStatus === 1  || disableAll} >
                        <PlayCircleIcon />
                    </Button>
                    <Button onClick={handleFastForward} disabled= {currentSong === playlist.length - 1  || disableAll}>
                        <FastForwardIcon />
                    </Button>
                </div>
            </div>
        </>
        )
}