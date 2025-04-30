import React from 'react';
import {Outlet , useLocation} from "react-router-dom";
import Navbar from '../BasicPage/Navbar';
import Footer from '../BasicPage/Footer';

const Layout = () => {
    return (
        <main>

            <Navbar/>

            <Outlet/>
            <Footer/>
        </main>
    );
}

export default Layout;
