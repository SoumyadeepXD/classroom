'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseWebRtcMediaOptions {
  autoStartMic?: boolean;
  sensitivityThreshold?: number; // 0 - 100
}

export function useWebRtcMedia({
  autoStartMic = false,
  sensitivityThreshold = 15,
}: UseWebRtcMediaOptions = {}) {
  const [micActive, setMicActive] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const [localVideoStream, setLocalVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const localAudioStreamRef = useRef<MediaStream | null>(null);
  const localVideoStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Request & start microphone with Web Audio VAD
  const startMicrophone = useCallback(async () => {
    try {
      setPermissionError(null);
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      localAudioStreamRef.current = stream;
      setMicActive(true);
      setMicMuted(false);

      // Initialize Web Audio Context for RMS volume analysis
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.4;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkAudioActivity = () => {
          if (!analyserRef.current || !localAudioStreamRef.current) return;

          analyserRef.current.getByteFrequencyData(dataArray);

          // Calculate RMS (Root Mean Square) volume level
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const normalizedVol = Math.min(100, Math.round((rms / 128) * 100));

          setAudioVolume(normalizedVol);

          // Update speaking threshold
          if (normalizedVol > sensitivityThreshold && !micMuted && !deafened) {
            setIsSpeaking(true);
          } else {
            setIsSpeaking(false);
          }

          animFrameRef.current = requestAnimationFrame(checkAudioActivity);
        };

        animFrameRef.current = requestAnimationFrame(checkAudioActivity);
      }
    } catch (err: any) {
      console.warn('Microphone permission or device not accessible:', err);
      setPermissionError(err.message || 'Microphone access denied or not found');
      setMicActive(false);
    }
  }, [micMuted, deafened, sensitivityThreshold]);

  // Stop microphone & clean up Web Audio
  const stopMicrophone = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (localAudioStreamRef.current) {
      localAudioStreamRef.current.getTracks().forEach((track) => track.stop());
      localAudioStreamRef.current = null;
    }
    setMicActive(false);
    setIsSpeaking(false);
    setAudioVolume(0);
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    if (!micActive) {
      startMicrophone();
      return;
    }
    const newMuted = !micMuted;
    setMicMuted(newMuted);
    if (localAudioStreamRef.current) {
      localAudioStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !newMuted;
      });
    }
    if (newMuted) {
      setIsSpeaking(false);
    }
  }, [micActive, micMuted, startMicrophone]);

  // Toggle Deafen
  const toggleDeafen = useCallback(() => {
    const newDeafened = !deafened;
    setDeafened(newDeafened);
    if (newDeafened) {
      setMicMuted(true);
      if (localAudioStreamRef.current) {
        localAudioStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }
      setIsSpeaking(false);
    }
  }, [deafened]);

  // Toggle Camera
  const toggleCamera = useCallback(async () => {
    if (videoActive) {
      if (localVideoStreamRef.current) {
        localVideoStreamRef.current.getTracks().forEach((track) => track.stop());
        localVideoStreamRef.current = null;
      }
      setLocalVideoStream(null);
      setVideoActive(false);
    } else {
      try {
        setPermissionError(null);
        if (!navigator.mediaDevices?.getUserMedia) return;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        localVideoStreamRef.current = stream;
        setLocalVideoStream(stream);
        setVideoActive(true);
      } catch (err: any) {
        console.warn('Camera permission or device not accessible:', err);
        setPermissionError(err.message || 'Camera access denied');
      }
    }
  }, [videoActive]);

  // Toggle Screen Share
  const toggleScreenShare = useCallback(async () => {
    if (screenShareActive) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setScreenStream(null);
      setScreenShareActive(false);
    } else {
      try {
        setPermissionError(null);
        if (!navigator.mediaDevices?.getDisplayMedia) return;
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        // Listen for browser native "Stop Sharing" bar
        stream.getVideoTracks()[0].onended = () => {
          setScreenShareActive(false);
          screenStreamRef.current = null;
          setScreenStream(null);
        };

        screenStreamRef.current = stream;
        setScreenStream(stream);
        setScreenShareActive(true);
      } catch (err: any) {
        console.warn('Screen share cancelled or failed:', err);
      }
    }
  }, [screenShareActive]);

  // Cleanup all streams on unmount
  const disconnectAll = useCallback(() => {
    stopMicrophone();
    if (localVideoStreamRef.current) {
      localVideoStreamRef.current.getTracks().forEach((t) => t.stop());
      localVideoStreamRef.current = null;
    }
    setLocalVideoStream(null);
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    setScreenStream(null);
    setVideoActive(false);
    setScreenShareActive(false);
    setMicActive(false);
    setMicMuted(false);
    setDeafened(false);
  }, [stopMicrophone]);

  useEffect(() => {
    if (autoStartMic) {
      startMicrophone();
    }
    return () => {
      disconnectAll();
    };
  }, [autoStartMic, startMicrophone, disconnectAll]);

  return {
    micActive,
    micMuted,
    deafened,
    videoActive,
    screenShareActive,
    isSpeaking,
    audioVolume,
    permissionError,
    localAudioStream: localAudioStreamRef.current,
    localVideoStream,
    screenStream,
    startMicrophone,
    stopMicrophone,
    toggleMute,
    toggleDeafen,
    toggleCamera,
    toggleScreenShare,
    disconnectAll,
  };
}
