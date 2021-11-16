require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
        database: DB_NAME,
        dialect: "postgres",
        host: DB_HOST,
        port: 5432,
        username: DB_USER,
        password: DB_PASSWORD,
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            // Ref.: https://github.com/brianc/node-postgres/issues/2009
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/mediconnect`,
        { logging: false, native: false }
      );

// const sequelize = new Sequelize(
//   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
//   {
//     logging: false, // set to console.log to see the raw SQL queries
//     native: false, // lets Sequelize know we can use pg-native for ~30% more speed
//   }
// );

async function pool() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
pool();
sequelize.authenticate().then(() => console.log("succes"));
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);

sequelize.models = Object.fromEntries(capsEntries);
// Aca vendrian las relaciones

const {
  Person,
  Doctor,
  Patient,
  Speciality,
  HealthInsurance,
  Notification,
  Conversation,
  Message,
  Allergy,
  Prescription_drug,
  Disease,
  Appointment,
  Work_day,
  Prescription,
} = sequelize.models;

// Uno a muchos
Patient.belongsTo(Person); // crea tabla personDni dentro de la tabla Patient
Person.hasMany(Patient);

// Uno a muchos
Notification.belongsTo(Person); // crea tabla personDni dentro de la tabla Notification
Person.hasMany(Notification);

// Uno a muchos
Doctor.belongsTo(Person);
Person.hasMany(Doctor);

// Uno a muchos
Patient.belongsTo(HealthInsurance);
HealthInsurance.hasMany(Patient);

// Muchos a Muchos
Doctor.belongsToMany(Speciality, { through: "Doctor_Speciality" });
Speciality.belongsToMany(Doctor, { through: "Doctor_Speciality" });

// Muchos a Muchos
Doctor.belongsToMany(HealthInsurance, { through: "Doctor_HealthInsurance" });
HealthInsurance.belongsToMany(Doctor, { through: "Doctor_HealthInsurance" });

// Muchos a Muchos
Doctor.belongsToMany(Patient, { through: "Doctor_Patient" });
Patient.belongsToMany(Doctor, { through: "Doctor_Patient" });

//Uno a muchos
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

//muchos a muchos
Conversation.belongsToMany(Person, { through: "Person_Conversation" });
Person.belongsToMany(Conversation, { through: "Person_Conversation" });

//Uno a muchos
Message.belongsTo(Person);
Person.hasMany(Message);

// Uno a Muchos
Allergy.belongsTo(Patient);
Patient.hasMany(Allergy);

//Uno a Muchos
Prescription_drug.belongsTo(Patient);
Patient.hasMany(Prescription_drug);

// Uno a Muchos
Disease.belongsTo(Patient);
Patient.hasMany(Disease);

// Uno a Muchos
Appointment.belongsTo(Patient);
Patient.hasMany(Appointment);
Appointment.belongsTo(Doctor);
Doctor.hasMany(Appointment);

// Uno a Muchos
Work_day.belongsTo(Doctor);
Doctor.hasMany(Work_day);

// Uno a Muchos
Prescription.belongsTo(Doctor);
Prescription.belongsTo(Patient);
Doctor.hasMany(Prescription);
Patient.hasMany(Prescription);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
