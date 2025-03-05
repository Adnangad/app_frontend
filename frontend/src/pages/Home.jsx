import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../static/Home.css';

function HomePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showSignupPopup, setShowSignupPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [errormess, setErrormes] = useState(false);
    const navigate = useNavigate();

    const handleLoginClick = (event) => {
        event.preventDefault();
        console.log("Login popup clicked");
        setShowLoginPopup(true);
    };

    const handleSignupClick = (event) => {
        event.preventDefault();
        setShowSignupPopup(true);
    };

    const handleCloseLoginPopup = () => {
        setShowLoginPopup(false);
    };

    const handleCloseSignupPopup = () => {
        setShowSignupPopup(false);
    };
    async function searchLoc(event) {
        event.preventDefault();
        const available_loc = ['Nairobi', 'Kisumu', "Naivasha", 'Eldoret', 'Mombasa'];
        if (!available_loc.includes(location)) {
            setErrormes(true);
        }
        
    }

    const login_url = "https://backend-proj-kgy6.onrender.com/login";
    const signup_url = "https://backend-proj-kgy6.onrender.com/signup";

    async function login(event) {
        event.preventDefault();
        if (!email || !password) {
            alert("Please fill in the Login forms");
        }
        try {
            const response = await fetch(login_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });
            if (response.status === 200) {
                const data = await response.json();
                setMessage(data.message);
                navigate("/menu");
                sessionStorage.setItem('user', JSON.stringify(data.user));
            }
        }
        catch (error) {
            alert("Unable to log you in at this moment");
        }
    }

    async function signup(event) {
        event.preventDefault();
        if (!email || !password || !name) {
            alert("Please fill in the Signup forms");
        }
        try {
            const response = await fetch(signup_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password, name: name })
            });
            if (response.status === 200) {
                const data = await response.json();
                setMessage(data.message);
            }
        }
        catch (error) {
            alert("Unable to add you in at this moment");
        }
    }

    return (
        <>
            <header className="homepageHeader">
                <div className="logo"></div>
                <section className="info">
                    <ul>
                        <li><Link to="/"><i className="fa-solid fa-house"></i>Home</Link></li>
                        <li><Link to="/menu">Menu</Link></li>
                        <li><Link to="https://www.linkedin.com/in/adnan-obuya-9bb70a289/">Contact us</Link></li>
                        <li>
                            <Link to="#login" id="log_in" onClick={handleLoginClick}><i className="fa-solid fa-user"></i>Login</Link>
                            {showLoginPopup && (
                                <div id="myPopup" className={`popup ${showLoginPopup ? 'active' : ''}`}>
                                    <div className="popup-content">
                                        <button id="ClosePopup" onClick={handleCloseLoginPopup}>Close</button>
                                        <p>Welcome</p>
                                        <p>Please Sign in to continue shopping from our Menu</p>
                                        <form id="loginForm" onSubmit={login}>
                                            <label htmlFor="email">Email Address:</label>
                                            <input type="text" name="email" placeholder="Enter email Address" required className="input_bar" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                                            <label htmlFor="password">Password:</label>
                                            <input type="password" name="password" placeholder="Enter Password" required className="input_bar" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <input type="submit" value="Sign in" className="sign_but" />
                                        </form>
                                        <div id="responseMessage">
                                            <p>{message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                        <li>
                            <Link to="#sign_in" id="sign_up" onClick={handleSignupClick}>Sign up</Link>
                            {showSignupPopup && (
                                <div id="mysignPopup" className={`popup ${showSignupPopup ? 'active' : ''}`}>
                                    <div className="popup-content">
                                        <button id="ClosesignPopup" onClick={handleCloseSignupPopup}>Close</button>
                                        <p>Signup</p>
                                        <form id="signupForm" onSubmit={signup}>
                                            <label htmlFor="name">Name:</label>
                                            <input type="text" name="name" placeholder="Enter Your name" required className="input_bar" value={name} onChange={(e) => setName(e.target.value)} /><br />
                                            <label htmlFor="email">Email:</label>
                                            <input type="email" name="email" placeholder="Enter Your Email Address" required className="input_bar" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                                            <label htmlFor="passwd">Password:</label>
                                            <input type="password" name="password" placeholder="Enter A Password" required className="input_bar" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
                                            <label htmlFor="location">Location:</label>
                                            <input type="text" name="location" placeholder="Enter Your current location" required className="input_bar" value={location} onChange={(e) => setLocation(e.target.value)} />
                                            <input type="submit" value="Sign up" className="sign_but" />
                                        </form>
                                        <div id="sign_upMessage"></div>
                                    </div>
                                </div>
                            )}
                        </li>
                    </ul>
                </section>
            </header>
            <section className="large_img">
                <div className="container">
                    <p className="slogan"><b>Where every flavor tells a story</b></p>
                    <div className="search_bar">
                        <form id="locationForm">
                            <input type="text" name="area" placeholder="Enter your location" className="location_search" value={location} onChange={(e) => setLocation(e.target.value)} />
                            <button className="search" onClick={(e) => searchLoc(e)}>Search</button>
                        </form>
                        {errormess && (
                            <div>
                                <p className="errormes">We are yet to reach that location</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <footer id="foot">
                <div className="footer-content-wrapper">
                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <Link to="/moreinfo">Gallery</Link>
                        <Link to="/moreinfo">Feedback</Link>
                        <Link to="/moreinfo">Contact Us</Link>
                    </div>
                    <div className="footer-col">
                        <h3>Useful Links</h3>
                        <Link to="/moreinfo">About Us</Link>
                        <Link to="/moreinfo">Cancellation Policy</Link>
                        <Link to="/moreinfo">Refunds</Link>
                    </div>
                    <div className="footer-col">
                        <h3>Contact Info</h3>
                        <Link to="/moreinfo">Address</Link>
                        <Link to="/moreinfo">Phone</Link>
                        <Link to="/moreinfo">Email</Link>
                    </div>
                    <div className="footer-col">
                        <h3>Follow Us</h3>
                        <Link to="/moreinfo">Facebook</Link>
                        <Link to="/moreinfo">Twitter</Link>
                        <Link to="/moreinfo">Instagram</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default HomePage;
