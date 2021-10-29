const { Person, Patient, Doctor } = require("../db");

const createPatient = async (req, res) => {
  const {
    dni,
    name,
    lastname,
    address,
    imageProfile,
    email,
    password,
    num_member,
  } = req.body;
  const rol = "Patient";
  try {
    let newPerson = await Person.create(
      {
        dni,
        name,
        lastname,
        address,
        imageProfile,
        email,
        password,
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
    let newPatient = await Patient.create(
      {
        num_member,
      },
      {
        fields: ["num_member"],
      }
    );
    newPatient.setPerson(dni);
    res.json({ data: [newPerson, newPatient], message: "Patient created" });
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
    let patientsDB = await Patient.findAll({
      include: {
        model: Person,
      },
    });

    let patients = [];
    patientsDB.forEach((patient) => {
      let aux = {};
      for (let key in patient.dataValues) {
        if (key != "person") {
          aux[key] = patient.dataValues[key];
        } else {
          for (let key in patient.dataValues.person.dataValues) {
            aux[key] = patient.dataValues.person.dataValues[key];
          }
        }
      }
      patients.push(aux);
    });
    res.json({ data: patients, message: "Pacientes de la BD" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

const getDoctors = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({
      where: {
        id: id,
      },
    });
    let doctors = await patient.getDoctors();
    let doctors_persons = [];
    for (let i = 0; i < doctors.length; i++) {
      let person = await Person.findOne({
        where: {
          dni: doctors[i].dataValues.personDni,
        },
      });
      for (let key in person.dataValues) {
        doctors[i].dataValues[key] = person.dataValues[key];
      }
      doctors_persons.push(doctors[i].dataValues);
    }
    res.json({
      data: doctors_persons,
      message: "Doctores de Paciente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

const addDoctor = async (req, res) => {
  const { id } = req.params;      // id de Paciente
  const { id_Doctor } = req.body; // id de Doctor
  let patient = await Patient.findOne({
    where: {
      id: id,
    },
  });
  await patient.addDoctor([id_Doctor]);
  res.json({
    data: patient,
    message: "Doctor añadido a lista de doctores de paciente",
  });
};

module.exports = { getDoctors, getPatients, createPatient, addDoctor };
