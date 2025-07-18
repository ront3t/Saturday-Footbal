import express from 'express';

import * as playerController from '../controllers/players';

const router = express.Router();

router.get('/', playerController.getAllPlayers);

router.get('/:id', playerController.getPlayerById);

router.post('/', playerController.createPlayer);

router.put('/:id', playerController.updatePlayer);

router.delete('/:id', playerController.deletePlayer);

export default router;