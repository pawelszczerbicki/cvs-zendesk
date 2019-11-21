const csv = require('csvtojson');
const Zendesk = require('zendesk-node');
const config = require('./config');
const zendeskSubdomain = config.subDomain;
const zendeskAdminToken = config.token;
const email = config.email;

const zendesk = Zendesk({authType: Zendesk.AUTH_TYPES.API_TOKEN, zendeskSubdomain, email, zendeskAdminToken});

const start = async () => {
    const content = await csv().fromFile(config.csvFilePath);
    for (const r of content) {
        try {
            const created = await zendesk.users.create({user: {...r}});
            await zendesk.tickets.create({
                ticket: {
                    requester_id: created.body.user.id,
                    subject: "Problem",
                    comment: {"body": "comment"},
                }
            });
        } catch (e) {
            console.log(e)
        }
    }
};
start().then(r => console.log("OK"));

