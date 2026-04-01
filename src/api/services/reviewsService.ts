import axiosInstance from '../axios';
import type { Review } from '../../types';
import { asArray, normalizeReview } from '../utils';

const reviewsService = {
    getByDoctor: async (doctorId: number): Promise<Review[]> => {
        const response = await axiosInstance.get('/reviews/', { params: { doctor: doctorId } });
        return asArray<Review>(response.data).map(normalizeReview);
    },

    create: async (data: { doctor: number; rating: number; comment: string }): Promise<Review> => {
        const response = await axiosInstance.post('/reviews/', data);
        return normalizeReview(response.data);
    },
};

export default reviewsService;
