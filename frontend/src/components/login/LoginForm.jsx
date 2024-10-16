import React, { useContext, useState } from "react";
import "../signup/signupform.css";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, goggleAuthProvider } from "../../firebase.config";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SvgComponent from "../SvgComponent";

const SignupForm = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(true);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let userCredential = {
        user: {
          uid: 1,  // Unique identifier for the user
          email: loginEmail,  // User's email
          displayName: "John Doe",  // Display name (can be null if not set)
          emailVerified: true,  // Whether the user's email is verified
          photoURL: "https://example.com/photo.jpg",  // URL to the user's profile photo
          phoneNumber: null,  // User's phone number (if available)
          providerId: "firebase",  // The provider that authenticated the user
          // Additional fields like refreshToken, multi-factor info, etc.
        },
        operationType: "signIn"
      };
      
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      // once user is signed in navigate them to the home page
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      setErrorMessage(errorMessage);
    }
  };

  const handleSignInWithGoggle = async () => {
    try {
      let userCredential = await signInWithPopup(auth, goggleAuthProvider);
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      console.log("user", user);
      // once user is signed in navigate them to the home page
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="signupFormContainer">
      <SvgComponent w={50} h={50} stroke="#202123" />
      <h1>Welcome Back</h1>
      <form onSubmit={handleLogin}>
        <input
          type="loginEmail"
          name="loginEmail"
          id="loginEmail"
          placeholder="login email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />
        <div id="signupPassword">
          <input
            type={showLoginPassword ? "text" : "password"}
            name="loginPassword"
            id="loginPassword"
            placeholder="login password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            autoComplete="password"
          />
          {/* eye icon */}
          <i onClick={() => setShowLoginPassword(!showLoginPassword)}>
            {!showLoginPassword ? (
              <svg
                width={26}
                height={26}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  stroke="#202123"
                  strokeWidth={0.792}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5C5.636 5 2 12 2 12s3.636 7 10 7 10-7 10-7-3.636-7-10-7Z" />
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </g>
                <title>Show Password</title>
              </svg>
            ) : (
              <svg
                width={26}
                height={26}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000"
              >
                <path
                  d="M20 14.834C21.308 13.332 22 12 22 12s-3.636-7-10-7a8.595 8.595 0 0 0-2 .236M12 9a2.995 2.995 0 0 1 3 3M3 3l18 18m-9-6a2.997 2.997 0 0 1-2.959-2.5M4.147 9c-.308.345-.585.682-.828 1C2.453 11.128 2 12 2 12s3.636 7 10 7c.341 0 .675-.02 1-.058"
                  stroke="#202123"
                  strokeWidth={0.768}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <title>Hide Password</title>
              </svg>
            )}
          </i>
        </div>
        <button type="submit">Continue</button>
        {errorMessage.trim() !== " " && <span>{errorMessage}</span>}
      </form>
    </div>
  );
};

export default SignupForm;
