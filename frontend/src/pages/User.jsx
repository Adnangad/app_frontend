import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import '../static/User.css';


function User() {
    const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("user")));
    const storedStocks = sessionStorage.getItem("stocks");
    console.log(user.name);
    const stocks = storedStocks ? JSON.parse(storedStocks) : [];
    const navigate = useNavigate();
    const [name, setName] = useState('') || user.name;
    const [location, setLocation] = useState('') || user.location;
    const [password, setPassword] = useState('') || user.password;

    if (!user) {
        alert("Please sign in to continue");
        navigate("/");
    }

    async function logout() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('stocks');
        navigate("/");
        
    }

    async function deleteAccount(event) {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5001/delete_user/${user.id}`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('stocks');
                navigate('/');
            }
        }catch(error) {
            alert("Unable to delete account at this time, please try again later");
        }
    }
    async function update_details(event) {
        event.preventDefault();
        try {
            const doc = {user_id: user.id, name:name, password:password, location:location}
            const response = await fetch(`http://localhost:5001/update_user`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(doc)
            });
            if (response.status === 200) {
                user.name = name;
                user.location = location;
                user.password = password;
                sessionStorage.setItem("user", JSON.stringify(user));
                navigate(0);
            }
            else {
                alert("Unable to update your credentials");
            }
        }catch(error) {
            alert("Problem with the backend server");
        }

        
    }
    const checkItem = (stockId) => {
        navigate(`/item/${stockId}`);
    };




    return (
        <>
            <header className="userheader">
                <div className="logo"></div>
                <section className="info">
                    <ul>
                        <li><a href="/menu">Menu</a></li>
                        <li><a href="/cart"><i className="fa-solid fa-cart-shopping"></i> Cart</a></li>
                        <li><a href="#logout" onClick={logout}>Logout</a></li>
                    </ul>
                </section>
            </header>
            <ul className="vertical">
                <li><a href="#home" className="active"><i className="fa-solid fa-user"></i> My account</a></li>
                <li><a href="/moreinfo">News</a></li>
                <li><a href="https://www.linkedin.com/in/adnan-obuya-9bb70a289/">Contact</a></li>
                <li><a href="/moreinfo">About</a></li>
            </ul>

            <section className="userinfo">
                <h2>Account Overview</h2>
                <div className="address">
                    <h3>ADDRESS BOOK</h3>
                    <p id="prevloc">Shipping Address: {user.location}</p>
                    <p id="prevpass">Password: *****</p>
                    <p>Email: {user.email}</p>
                    <p>Name: {user.name}</p>
                </div>
                <div className="credit">
                    <h3>Update Details</h3>
                    <form id="updateForm" onSubmit={update_details}>
                        <label htmlFor="name">Name:</label>
                        <input type="text" name="name" placeholder="Enter Your name" className="input_bar" value={name} onChange={(e) => setName(e.target.value)}/><br />

                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" placeholder="Enter Password" className="input_bar" value={password} onChange={(e) => setPassword(e.target.value)}/><br />

                        <label htmlFor="location">Location:</label>
                        <input type="text" name="location" placeholder="Please enter your location" className="input_bar" value={location} onChange={(e) => setLocation(e.target.value)}/><br />

                        <input type="submit" value="Submit" className="sub_but" />
                    </form>
                    <div id="sign_upMessage"></div>
                </div>


                <button className="delBut" onClick={deleteAccount}>Delete Account</button>
            </section>
            <div className="content">
                {stocks.map((stock) => (
                    <div className="product" key={stock.id} role="article">
                        <img
                            src={`http://localhost:5001/static/${stock.image}`}
                            alt={stock.product}
                            className="image"
                        />
                        <h2>{stock.product}</h2>
                        <p>{stock.description}</p>
                        <h6>ksh{stock.value}</h6>
                        <p>{stock.category}</p>
                        <button
                            className="cartButton cart"
                            onClick={() => checkItem(stock.id)}
                            aria-label="Add to Cart"
                        >
                            <i className="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default User;
