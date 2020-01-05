const Joi = require('joi')

require('dotenv').config()

const configOptions = {
  NODE_ENV: Joi.string()
    .required()
    .default('development')
    .allow('development', 'test', 'production'),
  HOST: Joi.string().required().default('0.0.0.0'),
  PORT: Joi.number().required().default(3000),
  APP_SECRET: Joi.string().required(),
  // MONGO CONFIG
  MONGO_DB_NAME: Joi.string().required(),
  MONGO_DB_HOST: Joi.string(),
  MONGO_DOCKER_HOST: Joi.string()
}

const schema = Joi.object(configOptions).unknown(true)
const { error, value: config } = Joi.validate(process.env, schema)

if (error) {
  console.error('Missing some required properties.', error)
  process.exit(1)
}

module.exports = config