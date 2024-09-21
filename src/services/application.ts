import {UploadableFile} from '../interfaces/document';
import {DocumentType} from '../types/document';
import api from './api';

export const uploadDocument = async ({
  documentType,
  documentFile,
}: {
  documentType: DocumentType;
  documentFile: UploadableFile;
}): Promise<any> => {
  try {
    const formData = new FormData();

    formData.append('document', documentFile);
    formData.append('documentType', documentType);

    const response = await api.post('/application/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const {data} = response;
    return data;
  } catch (error) {
    throw error;
  }
};

export const documentsStatus = async () => {
  try {
    const response = await api.get('/application/documents-status');

    const {data} = response;
    return data;
  } catch (error) {
    throw error;
  }
};

export const aboutMeText = async (text: string) => {
  try {
    const response = await api.post('/application/about-me', {aboutMe: text});

    const {data} = response;
    return data;
  } catch (error) {
    throw error;
  }
};

export const profile = async ({
  availability,
  transport,
  dogExperience,
}: {
  availability: string;
  transport: string;
  dogExperience: string;
}) => {
  try {
    const response = await api.post('/application/profile', {
      availability,
      transport,
      dogExperience,
    });

    const {data} = response;
    return data;
  } catch (error) {
    throw error;
  }
};
export const deactivateAccount = async () => {
  try {
    const response = await api.post('/application/deactivate-account');

    const {data} = response;
    return data;
  } catch (error) {
    throw error;
  }
};
