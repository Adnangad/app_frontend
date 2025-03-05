import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import HomePage from './pages/Home';
import Menu from './pages/Menu';
import Item from './pages/Item';
import Cart from './pages/Cart';
import User from './pages/User';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/menu",
    element: <Menu/>
  },
  {
    path: "/item/:id",
    element: <Item></Item>
  },
  {
    path: "cart",
    element: <Cart></Cart>
  },
  {
    path: "user",
    element: <User></User>
  }
]);

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

