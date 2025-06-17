import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || "");
        setAvatar(data.avatar || "");
        setCoverImage(data.coverImage || "");
      }
      setLoading(false);
    };
    fetchUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        username,
        avatar,
        coverImage,
      });

      setUser((prev) => ({
        ...prev,
        username,
        avatar,
        coverImage,
      }));
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile");
    }
  };

  if (loading)
    return (
      <div className='text-center mt-5'>
        <Spinner animation='border' />
      </div>
    );

  return (
    <div className='container mt-4' style={{ maxWidth: "600px" }}>
      <h3 className='mb-4 text-center'>Edit Profile</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Avatar URL</Form.Label>
          <Form.Control
            type='text'
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Cover Image URL</Form.Label>
          <Form.Control
            type='text'
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary' className='w-100'>
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default EditProfile;
