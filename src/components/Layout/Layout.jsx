import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout-container">
      <Header />

      <main className="content">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;