import { database } from './firebase';
import { ref, get, update } from 'firebase/database';

const studentData = async () => { 
    try {
        const dbRef = ref(database, 'Students');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val(); 
        } else {
            // console.log('No data available');
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
};

const debugUsers = async () => {
    console.clear()
    const stRef = ref(database, 'Students');
    const st = await get(stRef);

    const credRef = ref(database, 'student_credentials');
    const cred = await get(credRef);

    let errorArray = []

    if(cred.exists() && st.exists()){

        st.val().forEach((s) => {
            let user = `${s.FIRST.toLowerCase().replace(' ', '').replace('-', '').replace("'", '')}${s.LAST.toLowerCase().replace(' ', '').replace('-', '').replace("'", '')}`
            let pass = s.Teacher.split(' ')[1].toLowerCase()

            let validate = cred.val().find((st) => st.username === user && st.password === pass)

            !validate && errorArray.push({
                student: s,
                username: user,
                password: pass
            })

        })
    }

    // console.log(errorArray)
}

const studentCredentials = async (password, username) => { 

    // let password, username

    // username = 'maximusconey'
    // password = 'burch'

    try {
        const dbRef = ref(database, 'student_credentials');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            let data = snapshot.val()
            data.forEach((s, i) => {
                // console.log(i, s.username)
            })
            const result = snapshot.val().find((c) => c.password === password && c.username === username)
            if(result) {
                // console.log(result)
                return true
            } else {
                return false
            }
        } else {
            // console.log('No data available');
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
};

const studentDates = async (student) => {
    // console.log(student)
    try {
        const dbRef = ref(database, `Students`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val().find((st) => `${st.FIRST.toLowerCase()} ${st.LAST.toLowerCase()}` === student);  
        } else {
            // console.log('No data available');
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
}

const addStudentDate = async (data) => {

    // console.clear()

    try {
        const dbRef = ref(database, `Students`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            // const dbSt = snapshot.val()[23]
            // console.log(`${dbSt.FIRST.toLowerCase()} ${dbSt.LAST.toLowerCase()}`)
            // console.log(data.student.toLowerCase())

            // console.log(snapshot.val().findIndex((st) => `${st.FIRST.toLowerCase()} ${st.LAST.toLowerCase()}` === data.student.toLowerCase()))
            let foundStudent = snapshot.val().findIndex((st) => `${st.FIRST.toLowerCase()} ${st.LAST.toLowerCase()}` === data.student.toLowerCase())
            
            if(foundStudent !== -1){
                const studentRef = ref(database, `Students/${foundStudent}/dates`)
                await update(studentRef, data.date)
                // console.log(snapshot.val()[foundStudent].dates)
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

const fetchStudentDetail = async (data) => {
    console.log(data)
    try {
        const dbRef = ref(database, `Students`);
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            // console.log(snapshot.val().findIndex((st) => `${st.FIRST.toLowerCase()} ${st.LAST.toLowerCase()}` === data.student.toLowerCase()))
            let foundStudent = snapshot.val().findIndex((st) => `${st.FIRST.toLowerCase()} ${st.LAST.toLowerCase()}` === data)
            
            if(foundStudent !== -1){
                let dates = snapshot.val()[foundStudent].dates
                return dates && Object.values(dates)
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

export { studentData, studentDates, addStudentDate, studentCredentials, debugUsers, fetchStudentDetail};