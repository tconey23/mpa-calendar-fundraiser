import { database } from './firebase';
import { ref, get } from 'firebase/database';

const studentData = async () => {
    try {
        const dbRef = ref(database, 'Students');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val(); 
        } else {
            console.log('No data available');
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
};

const studentDates = async (student) => {
    try {
        const dbRef = ref(database, `Students`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val().find((st) => `${st.FIRST} ${st.LAST}` === student);  
        } else {
            console.log('No data available');
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
}

export { studentData, studentDates };