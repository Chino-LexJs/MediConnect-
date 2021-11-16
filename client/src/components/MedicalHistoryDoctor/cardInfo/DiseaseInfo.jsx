import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";
import { teal, grey } from "@mui/material/colors";

function DiseaseInfo({ setDisplayed, patientId }) {
  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    getDiseases(patientId);
  }, [patientId]);

  const getDiseases = async (patientId) => {
    const response = await axios.get(
      `/patient/disease/${patientId}`
    );
    setDiseases(response.data.data);
  };

  const handleDelete = async (diseaseId, patientId) => {
    try {
      await axios.delete(
        `/patient/disease/${patientId}?idDisease=${diseaseId}`
      );

      swal({
        icon: "success",
        title: "Enfermedad descartada",
        timer: 1500,
      });

      await getDiseases(patientId);
    } catch (error) {
      alert(error);
      swal({
        icon: "error",
        title: "Server Error",
        timer: 2000,
      });
    }
  };

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      {diseases.length > 0 && (
        <Box sx={{ height: "45vh", overflowY: "scroll" }}>
          {diseases.map((disease) => (
            <Box key={disease.id} sx={{ position: "relative" }}>
              {/* <IconButton
                sx={{ position: "absolute", top: "5px", right: "5px" }}
              >
                <Edit />
              </IconButton> */}
              <IconButton
                onClick={() => handleDelete(disease.id, disease.patientId)}
                sx={{ position: "absolute", top: "0", right: "0" }}
              >
                <HighlightOff sx={{ fontSize: "1.2em" }} />
              </IconButton>
              <Typography variant="h6" color={grey[800]}>
                {disease.name}
              </Typography>
              <Typography variant="body1" marginLeft="0.5em" color={grey[600]}>
                <strong>Fecha del Diagnóstico:</strong> {disease.diagnosis_date}
              </Typography>
              <Typography variant="body1" marginLeft="0.5em" color={grey[600]}>
                <strong>Descripción:</strong> {disease.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <Button
        variant="contained"
        onClick={() =>
          setDisplayed((state) => ({
            ...state,
            disease: true,
          }))
        }
        sx={{
          width: "100%",
          bgcolor: teal[900],
          position: diseases.length > 0 ? "sticky" : "absolute",
          bottom: "10px",
        }}
      >
        Agregar Enfermedad
      </Button>
    </Box>
  );
}

export default DiseaseInfo;
