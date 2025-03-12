import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { AuthContext } from '../../authContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './meal.css';

const Meal = () => {
    const { user } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await axios.get(`/meals/${user._id}`);
                setMeals(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load meals');
                setLoading(false);
                console.error('Error fetching meals:', err);
            }
        };
        fetchMeals();
    }, [user._id]);

    if (loading) return <p>Loading meals...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='mealsView'>
            <Navbar />
            <div className='mealsViewContainer'>
                {meals.length > 0 ? meals.map((m, index) => (
                    <div className='mealViewItem' key={index}>
                        <div className='mealDetails'>
                            <div className='mealName'>{m.name}</div>
                            <div className='mealDesc'>{m.description}</div>
                            <div className='mealTime'>{m.time} minutes</div>
                            <div className='mealCat'>{m.category}</div>
                        </div>
                        {m.recipe && (
                            <Link to={m.recipe} style={{ textDecoration: 'none', color: 'black' }}>
                                <div className='mealLink'>Watch Recipe Video</div>
                            </Link>
                        )}
                    </div>
                )) : (
                    <p>No meals found.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Meal;