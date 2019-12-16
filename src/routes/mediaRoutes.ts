import { Router } from 'express';

import { getMedia, upload } from '../controllers/mediaController';

const mediaRoutes = Router();

mediaRoutes.post('/upload', upload);

mediaRoutes.get('/:id', getMedia);

export { mediaRoutes };
