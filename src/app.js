const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const dummy = require('./dummy');
const mail = require('./mail');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

app.get('/v0/dummy', dummy.get);
// Your routes go here
app.get('/v0/mail', mail.getAll);
app.get('/v0/mail/:id', mail.getByUUID);
app.delete('/v0/mail/:id', mail.deleteByUUID);
app.post('/v0/mail', mail.post);
app.put('/v0/mail/:id', mail.put);
app.put('/v0/read/:id', mail.mark);
app.put('/v0/starred/:id', mail.star);
app.get('/v0/usermailboxes', mail.getUserMailboxes);
app.get('/v0/starred', mail.getStarred);
app.get('/v0/mailboxes', mail.getMailboxes);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
