import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { uploadAudioAndQueueExport } from "../firebase/audioUpload";

const ExportButton = ({ audioFile, visualizerSettings }) => {
  const { user } = useContext(UserContext);

  const handleExport = async () => {
    if (!user) return alert("You must be logged in to export!");
    if (!audioFile) return alert("Upload an audio file first!");

    const result = await uploadAudioAndQueueExport({
      file: audioFile,
      userId: user.uid,
      visualizerSettings,
    });

    if (result.success) {
      alert("Export job queued! We'll notify you when it's ready.");
    } else {
      alert("Export failed: " + result.error);
    }
  };

  return (
    <button className='dark-button' onClick={handleExport}>
      Export Visualizer
    </button>
  );
};

export default ExportButton;
