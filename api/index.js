const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const { HealthInsurance, Speciality } = conn.models;
const xlxs = require("xlsx");
const http = require("http");
const socketIO = require("socket.io");

const excel_to_json = (dir) => {
  const excel = xlxs.readFile(dir);
  let datos = xlxs.utils.sheet_to_json(excel.Sheets[excel.SheetNames[0]]);
  return datos;
};

async function addHealthInsurance(datos) {
  datos = datos.map((obra) => {
    return {
      id: obra.id,
      name: obra.name.toString().trim(),
      postal_code: obra.postal_code,
      province: obra.province.toString().trim(),
    };
  });
  await HealthInsurance.bulkCreate(datos, {
    fields: ["id", "name", "postal_code", "province"],
    ignoreDuplicates: true,
  });
}

async function addSpeciality(datos) {
  await Speciality.bulkCreate(datos, {
    fields: ["id", "name"],
    ignoreDuplicates: true,
  });
}

const no_existen_Especialidades = async () => {
  const especialidades = await Speciality.findAll();
  return especialidades.length === 0 ? true : false;
};

//socket.io
const server_pp = http.createServer(server);
const ioNotification = socketIO(server_pp, {
  path: "/notification",
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
  },
});
const ioChat = socketIO(server_pp, {
  path: "/message",
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
  },
});
const { SOCKET_NOTIFICATION } = require("./src/controllers/notification");
const { SOCKET_CHAT } = require("./src/controllers/chatMessage");

SOCKET_NOTIFICATION(ioNotification);
SOCKET_CHAT(ioChat);

// Syncing all the models at once.
conn.sync({ force: false }).then(async () => {
  if (await no_existen_Especialidades()) {
    const obras_sociales = excel_to_json(
      `${__dirname}/src/obras_sociales.xlsx`
    );
    const especialidades = excel_to_json(
      `${__dirname}/src/especialidades.xlsx`
    );
    addHealthInsurance(obras_sociales);
    addSpeciality(especialidades);
  }
  //start serverr
  const port = 3001;
  server_pp.listen(port, () => {
    console.log(`Server is executed on port ${port}`); // view on console
  });
});
