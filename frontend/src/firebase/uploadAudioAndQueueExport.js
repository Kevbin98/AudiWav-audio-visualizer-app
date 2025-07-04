// firebase/audioUpload.js
import { storage, db } from "../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const uploadAudioAndQueueExport = async ({
  file,
  userId,
  visualizerSettings,
}) => {
  try {
    // Upload file to Firebase Storage
    const fileRef = ref(storage, `audio/${userId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    // Queue export request in Firestore
    const exportRef = collection(db, "exportRequests");
    const exportDoc = await addDoc(exportRef, {
      userId,
      audioUrl: downloadURL,
      settings: visualizerSettings,
      createdAt: serverTimestamp(),
      status: "queued", // can be updated later to "processing", "done", etc.
    });

    return { success: true, exportId: exportDoc.id };
  } catch (err) {
    console.error("Error uploading audio or queuing export:", err);
    return { success: false, error: err.message };
  }
};
