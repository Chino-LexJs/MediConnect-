import React, { useState, useEffect } from "react";
import PrimarySearchAppBar from "../components/Notification/AppBarNoti";
import { Typography, Button, Grid, Box } from "@mui/material";
import { teal, grey } from "@mui/material/colors";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

const columnas = [
  { name: "Fecha", selector: (row) => row["date"] },
  { name: "Hora", selector: (row) => row["hour_long"], sortable: true },
  {
    name: "Nombre",
    selector: (row) => row["name"],
    sortable: true,
  },
  { name: "Apellido", selector: (row) => row["lastname"], sortable: true },
  {
    name: "Estado de pago",
    selector: (row) => row["payment_status"],
    sortable: true,
  },
];

const ScheduleDoctor = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getAppointments = async () => {
      const response = await axios.get(
        `/doctor/appointment/${props.match.params.id}`
      );
      let refactor = response.data.data.map((e) => {
        return {
          name: e.patient.person.name,
          lastname: e.patient.person.lastname,
          date: e.date,
          hour_long: e.hour_long,
          payment_status: e.payment_status,
        };
      });
      setData(refactor);
    };
    getAppointments();
  }, [props.match.params.id]);

  return (
    <>
      <Box sx={{ background: grey[50] }}>
        <PrimarySearchAppBar />
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            height="70vh"
            rowSpacing={1}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              align={"center"}
              variant="h4"
              style={{ color: grey[700] }}
            >
              Lista de turnos
            </Typography>
            {data.length ? (
              <Grid
                style={{
                  marginTop: "1em",
                  width: "80%",
                  background: grey[100],
                  border: "solid 0.0005px ",
                  borderColor: teal[100],
                  fontFamily: "Roboto",
                }}
              >
                <DataTable
                  columns={columnas}
                  data={data}
                  title={""}
                  fixedHeader
                  fixedHeaderScrollHeight="400px"
                />
              </Grid>
            ) : (
              <Grid
                // backgroundColor="red"
                height="30vh"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  align={"center"}
                  variant="h6"
                  style={{ color: grey[700] }}
                >
                  No tiene ningún turno pendiente
                </Typography>
              </Grid>
            )}

            <Link
              to={`/account/appointment-config/${props.match.params.id}`}
              style={{ textDecoration: "none", width: "80%" }}
            >
              <Button
                variant="contained"
                sx={{
                  marginTop: "1em",
                  fontSize: "14px",
                  width: "100%",
                  height: "50px",
                  background: teal[900],
                }}
              >
                Configurar agenda
              </Button>
            </Link>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default ScheduleDoctor;
