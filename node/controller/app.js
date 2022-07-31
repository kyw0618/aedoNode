import * as appRepository from '../data/app.js';

export async function callverification(req, res) {
  const data = await appRepository.showverification();
  res.status(200).json(data);
}

export async function policyfun(req, res) {
  const policyData = await appRepository.showPolicy();
  res.status(200).json(policyData);
}

export async function signupTerms(req, res) {
  const singupTermsD = await appRepository.findAuthTerms();
  res.status(200).json(singupTermsD);
}