const { Person, Patient, Doctor, Speciality } = require("../db");
const { Op, INTEGER, NUMBER } = require("sequelize");
const bcrypt = require("bcrypt");

//Encriptar password
function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

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
    healthInsuranceId,
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
    let newPatient = await Patient.create(
      {
        num_member,
      },
      {
        fields: ["num_member"],
      }
    );
    newPatient.setPerson(dni);
    newPatient.setHealthInsurance(healthInsuranceId);
    res.json({ data: [newPerson, newPatient], message: "Patient created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

/****************** getPatient ******************
ej: (method: GET) http://localhost:3001/patient/999

res: {
    "data": {
        "dni": 999,
        "name": "Alex",
        "lastname": "Villanueva",
        "address": "Calle falsa 123",
        "imageProfile": null,
        "email": "alex@hotmail.com",
        "password": "$2b$10$LBvXkX1ihvshYofwbH24JuRVHI5ZP5i6KIpu3ck/uPhuWLZxF4Kci",
        "rol": "Patient",
        "patient": {
            "id": "b6898307-9563-40f5-8a06-0220147d07c6",
            "num_member": 1,
            "personDni": 999,
            "healthInsuranceId": null
        }
    },
    "message": "Paciente de la BD"
}
*/
const getPatient = async (req, res) => {
  let { id } = req.params;
  console.log("DNI:", id);
  id = parseInt(id);
  let person = null;
  try {
    if (id) {
      person = await Person.findOne({
        where: {
          dni: id,
        },
        include: [
          {
            model: Patient,
          },
        ],
      });
      if (!person) {
        return res.json({
          data: person,
          message: `No se econtro Paciente con DNI: ${id}`,
        });
      }
      res.json({ data: person, message: `Paciente con DNI: ${id}` });
    } else {
      res.json({ data: person, message: "No se envio DNI del Paciente" });
    }
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
    let patientsDB = await Person.findAll({
      where: {
        rol: "Patient",
      },
      include: {
        model: Patient,
      },
    });
    res.json({ data: patientsDB, message: "Pacientes de la BD" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: error,
      message: "something goes wrong",
    });
  }
};

const getDoctor = async (req, res) => {
  const { name, id } = req.query;
  try {
    const patient = await Patient.findOne({
      where: {
        id: id,
      },
      include: {
        model: Doctor,
        include: {
          model: Person,
          where: {
            name: {
              [Op.like]: `%${name}%`,
            },
          },
        },
      },
    });
    console.log(patient.dataValues.doctors[0].person);
    let doctors = await patient
      .getDoctors({
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
              [Op.in]: doctors,
            },
          },
        ],
      },
    });
    res.json({
      data: patient.doctors,
      message: "Lista de Doctores de un Paciente",
    });
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
      include: {
        model: Doctor,
        include: [
          {
            model: Speciality,
          },
          {
            model: Person,
          },
        ],
      },
    });
    let doctors = await patient.getDoctors();
    let doctors_persons = [];
    for (let i = 0; i < doctors.length; i++) {
      let person = await Person.findOne({
        where: {
          dni: doctors[i].dataValues.personDni,
        },
        include: {
          model: Doctor,
          include: {
            model: Speciality,
          },
        },
      });
      for (let key in person.dataValues) {
        doctors[i].dataValues[key] = person.dataValues[key];
      }
      doctors_persons.push(doctors[i].dataValues);
    }
    res.json({
      data: patient.dataValues.doctors,
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
  const { id } = req.params; // id de Paciente
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

const deleteDoctor = async (req, res) => {
  const { id } = req.params; // id de Paciente
  const { id_Doctor } = req.body; // id de Doctor
  let patient = await Patient.findOne({
    where: {
      id: id,
    },
  });
  await patient.removeDoctor([id_Doctor]);
  res.json({
    data: patient,
    message: "Doctor borrado de la lista de doctores de paciente",
  });
};

module.exports = {
  getDoctor,
  getDoctors,
  getPatient,
  getPatients,
  createPatient,
  addDoctor,
  deleteDoctor,
};
