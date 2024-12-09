import { Suspense, useState } from 'react';
import { Stack } from '@mui/material';
import { styled } from '@mui/system';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import ProgressCircle from './ProgressCircle';

const Calendar = ({ disabledDates, setSelectedDate }) => {
    const [date] = useState(new Date().toLocaleDateString());

    const formatDate = (date) => dayjs(date).format('MM-DD-YYYY');

    const getCustomTitle = (date) => {
        const formattedDate = formatDate(date);
        const matchingDate = disabledDates?.find(
            (dt) => dt[0] === formattedDate
        );
        return matchingDate ? matchingDate[1] : null;
    };

    const handleDateSelect = (val) => {
        const selectedDate = formatDate(val.$d);
        console.log(getCustomTitle(selectedDate))
        setSelectedDate({
            date: selectedDate,
            reserved: getCustomTitle(selectedDate)
        });
    };

    const StyledSpecialDay = styled('div')(({ theme }) => ({
        color: 'white',
        backgroundColor: 'green',
        borderRadius: '50%',
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    }));

    return (
        <Stack direction="column" sx={{ height: '98vh', width: '100vw' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Suspense fallback={<ProgressCircle />}>
                    <DateCalendar
                        views={['day']}
                        value={dayjs(date)}
                        onChange={(newValue) => handleDateSelect(newValue)}
                        slotProps={{
                            day: (dayProps) => {
                                const isSpecialDate = disabledDates?.some(
                                    (disabledDate) =>
                                        disabledDate[0] ===
                                    formatDate(dayProps.day)
                                );
                                
                                const title = getCustomTitle(dayProps.day);
                                
                                return {
                                    ...dayProps,
                                    children: isSpecialDate ? (
                                        <StyledSpecialDay title={title}>
                                            {dayProps.day.format('D')}
                                        </StyledSpecialDay>
                                    ) : (
                                        dayProps.children
                                    ),
                                };
                            },
                        }}
                    />
                </Suspense>
            </LocalizationProvider>
        </Stack>
    );
};

export default Calendar;
