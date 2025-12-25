import Link from "next/link";

export default function Home() {
  return (
    <main style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh", 
      padding: "2rem",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Low-Energy Meals</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "3rem", maxWidth: "400px" }}>
        Too tired to think? Tell us what ingredients you have, and we'll tell you what to eat.
      </p>

      <Link href="/ingredients">
        <button style={{
          padding: "1.5rem 3rem",
          fontSize: "1.2rem",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer"
        }}>
          Start (I'm Tired)
        </button>
      </Link>
    </main>
  );
}