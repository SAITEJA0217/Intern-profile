// src/pages/RegisterIntern.jsx
import React, { useState } from "react";
import { database } from "../utils/firebase";
import { ref, push, set } from "firebase/database";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterIntern.css";

const RegisterIntern = () => {
  const [name, setName] = useState("");
  const [referral, setReferral] = useState("");
  const [donation, setDonation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Intern name is required");
      return;
    }

    if (donation && (isNaN(donation) || Number(donation) < 0)) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    try {
      setLoading(true);

      const internRef = ref(database, "interns");
      const newInternRef = push(internRef);

      await set(newInternRef, {
        name: name.trim(),
        referral: referral.trim() || "N/A",
        donation: Number(donation) || 0,
        timestamp: new Date().toISOString(), // ✅ Timestamp added here
      });

      setName("");
      setReferral("");
      setDonation("");

      toast.success("🎉 Intern registered successfully!");
    } catch (error) {
      toast.error("❌ Error registering intern. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <ToastContainer position="top-right" autoClose={2500} />
      <h2>🎓 Register Intern</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Intern Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Referral Code"
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
        />
        <input
          type="number"
          placeholder="Donation Amount"
          value={donation}
          onChange={(e) => setDonation(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterIntern;
