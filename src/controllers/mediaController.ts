import { Request, Response } from 'express';
import { Files, IncomingForm } from 'formidable';
import { resolve as resolvePath } from 'path';

import { Media } from '../entity/Media';

export const upload = async (req: Request, res: Response) => {
  try {
    const form = new IncomingForm();
    form.multiples = false;
    form.uploadDir = resolvePath('files');
    form.keepExtensions = true;
    const { file }: Files = await new Promise((resolve, reject) => {
      form.parse(req, (err, _, files) => {
        if (err) {
          return reject(err);
        }
        return resolve(files);
      });
    });
    let media = Media.create({
      path: file.path,
    });
    media = await media.save();
    delete media.path;
    return res.status(200).send({ media });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ message: error.message || 'Internal Server Error' });
  }
};

export const getMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const media = await Media.findOne(id);
    if (!media) {
      return res.status(404);
    }
    return res.sendFile(media.path);
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ message: error.message || 'Internal Server Error' });
  }
};
