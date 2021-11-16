import React, { useState } from "react";
import axios from "axios";
import { Box, Grid, Button } from "@mui/material";
import { teal } from "@mui/material/colors";
import AppBar from "../components/Notification/AppBarNoti";
import DoctorCard from "../components/newAppointment/Step2/DoctorCard";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import HourCard from "../components/newAppointment/Step2/HourCard";

const hours = [
  {
    value: "08:00",
    available: true,
  },
  {
    value: "08:30",
    available: true,
  },
  {
    value: "09:00",
    available: false,
  },
  {
    value: "09:30",
    available: true,
  },
  {
    value: "10:00",
    available: false,
  },
  {
    value: "10:30",
    available: true,
  },
  {
    value: "11:00",
    available: false,
  },
  {
    value: "11:30",
    available: true,
  },
  {
    value: "12:00",
    available: true,
  },
  {
    value: "12:30",
    available: true,
  },
  {
    value: "13:00",
    available: true,
  },
  {
    value: "13:30",
    available: false,
  },
  {
    value: "14:00",
    available: false,
  },
  {
    value: "14:30",
    available: true,
  },
  {
    value: "15:00",
    available: false,
  },
  {
    value: "15:30",
    available: true,
  },
  {
    value: "16:00",
    available: false,
  },
  {
    value: "16:30",
    available: true,
  },
  {
    value: "17:00",
    available: true,
  },
];

function NewAppointmentStep2(props) {
  const [date, setDate] = useState(new Date());

  const { idDoctor, name, lastname, image, specialities } =
    props.location.state.data;
  console.log();
  const patientId = props.match.params.id;

  const selectHour = (value) => {
    console.log(value);
  };

  const saveShift = async (date) => {
    const response = await axios.post(
      `/doctor/appointment/${idDoctor}?patient=${patientId}`,
      { date }
    );
    console.log(response.data);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: teal[100],
      }}
    >
      <AppBar bgColor={teal[900]} />
      <Box
        sx={{
          height: "90vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          display: "flex",
        }}
      >
        <DoctorCard
          id={idDoctor}
          name={name}
          lastname={lastname}
          imageProfile={image}
          specialities={specialities}
          goBack={props.history.goBack}
        />
        <Grid
          container
          sx={{ width: "70vw", padding: "0.5em 1em", borderRadius: "5px" }}
        >
          <Grid item xs={6}>
            <Calendar value={date} onChange={(value) => setDate(value)} />
          </Grid>
          <Grid
            item
            xs={6}
            flexDirection="column"
            justifyContent="space-between"
            display="flex"
          >
            <Grid container spacing={1}>
              {hours.map((hour, index) => (
                <Grid item key={index} xs={3}>
                  <HourCard hour={hour} selectHour={selectHour} />
                </Grid>
              ))}
            </Grid>
            <Button variant="contained" onClick={() => saveShift(date)}>
              Confirmar Turno
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default NewAppointmentStep2;
