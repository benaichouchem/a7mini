async function GetSecretWithName(secretName) {
    
    const name = secretName;
  
    // Imports the Secret Manager library
    const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
  
    // Instantiates a client
    const client = new SecretManagerServiceClient();
    try {
        const [secretVersion] = await client.accessSecretVersion({
            name: name,
        }); 

        const payload = secretVersion.payload.data.toString();
        return payload;

    }
    catch (e) {
      console.log(e, "ERROR");

    }
    
}

modules.export = GetSecretWithName;