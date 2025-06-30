import { useEffect, useRef } from "react";

const useAudioAnalyzer = (audioRef) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceNodeRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    // ✅ Only create a single AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;

    // ❌ Avoid creating a second MediaElementSourceNode
    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContext.createMediaElementSource(
        audioRef.current
      );
    }

    analyserRef.current = audioContext.createAnalyser();
    analyserRef.current.fftSize = 256;

    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    sourceNodeRef.current.connect(analyserRef.current);
    analyserRef.current.connect(audioContext.destination);

    return () => {
      // Clean up (do not disconnect if reused elsewhere)
      analyserRef.current?.disconnect();
    };
  }, [audioRef]);

  const getFrequencyData = () => {
    if (!analyserRef.current || !dataArrayRef.current) return [];
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    return Array.from(dataArrayRef.current);
  };

  return { getFrequencyData };
};

export default useAudioAnalyzer;
