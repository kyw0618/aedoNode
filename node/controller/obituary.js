import * as obitRepository from '../data/obituary.js';
import { config } from '../config.js';


export async function createObituary(req, res) {
  const imgName = res.req.file.filename;
  const resident = {
    relation: req.body.relation,
    name: req.body.residentName,
    phone: req.body.residentphone,
  };
  const deceased = {
    name: req.body.deceasedName,
    age: req.body.deceasedAge
  };
  const {place, eod, coffin, dofp, buried, word, created} = req.body;

  const userId = req.userId;
  try {
    var obituary = await obitRepository.save({
      imgName,
      resident,
      place,
      deceased,
      eod,
      coffin,
      dofp,
      buried,
      word,
      created,
      userId
    });
  } catch (error) {
    return res.status(400).json({"status" : "400"});
  }
  
  res.status(201).json({"status": "201", obituary});
}

export async function getImageData(req, res) {
  const imgName = req.query.imgname;
  let filepath;
  try {
    filepath = (`${config.db.img}/${imgName}`);
  } catch {
    return res.status(404).json({"status": "404"});
  }
  res.sendFile(filepath);
}

export async function updateObit(req, res, next) {
  const id = req.params.id;
  const obit = await obitRepository.findById(id);
  
  if(!obit) {
    return res.status(404).json({"status":"404"});
  }
  if(obit.userId !== req.userId && req.admin == false) {
    return res.status(403).json({"status": "403"});
  }

  const resident = {
    relation: req.body.relation,
    name: req.body.residentName,
    phone: req.body.residentphone
  };
  const deceased = {
    name: req.body.deceasedName,
    age: req.body.deceasedAge
  };
  const {place, eod, coffin, dofp, buried, word} = req.body;

  const updatedObit = await obitRepository.update(
    id,
    resident,
    place,
    deceased,
    eod,
    coffin,
    dofp,
    buried,
    word
  );
  res.status(200).json({"status": "200", updatedObit});
}

export async function removeObit(req, res, next) {
  const id = req.params.id;
  const obit = await obitRepository.findById(id);
  if(!obit) {
    return res.status(404).json({"status":"404"});
  }
  if(obit.userId !== req.userId && req.admin == false) {
    return res.status(403).json({"status": "403"});
  }

  await obitRepository.remove(id);
  res.status(204).json(({"status":"204"}))
}

export async function getMyObituary(req, res) {
  const obituary = await obitRepository.findMyObituary(req.userId);

  res.status(200).json({"status": "200", obituary});
}

export async function getOneObituary(req, res) {
  const obId = req.params.id;
  const obit = await obitRepository.findById(obId);

  res.status(200).json({"status": "200", obit});

}

export async function getByname(req, res) {
  const value = req.query.name;
  const result = await ( value 
    ? obitRepository.findObituaryByname(value)
    : obitRepository.getAllObituary());
  
  res.status(200).json({"status": "200", result});
}
