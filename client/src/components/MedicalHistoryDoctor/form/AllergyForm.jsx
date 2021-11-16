import React from "react";
import axios from "axios";
import swal from "sweetalert";
import { useForm } from "react-hook-form";
import { Grid, InputLabel, TextField, MenuItem, Button } from "@mui/material";
import { teal } from "@mui/material/colors";

function AllergyForm({ patientId, setDisplayed }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `/patient/allergy/${patientId}`,
        data
      );

      if (response.data.data) {
        swal({
          icon: "success",
          title: "Datos guardados exitosamente",
          timer: 1500,
        });
      } else {
        swal({
          icon: "error",
          title: "Ha ocurrido un error",
          text: "Intente de nuevo",
        });
      }
      setDisplayed((state) => ({
        ...state,
        allergy: false,
      }));
    } catch (error) {
      alert(error);
      swal({
        icon: "error",
        title: "Server Error",
      });
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ marginBottom: "2em" }}>
      <Grid item xs={12} marginY="1em">
        <InputLabel sx={{ marginLeft: "5px" }}>Nombre</InputLabel>
        <TextField
          variant="standard"
          error={errors.name ? true : false}
          sx={{ width: "100%" }}
          {...register("name", { required: true })}
        />
      </Grid>
      <Grid item xs={12} marginY="1em">
        <InputLabel sx={{ marginLeft: "5px" }}>Gravedad</InputLabel>
        <TextField
          variant="standard"
          select
          defaultValue=""
          error={errors.severity ? true : false}
          sx={{ width: "100%" }}
          {...register("severity", { required: true })}
        >
          <MenuItem value="1">Baja</MenuItem>
          <MenuItem value="2">Media</MenuItem>
          <MenuItem value="3">Alta</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} marginY="1em">
        <InputLabel sx={{ marginLeft: "5px" }}>Descripción</InputLabel>
        <TextField
          variant="outlined"
          multiline
          rows={4}
          error={errors.description ? true : false}
          sx={{ width: "100%" }}
          {...register("description", { required: true })}
        />
      </Grid>
      <Grid item xs={12} justifyContent="space-around" display="flex">
        <Button
          variant="contained"
          onClick={() =>
            setDisplayed((state) => ({
              ...state,
              allergy: false,
            }))
          }
          sx={{
            width: "40%",
            height: "50px",
            marginY: "1em",
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={{
            width: "40%",
            height: "50px",
            marginY: "1em",
            bgcolor: teal[900],
          }}
        >
          Guardar
        </Button>
      </Grid>
    </Grid>
  );
}

export default AllergyForm;
