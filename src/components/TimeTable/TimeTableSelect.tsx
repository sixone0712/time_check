import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
import { IconButton, TextField } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

export type TimeTableSelectProps = {
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

export default function TimeTableSelect({
  date,
  setDate,
}: TimeTableSelectProps): JSX.Element {
  const addMonth = () => {
    if (date) {
      setDate((prev) => dayjs(prev).add(1, 'month').toDate());
    }
  };

  const subtractMonth = () => {
    if (date) {
      setDate((prev) => dayjs(prev).subtract(1, 'month').toDate());
    }
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <div className="date-picker">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            size="large"
            onClick={subtractMonth}
          >
            <ArrowCircleLeftIcon fontSize="inherit" />
          </IconButton>
          <DatePicker
            openTo="month"
            views={['year', 'month']}
            label="Year, month"
            inputFormat="YYYY/MM"
            value={date}
            onChange={(newValue) => {
              setDate(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            size="large"
            onClick={addMonth}
          >
            <ArrowCircleRightIcon fontSize="inherit" />
          </IconButton>
        </div>
      </LocalizationProvider>
    </div>
  );
}
