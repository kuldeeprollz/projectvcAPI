import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
const db = require('../db/pgConnection');
const request = require('request');
import dotenv from 'dotenv';
import { SSL_OP_EPHEMERAL_RSA } from 'constants';
import { url } from 'inspector';









@Service()
export default class RoomsService {
  constructor(
      @Inject('userModel') private userModel : Models.UserModel,
      private mailer: MailerService,
      @Inject('logger') private logger,

      @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
      private xml2jsonres:any,
      private createRoomRes:any
  ) {}

  public async create(title: string, description: string ,type: string, owner:string, accessCode:string, settings:string, action:string, meeting_id:string) {
    try {
    
      var dbResponse=""

if(action=="Create")
{
  var bbb_id:any = this.makeString(20);
      var moderator_pw:any = this.makeString(7)
      var attendee_pw:any = this.makeString(7)
      meeting_id=this.makeString(3) + "-" + this.makeString(3) + "-" + this.makeString(3)

      var query="insert into meetings(title,agenda,type,owner,moderator_pw,attendee_pw,access_code,settings,bbb_id,meeting_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"

       dbResponse=db.query(query,[title,description,type,owner,moderator_pw,attendee_pw,accessCode,settings,bbb_id,meeting_id])
    } else
    
  if(action=="Update") {
    var query="update meetings set title=$1,agenda=$2,access_code=$3,settings=$4 where meeting_id=$5"
     
    dbResponse = db.query(query,[title,description,accessCode,settings,meeting_id])
  }
    else 
    if(action=="Delete")
{
  var  query="update meetings set  is_deleted=true where meeting_id=$1"
  dbResponse=db.query(query,[meeting_id])
    }  
  
     return (dbResponse)
    
} catch (e) {
      this.logger.error(e);
      throw e;
    }
  }




  public async  getUserRooms(userID:any,type:any) {

    try{
   const query="select * from meetings where owner=$1 and type=$2 and is_deleted=false"
  // console.log ("userId---->",userID)
   const result = await db.query(query,[userID,type])
   const userRecord =result.rows
   return userRecord
    }
    catch (e) {
      this.logger.error(e);
      throw e;
    }

  }

  public async  getUserRoom(meeting_id:any) {

    try{
   const query="select a.id,a.meeting_id,a.owner,a.title,b.name as username , case when access_code='' then false else true end as accesscode_required from meetings a inner join users b on a.owner=b.id where meeting_id=$1"
   console.log ("userId---->", meeting_id)
   const result = await db.query(query,[meeting_id])
   const roomRecord =result.rows
   return roomRecord
    }
    catch (e) {
      this.logger.error(e);
      throw e;
    }

  }


  public async  validateAccessCode(meeting_id:any,access_code:any) {

    try{
   const query="select case when access_code=$2 then true else false end as isvalid_accesscode from meetings where meeting_id=$1" 
   console.log ("userId---->", meeting_id)
   const result = await db.query(query,[meeting_id,access_code])
   const resultRecord =result.rows
   return resultRecord
    }
    catch (e) {
      this.logger.error(e);
      throw e;
    }

  }


 


  public async joinMeeting(meeting_id,user_Id,user_name){
var pwd=""
var query
if (user_Id==0)
{
  query="select *,'"+user_name+"' as name from meetings  where meeting_id=$1"

}else
{
  query="select * from meetings a inner join users b on a.owner=b.id  where a.meeting_id=$1"
}


  
    console.log(query)
    const result:any = await db.query(query,[meeting_id])
const meetingRecord = result.rows[0] 
//console.log(meetingRecord)
    if (!meetingRecord) {
      throw new Error('Invalid meeting ID');
    }
    else
    {
      if (meetingRecord.owner==user_Id) {  pwd= meetingRecord.moderator_pw } else { pwd=meetingRecord.attendee_pw}
    }

    const bbb_meeting_url=await this.createRoomURL( meetingRecord.meeting_id ,meetingRecord.bbb_id, meetingRecord.moderator_pw, meetingRecord.attendee_pw, meetingRecord.title, meetingRecord.description,meetingRecord.description, meetingRecord.owner,meetingRecord.access_code,meetingRecord.settings )


    const res:any=await request(bbb_meeting_url, function (error, response, body) {

      if (!error && response.statusCode == 200) {
        console.log(body)
                       
      }
    });
  
   await this.delay(1500);
    // const cc:any =await request(bbb_meeting_url)
    // console.log(cc)
  

   const  bbb_join_url= await  this.JoinRoomURL(meetingRecord.name,meetingRecord.bbb_id,pwd,user_Id)
  console.log("join url -------------------->",bbb_join_url)
 
    return (bbb_join_url)

  }







  private createRoomURL(meetingId: string, bbb_id: string, moderater_pw: string,attendee_pw:string, title: string, description: string, type: string, owner:string, accessCode:string, settings:string) {

    //console.log("createRoomURL---meetingID->" ,meetingId)
    var sha1 = require('sha1');
   const bbb_url= process.env.bbb_url ;
   const bbb_secret = process.env.bbb_secret;
   title=title.replace(/ /g, '+')
   const requestString = "name="+title+"&meetingID="+bbb_id+"&attendeePW="+attendee_pw+"&moderatorPW="+moderater_pw+"&logoutURL=http://mulakaat.in/%23/join/"+meetingId
   const checksum =sha1("create"+requestString+bbb_secret)

   const bbb_URL= bbb_url+"api/create?"+requestString+"&checksum="+checksum
   console.log('create meetin URL---->',bbb_URL)
   return(bbb_URL)



  }


  private JoinRoomURL(fullName:string,meetingId:string,password:string,userID:string) {

    fullName=fullName.replace(/ /g, '+')
    var sha1 = require('sha1');
   const bbb_url= process.env.bbb_url ;
   const bbb_secret = process.env.bbb_secret;
   const requestString = "fullName="+fullName+"&meetingID="+meetingId+"&password="+password+"&userID="+userID+"&joinViaHtml5=true"
   const checksum =sha1("join"+requestString+bbb_secret)

   const bbb_join_URL= bbb_url+"api/join?"+requestString+"&checksum="+checksum
   //console.log (bbb_join_URL)
   return(bbb_join_URL)



  }






  
  private makeString(length) {
    let outString: string = '';
    let inOptions: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    for (let i = 0; i < length; i++) {

      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));

    }
   

  //console.log(outString)
  return(outString)
  }



  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}  

}


