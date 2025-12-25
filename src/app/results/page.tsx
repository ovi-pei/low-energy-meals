"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { meals } from "../../data/meals";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const itemsString = searchParams.get("items");
  const energyLevel = searchParams.get("energy");
  
  // State to track what has been saved (for button feedback)
  const [savedIds, setSavedIds] = useState<number[]>([]);

  // On load, check what is already saved in LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedMeals");
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
  }, []);

  const toggleSave = (id: number) => {
    let newSaved;
    if (savedIds.includes(id)) {
      newSaved = savedIds.filter(savedId => savedId !== id);
    } else {
      newSaved = [...savedIds, id];
    }
    setSavedIds(newSaved);
    localStorage.setItem("savedMeals", JSON.stringify(newSaved));
  };
  
  const selectedIngredients = itemsString 
    ? itemsString.split(",").map(i => i.toLowerCase().trim()) 
    : [];

  const matchingMeals = meals.filter((meal) => {
    const hasIngredient = meal.ingredients.some(ing => 
      selectedIngredients.includes(ing.toLowerCase())
    );
    // Strict match for 'very low', relaxed match for 'medium'
    const isEnergyMatch = energyLevel === "very low" 
        ? meal.energyLevel === "very low" 
        : true; 

    return hasIngredient && isEnergyMatch;
  });

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      {/* Header with link to Saved Page */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Results</h1>
        <Link href="/saved" style={{ textDecoration: "underline", fontSize: "0.9rem" }}>
          View Saved ({savedIds.length})
        </Link>
      </div>

      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Based on: <strong>{energyLevel} energy</strong>
      </p>

      {matchingMeals.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "3rem", padding: "2rem", background: "#f5f5f5", borderRadius: "12px" }}>
          <h3>No matches.</h3>
          <p>We couldn't find a {energyLevel} energy meal with those ingredients.</p>
          <Link href="/ingredients">
            <button style={{ marginTop: "1rem", padding: "10px 20px", cursor: "pointer" }}>Try Again</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {matchingMeals.map((meal) => (
            <div 
              key={meal.id} 
              style={{
                border: "1px solid #ddd",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                position: "relative"
              }}
            >
              <h2 style={{ margin: "0 0 0.5rem 0" }}>{meal.name}</h2>
              <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                <span style={{ 
                  background: meal.energyLevel === "very low" ? "#e0f7fa" : "#fff3e0",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>
                  {meal.energyLevel === "very low" ? "⚡ Very Low" : "😐 Medium"}
                </span>
              </div>
              <p style={{ margin: "0 0 1rem 0", color: "#555" }}>
                <strong>You need:</strong> {meal.ingredients.join(", ")}
              </p>

              {/* SAVE BUTTON */}
              <button 
                onClick={() => toggleSave(meal.id)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid black",
                  background: savedIds.includes(meal.id) ? "black" : "white",
                  color: savedIds.includes(meal.id) ? "white" : "black",
                  cursor: "pointer"
                }}
              >
                {savedIds.includes(meal.id) ? "Saved ♥" : "Save for later"}
              </button>
            </div>
          ))}
        </div>
      )}
      
      <Link href="/ingredients" style={{ display: "block", marginTop: "3rem", textAlign: "center", textDecoration: "underline" }}>
        ← Start Over
      </Link>
    </main>
  );
}