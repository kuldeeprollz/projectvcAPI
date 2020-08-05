import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AuthService from '../../services/auth';
import RoomsService from '../../services/rooms';
import { IUserInputDTO } from '../../interfaces/IUser';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { stringify } from 'querystring';


const route = Router();
var sha1 = require('sha1');
export default (app: Router) => {
  app.use('/rooms', route);
  route.post(
    '/create',
    
     celebrate({
      body: Joi.object({
        
        title: Joi.string().required(),
        description: Joi.string(),
        type: Joi.string().required(),
        owner: Joi.string().required(),
        accessCode:Joi.string().allow(""),
        settings: Joi.string(),
        action: Joi.string().required(),
        meeting_id:Joi.string().allow(""),

      }),
      
    }),
    
    async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
      const logger = Container.get('logger');
      //logger.debug('Calling Sign-Up endpoint with body: %o', req.body )
     
      //console.log('Calling Sign-Up endpoint with body: %o', req.body )
      
      try {
          var title=req.body.title;
          var description=req.body.description;
          var type =req.body.type;
          var owner=req.body.owner;
          var accessCode=req.body.accessCode;
          var settings=req.body.settings;
          var action=req.body.action ;
          var meeting_id=req.body.meeting_id
        console.log('Access Code---->',accessCode)
        const rommsServiceInstance = Container.get(RoomsService);
        
        const url  = await rommsServiceInstance.create(title, description,type, owner, accessCode, settings, action,meeting_id);
        return res.status(201).json({ url });
      } catch (e) {
   //  logger.error('🔥 error: %o', e);
     //console.log('🔥 error: %o', e)
        return next(e);
      }
    },
  );



  route.post(
    '/getUserRooms',
    
     celebrate({
      body: Joi.object({
        
        owner: Joi.string().required(),
        type: Joi.string().required()

       
      }),
      
    }),
    
    async (req: Request, res: Response, next: NextFunction) => {
   
      const logger = Container.get('logger');
      //logger.debug('Calling Sign-Up endpoint with body: %o', req.body )
     
      //console.log('Calling Sign-Up endpoint with body: %o', req.body )
      
      try {
          var userId=req.body.owner;
          var roomType=req.body.type;
                 
        const rommsServiceInstance = Container.get(RoomsService);
        
        const result  = await rommsServiceInstance.getUserRooms(userId,roomType);
        return res.status(201).json({ result });
      } catch (e) {
   //  logger.error('🔥 error: %o', e);
     //console.log('🔥 error: %o', e)
        return next(e);
      }
    },
  );





  
  route.post(
    '/getUserRoom',
    
     celebrate({
      body: Joi.object({
        
        meeting_id: Joi.string().required(),
       
       
      }),
      
    }),
    
    async (req: Request, res: Response, next: NextFunction) => {
   
      const logger = Container.get('logger');
      //logger.debug('Calling Sign-Up endpoint with body: %o', req.body )
     
      //console.log('Calling Sign-Up endpoint with body: %o', req.body )
      
      try {
          var meeting_id=req.body.meeting_id;
          
                 
        const rommsServiceInstance = Container.get(RoomsService);
        
        const result  = await rommsServiceInstance.getUserRoom(meeting_id);
        return res.status(201).json({ result });
      } catch (e) {
   //  logger.error('🔥 error: %o', e);
     //console.log('🔥 error: %o', e)
        return next(e);
      }
    },
  );





  route.post(
    '/joinRoomURL',
    
     celebrate({
      body: Joi.object({
        
        meetingId: Joi.string().required(),
        userId: Joi.string().required().allow(""),
        userName: Joi.string().allow("")
       
      }),
      
    }),
    
    async (req: Request, res: Response, next: NextFunction) => {
   
      //const logger = Container.get('logger');
 
      
      try {
        var meetingId=req.body.meetingId;
          var userId=req.body.userId;
          var userName=req.body.userName
                 
        const roomsServiceInstance = Container.get(RoomsService);
        
        const result  = await roomsServiceInstance.joinMeeting(meetingId,userId,userName);
        return res.status(201).json({ result });
      } catch (e) {
   //  logger.error('🔥 error: %o', e);
     //console.log('🔥 error: %o', e)
        return next(e);
      }
    },
  );

  





route.post(
  '/validateAccessCode',
  
   celebrate({
    body: Joi.object({
      
      meetingId: Joi.string().required(),
      accessCode: Joi.string().required().allow(""),
      
     
    }),
    
  }),
  
  async (req: Request, res: Response, next: NextFunction) => {
 
    //const logger = Container.get('logger');

    
    try {
      var meetingId=req.body.meetingId;
        
        var accessCode=req.body.accessCode
               
      const roomsServiceInstance = Container.get(RoomsService);
      
      const result  = await roomsServiceInstance.validateAccessCode(meetingId,accessCode);

      console.log(result)
      return res.status(201).json({ result });
    } catch (e) {
 //  logger.error('🔥 error: %o', e);
   //console.log('🔥 error: %o', e)
      return next(e);
    }
  },
);










route.get(
  '/testURL',
  
   celebrate({
    body: Joi.object({
    
      
      
      logouturl: Joi.string().required(),
      
      
     
    }),
    
  }),
  
  async (req: Request, res: Response, next: NextFunction) => {
 
    //const logger = Container.get('logger');

    
    try {
      var meetingId=req.query.logouturl;
     console.log(meetingId)
      return res.status(201).json({ meetingId });
    } catch (e) {
 //  logger.error('🔥 error: %o', e);
   //console.log('🔥 error: %o', e)
      return next(e);
    }
  },
);



};





