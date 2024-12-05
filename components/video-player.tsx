'use client'

import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { Volume2, VolumeX, Maximize, Minimize, Settings, Pause, Play } from 'lucide-react'

interface VideoPlayerProps {
  sources: string[]
  poster?: string
}

export function VideoPlayer({ sources, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<videojs.Player | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!videoRef.current) return

    const videoJsOptions = {
      sources: sources.map(src => ({
        src,
        type: src.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
      })),
      poster,
      controls: false,
      responsive: true,
      fluid: true,
      html5: {
        hls: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          overrideNative: true,
        },
      },
    }

    playerRef.current = videojs(videoRef.current, videoJsOptions)

    playerRef.current.on('play', () => setIsPlaying(true))
    playerRef.current.on('pause', () => setIsPlaying(false))
    playerRef.current.on('volumechange', () => setIsMuted(playerRef.current?.muted() || false))
    playerRef.current.on('fullscreenchange', () => setIsFullscreen(playerRef.current?.isFullscreen() || false))

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
      }
    }
  }, [sources, poster])

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play()
      } else {
        playerRef.current.pause()
      }
    }
  }

  const handleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted(!playerRef.current.muted())
    }
  }

  const handleFullscreen = () => {
    if (playerRef.current) {
      if (playerRef.current.isFullscreen()) {
        playerRef.current.exitFullscreen()
      } else {
        playerRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div className="video-container">
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
      
      <div className="video-controls">
        <div className="video-progress">
          <div className="video-progress-bar" style={{ width: '50%' }}></div>
        </div>
        <div className="video-buttons">
          <button onClick={handlePlayPause} className="video-button">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={handleMute} className="video-button">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <div className="video-time">0:30</div>
          <div className="flex-grow"></div>
          <button onClick={() => {}} className="video-button">
            <Settings size={20} />
          </button>
          <button onClick={handleFullscreen} className="video-button">
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
