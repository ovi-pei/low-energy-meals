"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STAPLES = [
  "Eggs", "Bread", "Rice", "Noodles", 
  "Chicken", "Cheese", "Beans", "Potatoes",
  "Cereal", "Milk", "Tortilla", "Peanut Butter" // Added new staples to match new menu
];

export default function IngredientsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [energy, setEnergy] = useState<string | null>(null);
  const [otherInput, setOtherInput] = useState(""); // New state for text input

  const toggleIngredient = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleFindMeals = () => {
    // Combine clicked buttons AND the text input
    let allIngredients = [...selected];
    
    // If they typed something, split by comma (in case they typed "ham, onion")
    if (otherInput.trim()) {
        const typedItems = otherInput.split(",").map(i => i.trim());
        allIngredients = [...allIngredients, ...typedItems];
    }

    const query = allIngredients.join(",");
    router.push(`/results?items=${query}&energy=${energy}`);
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      
      {/* 1. ENERGY SECTION */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>1. How is your energy?</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setEnergy("very low")}
            style={{
              flex: 1,
              padding: "1.5rem",
              borderRadius: "12px",
              border: energy === "very low" ? "3px solid black" : "1px solid #ccc",
              background: energy === "very low" ? "#e0f7fa" : "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            😫 Very Low
            <div style={{ fontSize: "0.8rem", fontWeight: "normal", marginTop: "5px" }}>
              I can't cook. Just feed me.
            </div>
          </button>

          <button
            onClick={() => setEnergy("medium")}
            style={{
              flex: 1,
              padding: "1.5rem",
              borderRadius: "12px",
              border: energy === "medium" ? "3px solid black" : "1px solid #ccc",
              background: energy === "medium" ? "#fff3e0" : "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            😐 Medium
            <div style={{ fontSize: "0.8rem", fontWeight: "normal", marginTop: "5px" }}>
              I can do 10 mins of prep.
            </div>
          </button>
        </div>
      </section>

      {/* 2. INGREDIENTS SECTION */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>2. What do you have?</h2>
        
        {/* Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "1rem" }}>
          {STAPLES.map((item) => (
            <button
              key={item}
              onClick={() => toggleIngredient(item)}
              style={{
                padding: "10px 20px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                background: selected.includes(item) ? "black" : "white",
                color: selected.includes(item) ? "white" : "black",
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* The "Other" Input */}
        <div style={{ marginTop: "1rem" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>Other (type anything else):</label>
            <input 
                type="text" 
                placeholder="e.g. tuna, mayo, yogurt"
                value={otherInput}
                onChange={(e) => setOtherInput(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem"
                }}
            />
        </div>
      </section>

      {/* SUBMIT BUTTON */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button 
            onClick={handleFindMeals}
            disabled={(selected.length === 0 && !otherInput) || !energy}
            style={{
                width: "100%",
                padding: "1.5rem", 
                background: ((selected.length > 0 || otherInput) && energy) ? "blue" : "#ccc", 
                color: "white", 
                border: "none", 
                borderRadius: "12px",
                fontSize: "1.2rem",
                cursor: ((selected.length > 0 || otherInput) && energy) ? "pointer" : "not-allowed"
            }}
        >
            Find My Meal
        </button>
      </div>
    </main>
  );
}