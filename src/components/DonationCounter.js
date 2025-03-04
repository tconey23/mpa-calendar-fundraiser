import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import {Slider} from '@mui/material';
import { studentData } from "../business/apiCalls";

const DonationCounter = () => {

    const [goalAmt, setGoalAmt] = useState(70000)
    const [totalDonated, setTotalDonated] = useState(0)
    const [students, setStudents] = useState([])

    const getStudents = async () => {
        const res = await studentData();
        setStudents(res);
        calculateTotalDonated(res);
      };
    
      const calculateTotalDonated = (studentsData) => {
        let total = 0;
    
        studentsData.map((data) => {
            if (data.dates && data.dates !== "NA") {
                const dateArray = Object.values(data.dates);
                const studentTotal = dateArray.reduce(
                    (acc, dt) => acc + parseFloat(dt.dollarAmount.replace("$", "")),
                    0
                );
                total += studentTotal;
                return { ...data, total: studentTotal };
            }
            return { ...data, total: 0 };
        });
    
        setTotalDonated(total); 
    };

    useEffect(() => {
        getStudents();
      }, []);

  return (
    <Stack direction={'column'} sx={{height: '10%', width: '75%'}} justifyContent={'center'}>
        <Slider 
            size="small"
            value={totalDonated}
            valueLabelDisplay="on"
            aria-label="Small"
            max={goalAmt}
            valueLabelFormat={(value) => `$${value}`}
            marks={[
                { value: goalAmt, label: `$${goalAmt}` }
            ]}
        />
    </Stack>
  );
};

export default DonationCounter;