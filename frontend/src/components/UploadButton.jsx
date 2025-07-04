import { useState } from "react";

const UploadButton = ({ onAudioSelected }) => {
  const [fileInfo, setFileInfo] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      onAudioSelected(selectedFile, objectUrl);
      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
    }
  };

  return (
    <div style={styles.mainContainer}>
      <label style={styles.uploadLabel} className='dark-button'>
        Choose file
        <input
          type='file'
          accept='.mp3,.wav'
          onChange={handleFileChange}
          style={styles.input}
        />
      </label>

      {fileInfo && (
        <div style={styles.fileInfo}>
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

const styles = {
  mainContainer: {
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    textAlign: "center",
  },
  uploadLabel: {
    display: "inline-block",
    cursor: "pointer",
    padding: "10px 16px",
    borderRadius: "6px",
    whiteSpace: "nowrap",
    maxWidth: "100%",
  },
  input: {
    display: "none",
  },
  fileInfo: {
    marginTop: "15px",
    fontSize: "0.85rem",
    color: "#ccc",
  },
};

export default UploadButton;
