import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../static/Item.css";

function Item() {
    const navigate = useNavigate();

    // Safely get stocks from sessionStorage
    const { id } = useParams();
    const storedStocks = sessionStorage.getItem("stocks");
    const stocks = storedStocks ? JSON.parse(storedStocks) : [];
    const user = sessionStorage.getItem("user");
    let stock = stocks.find((item) => item.id === id) || null;

    const [cart_id, setCart] = useState("");
    const [addedToCart, setAddedToCart] = useState(false);
    const [removedItem, setRemoved] = useState(true);

    const add_url = "https://backend-proj-kgy6.onrender.com/add_to_cart";

    async function logout() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('stocks');
        navigate("/");

    }

    const checkItem = (stockId) => {
        navigate(`/item/${stockId}`);
    };

    async function add_to_cart() {
        if (!user) {
            alert("Please Sign in to continue");
            return;
        }
        if (!stock) {
            alert("Unable to locate the item");
            return;
        }

        try {
            const response = await fetch(add_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock, user }),
            });

            if (response.status === 200) {
                setAddedToCart(true);
                setRemoved(false);
                const data = await response.json();
                console.log(data['cart_item']);
                setCart(data['cart_item']);
            }
            else {

            }
        } catch (error) {
            alert("Unable to add item to your cart");
        }
    }

    async function remove_from_cart() {
        if (!user) {
            alert("Please Sign in to continue");
            return;
        }
        if (!cart_id) {
            alert("Unable to locate the item");
            return;
        }

        const remove_url = `https://backend-proj-kgy6.onrender.com/remove_item`;
        try {
            const doc = {user: user, cart_id:cart_id}
            const response = await fetch(remove_url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(doc)
            });

            if (response.status === 200) {
                setAddedToCart(false);
                setRemoved(true);
            }
        } catch (error) {
            alert("Unable to remove item from your cart");
        }
    }

    function toCart() {
        navigate("/cart");
    }

    return (
        <>
            <header className="itemHeader">
                <div className="logo"></div>
                <nav className="infor">
                    <ul>
                        <li>
                            <Link to="/" id="home">
                                <i className="fa-solid fa-house"></i> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/menu">
                                <i className="fa-solid fa-backward"></i> Back To Menu
                            </Link>
                        </li>
                        <li>
                            {user ? (
                                <>
                                    <li>
                                        <Link to="/cart" className="iconz" id="cart">
                                            <i className="fa-solid fa-cart-shopping"></i> Cart
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#logout" onClick={logout}>Logout</a>
                                    </li>
                                    <li>
                                        <Link to="/user" className="iconz" id="user">
                                            <i className="fa-solid fa-user"></i> Hi {user.name}
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <Link href="/" id="log_in">
                                    <i className="fa-solid fa-user" aria-hidden="true"></i> Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </header>

            <div className="itemdisplay">
                {stock ? (
                    <>
                        <img
                            src={`http://localhost:5001/static/${stock.image}`}
                            alt={stock.product}
                            className="image"
                        />
                        <div className="item_info">
                            <p className="item_name">{stock.product}</p>
                            <p className="description">{stock.description}</p>
                            <p className="value">Ksh{stock.value}.00</p>
                            {!addedToCart && (
                                <button id="addtocart" className="cartButton" onClick={add_to_cart}>
                                    Add to cart <i className="fa-solid fa-cart-shopping"></i>
                                </button>
                            )}
                            {addedToCart && <p>Item added to cart</p>}
                            {!removedItem && (
                                <button id="removefromcart" className="cartButton" onClick={remove_from_cart}>
                                    Remove from cart
                                </button>
                            )}
                            {removedItem && <p>Item removed from cart</p>}
                            <button id="checkout" className="cartButton" onClick={toCart}>
                                Checkout
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Item not found</p>
                )}
            </div>

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

export default Item;