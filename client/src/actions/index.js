import axios from "axios";
import types from "./types.js";
import swal from "sweetalert";

export const getDoctors = (id_patient) => {
  return async function (dispatch) {
    const response = await axios.get(`/patient/doctors/${id_patient}`);
    dispatch({ type: types.GET_DOCTORS, payload: response });
  };
};

export const getUser = (user) => {
  return async function (dispatch) {
    const response = await axios.post(`/login`, user, {
      withCredentials: true,
    });
    sessionStorage.setItem("user", JSON.stringify(response.data));
    dispatch({ type: types.GET_USER_LOGIN, payload: response.data });
  };
};

export const postDoctor = (payload, history) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(`/doctor`, payload);
      swal({
        title: `El registro fue exitoso`,
        icon: "success",
        button: "Continuar",
      }).then(() => history.push("/login"));
      return dispatch({
        type: types.POST_DOCTOR,
        payload: response.data,
      });
    } catch (error) {
      swal({
        title: "No se puedo registrar el usuario",
        dangerMode: true,
        icon: "error",
        button: "Reintentar",
      }).then(() => history.push("/register/doctor"));
    }
  };
};

export function getSpecialities() {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/specialities`);
      return dispatch({
        type: types.GET_SPECIALITIES,
        payload: response.data,
      });
    } catch (error) {
      console.log("Actions - getSpecialities---> ", error);
    }
  };
}

export const postPatient = (payload, history) => {
  return async function (dispatch) {
    try {
      await axios.post(`/patient`, payload);
      swal({
        title: `El registro fue exitoso`,
        icon: "success",
        button: "Continuar",
      }).then(() => history.push("/login"));
      return dispatch({
        type: types.POST_PATIENT,
        payload,
      });
    } catch (error) {
      swal({
        title: "No se puedo registrar el usuario",
        dangerMode: true,
        icon: "error",
        button: "Reintentar",
      }).then(() => history.push("/register/patient"));
    }
  };
};

export const getHealthInsurances = () => {
  return async function (dispatch) {
    try {
      let healthInsurances = await axios.get(`/healthinsurance`);
      return dispatch({
        type: types.GET_HEALTHINSURANCES,
        payload: healthInsurances.data,
      });
    } catch (error) {
      alert(error);
    }
  };
};

export const getMyDoctors = (payload) => {
  return async function (dispatch) {
    try {
      let myDocs = await axios.get(`/patient/doctors/${payload}`);
      return dispatch({
        type: types.GET_MY_DOCTORS,
        payload: myDocs.data,
      });
    } catch (error) {
      alert(error);
    }
  };
};

export const postMyDoctor = (payload, id_Doctor) => {
  return async function (dispatch) {
    try {
      await axios.post(`/patient/doctors/${payload}`, {
        id_Doctor: id_Doctor,
      });
      swal({
        title: "Se acepto la solicitud",
        icon: "success",
        timer: 2000,
      });
      return dispatch({
        type: types.POST_MY_DOCTOR,
        id_Doctor,
      });
    } catch (error) {
      alert(error); // CORREGIR! ----> EL MENSAJE A MOSTRAR TIENE QUE VENIR DEL BACK
    }
  };
};

export const filterMyPatientsByName = (patientName, id_doctor) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(
        `/doctor/patients/${id_doctor}?patient=${patientName}`
      );
      // console.log("action filterMyPatient", response);
      if (response.data.data.length) {
        return dispatch({
          type: types.FILTER_MY_PATIENTS_BY_NAME,
          payload: response.data,
        });
      } else {
        swal({
          title: "No tiene asociado un paciente con ese nombre",
          icon: "info",
          button: "Continuar",
        });
      }
    } catch (error) {
      alert(error);
    }
  };
};

// VER, SI NO SE USA, BORRARLA
export const filterSpecialities = (optionSelected) => {
  return {
    type: types.FILTER_SPECIALITIES,
    payload: optionSelected,
  };
};

// Filtra por especialidad en doctores asociados al paciente
export const filterSpecialitiesMyDoctors = (optionSelected) => {
  return {
    type: types.FILTER_SPECIALITIES_MY_DOCTORS,
    payload: optionSelected,
  };
};

// Filtra por especialidad en doctores NO asociados al paciente
export const filterSpecialitiesAllDoctors = (optionSelected) => {
  return {
    type: types.FILTER_SPECIALITIES_ALL_DOCTORS,
    payload: optionSelected,
  };
};

//Filtra por nombres en el estado de doctores NO asociados al paciente
export const filterDoctorsByName = (nameDoc, idPatient) => {
  return async function (dispatch) {
    try {
      let response = await axios.get(
        `/patient/doctors/${idPatient}?doctor=${nameDoc}`
      );
      return dispatch({
        type: types.FILTER_DOCTORS_BY_NAME,
        payload: response,
      });
    } catch (error) {
      alert(error);
    }
  };
};

//Filtra por nombres en el estado de doctores asociados al paciente
export const filterMyDoctorsByName = (nameDoc, idPatient) => {
  return async function (dispatch) {
    try {
      let response = await axios.get(
        `/patient/doctors/${idPatient}?doctor=${nameDoc}`
      );
      return dispatch({
        type: types.FILTER_MY_DOCTORS_BY_NAME,
        payload: response,
      });
    } catch (error) {
      alert(error);
    }
  };
};

/*
Para eliminar un Doctor a lista de Doctores de un Paciente
Se envia por params el id del Paciente
Y se envia por query el id del Doctor
*/
export const deleteDoctor = (id, id_Doctor) => {
  return async function (dispatch) {
    try {
      const response = await axios.delete(
        `/patient/doctors/${id}?id_Doctor=${id_Doctor}`
      );
      return dispatch({
        type: types.DELETE_DOCTOR,
        payload: response,
      });
    } catch (error) {
      swal({
        title: `${error}`,
        icon: "info",
        button: "Continuar",
      });
    }
  };
};

export const getNotifications = (idDoctor) => {
  return async function (dispatch) {
    try {
      const notif = await axios.get(
        `/notifications?idDoctor=${idDoctor}&type=solicitud`
      );
      return dispatch({
        type: types.GET_NOTIFICATIONS,
        payload: notif.data,
      });
    } catch (error) {
      alert(error);
    }
  };
};

export const deleteNotifications = (id) => {
  return {
    type: types.DELETE_NOTIFICATIONS,
    payload: id,
  };
};

export const rejectNotification = (id) => {
  return async function (dispatch) {
    try {
      await axios.put(`/notifications/reject`, { idPatient: id });
      alert("Se rechazo la notificacion");
      return {
        type: types.REJECT_NOTIFICATION,
        payload: id,
      };
    } catch (error) {
      alert(error);
    }
  };
};

export const getMyPatients = (idDoctor) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/doctor/patients/${idDoctor}`);
      return dispatch({
        type: types.GET_MY_PATIENTS,
        payload: response.data,
      });
    } catch (error) {
      alert(error);
    }
  };
};

export const getContact = (email, rol) => {
  return {
    type: types.GET_CONTACT,
    payload: email,
    rol,
  };
};

export const getMessage = (dniSender, dniReciver) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(
        `/chat?dniSender=${dniSender}&dniReciver=${dniReciver}`
      );
      return dispatch({
        type: types.GET_MESSAGE,
        payload: response.data,
      });
    } catch (error) {
      alert(error);
    }
  };
};

export const getConversations = (dniSender, dniReciver)=>{ 
      return async function(dispatch){
        const response = await axios.get(`/chat/conversation?dniSender=${dniSender}&dniReciver=${dniReciver}`)
        return dispatch({
          type: types.GET_CONVERSATION,
          payload: response.data
        })
      }
}

export const getNotificationsMessage = (dniReciver) => {
  return async function (dispatch) {
    const response = await axios.get(`/chat/notifications?dniReciver=${dniReciver}&type=message`)
    return dispatch({
      type: types.GET_NOTIFICATIONS_MESSAGE,
      payload: response.data
    })
  } 
}

export const deleteNotificationChat = (personDni) => {
  return async function (dispatch) {
    await axios.delete(`/chat/notifications/delete?personDni=${personDni}&type=message`)
    return dispatch({
      type: types.DELETE_NOTIFICATION_CHAT
    })
  }
}
