import React, { useState, useEffect } from 'react';
import '../static/Menu.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Menu = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [stocks, setStocks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPg] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category') || 'all_items';

    const getUserFromSession = () => {
        try {
            const userData = sessionStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    };
    async function logout() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('stocks');
        navigate("/");

    }

    const user = getUserFromSession();
    console.log(user);
    const stock_url = `https://backend-proj-kgy6.onrender.com/getmenu?page=${page}&category=${category}`;

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://backend-proj-kgy6.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            setResponseMessage(data.message);

            if (response.status === 200) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
                setTimeout(() => {
                    navigate(`/menu?user_id=${data.user.id}`);
                }, 1000);
            }
        } catch (error) {
            setResponseMessage("Login failed. Please try again.");
            console.error("Login error:", error);
        }
    };

    const checkItem = (stockId) => {
        console.log("Clicked");
        console.log(stockId);
        navigate(`/item/${stockId}`);
    };

    const handlePopupClose = () => setIsPopupVisible(false);
    const handlePopupOpen = () => setIsPopupVisible(true);

    useEffect(() => {
        async function fetchStockData() {
            try {
                const response = await fetch(stock_url, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) throw new Error("Failed to fetch stock data");

                const data = await response.json();
                setStocks(data.stocks);
                sessionStorage.setItem("stocks", JSON.stringify(data.stocks));
                setPage(Number(data.page) || 1);
                setTotalPg(Number(data.total_pages) || 1);
            } catch (error) {
                console.error("Error fetching stock data:", error);
                alert("Unable to fetch menu at this time. Please try again later.");
            }
        }
        fetchStockData();
    }, [page, category]);

    const handlePreviousPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const handlePageClick = (newPage) => {
        if (newPage !== page) setPage(newPage);
    };

    return (
        <div>
            <header className='menuHeader'>
                <div id="logo"></div>
                <nav className="infoz">
                    <ul>
                        <li><a href="/" id="home"><i className="fa-solid fa-house"></i> Home</a></li>
                        <li className="dropdown">
                            <button className="category" aria-haspopup="true" aria-expanded="false">
                                Category <i className="fa fa-caret-down"></i>
                            </button>
                            <ul className="dropdown-content">
                                <li><a href="/menu?category=beverages">Beverages</a></li>
                                <li><a href="/menu?category=drinks">Drinks</a></li>
                                <li><a href="/menu?category=foods">Foods</a></li>
                                <li><a href="/menu?category=all_items">All Items</a></li>
                            </ul>
                        </li>
                        <li>
                            {user ? (
                                <>
                                    <li><a href="/cart" className="iconz" id="cart"><i className="fa-solid fa-cart-shopping"></i> Cart</a></li>
                                    <li><a href="#logout" onClick={logout}>Logout</a></li>
                                    <li><a href="/user" className="iconz" id="user"><i className="fa-solid fa-user"></i> Hi {user.name}</a></li>
                                </>
                            ) : (
                                <a href="#login" id="log_in" onClick={handlePopupOpen}>
                                    <i className="fa-solid fa-user"></i> Login
                                </a>
                            )}
                        </li>
                    </ul>
                </nav>
            </header>

            {isPopupVisible && (
                <div id="mysignPopup" className={`popup ${isPopupVisible ? 'active' : ''}`}>
                    <div className="popup-content">
                        <button id="ClosePopup" onClick={handlePopupClose}>Close</button>
                        <h2>Welcome</h2>
                        <p>Please Sign in to continue shopping from our Menu</p>
                        <form id="loginForm" onSubmit={handleLoginSubmit}>
                            <label htmlFor="email">Email Address:</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <input type="submit" value="Sign in" />
                        </form>
                        {responseMessage && <div id="responseMessage">{responseMessage}</div>}
                    </div>
                </div>
            )}

            <div className="rest_of_body">
                <div className="content">
                    {stocks.map((stock) => (
                        <div className="product" key={stock.id}>
                            <img src={`http://localhost:5001/static/${stock.image}`} alt={stock.product} />
                            <h2>{stock.product}</h2>
                            <p>{stock.description}</p>
                            <h6>ksh{stock.value}</h6>
                            <p>{stock.category}</p>
                            <button className="cartButton" onClick={() => checkItem(stock.id)}>
                                <i className="fa-solid fa-cart-plus"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <footer>
                {totalPages > 1 && (
                    <div className="pagination">
                        {page > 1 && <button onClick={handlePreviousPage}>Previous</button>}
                        {[...Array(totalPages)].map((_, index) => (
                            <button key={index} onClick={() => handlePageClick(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                        {page < totalPages && <button onClick={handleNextPage}>Next</button>}
                    </div>
                )}
            </footer>
        </div>
    );
};

export default Menu;
