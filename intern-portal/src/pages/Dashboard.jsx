import React, { useEffect, useState } from "react";       // React + hooks
import { getDatabase, ref, onValue } from "firebase/database";  // Firebase DB functions
import { motion } from "framer-motion";                   // motion component
import { useLocation, Navigate } from "react-router-dom"; // routing hooks/components
import "../pages/Dashboard.css";                           // your styles

const Dashboard = () => {
  const location = useLocation();
  const internName = location.state?.internName;

  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!internName) {
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const internsRef = ref(db, "interns");

    const unsubscribe = onValue(
      internsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const internList = Object.entries(data).map(([id, intern]) => ({
            id,
            ...intern,
          }));
          setInterns(internList.sort((a, b) => b.donation - a.donation));
        } else {
          setInterns([]);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to fetch interns:", err);
        setError("Failed to load intern data. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [internName]);

  if (!internName) {
    return <Navigate to="/" />;
  }

  const getRewards = (donation) => {
    if (donation >= 2000)
      return ["📜 Letter of Recommendation", "🏅 Appreciation", "🎓 Certificate"];
    if (donation >= 1000) return ["🏅 Appreciation", "🎓 Certificate"];
    if (donation >= 500) return ["🎓 Certificate"];
    return ["🚫 No rewards unlocked yet"];
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, {internName}!</h1>
      <h2>Intern Dashboard</h2>

      {loading && <p>Loading interns...</p>}

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {!loading && !error && (
        <div className="intern-list">
          {interns.map((intern, index) => (
            <motion.div
              className="intern-card"
              key={intern.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3>{intern.name}</h3>
              <p>
                Referral: <b>{intern.referral}</b>
              </p>
              <p>Total Donations: ₹{intern.donation}</p>
              <div className="rewards">
                <h4>Unlocked:</h4>
                <ul>
                  {getRewards(intern.donation).map((reward, i) => (
                    <li key={i}>{reward}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
