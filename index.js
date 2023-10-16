require('dotenv').config()
const express = require('express');
const { sendSlackMessage } = require('./slack');
const app = express()
const port = process.env.HTTP_PORT || 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (_req, res, _next) => {
	const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now()
	};
	try {
		res.send(healthcheck);
	} catch (e) {
		res.status(503).send();
	}
});

app.post('/send-slack/:channelId', async (req, res) => {
  const { body, params } = req;
  const { channelId } = params;
  if (!channelId) {
    res.status(400).json({ ok: false })
    return;
  }
  try {
    await sendSlackMessage(body.message, body.blocks, params.channelId);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(JSON.stringify(error))
    res.status(500).json({ ok: false });
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})