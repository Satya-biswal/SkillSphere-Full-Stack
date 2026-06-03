import api from './api';

export const getAllGigs = async (params) => {
  const response = await api.get('/gigs', { params });
  return response.data;
};

export const getGigById = async (id) => {
  const response = await api.get(`/gigs/${id}`);
  return response.data;
};

export const createGig = async (data) => {
  const response = await api.post('/gigs', data);
  return response.data;
};

export const getMyGigs = async () => {
  const response = await api.get('/gigs/my-gigs');
  return response.data;
};

export const deleteGig = async (id) => {
  const response = await api.delete(`/gigs/${id}`);
  return response.data;
};

export const submitProposal = async (gigId, data) => {
  const response = await api.post(`/proposals/${gigId}`, data);
  return response.data;
};

export const getMyProposals = async () => {
  const response = await api.get('/proposals/my');
  return response.data;
};

export const getGigProposals = async (gigId) => {
  const response = await api.get(`/proposals/gig/${gigId}`);
  return response.data;
};

export const updateProposalStatus = async (proposalId, status) => {
  const response = await api.put(`/proposals/${proposalId}/status`, { status });
  return response.data;
};
