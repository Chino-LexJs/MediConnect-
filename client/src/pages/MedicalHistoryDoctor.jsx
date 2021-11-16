import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Typography } from "@mui/material";
import { teal } from "@mui/material/colors";
import AppBar from "../components/Notification/AppBarNoti";
import PatientData from "../components/MedicalHistoryDoctor/PatientData";
import AllergyForm from "../components/MedicalHistoryDoctor/form/AllergyForm";
import PrescriptionForm from "../components/MedicalHistoryDoctor/form/PrescriptionForm";
import DiseaseForm from "../components/MedicalHistoryDoctor/form/DiseaseForm";
import AllergyInfo from "../components/MedicalHistoryDoctor/cardInfo/AllergyInfo";
import DiseaseInfo from "../components/MedicalHistoryDoctor/cardInfo/DiseaseInfo";
import PrescriptionInfo from "../components/MedicalHistoryDoctor/cardInfo/PrescriptionInfo";

function MedicalHistoryDoctor(props) {
  const [patientData, setPatientData] = useState({});
  const [displayed, setDisplayed] = useState({
    allergy: false,
    disease: false,
    prescription: false,
  });

  const query = new URLSearchParams(props.location.search);
  const patientId = query.get("patient");
  // const doctorId = props.match.params.id;

  useEffect(() => {
    const getPatient = async (patientId) => {
      const response = await axios.get(
        `/patient/${patientId}`
      );
      const data = await response.data.data;
      setPatientData({
        ...patientData,
        id: data.id,
        name: data.name,
        lastname: data.lastname,
        dni: data.personDni,
        image: data.imageProfile,
      });
    };
    getPatient(patientId);
  }, [patientId, patientData]);

  return (
    <Box>
      <AppBar bgColor={teal[900]} />
      <Box sx={{ height: "90vh" }}>
        <PatientData data={patientData} />
        <Grid container columnSpacing={1} rowSpacing={2} padding="1em">
          <Grid item lg={4} sm={6} xs={12}>
            <Box bgcolor={teal[900]} sx={{ borderRadius: "5px" }}>
              <Typography
                variant="h5"
                textAlign="center"
                color={teal[50]}
                paddingY=".3em"
              >
                Alergias
              </Typography>
            </Box>
            <Box
              height="50vh"
              bgcolor={teal[50]}
              paddingX="0.3em"
              borderRadius="0 0 10px 10px"
            >
              {displayed.allergy ? (
                <AllergyForm
                  patientId={patientId}
                  setDisplayed={setDisplayed}
                />
              ) : (
                <AllergyInfo
                  patientId={patientId}
                  setDisplayed={setDisplayed}
                />
              )}
            </Box>
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <Box bgcolor={teal[900]} sx={{ borderRadius: "5px" }}>
              <Typography
                variant="h5"
                textAlign="center"
                color={teal[50]}
                paddingY=".3em"
              >
                Enfermedad
              </Typography>
            </Box>
            <Box
              height="50vh"
              bgcolor={teal[50]}
              paddingX="0.5em"
              borderRadius="0 0 10px 10px"
            >
              {displayed.disease ? (
                <DiseaseForm
                  patientId={patientId}
                  setDisplayed={setDisplayed}
                />
              ) : (
                <DiseaseInfo
                  patientId={patientId}
                  setDisplayed={setDisplayed}
                />
              )}
            </Box>
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <Box bgcolor={teal[900]} sx={{ borderRadius: "5px" }}>
              <Typography
                variant="h5"
                textAlign="center"
                color={teal[50]}
                paddingY=".3em"
              >
                Prescripción
              </Typography>
            </Box>
            <Box
              height="50vh"
              bgcolor={teal[50]}
              paddingX="0.5em"
              borderRadius="0 0 10px 10px"
            >
              {displayed.prescription ? (
                <PrescriptionForm
                  patientId={patientId}
                  setDisplayed={setDisplayed}
                />
              ) : (
                <PrescriptionInfo
                  patientId={patientId}
                  setDisplayed={setDisplayed}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default MedicalHistoryDoctor;
