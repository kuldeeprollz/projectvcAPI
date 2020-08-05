import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AuthService from '../../services/auth';
import RoomsService from '../../services/rooms';
import MeetingsService from '../../services/meetings'
import { IUserInputDTO } from '../../interfaces/IUser';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { stringify } from 'querystring';


const route = Router();

export default (app: Router) => {
  app.use('/meetings', route);
  
  route.get(
    '/meetingdetails',
    
     celebrate({
      body: Joi.object({
        
        meetingId: Joi.string().required(),
        sessionId: Joi.string().required(),
        
      }),
      
    }),
    
    async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query)
      const logger = Container.get('logger');
      
      
      try {
          var meetingId=req.query.meetingId;
          var sessionId=req.query.sessionId;
         
    
        const meetingsServiceInstance = Container.get(MeetingsService);
        
        const result  = await meetingsServiceInstance.meetingInfo(meetingId,sessionId);

        return res.status(201).json({ result });
      } catch (e) {
   
        return next(e);
      }
    },
  );


  route.get(
    '/meetingList',
    
     celebrate({
      body: Joi.object({
        
        ownerUserId: Joi.string().required(),
        
      }),
      
    }),
    
    async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query)
      const logger = Container.get('logger');
      
      
      try {
          var ownerUserId=req.query.ownerUserId;
         
    
        const meetingsServiceInstance = Container.get(MeetingsService);
        
        const result  = await meetingsServiceInstance.meetingList(ownerUserId);

        return res.status(201).json({ result });
      } catch (e) {
   
        return next(e);
      }
    },
  );


}
