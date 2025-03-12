import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { AuthContext } from '../../authContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './routine.css';

const Routines = () => {
    const { user } = useContext(AuthContext);
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const response = await axios.get(`/routines/${user._id}`);
                setRoutines(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load routines');
                setLoading(false);
                console.error('Error fetching routines:', err);
            }
        };
        fetchRoutines();
    }, [user._id]);

    if (loading) return <p>Loading routines...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='routinesView'>
            <Navbar />
            <div className='routinesViewContainer'>
                {routines.length > 0 ? routines.map((r, index) => (
                    <div className='routineViewItem' key={index}>
                        <div className='routineDetails'>
                            <div className='routineName'>{r.name}</div>
                            <div className='routineType'>{r.workout_type}</div>
                            <div className='routinePart'>{r.body_part}</div>
                        </div>
                        {r.link && (
                            <Link to={r.link} style={{ textDecoration: 'none', color: 'black' }}>
                                <div className='routineLink'>Watch Workout Video</div>
                            </Link>
                        )}
                    </div>
                )) : (
                    <p>No routines found.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Routines;
