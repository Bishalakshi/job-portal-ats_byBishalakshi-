import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Upload() {
  const [file, setFile]       = useState(null);
  const [msg, setMsg]         = useState("");
  const [loading, setLoading] = useState(false);
  const navigate  = useNavigate();
  const username  = localStorage.getItem("username");

  const upload = async e => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");
    if (file.type !== "application/pdf")
      return alert("Only PDF files are allowed");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);

    setLoading(true);
    try {
      await api.post("/auth/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMsg("Resume uploaded successfully!");
      setTimeout(() => navigate("/jobs"), 1500);
    } catch {
      setMsg("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center
                    align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: 420 }}>
        <h4 className="text-center mb-3">Upload Your Resume</h4>
        <p className="text-muted text-center">PDF format only · Max 10MB</p>

        {msg && (
          <div className={`alert ${msg.includes("success")
            ? "alert-success" : "alert-danger"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={upload}>
          <div className="mb-3">
            <input className="form-control" type="file"
              accept=".pdf"
              onChange={e => setFile(e.target.files[0])} />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Uploading..." : "Upload & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}