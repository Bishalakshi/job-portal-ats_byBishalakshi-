import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const upload = async () => {
    if (!file) return alert("Select file");

    const user = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", user.username);

    try {
      await api.post("/auth/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Uploaded");

      navigate("/jobs");

    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={upload}>Upload</button>
    </div>
  );
}