import React, { useContext, useState, useEffect } from 'react'
import useFetch from '../../useFetch'
import Navbar from "../../components/Navbar/Navbar"
import Footer from "../../components/Footer/Footer"
import "./entry.css"
import { AuthContext } from '../../authContext'
import axios from 'axios'

const Entries = () => {

    const { user } = useContext(AuthContext)
    const [info, setInfo] = useState({
        date: '',
        meals: [],
        routines: []
    })
    const [showForm, setShowForm] = useState(false) // Toggle the form visibility
    const [entries, setEntries] = useState([]) // State to store fetched entries
    const [optionsData, setOptionsData] = useState({ meals: [], routines: [] }) // State for meal and routine options
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch entries and options when the component mounts or an entry is added
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get(`https://server-seide.vercel.app/api/entries/${user._id}`);
                setEntries(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            } catch (err) {
                setError("Failed to load entries");
                setLoading(false);
                console.error("Error fetching entries:", err);
            }
        };

        const fetchOptions = async () => {
            try {
                const response = await axios.get(`/api/entries/fetchMealsAndRoutines/${user._id}`);
                setOptionsData(response.data);
            } catch (err) {
                console.error("Error fetching meal and routine options:", err);
            }
        };

        fetchEntries();
        fetchOptions();
    }, [user._id]);

    // Function to handle input changes
    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }

    // Function to handle multi-select change for meals and routines
    const handleMultiSelectChange = (e) => {
        const { id, options } = e.target;
        const selectedOptions = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setInfo(prev => ({ ...prev, [id]: selectedOptions }));
    }

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newEntry = { ...info, author: user._id }
        try {
            await axios.post('/api/entries', newEntry);
            setShowForm(false);
            setInfo({ date: '', meals: [], routines: [] }); // Reset form fields
            // Refresh entries after submission
            const response = await axios.get(`/api/entries/${user._id}`);
            setEntries(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error submitting entry:", err);
        }
    }

    // Calculate progress based on the number of entries
    const calculateProgress = () => {
        const totalEntries = entries.length;
        const progress = Math.min((totalEntries / 30) * 100, 100); // Assuming 30 entries as target
        return progress;
    }

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    if (loading) return <p>Loading entries...</p>;
    if (error) return <p>{error}</p>;

    return (
        
        <div className='entry'>
            <Navbar />

            <div className="entriesContainer">
                <div className="header">
                    <h1>Your Entries</h1>
                    <button className="createEntryBtn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : "Create New Entry"}
                    </button>
                </div>

                {/* Progress bar */}
                <div className="progressContainer">
                    <h2>Your Progress</h2>
                    <div className="progressBar">
                        <div className="progressFill" style={{ width: `${calculateProgress()}%` }}></div>
                    </div>
                    <p>{calculateProgress()}% Completed</p>
                </div>

                {/* Entry creation form */}
                {showForm && (
                    <div className="formContainer">
                        <form onSubmit={handleSubmit}>
                            <div className="formInput">
                                <label htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={info.date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="formInput">
                                <label htmlFor="meals">Choose Meals</label>
                                <select
                                    id="meals"
                                    multiple
                                    value={info.meals}
                                    onChange={handleMultiSelectChange}
                                >
                                    {optionsData?.meals?.map((meal, index) => (
                                        <option key={index} value={meal._id}>{meal.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="formInput">
                                <label htmlFor="routines">Choose Routines</label>
                                <select
                                    id="routines"
                                    multiple
                                    value={info.routines}
                                    onChange={handleMultiSelectChange}
                                >
                                    {optionsData?.routines?.map((routine, index) => (
                                        <option key={index} value={routine._id}>{routine.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="submitBtn">Submit</button>
                        </form>
                    </div>
                )}

                {/* Displaying entries */}
                <div className="entriesList">
                    {entries.length > 0 ? (
                        entries.map((entry, index) => (
                            <div className="entryItem" key={index}>
                                <h1>{formatDate(entry.date)}</h1>
                                <h2>Meals Taken</h2>
                                <div className="mealsContainer">
                                    {entry?.meals?.map((meal, i) => (
                                        <div className="mealItem" key={i}>{meal.name}</div>
                                    ))}
                                </div>
                                <h2>Exercise Done</h2>
                                <div className="routinesContainer">
                                    {entry?.routines?.map((routine, j) => (
                                        <div className="routineItem" key={j}>{routine.name}</div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No entries found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Entries
