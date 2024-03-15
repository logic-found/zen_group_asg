import "./App.css";
import { Toaster } from "react-hot-toast";
import Home from "./Home";


function App() {
    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#F5F2F2",
                    },
                    success: {
                        icon: "✅",
                    },
                    error: {
                        icon: "❌",
                    },
                }}
            />
            <Home/>
        </>
    );
}

export default App;
