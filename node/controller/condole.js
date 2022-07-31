import * as condoleRepository from '../data/condole.js';
import * as authRepository from '../data/auth.js';

export async function createCondoleMessage(req, res) {
  const name = await authRepository.findUserName(req.userId);
  if (!name) {
    return res.status(404).json({"status": "404"});
  }
  const {
    title, content, created, obId
  } = req.body;
  const userId = req.userId;
  try {
    var condolMessage = await condoleRepository.save({
      title, 
      content, 
      name, 
      created, 
      obId, 
      userId
    });
  } catch (error) {
    return res.status(400).json({"status" : "400"});
  }
  res.status(201).json({"status": "201", condolMessage})
}

export async function updateCondole(req, res) {
  const id = req.params.id;
  const { title, content } = req.body;
  const condole = await condoleRepository.findById(id);
  
  if(!condole) {
    return res.status(404).json({"status":"404"});
  }
  if(condole.userId !== req.userId && req.admin == false) {
    return res.status(403).json({"status": "403"});
  }

  const updatedCondole = await condoleRepository.update(id, title, content);
  res.status(200).json(({"status":"200", updatedCondole}))
}

export async function removeCondel(req, res) {
  const id = req.params.id;
  const condole = await condoleRepository.findById(id);
  if(!condole) {
    return res.status(404).json({"status":"404"});
  }
  if(condole.userId !== req.userId && req.admin == false) {
    return res.status(403).json({"status": "403"});
  }

  await condoleRepository.remove(id);
  res.status(204).json({"status": "204"});
}

export async function getCondoleMessage(req, res) {
  const obId = req.query.id;
  const condoleMessage = await condoleRepository.findByObId(obId);
  
  res.status(200).json({"status":"200", condoleMessage});

}