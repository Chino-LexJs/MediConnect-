const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const loginRouter = require("./routes/login");
const patientRouter = require("./routes/patients");
const doctorRouter = require("./routes/doctor");
const sendEmail = require("./routes/sendEmail");
const prescriptionRouter = require("./routes/prescription");
const { Person, Patient, Doctor } = require("./db");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const specialitiesRouter = require("./routes/specialities");
const healthinsuranceRouter = require("./routes/healthinsurance");
const flash = require("connect-flash");
const notification = require("./routes/notifications");
const chatMessage = require("./routes/chatMessage");
const payments = require("./routes/mercadopago");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
require("./db.js");

// comment
//Para poder comparar con la password encrypt
function comparePassword(password, passwordDB) {
  return bcryptjs.compareSync(password, passwordDB);
}

//Configuración de estrategia local
passport.use(
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, username, password, done) {
      try {
        let user = await Person.findOne({
          where: {
            email: username,
          },
        });
        if (user !== null) {
          //Si existe usera con ese email
          if (comparePassword(password, user.password)) {
            //Si coincide password ingresada con la registrada del usuario
            //Para traer el perfil de DOCTOR
            if (user.rol === "Doctor") {
              try {
                let doctor = await Doctor.findOne({
                  where: {
                    personDni: user.dni,
                  },
                });
                user = { ...user, doctor };
                user = {
                  user: user.dataValues,
                  rol: user.doctor.dataValues,
                };
              } catch (e) {
                console.log("Error al traer al doctor: ", e);
              }
              //Para traer el perfil de PACIENTE
            } else if (user.rol === "Patient") {
              try {
                let patient = await Patient.findOne({
                  where: {
                    personDni: user.dni,
                  },
                });
                user = { ...user, patient };
                user = {
                  user: user.dataValues,
                  rol: user.patient.dataValues,
                };
              } catch (e) {
                console.log("Error al traer al paciente: ", e);
              }
            }
            return done(
              null,
              user,
              req.flash("loginMessage", "User logged!!!")
            );
          } else {
            //Se encontro usera, pero password es incorrecta
            return done(
              null,
              false,
              req.flash("loginMessage", "Incorrect password")
            );
          }
        } else {
          //No se encontro usera con email ingresado
          return done(
            null,
            false,
            req.flash("loginMessage", "There is no such registered email")
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

//Serializar
passport.serializeUser(function (user, done) {
  return done(null, user.user.dni);
});
//Deserializar
passport.deserializeUser(async function (dni, done) {
  try {
    let user = await Person.findOne({
      where: {
        dni: dni,
      },
    });
    //Para traer el perfil de DOCTOR
    if (user.rol === "Doctor") {
      try {
        let doctor = await Doctor.findOne({
          where: {
            personDni: user.dni,
          },
        });
        user = { ...user, doctor };
        user = {
          user: user.dataValues,
          rol: user.doctor.dataValues,
        };
      } catch (e) {
        console.log("Error al traer al doctor: ", e);
      }
      //Para traer el perfil de PACIENTE
    } else if (user.rol === "Patient") {
      try {
        let patient = await Patient.findOne({
          where: {
            personDni: user.dni,
          },
        });
        user = { ...user, patient };
        user = {
          user: user.dataValues,
          rol: user.patient.dataValues,
        };
      } catch (e) {
        console.log("Error al traer al paciente: ", e);
      }
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

const server = express();

server.name = "API";

// middlewares
server.use(cors({ credentials: true, origin: "*" }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser("secret"));
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
server.use(
  session({
    secret: "1234",
    resave: false,
    saveUninitialized: false,
  })
);

// Inicializa Passport y recupera el estado de autenticación de la sesión.
server.use(flash());
server.use(passport.initialize());
server.use(passport.session());

// Middleware para mostrar la sesión actual en cada request
server.use((req, res, next) => {
  console.log(req.cookies);
  console.log(req.session);
  console.log(req.user);
  next();
});

// config multer
const storage = multer.diskStorage({
  destination: "./src/public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});
server.use(multer({ storage: storage }).single("image"));

// Routes
// localhost:3001/
server.use("/", routes);
server.use("/login", loginRouter);
server.use("/patient", patientRouter);
server.use("/doctor", doctorRouter);
server.use("/specialities", specialitiesRouter);
server.use("/healthinsurance", healthinsuranceRouter);
server.use("/notifications", notification);
server.use("/prescription", prescriptionRouter);
server.use("/chat", chatMessage);
server.use("/email-send", sendEmail);
server.use("/checkout", payments);
// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
