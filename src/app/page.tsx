import { meals } from "../data/meals";

export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Low-Energy Meals</h1>

      {meals.map((meal) => (
        <div key={meal.id} style={{ marginBottom: "1rem" }}>
          <h3>{meal.name}</h3>
          <p>Energy: {meal.energyLevel}</p>
        </div>
      ))}
    </main>
  );
}
