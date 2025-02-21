import { Router } from 'express';
import handler from '../../shared/lib/handler';

const router = Router();
const route_prefix = '/user';

router.post(route_prefix + '/register', handler(({ body, query }) => {

}, {
}))


export default router;
