import * as fs from "fs";
import * as bodyParser from "body-parser";
import { assignEntity } from "./middleware";

export default function server(app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  // for pretty print debugging
  app.set("json spaces", 2);
  // assign the session sp and idp based on the params
  app.use(assignEntity);

  // assertion consumer service endpoint (post-binding)
  app.post("/sp/acs", async (req, res) => {
    try {
      const { extract } = await req.sp.parseLoginResponse(req.idp, "post", req);
      const { mail, name } = extract.attributes;

      console.log("extract details--> " + JSON.stringify(extract));
      console.log(mail);
      console.log(name);

      if (mail) {
        return res.redirect(`/?auth=true&email=${mail}`);
      }

      throw new Error("ERR_USER_NOT_FOUND");
    } catch (e) {
      console.error("[FATAL] when parsing login response", e);
      return res.redirect("/");
    }
  });

  // call to init a sso login with redirect binding
  app.get("/sso/redirect", async (req, res) => {
    const { id, context: redirectUrl } = await req.sp.createLoginRequest(
      req.idp,
      "redirect"
    );
    return res.redirect(redirectUrl);
  });

  const https = require("https");
  const key = fs.readFileSync("./key.pem");
  const cert = fs.readFileSync("./cert.pem");
  const server = https.createServer({ key: key, cert: cert }, app);
  server.listen(8081);
}
