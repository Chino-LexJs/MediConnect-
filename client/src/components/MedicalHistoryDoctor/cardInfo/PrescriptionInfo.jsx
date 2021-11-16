import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";
import { teal, grey } from "@mui/material/colors";

function PrescriptionInfo({ setDisplayed, patientId }) {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    getPrescriptions(patientId);
  }, [patientId]);

  const getPrescriptions = async (patientId) => {
    const response = await axios.get(
      `/patient/prescription_drug/${patientId}`
    );
    setPrescriptions(response.data.data);
  };

  const handleDelete = async (prescriptionId, patientId, prescription) => {
    try {
      await axios.delete(
        `/patient/prescription_drug/${patientId}?idPrescription_drug=${prescriptionId}`
      );

      swal({
        icon: "success",
        title: "Prescripción eliminada",
        timer: 1500,
      });

      await getPrescriptions(patientId);
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
      {prescriptions.length > 0 && (
        <Box sx={{ height: "45vh", overflowY: "scroll" }}>
          {prescriptions.map((prescription) => (
            <Box key={prescription.id} sx={{ position: "relative" }}>
              {/* <IconButton
                sx={{ position: "absolute", top: "5px", right: "5px" }}
              >
                <Edit />
              </IconButton> */}
              <IconButton
                onClick={() =>
                  handleDelete(
                    prescription.id,
                    prescription.patientId,
                    prescription
                  )
                }
                sx={{ position: "absolute", top: "0", right: "0" }}
              >
                <HighlightOff sx={{ fontSize: "1.2em" }} />
              </IconButton>
              <Typography variant="h6" color={grey[800]}>
                {prescription.name}
              </Typography>
              <Typography variant="body1" marginLeft="0.5em" color={grey[600]}>
                <strong>Indicaciones:</strong> {prescription.posology}
              </Typography>
              <Typography variant="body1" marginLeft="0.5em" color={grey[600]}>
                <strong>Descripción:</strong> {prescription.description}
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
            prescription: true,
          }))
        }
        sx={{
          width: "100%",
          bgcolor: teal[900],
          position: prescriptions.length > 0 ? "sticky" : "absolute",
          bottom: "10px",
        }}
      >
        Agregar Prescripción
      </Button>
    </Box>
  );
}

export default PrescriptionInfo;
