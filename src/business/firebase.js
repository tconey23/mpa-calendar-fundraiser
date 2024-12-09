import { getDatabase } from 'firebase/database';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB6ivFlFvmSWRFbv8ho3zE5tzMTG0i2SyU",
  authDomain: "mpa-calendar-fundraiser.firebaseapp.com",
  databaseURL: "https://mpa-calendar-fundraiser-default-rtdb.firebaseio.com",
  projectId: "mpa-calendar-fundraiser",
  storageBucket: "mpa-calendar-fundraiser.firebasestorage.app",
  messagingSenderId: "1001400612913",
  appId: "1:1001400612913:web:de4f30a823d360c9dabd10",
  measurementId: "G-8LS86RJXPB"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

export { database, app}