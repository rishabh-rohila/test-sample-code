import "./App.css";
import Navbar from "./components/Navbar";
import Textform from "./components/Textform";

function App() {
  return( 
  <>
  <Navbar title = "Text Utility"/>
  <div className="Main">
  <Textform heading = "Type Your Text in Below Textbox"/>
  </div>
  </>
  );
}

export default App;
