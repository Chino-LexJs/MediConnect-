import React, { useState } from "react";
import {
  Typography,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import PrimarySearchAppBar from "../components/Notification/AppBarNoti";
import { teal, grey } from "@mui/material/colors";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

const AppointmentConfig = (props) => {
  const history = useHistory();

  // Estados
  const [dia1, setDia1] = useState({
    lunes: false,
    day: 1,
    init: "",
    end: "",
  });
  const [dia2, setDia2] = useState({
    martes: false,
    day: 2,
    init: "",
    end: "",
  });
  const [dia3, setDia3] = useState({
    miercoles: false,
    day: 3,
    init: "",
    end: "",
  });
  const [dia4, setDia4] = useState({
    jueves: false,
    day: 4,
    init: "",
    end: "",
  });
  const [dia5, setDia5] = useState({
    viernes: false,
    day: 5,
    init: "",
    end: "",
  });

  // Funciones
  const timeSlots = Array.from(new Array(24 * 2)).map(
    (_, index) =>
      `${index < 20 ? "0" : ""}${Math.floor(index / 2)}:${
        index % 2 === 0 ? "00" : "30"
      }`
  );
  const descomponerHora = (str) => {
    let arr = str.split(":");
    return [parseInt(arr[0]), parseInt(arr[1])];
  };
  const postConfig = async (week) => {

    const response = await axios.post(
      `/doctor/workday/${props.match.params.id}`,
      week
    );
    console.log("postConfig ", response);
  };
  const handleSubmit = () => {
    let week = []; // Se estructura el objeto a enviar
    if (dia1.lunes) {
      let [initHour, initMinutes] = descomponerHora(dia1.init);
      let [endHour, endMinutes] = descomponerHora(dia1.end);
      week.push({
        day: dia1.day,
        init: {
          hour: initHour,
          minutes: initMinutes,
        },
        end: {
          hour: endHour,
          minutes: endMinutes,
        },
      });
    }
    if (dia2.martes) {
      let [initHour, initMinutes] = descomponerHora(dia2.init);
      let [endHour, endMinutes] = descomponerHora(dia2.end);
      week.push({
        day: dia2.day,
        init: {
          hour: initHour,
          minutes: initMinutes,
        },
        end: {
          hour: endHour,
          minutes: endMinutes,
        },
      });
    }
    if (dia3.miercoles) {
      let [initHour, initMinutes] = descomponerHora(dia3.init);
      let [endHour, endMinutes] = descomponerHora(dia3.end);
      week.push({
        day: dia3.day,
        init: {
          hour: initHour,
          minutes: initMinutes,
        },
        end: {
          hour: endHour,
          minutes: endMinutes,
        },
      });
    }
    if (dia4.jueves) {
      let [initHour, initMinutes] = descomponerHora(dia4.init);
      let [endHour, endMinutes] = descomponerHora(dia4.end);
      week.push({
        day: dia4.day,
        init: {
          hour: initHour,
          minutes: initMinutes,
        },
        end: {
          hour: endHour,
          minutes: endMinutes,
        },
      });
    }
    if (dia5.viernes) {
      let [initHour, initMinutes] = descomponerHora(dia5.init);
      let [endHour, endMinutes] = descomponerHora(dia5.end);
      week.push({
        day: dia5.day,
        init: {
          hour: initHour,
          minutes: initMinutes,
        },
        end: {
          hour: endHour,
          minutes: endMinutes,
        },
      });
    }
    postConfig({ week });
    swal({
      title: `Los datos fueron guardados`,
      icon: "success",
      button: "Continuar",
    }).then(() => history.push("/account/profesional"));
  };
  const handleClear = () => {
    setDia1({
      lunes: false,
      day: 1,
      init: "",
      end: "",
    });
    setDia2({
      martes: false,
      day: 2,
      init: "",
      end: "",
    });
    setDia3({
      miercoles: false,
      day: 3,
      init: "",
      end: "",
    });
    setDia4({
      jueves: false,
      day: 4,
      init: "",
      end: "",
    });
    setDia5({
      viernes: false,
      day: 5,
      init: "",
      end: "",
    });
  };

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
            width="70vw"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              marginBottom="1em"
              variant="h4"
              style={{ color: grey[700] }}
            >
              Configuración de agenda
            </Typography>
            {/* -------------------------------------------LUNES------------------------------------------- */}
            <Grid
              width="70vw"
              container
              columnSpacing={4}
              style={{
                displey: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item xs={2}>
                <FormControlLabel
                  style={{ width: "90%" }}
                  control={
                    <Checkbox
                      checked={dia1.lunes}
                      onChange={(e) =>
                        setDia1({
                          ...dia1,
                          [e.target.name]: e.target.checked,
                        })
                      }
                      inputProps={{ "aria-label": "controlled" }}
                      style={{
                        color: teal[800],
                        transform: "scale(1.5)",
                      }}
                    />
                  }
                  label={"Lunes"}
                  labelPlacement="start"
                  name={"lunes"}
                />
              </Grid>
              {/* -------------------------------------------HORA DE INICIO------------------------------------------- */}
              <Grid
                item
                xs={5}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <InputLabel>Hora de inicio</InputLabel>
                <Select
                  name={"init"}
                  value={dia1.init}
                  disabled={!dia1.lunes}
                  onChange={(e) =>
                    setDia1({ ...dia1, [e.target.name]: e.target.value })
                  }
                  sx={{ width: "90%" }}
                >
                  {timeSlots.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              {/* -------------------------------------------HORA DE FIN------------------------------------------- */}
              <Grid
                item
                xs={5}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <InputLabel>Hora de fin</InputLabel>
                <Select
                  name={"end"}
                  value={dia1.end}
                  disabled={!dia1.lunes}
                  onChange={(e) =>
                    setDia1({ ...dia1, [e.target.name]: e.target.value })
                  }
                  sx={{ width: "90%" }}
                >
                  {timeSlots.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>
            {/* -------------------------------------------MARTES------------------------------------------- */}
            <Grid
              width="70vw"
              container
              columnSpacing={4}
              style={{
                displey: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item xs={2}>
                <FormControlLabel
                  style={{ width: "90%" }}
                  control={
                    <Checkbox
                      checked={dia2.martes}
                      onChange={(e) =>
                        setDia2({
                          ...dia2,
                          [e.target.name]: e.target.checked,
                        })
                      }
                      inputProps={{ "aria-label": "controlled" }}
                      style={{
                        color: teal[800],
                        transform: "scale(1.5)",
                      }}
                    />
                  }
                  label={"Martes"}
                  labelPlacement="start"
                  name={"martes"}
                />
              </Grid>
              {/* -------------------------------------------HORA DE INICIO------------------------------------------- */}
              <Grid
                item
                xs={5}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <InputLabel>Hora de inicio</InputLabel>
                <Select
                  name={"init"}
                  value={dia2.init}
                  disabled={!dia2.martes}
                  onChange={(e) =>
                    setDia2({ ...dia2, [e.target.name]: e.target.value })
                  }
                  sx={{ width: "90%" }}
                >
                  {timeSlots.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              {/* -------------------------------------------HORA DE FIN------------------------------------------- */}
              <Grid
                item
                xs={5}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <InputLabel>Hora de fin</InputLabel>
                <Select
                  name={"end"}
                  value={dia2.end}
                  disabled={!dia2.martes}
                  onChange={(e) =>
                    setDia2({ ...dia2, [e.target.name]: e.target.value })
                  }
                  sx={{ width: "90%" }}
                >
                  {timeSlots.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>
            {/* -------------------------------------------MIERCOLES------------------------------------------- */}
            <Grid
              width="70vw"
              container
              columnSpacing={4}
              style={{
                displey: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item xs={2}>
                <FormControlLabel
                  style={{ width: "90%" }}
                  control={
                    <Checkbox
                      checked={dia3.miercoles}
                      onChange={(e) =>
                        setDia3({
                          ...dia3,
                          [e.target.name]: e.target.checked,
                        })
                      }
                      inputProps={{ "aria-label": "controlled" }}
                      style={{
                        color: teal[800],
                        transform: "scale(1.5)",
                      }}
                    />
                  }
                  label={"Miércoles"}
                  labelPlacement="start"
                  name={"miercoles"}
                />
              </Grid>
              {/* -------------------------------------------HORA DE INICIO------------------------------------------- */}
              <Grid
                item
                xs={5}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <InputLabel>Hora de inicio</InputLabel>
                <Select
                  name={"init"}
                  value={dia3.init}
                  disabled={!dia3.miercoles}
                  onChange={(e) =>
                    setDia3({ ...dia3, [e.target.name]: e.target.value })
                  }
                  sx={{ width: "90%" }}
                >
                  {timeSlots.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              {/* -------------------------------------------HORA DE FIN------------------------------------------- */}
              <Grid
                item
                xs={5}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <InputLabel>Hora de fin</InputLabel>
                <Select
                  name={"end"}
                  value={dia3.end}
                  disabled={!dia3.miercoles}
                  onChange={(e) =>
                    setDia3({ ...dia3, [e.target.name]: e.target.value })
                  }
                  sx={{ width: "90%" }}
                >
                  {timeSlots.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>
            {/* -------------------------------------------JUEVES------------------------------------------- */}
            <Grid
              width="70vw"
              container
              columnSpacing={4}
              style={{
                displey: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item xs={2}>
                <FormControlLabel
                  style={{ width: "90%" }}
                  control={
                    <Checkbox
                      checked={dia4.jueves}
                      onChange={(e) =>
                        setDia4({
                          ...dia4,
                          [e.target.name]: e.target.checked,
                        })
                      }
                      inputProps={{ "aria-label": "controlled" }}
                      style={{
                        color: teal[800],
                        transform: "scale(1.5)",
                      }}
                    />
                  }
                  label={"Jueves"}
                  labelPlacement="start"
                  name={"jueves"}
                />
              </Grid>
              {/* -------------------------------------------HORA DE INICIO------------------------------------------- */}
              <Grid
                item
                xs={5}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <InputLabel>Hora de inicio</InputLabel>
                <Select
                  name={"init"}
                  value={dia4.init}
                  disabled={!dia4.jueves}
                  onChange={(e) =>
                    setDia4({ ...dia4, [e.target.name]: e.target.value })
                  }
                  sx={{ width: "90%" }}
                >
                  {timeSlots.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              {/* -------------------------------------------HORA DE FIN------------------------------------------- */}
              <Grid
                item
                xs={5}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <InputLabel>Hora de fin</InputLabel>
                <Select
                  name={"end"}
                  value={dia4.end}
                  disabled={!dia4.jueves}
                  onChange={(e) =>
                    setDia4({ ...dia4, [e.target.name]: e.target.value })
                  }
                  sx={{ width: "90%" }}
                >
                  {timeSlots.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>
            {/* -------------------------------------------VIERNES------------------------------------------- */}
            <Grid
              width="70vw"
              container
              columnSpacing={4}
              style={{
                displey: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item xs={2}>
                <FormControlLabel
                  style={{ width: "90%" }}
                  control={
                    <Checkbox
                      checked={dia5.viernes}
                      onChange={(e) =>
                        setDia5({
                          ...dia5,
                          [e.target.name]: e.target.checked,
                        })
                      }
                      inputProps={{ "aria-label": "controlled" }}
                      style={{
                        color: teal[800],
                        transform: "scale(1.5)",
                      }}
                    />
                  }
                  label={"Viernes"}
                  labelPlacement="start"
                  name={"viernes"}
                />
              </Grid>
              {/* -------------------------------------------HORA DE INICIO------------------------------------------- */}
              <Grid
                item
                xs={5}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <InputLabel>Hora de inicio</InputLabel>
                <Select
                  name={"init"}
                  value={dia5.init}
                  disabled={!dia5.viernes}
                  onChange={(e) =>
                    setDia5({ ...dia5, [e.target.name]: e.target.value })
                  }
                  sx={{ width: "90%" }}
                >
                  {timeSlots.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              {/* -------------------------------------------HORA DE FIN------------------------------------------- */}
              <Grid
                item
                xs={5}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <InputLabel>Hora de fin</InputLabel>
                <Select
                  name={"end"}
                  value={dia5.end}
                  disabled={!dia5.viernes}
                  onChange={(e) =>
                    setDia5({ ...dia5, [e.target.name]: e.target.value })
                  }
                  sx={{ width: "90%" }}
                >
                  {timeSlots.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>
            {/* ----------------------------------------------------------------------------------------------------------- */}

            <Grid
              item
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                marginTop: "3em",
              }}
            >
              <Button
                variant="contained"
                onClick={handleClear}
                sx={{
                  fontSize: "14px",
                  width: "40%",
                  height: "50px",
                  background: teal[900],
                }}
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  fontSize: "14px",
                  width: "40%",
                  height: "50px",
                  background: teal[900],
                }}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default AppointmentConfig;
