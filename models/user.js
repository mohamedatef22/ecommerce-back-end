const mongoose = require("mongoose");
const validator = require("validator").default;
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return (
          validator.isAlpha(v, "ar-AE", { ignore: " " }) ||
          validator.isAlpha(v, "en-US", { ignore: " " })
        );
      },
      message: "invalid name",
    },
    minLength: 3,
    maxLength: 50,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 20,
    validate: {
      validator: function (v) {
        v = v.replace(/_|@/g, "");
        return validator.isAlphanumeric(v, "en-US");
      },
      message: "invalid user name",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: "invalid email",
    },
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isMobilePhone(v, validator.isMobilePhoneLocales, {
          strictMode: true,
        });
      },
      message: "invalid phone number",
    },
  },
  role: {
    type: String,
    enum: ["Admin", "Seller"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

userSchema.statics.validateUser = (user) => {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
  });
  return schema.validate(user, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

userSchema.plugin(uniqueValidator, { message: "'{VALUE}' already exist " });

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};
userSchema.methods.generateToken = function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), role: user.role },
    process.env.jwtPassword
  );
  return `Bearer ${token}`;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
