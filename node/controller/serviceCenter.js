import * as centerRepository from '../data/serviceCenter.js';
import { config } from '../config.js';

/**
 * 공지사항 
 */
export async function getAnnounceMent(req, res) {
  const id = req.query.id;
  const announcement = await ( id 
    ? centerRepository.finById(id)
    : centerRepository.findAll());

  res.status(200).json({"status": "200", announcement});
}

export async function createAnnouncement(req, res) {
  const {title, content, created} = req.body;
  try {
    var announcement = await centerRepository.saveAnnouncement({title, content, created});
  } catch (error) {
    return res.status(400).json({"status" : "400"});
  }
  
  res.status(201).json({"status": "201", announcement})
}

export async function updateAnnouncement(req, res) {
  const id = req.params.id;
  const {title, content} = req.body;

  const announcement = await centerRepository.update(id, title, content);
  res.status(200).json({"status": "200", announcement});
}

export async function removeAnnouncement(req, res) {
  const id = req.params.id;

  await centerRepository.remove(id);
  res.status(204).json({"status": "204"});
}

/**
 * 1:1 문의 등록 
 */
export async function createRequest(req, res) {
  const {name, phone, title, content, created} = req.body;
  const userId = req.userId;
  try {
    var userRequest = await centerRepository.saveRequest({
      name,
      phone,
      title,
      content,
      created,
      userId
    });
  } catch (error) {
    return res.status(400).json({"status" : "400"});
  }
  
  res.status(201).json({"status": "201", userRequest});
}

export async function myRequest(req, res) {
  const userRequest = await centerRepository.findMyRequest(req.userId);

  res.status(200).json({"status": "200", userRequest});
 }

 export async function getReqAndRes(req, res) {
   const id = req.params.id;
   const userRequest = await centerRepository.findRequestById(id);
   const userResponse = await centerRepository.findResponseById(id);

   return res.status(200).json({"status": "200", userRequest, userResponse});
 }


export async function updateUserRequest(req, res) {
  const id = req.params.id;
  const { title, content } = req.body;
  const userRequest = await centerRepository.findRequestById(id);
  
  if(!userRequest) {
    return res.status(404).json({"status":"404"});
  }
  if(userRequest.userId !== req.userId && req.admin == false) {
    return res.status(403).json({"status": "403"});
  }

  const updatedRequest = await centerRepository.updateRequest(id, title, content);
  res.status(200).json(({"status":"200", updatedRequest}))
}

export async function removeUserRequest(req, res) {
  const id = req.params.id;
  const userRequest = await centerRepository.findRequestById(id);
  if(!userRequest) {
    return res.status(404).json({"status":"404"});
  }
  if(userRequest.userId !== req.userId && req.admin == false) {
    return res.status(403).json({"status": "403"});
  }

  await centerRepository.removeRequset(id);
  res.status(204).json({"status": "204"});
}

export async function adminSearch(req, res) {
  if(req.admin == false) {
    return res.status(403).json({"stauts": "403"});
  }

  const value = req.query.value;
  const announcement = await centerRepository.findByAdmin(value);

  return res.status(200).json({"status": "200", announcement});
}

/**
 * 1:1 문의 응답
 */
export async function createResponse(req, res) {
  const {reqId, title, content, created} = req.body;
  if(req.admin == false) {
    return res.status(403).json({"stauts": "403"});
  }
  try {
    var userResponse = await centerRepository.saveResponse({
      reqId,
      title,
      content,
      created
    });
  } catch (error) {
    return res.status(400).json({"status": "400"});
  }
  
  res.status(201).json({"status": "201", userResponse})
}

export async function updateUserResponse(req, res) {
  if(req.admin == false) {
    return res.status(403).json({"stauts": "403"});
  }

  const id = req.params.id;
  const { title, content } = req.body;

  const userResponse = centerRepository.findResponseById(id);
  if (!userResponse) {
    return res.status(404).json({"status": "404"});
  }

  const updatedResponse = await centerRepository.updateResponse(id, title, content);
  res.status(200).json({"status": "200", updatedResponse});
}

export async function removeUserResponse(req, res) {
  const id = req.params.id;
  if(req.admin == false) {
    return res.status(403).json({"stauts": "403"});
  }

  await centerRepository.removeResponse(id);

  res.status(204).json({"status": "204"});
}

/**
 * admin
 */
export async function getRequestByname(req, res) {
  if(req.admin == false) {
    return res.status(403).json({"stauts": "403"});
  }

  const userRequest = await centerRepository.finRequestByName(req.query.name);
  res.status(200).json({"stauts": "200", userRequest});
}