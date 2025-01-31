import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyPatients, filterMyPatientsByName } from "../../actions";
import { Box, Grid, Typography } from "@mui/material";
import { teal, grey } from "@mui/material/colors";
import AppBar from "../Notification/AppBarNoti";
import SearchBar from "../SearchBar/SearchBar";
import PatientCard from "../MyPatients/PatientCard";
import { useParams } from "react-router-dom";

function MyPatientsHistory(props) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const myPatients = useSelector((state) => state.myPatients);
  useEffect(() => {
    dispatch(getMyPatients(id));
  }, [dispatch, id]);

  return (
    <Box>
      <AppBar bgColor={teal[900]} color={teal[50]} />
      <Box
        sx={{
          height: "93vh",
          background: teal[100],
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: "95vw",
            height: "85vh",
            background: teal[500],
            borderRadius: "12px",
          }}
        >
          <Grid container justifyContent="flex-end">
            <SearchBar
              id={id}
              filterName={filterMyPatientsByName}
              bgColor={teal[800]}
            />
          </Grid>
          {myPatients.names.length ? (
            <Grid
              container
              rowSpacing={1}
              sx={{ height: "70vh", overflowY: "scroll" }}
            >
              {myPatients.names &&
                myPatients.names.map((patient) => {
                  return (
                    <Grid
                      item
                      key={patient.id}
                      xl={4}
                      md={6}
                      xs={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <PatientCard
                        id={patient.id}
                        idDoctor={id}
                        name={patient.name}
                        lastname={patient.lastname}
                        email={patient.email}
                        dni={patient.dni}
                        address={patient.address}
                        img={patient.imageProfile}
                        historial={true}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          ) : (
            // <Box>
            <Grid
              container
              height="70%"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Typography
                variant="h4"
                color={grey[900]}
                textAlign="center"
                marginBottom="1em"
              >
                No tiene ningún paciente en su lista
              </Typography>
              <Typography variant="h5" color={grey[900]} textAlign="center">
                Espere a que un paciente lo agrege
              </Typography>
              {/* <Typography variant="h4">
                Espera a que un paciente lo agregue */}
              {/* </Typography> */}
            </Grid>
            // {/* </Box> */}
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default MyPatientsHistory;
