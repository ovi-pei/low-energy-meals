"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { meals } from "../../data/meals";

export default function SavedPage() {
  const [savedMeals, setSavedMeals] = useState<any[]>([]);

  useEffect(() => {
    // 1. Get IDs from local storage
    const savedIdsString = localStorage.getItem("savedMeals");
    const savedIds = savedIdsString ? JSON.parse(savedIdsString) : [];

    // 2. Find the actual meal objects from our data file
    const filteredMeals = meals.filter((meal) => savedIds.includes(meal.id));
    setSavedMeals(filteredMeals);
  }, []);

  // Allow removing from the saved list
  const removeMeal = (id: number) => {
    const newSaved = savedMeals.filter(m => m.id !== id);
    setSavedMeals(newSaved);
    
    // Update local storage
    const newIds = newSaved.map(m => m.id);
    localStorage.setItem("savedMeals", JSON.stringify(newIds));
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Saved Meals</h1>

      {savedMeals.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666" }}>
          <p>You haven't saved anything yet.</p>
          <Link href="/ingredients" style={{ textDecoration: "underline", display: "block", marginTop: "1rem" }}>
            Go find food
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {savedMeals.map((meal) => (
            <div 
              key={meal.id} 
              style={{
                border: "1px solid #ddd",
                padding: "1.5rem",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{meal.name}</h3>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>
                  {meal.energyLevel} energy
                </span>
              </div>
              <button 
                onClick={() => removeMeal(meal.id)}
                style={{
                  background: "transparent",
                  border: "1px solid #ccc",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  color: "red"
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <Link href="/" style={{ display: "block", marginTop: "3rem", textAlign: "center", textDecoration: "underline" }}>
        ← Home
      </Link>
    </main>
  );
}