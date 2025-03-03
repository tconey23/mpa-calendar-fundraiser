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

studentCredentials()

const studentDates = async (student) => {
    console.log(student)
    try {
        const dbRef = ref(database, `Students`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val().find((st) => `${st.FIRST.toLowerCase()} ${st.LAST.toLowerCase()}` === student);  
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

    console.log(data.student.toLowerCase())

    try {
        const dbRef = ref(database, `Students`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            console.log(snapshot.val().findIndex((st) => `${st.FIRST.toLowerCase()} ${st.LAST.toLowerCase()}` === data.student))

            let foundStudent = snapshot.val().findIndex((st) => `${st.FIRST.toLowerCase()} ${st.LAST.toLowerCase()}` === data.student)
            
            if(foundStudent !== -1){
                const studentRef = ref(database, `Students/${foundStudent}/dates`)
                console.log(studentRef)
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