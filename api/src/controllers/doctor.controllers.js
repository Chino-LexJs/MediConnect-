const {
  Person,
  Doctor,
  Patient,
  Speciality,
  HealthInsurance,
  Appointment,
  Work_day,
} = require("../db");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const atob = require("atob");
global.Blob = require("node-blob");
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

//Encriptar password
function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function concat_json(json, json_empty) {
  for (let key in json) {
    if (!Array.isArray(json[key])) {
      json_empty[key] = json[key];
    }
  }
}

function day_name_by_number(day_number) {
  switch (day_number) {
    case 1:
      return "Lu";
    case 2:
      return "Ma";
    case 3:
      return "Mi";
    case 4:
      return "Ju";
    case 5:
      return "Vi";
    case 6:
      return "Sa";
    case 7:
      return "Do";
    default:
      "Lu";
      break;
  }
}

const createDoctor = async (req, res) => {
  let result;
  try {
    if (req.file != undefined) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      result = result.url;
    }
  } catch (error) {
    console.log("Error con cloudinary:", error);
  }
  const {
    dni,
    name,
    lastname,
    address,
    email,
    password,
    enrollment,
    location,
    specialities, // tiene que ser un arreglo de id de specialties o un arreglo vacio
    signature,
  } = req.body;
  const rol = "Doctor";
  if (
    dni &&
    name &&
    lastname &&
    address &&
    email &&
    password &&
    enrollment &&
    location &&
    specialities
  ) {
    try {
      let newPerson = await Person.create(
        {
          dni,
          name,
          lastname,
          address,
          imageProfile: result,
          email,
          password: encryptPassword(password),
          rol,
        },
        {
          fields: [
            "dni",
            "name",
            "lastname",
            "address",
            "imageProfile",
            "email",
            "password",
            "rol",
          ],
        }
      );
      try {
        if (req.file != undefined) {
          await fs.unlink(req.file.path); // Elimina la imagen guardada en api/src/public/uploads
        }
      } catch (error) {
        console.log("Error eliminando la imagen guardada", error);
      }
      const byte_sign = atob(signature);
      const byte_number_sign = new Array(byte_sign.length);
      for (let i = 0; i < byte_sign.length; i++) {
        byte_number_sign[i] = byte_sign.charCodeAt(i);
      }
      const byte_array_sign = new Uint8Array(byte_number_sign);
      const blob = new Blob([byte_array_sign], { type: "" });
      let newDoctor = await Doctor.create(
        {
          enrollment,
          location,
          signature: blob,
        },
        {
          fields: ["enrollment", "location", "signature"],
        }
      );
      await newDoctor.setPerson(dni);
      if (specialities.length != 0) {
        await newDoctor.addSpecialities(specialities);
      }
      res.json({ data: [newPerson, newDoctor], message: "Doctor created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        data: error,
        message: "something goes wrong",
      });
    }
  } else {
    res.status(500).json({
      data: null,
      message: "No se enviaron todos los parametros",
    });
  }
};

const getDoctors = async (req, res) => {
  let { name } = req.query;
  try {
    let doctorsDB;
    if (typeof name != "undefined") {
      name = name.toUpperCase();
      doctorsDB = await Doctor.findAll({
        include: [
          {
            model: Person,
          },
          {
            model: Speciality,
            where: {
              name: { [Op.like]: `%${name}%` },
            },
          },
        ],
      });
    } else {
      doctorsDB = await Doctor.findAll({
        include: [
          {
            model: Person,
          },
          {
            model: Speciality,
          },
        ],
      });
    }

    let doctors = [];
    doctorsDB.forEach((doctor) => {
      let aux = {};
      for (let key in doctor.dataValues) {
        if (key != "person") {
          aux[key] = doctor.dataValues[key];
        } else {
          for (let key in doctor.dataValues.person.dataValues) {
            aux[key] = doctor.dataValues.person.dataValues[key];
          }
        }
      }
      doctors.push(aux);
    });
    res.json({ data: doctors, message: "Doctores de la BD" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

const getDoctor = async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      const doctor = await Person.findOne({
        include: {
          model: Doctor,
          where: {
            id: id,
          },
          include: {
            model: Speciality,
          },
        },
      });
      if (doctor) {
        let json = {};
        concat_json(doctor.dataValues, json);
        concat_json(doctor.dataValues.doctors[0].dataValues, json);
        json["specialities"] =
          doctor.dataValues.doctors[0].dataValues.specialities;
        res.json({
          data: json,
          message: `Datos de Dr ${doctor.name} ${doctor.lastname}`,
        });
      }
      res.json({ data: null, message: `No se encontro Doctor con id ${id}` });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        data: error,
        message: "something goes wrong",
      });
    }
  } else {
    res.status(500).json({
      data: null,
      message: "No se envio id de Doctor",
    });
  }
};

// FUNCION OBSOLETA ver que no la usen en Front y despues BORRARLA
const getPatient = async (req, res) => {
  const { name, id } = req.query;
  try {
    const doctor = await Doctor.findOne({
      where: {
        id: id,
      },
    });
    let patients = await doctor
      .getPatients({
        attributes: ["personDni"],
      })
      .then((element) => element.map((item) => item.personDni));
    let persons = await Person.findAll({
      where: {
        [Op.and]: [
          {
            name: {
              [Op.like]: `%${name}%`,
            },
          },
          {
            dni: {
              [Op.in]: patients,
            },
          },
        ],
      },
    });
    res.json({ data: persons, message: "Lista de Pacientes de un Doctor" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

const getPatients = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient } = req.query;
    const patients = await Person.findAll({
      where: {
        rol: "Patient",
        name: patient ? { [Op.like]: `%${patient}%` } : { [Op.like]: "%%" },
      },
      include: {
        model: Patient,
        required: true,
        include: [
          {
            model: Doctor,
            where: {
              id: id,
            },
          },
          {
            model: HealthInsurance,
          },
        ],
      },
    });
    const dni_linked_doctor = patients.map((patient) => patient.dataValues.dni);
    const patients_unlinked = await Person.findAll({
      where: {
        rol: "Patient",
        dni: {
          [Op.not]: dni_linked_doctor,
        },
        name: patient ? { [Op.like]: `%${patient}%` } : { [Op.like]: "%%" },
      },
      include: {
        model: Patient,
        include: {
          model: HealthInsurance,
        },
      },
    });
    let json = {};
    // Se concatena la informacion en un solo json
    data = patients.map((patient) => {
      json = {};
      concat_json(patient.dataValues, json);
      concat_json(patient.dataValues.patients[0].dataValues, json);
      json["healthInsurance"] =
        patient.dataValues.patients[0].dataValues.healthInsurance;
      return json;
    });
    // Se concatena la informacion en un solo json
    unlinked = patients_unlinked.map((patient) => {
      json = {};
      concat_json(patient.dataValues, json);
      concat_json(patient.dataValues.patients[0].dataValues, json);
      json["healthInsurance"] =
        patient.dataValues.patients[0].dataValues.healthInsurance;
      return json;
    });
    res.json({
      data: data,
      unlinked: unlinked,
      message: "Pacientes de Doctor",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

const validateAppointment = async (date, id_doctor) => {
  let appointment;
  const newDate = new Date(date);
  const doctor = await Doctor.findOne({
    where: {
      id: id_doctor,
    },
    include: {
      model: Work_day,
    },
  });
  const workDays = await doctor.getWork_days();
  workDays.forEach(async (workday) => {
    if (workday.dataValues.day === newDate.getDay()) {
      if (
        workday.init.hour <= newDate.getHours() &&
        newDate.getHours() <= workday.end.hour
      ) {
        appointment = true;
      }
    }
  });
  if (appointment) {
    return (appointment = await Appointment.findOne({
      where: {
        doctorId: id_doctor,
        day: newDate.getDate(),
        month: newDate.getMonth(),
        year: newDate.getFullYear(),
        hour: newDate.getHours(),
        minutes: newDate.getMinutes(),
      },
    }));
  } else {
    return false;
  }
};

const createAppointment = async (req, res) => {
  const { id } = req.params; // id de doctor
  const { patient } = req.query; // id de paciente
  const { date } = req.body; // fecha de turno
  const payment_status = "Pendiente";
  const newDate = new Date(date);
  const appointment = await validateAppointment(newDate, id);
  if (appointment) {
    res.json({
      data: null,
      message: "Ya existe turno con esa fecha",
    });
  } else if (appointment === false) {
    res.json({
      data: null,
      message: "El turno no corresponde a la jornada laboral del Doctor",
    });
  } else {
    try {
      const appointment = await Appointment.create({
        date: date,
        day: newDate.getDate(),
        day_name: day_name_by_number(newDate.getDay()),
        month: newDate.getMonth(),
        year: newDate.getFullYear(),
        hour: newDate.getHours(),
        minutes: newDate.getMinutes(),
        payment_status: payment_status,
      });
      appointment.setPatient(patient);
      appointment.setDoctor(id);
      res.json({
        data: appointment,
        message: "Turno creado satisfactoriamente",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        data: error,
        message: "something goes wrong",
      });
    }
  }
};

const getAppointment = async (req, res) => {
  const { id } = req.params; // id de doctor
  try {
    const appointments = await Appointment.findAll({
      where: {
        doctorId: id,
      },
      include: [
        {
          model: Patient,
          include: {
            model: Person,
          },
        },
        {
          model: Doctor,
          include: {
            model: Person,
          },
        },
      ],
    });
    res.json({
      data: appointments,
      message: "Turnos pendientes del Doctor",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

const getAppointmentByDay = async (req, res) => {
  const { id } = req.params; // id de doctor
  const { day, month, year } = req.body;
  try {
    const appointments = await Appointment.findAll({
      where: {
        doctorId: id,
        day: day,
        month: month,
        year: year,
      },
      include: [
        {
          model: Patient,
          include: {
            model: Person,
          },
        },
        {
          model: Doctor,
          include: {
            model: Person,
          },
        },
      ],
    });
    res.json({
      data: appointments,
      message: `Turnos del Doctor en la fecha ${day}/${month}/${year}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

const createWorkDay = async (req, res) => {
  const { id } = req.params;
  const { week } = req.body;
  await Work_day.destroy({
    where: {
      doctorId: id,
    },
  });
  try {
    const newWorkDay = await Work_day.bulkCreate(week, {
      fields: ["id", "day", "init", "end"],
    });
    newWorkDay.forEach((workday) => {
      workday.setDoctor(id);
    });
    res.json({
      data: newWorkDay,
      message: "Jornada creada",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

const getWorkDays = async (req, res) => {
  const { id } = req.params;
  try {
    const workDays = await Work_day.findAll({
      where: {
        doctorId: id,
      },
    });
    res.json({
      data: workDays,
      message: "Jornadas laborales de Doctor",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

module.exports = {
  createDoctor,
  getDoctor,
  getDoctors,
  getPatient,
  getPatients,
  createAppointment,
  getAppointment,
  getAppointmentByDay,
  createWorkDay,
  getWorkDays,
};
