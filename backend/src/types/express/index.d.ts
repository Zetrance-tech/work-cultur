import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: Types.ObjectId;
                id: string;
                email: string;
                accountType: string;
            };
        }
    }
} 