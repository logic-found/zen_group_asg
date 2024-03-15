import toast from "react-hot-toast";

const ErrorHandler = (error) => {
    console.log(error);
    if (error.message == "Network Error") {
        toast.error(
            "Network Error, Could not connect to server, please try again later."
        );
    } else {
        toast.error(error.response?.data?.message || "Internal Server Error");
    }
};

export default ErrorHandler;
