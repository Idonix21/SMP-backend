const sequelize = require("../db");
const { DataTypes } = require("sequelize");

// Определение моделей

// Gender model (больше не используется в MissingPerson)
const Gender = sequelize.define("Gender", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  gender: { type: DataTypes.STRING, allowNull: false },
});

// User model
const User = sequelize.define("User", {
  firstName: { type: DataTypes.STRING, allowNull: true },
  patronymic: { type: DataTypes.STRING },
  secondName: { type: DataTypes.STRING },
  tel: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: "USER" },
});

// MissingPerson model (убрали связь с Gender)
const MissingPerson = sequelize.define("MissingPerson", {
  firstName: { type: DataTypes.STRING, allowNull: false },
  patronymic: { type: DataTypes.STRING },
  secondName: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: true },
  birthday: { type: DataTypes.DATE },
  addressLoss: { type: DataTypes.STRING },
  telMissing: { type: DataTypes.STRING },
  dateLoss: { type: DataTypes.DATE },
  timeLoss: { type: DataTypes.STRING },
  contactNumberApplicant: { type: DataTypes.STRING },
  circumstances: { type: DataTypes.STRING },
  healthStatus: { type: DataTypes.STRING },
  addInf: { type: DataTypes.TEXT },
  items: { type: DataTypes.TEXT },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  firstNameApplicant: { type: DataTypes.STRING, allowNull: false },
  patronymicApplicant: { type: DataTypes.STRING },
  secondNameApplicant: { type: DataTypes.STRING, allowNull: false },
  topClothes: { type: DataTypes.STRING, allowNull: true }, // Верхняя одежда
  bottomClothes: { type: DataTypes.STRING, allowNull: true }, // Нижняя одежда
  headWear: { type: DataTypes.STRING, allowNull: true }, // Волосы/головной убор
  photoUrl: { type: DataTypes.STRING, allowNull: true }, // Поле для хранения ссылки на фото
});

// Log model
const Log = sequelize.define("Log", {
  reporterName: { type: DataTypes.STRING, allowNull: false },
  reportLocation: { type: DataTypes.STRING, allowNull: false },
  reportDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Сообщение отсутствует",
  },
  time: {
    type: DataTypes.DATE,
    allowNull: true, // Разрешаем NULL, чтобы избежать ошибки при добавлении
    defaultValue: DataTypes.NOW, // Устанавливаем значение по умолчанию для новых записей
  },
});

// Фото модели, kinship, district и другие
const Photo = sequelize.define("Photo", {
  name: { type: DataTypes.STRING, allowNull: false },
  imageData: { type: DataTypes.BLOB },
});

// Другие модели остаются без изменений
const Kinship = sequelize.define("Kinship", {
  kinshipName: { type: DataTypes.STRING, allowNull: false },
});
const Districts = sequelize.define("Districts", {
  district: { type: DataTypes.STRING, allowNull: false },
});
const Conditions = sequelize.define("Conditions", {
  condition: { type: DataTypes.STRING, allowNull: false },
});
const Status = sequelize.define("Status", {
  status: { type: DataTypes.STRING, allowNull: false },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

const Color = sequelize.define("Color", {
  colorHEX: { type: DataTypes.STRING, allowNull: false },
});
const Outwear = sequelize.define("Outwear", {
  outwear: { type: DataTypes.STRING, allowNull: false },
});
const Underware = sequelize.define("Underware", {
  underware: { type: DataTypes.STRING, allowNull: false },
});
const Headdress = sequelize.define("Headdress", {
  headdress: { type: DataTypes.STRING, allowNull: false },
});

// Avatar model
const Avatar = sequelize.define("Avatar", {
  topClothes: { type: DataTypes.STRING, defaultValue: "Куртка" },
  bottomClothes: { type: DataTypes.STRING, defaultValue: "Брюки" },
  headWear: { type: DataTypes.STRING, defaultValue: "Шапка" },
  hairColor: { type: DataTypes.STRING, defaultValue: "Черный" },
  colorOutwear: { type: DataTypes.STRING, defaultValue: "#000000" },
  colorUnderware: { type: DataTypes.STRING, defaultValue: "#000000" },
  colorHead: { type: DataTypes.STRING, defaultValue: "#000000" },
});

// Установление связей между моделями
User.hasMany(MissingPerson, { foreignKey: "idUser" });
MissingPerson.belongsTo(User, { foreignKey: "idUser" });

Kinship.hasMany(MissingPerson, { foreignKey: "idKinship" });
MissingPerson.belongsTo(Kinship, { foreignKey: "idKinship" });

Districts.hasMany(MissingPerson, { foreignKey: "idDistrict" });
MissingPerson.belongsTo(Districts, { foreignKey: "idDistrict" });

Conditions.hasMany(MissingPerson, { foreignKey: "idCondition" });
MissingPerson.belongsTo(Conditions, { foreignKey: "idCondition" });

Color.hasMany(MissingPerson, { foreignKey: "idColorHair" });
MissingPerson.belongsTo(Color, { as: "ColorHair", foreignKey: "idColorHair" });

Status.hasMany(MissingPerson, { foreignKey: "idStatus" });
MissingPerson.belongsTo(Status, { foreignKey: "idStatus" });

Photo.hasOne(MissingPerson, { foreignKey: "idPhoto" });
MissingPerson.belongsTo(Photo, { foreignKey: "idPhoto" });

Avatar.hasOne(MissingPerson, { foreignKey: "idAvatar" });
MissingPerson.belongsTo(Avatar, { foreignKey: "idAvatar" });

Outwear.hasMany(Avatar, { foreignKey: "idOutwear" });
Avatar.belongsTo(Outwear, { foreignKey: "idOutwear" });

Underware.hasMany(Avatar, { foreignKey: "idUnderware" });
Avatar.belongsTo(Underware, { foreignKey: "idUnderware" });

Headdress.hasMany(Avatar, { foreignKey: "idHeaddress" });
Avatar.belongsTo(Headdress, { foreignKey: "idHeaddress" });

Color.hasMany(Avatar, { foreignKey: "idColorOutwear" });
Color.hasMany(Avatar, { foreignKey: "idColorUnderware" });
Color.hasMany(Avatar, { foreignKey: "idColorHead" });
Avatar.belongsTo(Color, { as: "ColorOutwear", foreignKey: "idColorOutwear" });
Avatar.belongsTo(Color, {
  as: "ColorUnderware",
  foreignKey: "idColorUnderware",
});
Avatar.belongsTo(Color, { as: "ColorHead", foreignKey: "idColorHead" });

User.hasMany(Log, { foreignKey: "userId" });
Log.belongsTo(User, { foreignKey: "userId" });

MissingPerson.hasMany(Log, { foreignKey: "reportId" });
Log.belongsTo(MissingPerson, { foreignKey: "reportId" });

// Экспорт моделей
module.exports = {
  sequelize,
  User,
  Gender, // Удалить, если не нужно
  MissingPerson,
  Photo,
  Avatar,
  Kinship,
  Districts,
  Conditions,
  Status,
  Outwear,
  Underware,
  Headdress,
  Color,
  Log,
};
