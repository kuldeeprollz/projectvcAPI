import { Router } from 'express';
import auth from './routes/auth';
import rooms from './routes/rooms';
import user from './routes/user';
import meetings from './routes/meetings';
import agendash from './routes/agendash';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	rooms(app);
	meetings(app);
	agendash(app);

	return app
}
