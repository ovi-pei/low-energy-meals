"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { meals } from "../../data/meals";

function ResultsContent() {
  const searchParams = useSearchParams();
  const itemsString = searchParams.get("items");
  const energyLevel = searchParams.get("energy");
  
  const [savedIds, setSavedIds] = useState<number[]>([]);

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
    const isEnergyMatch = energyLevel === "very low" 
        ? meal.energyLevel === "very low" 
        : true; 

    return hasIngredient && isEnergyMatch;
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
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
                position: "relative",
                background: "white"
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
              
              <div style={{ marginBottom: "1rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", color: "#555", fontWeight: "bold" }}>Ingredients:</p>
                <p style={{ margin: 0, color: "#666" }}>{meal.ingredients.join(", ")}</p>
              </div>

              {/* INSTRUCTIONS SECTION */}
              <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", fontSize: "0.9rem" }}>Steps:</p>
                <ol style={{ margin: 0, paddingLeft: "1.2rem", color: "#444" }}>
                    {/* The ? is optional chaining, in case a meal has no instructions yet */}
                    {meal.instructions?.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: "5px" }}>{step}</li>
                    ))}
                </ol>
              </div>

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
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{padding: "2rem", textAlign: "center"}}>Loading meals...</div>}>
      <ResultsContent />
    </Suspense>
  );
}