import { useState } from "react";

const UploadButton = ({ onAudioSelected }) => {
  const [fileInfo, setFileInfo] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      onAudioSelected(selectedFile, objectUrl); // 🔄 pass back to parent
      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
    }
  };

  return (
    <div className='space-y-2'>
      <input type='file' accept='.mp3,.wav' onChange={handleFileChange} />
      {fileInfo && (
        <div className='mb-4 text-sm'>
          <p>
            <strong>File:</strong> {fileInfo.name}
          </p>
          <p>
            <strong>Size:</strong> {(fileInfo.size / 1024).toFixed(2)} KB
          </p>
          <p>
            <strong>Type:</strong> {fileInfo.type}
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadButton;
