// pages/Meals/Meals.jsx
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { AuthContext } from '../../authContext';
import "./meal.css";

const Meals = () => {
    const { user } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [info, setInfo] = useState({
        name: '',
        description: '',
        recipe: '',
        time: '',
        category: 'none'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch meals when the component mounts
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await axios.get(`https://server-seide.vercel.app/api/meals/${user._id}`);
                setMeals(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load meals");
                setLoading(false);
                console.error("Error fetching meals:", err);
            }
        };

        fetchMeals();
    }, [user._id]);

    // Handle form input changes
    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    // Handle meal creation
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newMeal = { ...info, author: user._id };
            const response = await axios.post('https://server-seide.vercel.app/api/meals', newMeal);
            setMeals((prev) => [...prev, response.data]); // Update the meals list
            setInfo({ name: '', description: '', recipe: '', time: '', category: 'none' }); // Reset form
        } catch (err) {
            console.error("Error creating meal:", err);
        }
    };

    // Handle meal deletion
    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://server-seide.vercel.app/api/meals/${id}`);
            setMeals(meals.filter((meal) => meal._id !== id)); // Remove the meal from the list
        } catch (err) {
            console.error("Error deleting meal:", err);
        }
    };

    if (loading) return <p>Loading meals...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='meals'>
            <Navbar />
            <div className="mealsContainer">
                <h1>Your Meal Plans</h1>

                {/* Meal creation form */}
                <form className="mealForm" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="name"
                        placeholder="Meal Name"
                        value={info.name}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        id="description"
                        placeholder="Description"
                        value={info.description}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        id="recipe"
                        placeholder="Recipe Link"
                        value={info.recipe}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        id="time"
                        placeholder="Time (minutes)"
                        value={info.time}
                        onChange={handleChange}
                    />
                    <select id="category" value={info.category} onChange={handleChange}>
                        <option value="none">Select Category</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snack">Snack</option>
                    </select>
                    <button type="submit" className="createMealBtn">Add Meal</button>
                </form>

                {/* Meal list */}
                <div className="mealsList">
                    {meals.length > 0 ? (
                        meals.map((meal) => (
                            <div className="mealItem" key={meal._id}>
                                <h2>{meal.name}</h2>
                                <p>{meal.description}</p>
                                {meal.recipe && (
                                    <a href={meal.recipe} target="_blank" rel="noopener noreferrer">
                                        View Recipe
                                    </a>
                                )}
                                <p>Time: {meal.time} minutes</p>
                                <p>Category: {meal.category}</p>
                                <button className="deleteBtn" onClick={() => handleDelete(meal._id)}>Delete</button>
                            </div>
                        ))
                    ) : (
                        <p>No meals found. Add some!</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Meals;
