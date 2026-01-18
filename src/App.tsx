import logo from './assets/logo.png'
import './index.css'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="LavenderDragonDesign logo" className="logo" />
        <h1>LavenderDragonDesign Tools</h1>
      </header>

      <main className="main">
        <a href="/pdf" className="card">
          <h2>LavenderDragonDesign's PDF Generator</h2>
          <p>Create branded download PDFs for Etsy customers.</p>
        </a>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} LavenderDragonDesign
      </footer>
    </div>
  )
}
