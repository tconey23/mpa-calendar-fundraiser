import { database } from './firebase';
import { ref, get, update } from 'firebase/database';

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

const studentCredentials = async (password, username) => { 

    // let password, username

    // username = 'maximusconey'
    // password = 'burch'

    try {
        const dbRef = ref(database, 'student_credentials');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const result = snapshot.val().find((c) => c.password === password && c.username === username)
            if(result) {
                console.log(result)
                return true
            } else {
                return false
            }
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

const addStudentDate = async (data) => {

    console.log(data)

    try {
        const dbRef = ref(database, `Students`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            console.log(snapshot.val().findIndex((st) => `${st.FIRST} ${st.LAST}` === data.student))
            let foundStudent = snapshot.val().findIndex((st) => `${st.FIRST} ${st.LAST}` === data.student)
            
            if(foundStudent !== -1){
                const studentRef = ref(database, `Students/${foundStudent}/dates`)
                await update(studentRef, data.date)
                return 'success'
            }
            
        } else {
            console.log('No data available');
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }

}

export { studentData, studentDates, addStudentDate, studentCredentials };