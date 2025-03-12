import React from 'react';
import "./home.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HomeComp from '../../components/homeComp/HomeComp';

const Home = () => {
    return (
        <div className='home'>
            <Navbar />
            <div className="banner">
                <h1>Welcome to GymBro</h1>
                <p>The one-stop solution for your fitness journey</p>
                
                
            </div>
            <Footer />
        </div>
    )
}

export default Home;
