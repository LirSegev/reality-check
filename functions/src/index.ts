import * as functions from 'firebase-functions';
import * as express from 'express';
import bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', (req, res, next) => {
	res.status(400).send({
		success: false,
		message: 'Error: Bad uri',
	});
});

// const port = process.env.PORT || 'unknown';
// app.listen(port, () => console.log(`Listening on port ${port}`));

// Error handling
app.use(
	(
		err: Error,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		if (res.headersSent) next(err);
		else {
			res.status(500);
			res.send({
				success: false,
				message: 'Error: Server error',
			});
			console.error(err.stack);
		}
	}
);

export const api = functions.https.onRequest(app);
