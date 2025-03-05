import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../static/Cart.css";

function Cart() {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("user")));
    const navigate = useNavigate();

    async function logout() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('stocks');
        navigate("/");

    }
    
    useEffect(() => {
        if (!user) {
            alert("Sign in to continue");
            navigate("/");
            return;
        }

        let isMounted = true;

        const fetchCart = async () => {
            try {
                const response = await fetch(`http://localhost:5001/cart/${user.id}`);
                if (!isMounted) return;

                if (response.ok) {
                    const data = await response.json();
                    setCart(Object.entries(data.grouped_carts || {}));
                    console.log(Object.entries(data.grouped_carts));
                    setTotalPrice(data.total_price || 0);
                }
            } catch (error) {
                console.error("Unable to fetch cart:", error);
            }
        };

        fetchCart();
        return () => { isMounted = false; };
    }, [user, navigate]);

    const updateCart = async (url, method, body, updateFunc) => {
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const data = await response.json();
                updateFunc(data);
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };
    async function removeFromCart(cart_id) {
        if (!user) {
            alert("Please Sign in to continue");
            return;
        }
        if (!cart_id) {
            alert("Unable to locate the item");
            return;
        }

        const remove_url = `http://localhost:5001/remove_item`;
        try {
            const doc = {user: user, cart_id:cart_id}
            const response = await fetch(remove_url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(doc)
            });

            if (response.status === 200) {
                navigate(0);
            }
        } catch (error) {
            alert("Unable to remove item from your cart");
        }        
    };


    async function addToCart(stock) {
        if (!user) {
            alert("Please Sign in to continue");
            return;
        }
        if (!stock) {
            alert("Unable to locate the item");
            return;
        }

        try {
            console.log(stock);
            const add_url = "http://localhost:5001/add_to_cart";
            const response = await fetch(add_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock, user }),
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log(data['cart_item']);
                navigate(0);
            }
        } catch (error) {
            alert("Unable to add item to your cart");
        }
    }

    return (
        <div className="cart-page">
            <header className="cart-header">
                <div className="logo"></div>
                <nav className="nav-bar">
                    <ul>
                        <li><a href="/menu">Menu</a></li>
                        <li><a href="/user">Account</a></li>
                        <li><a href="#logout" onClick={logout}>Logout</a></li>
                    </ul>
                </nav>
            </header>
            <div className="cart-content">
                <div className="cart-container">
                    <h2>Your Shopping Cart</h2>
                    {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cart.map(([name, item]) => (
                            <div key={item.details.id} className="cart-item">
                                <img src={`http://localhost:5001/static/${item.details.image}`} alt={name} />
                                <div className="cart-item-info">
                                    <h4>{name}</h4>
                                    <p>Price: Ksh {item.details.price}</p>
                                    <p>Quantity: {item.count}</p>
                                    <div className="cart-actions">
                                        <button onClick={() => removeFromCart(item.details.id)}>-</button>
                                        <button onClick={() => addToCart({'product':name, 'value':item.details.price, 'image':item.details.image})}>+</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="payment-section">
                    <h3>Subtotal: Ksh {totalPrice}</h3>
                    <form action="/payment" method="post" className="payment-form">
                        <label>Phone Number:</label>
                        <input type="number" name="phone" required placeholder="Enter phone number" /><br />
                        <label>First Name:</label>
                        <input type="text" name="name" required placeholder="Enter name" /><br />
                        <input type="hidden" name="amount" value={totalPrice} />
                        <button type="submit" className="checkout-button">Checkout</button>
                    </form>
                </div>
            </div>
        </div>

    );
}

export default Cart;