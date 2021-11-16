import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Typography } from "@mui/material";
import { teal, grey } from "@mui/material/colors";
import AppBar from "../components/Notification/AppBarNoti";
import CardLabel from "../components/MedicalHistoryPatient/CardLabel";

function MedicalHistoryPatient(props) {
  const [allergies, setAllergies] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const id = props.match.params.id;

  useEffect(() => {
    !allergies.length > 0 && getAllergies(id);
    !diseases.length > 0 && getDiseases(id);
    !prescriptions.length > 0 && getPrescriptions(id);
  }, [id, allergies.length, diseases.length, prescriptions.length]);

  const getAllergies = async (id) => {
    const response = await axios.get(
      `/patient/allergy/${id}`
    );
    setAllergies(response.data.data);
  };

  const getDiseases = async (id) => {
    const response = await axios.get(
      `/patient/disease/${id}`
    );
    setDiseases(response.data.data);
  };

  const getPrescriptions = async (id) => {
    const response = await axios.get(
      `/patient/prescription_drug/${id}`
    );
    setPrescriptions(response.data.data);
  };

  return (
    <Box bgcolor={teal[50]} sx={{ height: "100vh" }}>
      <AppBar />
      <Box sx={{ height: "90vh", padding: "1em" }}>
        <Grid container spacing={2} height="80vh" alignItems="center">
          <Grid item md={4} sm={6} xs={12}>
            <CardLabel title="Alergias" />
            <Box
              sx={{
                padding: "1em",
                height: "50vh",
                background: teal[100],
                borderRadius: "0 0 5px 5px",
                overflowY: "scroll",
                boxShadow: "0 4px 3px rgba(171,171,171,1)",
              }}
            >
              {allergies.length > 0 ? (
                allergies.map((allergy) => (
                  <Box key={allergy.id}>
                    <Typography variant="h6" color={grey[800]}>
                      {allergy.name}
                    </Typography>
                    <Typography variant="body1" color={grey[800]}>
                      <strong>Gravedad:</strong> {allergy.severity}
                    </Typography>
                    <Typography variant="body1" color={grey[800]}>
                      <strong>Descripción:</strong> {allergy.description}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box>
                  <Typography variant="h6" color={grey[800]}>
                    No se ha registrado ninguna Alergia
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <CardLabel title="Enfermedades" />
            <Box
              sx={{
                padding: "1em",
                height: "50vh",
                background: teal[100],
                borderRadius: "0 0 5px 5px",
                overflowY: "scroll",
                boxShadow: "0 4px 3px rgba(171,171,171,1)",
              }}
            >
              {diseases.length > 0 ? (
                diseases.map((disease) => (
                  <Box key={disease.id}>
                    <Typography variant="h6" color={grey[800]}>
                      {disease.name}
                    </Typography>
                    <Typography variant="body1" color={grey[800]}>
                      <strong>Gravedad:</strong> {disease.diagnosis_date}
                    </Typography>
                    <Typography variant="body1" color={grey[800]}>
                      <strong>Descripción:</strong> {disease.description}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box>
                  <Typography variant="h6" color={grey[800]}>
                    No se ha registrado ninguna Enfermedad
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <CardLabel title="Prescripción" />
            <Box
              sx={{
                padding: "1em",
                height: "50vh",
                background: teal[100],
                borderRadius: "0 0 5px 5px",
                overflowY: "scroll",
                boxShadow: "0 4px 3px rgba(171,171,171,1)",
              }}
            >
              {prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                  <Box key={prescription.id}>
                    <Typography variant="h6" color={grey[800]}>
                      {prescription.name}
                    </Typography>
                    <Typography variant="body1" color={grey[800]}>
                      <strong>Gravedad:</strong> {prescription.posology}
                    </Typography>
                    <Typography variant="body1" color={grey[800]}>
                      <strong>Descripción:</strong> {prescription.description}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box>
                  <Typography variant="h6" color={grey[800]}>
                    No se ha registrado ninguna Prescripción
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default MedicalHistoryPatient;
