import React from 'react';
import '../styles/styles.css';
import MyPet from '../components/MyPet';
import Calendar from '../components/Calendar';
import Contact from '../components/Contact';
import WeightChart from '../components/WeightChart';
import HistoriqueMedical from '../components/HistoriqueMedical';

function Profile() {
    return (
        <div style={{marginRight:'15px'}}>
            <div className="profile">
                <Contact />
                <Calendar />
            </div>
            <div className="profile">
                <MyPet />
                <WeightChart />

            </div>
            <div className="profile">
                <HistoriqueMedical />
            </div>
        </div>
    );
}

export default Profile;