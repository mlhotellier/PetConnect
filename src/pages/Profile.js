import React from 'react';
import '../styles/styles.css';
import MyPet from '../components/MyPet';
import Calendar from '../components/Calendar';
import Contact from '../components/Contact';
import User from '../components/User';
import WeightChart from '../components/WeightChart';
import HistoriqueMedical from '../components/HistoriqueMedical';
import PetFood from '../components/PetFood';

function Profile({isLogged}) {
    return (
        <div style={{marginRight:'15px'}}>
            <div className="profile">
                <User isLogged={isLogged} />
            </div>
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
                <PetFood />
            </div>
        </div>
    );
}

export default Profile;