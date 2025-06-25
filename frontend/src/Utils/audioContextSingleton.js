// utils/audioContextSingleton.js
let audioContext;
let sourceNode;

export const getAudioSetup = (mediaElement) => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (!sourceNode) {
    sourceNode = audioContext.createMediaElementSource(mediaElement);
  }

  return { audioContext, sourceNode };
};
