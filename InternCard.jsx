// src/components/InternCard.jsx
import React from "react";
import "./InternCard.css";

const InternCard = ({ name, referral, donation }) => {
  return (
    <div className="intern-card">
      <h2>{name}</h2>
      <p><strong>Referral:</strong> {referral}</p>
      <p><strong>Total Donations:</strong> ₹{donation}</p>
      <div className="rewards">
        <p>🎁 Rewards unlocked (static)</p>
        <ul>
          <li>🌟 Bronze Badge</li>
          <li>🥈 Silver Badge</li>
        </ul>
      </div>
    </div>
  );
};

export default InternCard;
