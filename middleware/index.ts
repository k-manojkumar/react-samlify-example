import * as samlify from 'samlify';
import * as fs from 'fs';
import * as validator from '@authenio/samlify-node-xmllint';

const binding = samlify.Constants.namespace.binding;

samlify.setSchemaValidator(validator);

// configure Azure idp
const idp = samlify.IdentityProvider({
  metadata: fs.readFileSync(__dirname + '/../metadata/react-samlifyFederationMetadata.xml'),
  wantLogoutRequestSigned: true
});



// configure service provider (application)
const sp = samlify.ServiceProvider({
  entityID: 'react-samlify',
  authnRequestsSigned: false,
  wantAssertionsSigned: true,
  wantMessageSigned: true,
  wantLogoutResponseSigned: true,
  wantLogoutRequestSigned: true,
  privateKey: fs.readFileSync(__dirname + '/../key/sign/privkey.pem'),
  privateKeyPass: 'VHOSp5RUiBcrsjrcAuXFwU1NKCkGA8px',
  isAssertionEncrypted: false,
  assertionConsumerService: [{
    Binding: binding.post,
    Location: 'https://localhost:8081/sp/acs',
  }]
});



export const assignEntity = (req, res, next) => {

  req.idp = idp;
  req.sp = sp;


  return next();

};