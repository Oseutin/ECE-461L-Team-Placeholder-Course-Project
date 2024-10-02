import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  /*
  This useEffect and useState serve to show how we will be connecting the front end to the backend. The way that useEffect 
  works is that it just runs the callback message aka it just calls the api. If you are curious, the reason fetch('/api/welcome')
  works is because in the vite.config.js file I set api/ to go to localhost:5000 aka where the Flask backend is located. /api/ WILL ALWAYS
  be needed at the front, the rest of the /welcome will be the endpoint that is written in the Flask backend. 
  */
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('/api/welcome');
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };
    fetchMessage();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Placeholder Login</h2>
        {/* The return message from the API is here*/}
        {message && <p className="text-center text-sm text-gray-600">{message}</p>} 
        <form className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/adduser" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
