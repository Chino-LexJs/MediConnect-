import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";
import { teal, grey } from "@mui/material/colors";

function AllergyInfo({ setDisplayed, patientId }) {
  const [allergies, setAllergies] = useState([]);

  useEffect(() => {
    getAllegies(patientId);
  }, [patientId]);

  const getAllegies = async (patientId) => {
    try {
      const response = await axios.get(
        `/patient/allergy/${patientId}`
      );
      setAllergies(response.data.data);
    } catch (error) {
      alert(error);
    }
  };

  const handleDelete = async (allergyId, patientId) => {
    try {
      await axios.delete(
        `/patient/allergy/${patientId}?idAllergy=${allergyId}`
      );

      swal({
        icon: "success",
        title: "Alergia descartada",
        timer: 1500,
      });

      await getAllegies(patientId);
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
      {allergies.length > 0 && (
        <Box sx={{ height: "45vh", overflowY: "scroll" }}>
          {allergies.map((allergy) => (
            <Box key={allergy.id} sx={{ position: "relative" }}>
              {/* <IconButton
                sx={{ position: "absolute", top: "5px", right: "5px" }}
              >
                <Edit />
              </IconButton> */}
              <IconButton
                onClick={() => handleDelete(allergy.id, allergy.patientId)}
                sx={{ position: "absolute", top: "0", right: "0" }}
              >
                <HighlightOff sx={{ fontSize: "1.2em" }} />
              </IconButton>
              <Typography variant="h6" color={grey[800]}>
                {allergy.name}
              </Typography>
              <Typography variant="body1" marginLeft="0.5em" color={grey[600]}>
                <strong>Gravedad:</strong> {allergy.severity}
              </Typography>
              <Typography variant="body1" marginLeft="0.5em" color={grey[600]}>
                <strong>Descripción:</strong> {allergy.description}
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
            allergy: true,
          }))
        }
        sx={{
          width: "100%",
          bgcolor: teal[900],
          position: allergies.length > 0 ? "sticky" : "absolute",
          bottom: "10px",
        }}
      >
        Agregar Alergia
      </Button>
    </Box>
  );
}

export default AllergyInfo;
