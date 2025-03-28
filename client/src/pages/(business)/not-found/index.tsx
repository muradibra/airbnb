import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
      <p className="text-lg text-gray-600 mb-6">
        We can't seem to find the page you're looking for.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-[#FF385C] text-white font-semibold rounded-lg shadow-md hover:bg-[#FF385C]/90 transition"
      >
        Go Back to Homepage
      </button>
    </div>
  );
};

export default NotFound;
