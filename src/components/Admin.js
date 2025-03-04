import { useEffect, useState } from "react";
import { Box, List, ListItem, Stack, Typography } from "@mui/material";
import { studentData, getBalance } from "../business/apiCalls";

const Admin = () => {
  const [students, setStudents] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0)
  const [paypalBalance, setPayPalBalance] = useState(null)


  const getPaypalBalance = async () => {
    const res = await getBalance()
    setPayPalBalance(res)
  }

  useEffect(() => {
    console.log(paypalBalance)
  }, [paypalBalance])


  useEffect(() => {
    getStudents();
    getPaypalBalance()
  }, []);

  const getStudents = async () => {
    const res = await studentData();
    setStudents(res);
    calculateTotalDonated(res);
  };

  const calculateTotalDonated = (studentsData) => {
    let total = 0;

    const updatedStudents = studentsData.map((data) => {
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

    setStudents(updatedStudents);
    setTotalDonated(total); 
};

  const getStudentTotal = (data) => {
    if (data.dates && data.dates !== "NA") {
      const dateArray = Object.values(data.dates);
      const total = dateArray.reduce(
        (acc, dt) => acc + parseFloat(dt.dollarAmount.replace("$", "")),
        0
      );
      return `$${total.toFixed(2)}`;
    }
    return "$0.00";
  };

  const formatDate = (date) => {

    let dt = new Date(date)
    return dt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: 'numeric',
        minute: 'numeric'
      })
  }

  return (
    <Stack padding={5} direction={"column"} sx={{ height: "80vh", width: "100vw", overflow: "auto" }}>
        <Stack>
            {paypalBalance && 
            <Stack width={500} justifyContent={'flex-start'}>
                <Stack direction={'row'} justifyContent={'flex-start'}>
                    <Typography marginRight={2}>Total Balance: </Typography>
                    <Typography>{`$${paypalBalance.balance.balances[0].total_balance.value}`}</Typography>
                </Stack>
                <Stack direction={'row'} justifyContent={'flex-start'}>
                    <Typography  marginRight={2}>Total Withheld: </Typography>
                    <Typography>{`$${paypalBalance.balance.balances[0].withheld_balance.value}`}</Typography>
                </Stack>
                <Stack direction={'row'} justifyContent={'flex-start'}>
                    <Typography  marginRight={2}>Available Balance: </Typography>
                    <Typography>{`$${paypalBalance.balance.balances[0].available_balance.value}`}</Typography>
                </Stack>
                <Stack direction={'row'} justifyContent={'flex-start'}>
                    <Typography  marginRight={2}>Balance as of: </Typography>
                    <Typography>{`${formatDate(paypalBalance.balance.as_of_time)}`}</Typography>
                </Stack>
                <Stack direction={'row'} justifyContent={'flex-start'}>
                    <Typography  marginRight={2}>Account ID: </Typography>
                    <Typography>{`${paypalBalance.balance.account_id}`}</Typography>
                </Stack>
            </Stack>
            }
        </Stack>
      <Stack>
        <Typography>Total Donated: ${totalDonated.toFixed(2)}</Typography>
      </Stack>
      <List>
        {students.length > 0 &&
        students
          .sort((a, b) => b.total - a.total)
          .map((st, index) => {
                console.log(st.total)
            return (
            <ListItem key={index} direction={"row"} height={100} >
              <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{borderBottom: '1px ridge grey'}}>
                <Box display={"flex"} direction={"row"} width={400}>
                  <Typography>{st.FIRST}</Typography>
                  <Typography marginLeft={1}>{st.LAST}</Typography>
                </Box>
                <Box width={100}>
                  <Typography marginLeft={1}>${st.total.toFixed(2)}</Typography>
                </Box>
              </Stack>
            </ListItem>
          )})}
      </List>
    </Stack>
  );
};

export default Admin;
