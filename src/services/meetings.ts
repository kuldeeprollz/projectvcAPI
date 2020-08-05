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
export default class MeetingsService {
  constructor(
      @Inject('userModel') private userModel : Models.UserModel,
      private mailer: MailerService,
      @Inject('logger') private logger,

      @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
      private xml2jsonres:any,
      private createRoomRes:any
  ) {}

  public async meetingInfo( meetingId:string) {
    try {

    let data=[{
        "meetingDetails": {
          "meetingId": "11",
          "meetingUid": "XW1-CFE-1WS",
          "sessionId": "123",
          "ownerUserId":"110",
          "ownerName": "Amit Pandey",
          "ownerDesignation": "MD",
          "ownerOrganisation": "PSCL",
          "meetingDate": "27/03/2020 13:01:00",
          "title": "Review meetings Solid Waste management",
          "agenda": "Discussion on finalization of the DPR for the Solid Waste management project. Ramchak Dairiya Weighbridge issue to be discussed.",
          "password": "4X123455HS",
          "accessCode": "XDR4RS",
          "MeetingURL": "http://mulakaat.com/meetings/join/ABX-234-DSA",
          "Officers": [
            {
              "userId": "22",
              "name": "Rajeev Kumar",
              "designation": "Manager",
              "department": "Admin",
              "organisation": "PSCL"
            },
            {
              "userId": "24",
              "name": "Surender Sahu",
              "designation": "AGM",
              "department": "Finance",
              "organisation": "PSCL"
            },
            {
              "userId": "28",
              "name": "Rajeev Kapoor",
              "designation": "AGM",
              "department": "IT",
              "organisation": "PSCL"
            }
          ],
          "moderator": [
            {
              "userId": "5",
              "name": "Ashish Ranjan",
              "designation": "Joint Secratory",
              "department": "Admin",
              "organisation": "PSCL"
            }
          ],
          "Participents": [
            {
              "userId": "66",
              "name": "Ashish Ranjan",
              "designation": "Joint Secratory",
              "department": "Admin",
              "organisation": "PSCL"
            },
            {
              "userId": "28",
              "name": "Rajeev Kapoor",
              "designation": "AGM",
              "department": "IT",
              "organisation": "PSCL"
            },
            {
              "userId": "24",
              "name": "Surender Sahu",
              "designation": "AGM",
              "department": "Finance",
              "organisation": "PSCL"
            },
            {
              "userId": "22",
              "name": "Rajeev Kumar",
              "designation": "Manager",
              "department": "Admin",
              "organisation": "PSCL"
            }
          ],
          "Recordings": [
            {
              "recordingId": "1234",
              "recordingURL": "https://google.com"
            },
            {
              "recordingId": "1236",
              "recordingURL": "https://google.com"
            },
            {
              "recordingId": "1355",
              "recordingURL": "https://google.com"
            }
          ],
          "Documents": [
            {
              "documentId": "12344",
              "documentType": "DOCX",
              "documentDescription": "Revised draft of the DPR Incorp.",
              "uploadDate": "27/03/2020 22:00:00",
              "documentName": "Project DPR V-2",
              "documentURL": "https://google.com"
            },
            {
              "documentId": "12555",
              "documentType": "PDF",
              "documentDescription": "Revised draft of the DPR Incorp.",
              "uploadDate": "26/03/2020 22:00:00",
              "documentName": "Project DPR V-3",
              "documentURL": "https://google.com"
            },
            {
              "documentId": "12336",
              "documentType": "PDF",
              "documentDescription": "Revised draft of the DPR Incorp.",
              "uploadDate": "25/03/2020 22:00:00",
              "documentName": "Project DPR Draft",
              "documentURL": "https://google.com"
            }
          ],
          "mom": [
            {
              "momId:123": {},
              "meetingId": "11",
              "sessionId": "123",
              "type": "Task",
              "momText": "prepare the ER Diagram for the table with IOT software for district",
              "assignedToId": "23",
              "assignedToName": "Vivek Kumar",
              "assignedDate": "25/03/2020",
              "dueDate": "27/03/2020",
              "createdById": "5",
              "createdByName": "Ashish Ranjan",
              "status": "Pending"
            },
            {
              "momId:101": {},
              "meetingId": "11",
              "sessionId": "123",
              "type": "Task",
              "momText": "prepare the ER Diagram for the table with IOT software for district",
              "assignedToId": "23",
              "assignedToName": "Vivek Kumar",
              "assignedDate": "25/03/2020",
              "dueDate": "26/03/2020",
              "createdById": "5",
              "createdByName": "Ashish Ranjan",
              "status": "Completed"
            },
            {
              "momId:99": {},
              "meetingId": "11",
              "sessionId": "123",
              "type": "Task",
              "momText": "prepare the ER Diagram for the table with IOT software for district",
              "assignedToId": "23",
              "assignedToName": "Vivek Kumar",
              "assignedDate": "25/03/2020",
              "dueDate": "26/03/2020",
              "createdById": "5",
              "createdByName": "Ashish Ranjan",
              "status": "Pending"
            }
          ]
        }
      }]

      return data
    }
catch (e) {
    this.logger.error(e);
    throw e;
  }
}




public async meetingList( ownerUserId:string) {
    try {

    let data=[{
        "meetingList": [
          {
            "meetingId": "11",
            "sessionId": "123",
            "ownerUserId": "110",
            "ownerName": "Amit Pandey",
            "ownerDesignation": "MD",
            "ownerOrganisation": "\"PSCL\"",
            "meetingDate": "27/03/2020 13:01:00",
            "title": "Review meetings Solid Waste management"
          },
          {
            "meetingId": "11",
            "sessionId": "122",
            "ownerUserId": "110",
            "ownerName": "Amit Pandey",
            "ownerDesignation": "MD",
            "ownerOrganisation": "\"PSCL\"",
            "meetingDate": "26/03/2020 13:01:00",
            "title": "Review meetings Solid Waste management"
          },
          {
            "meetingId": "11",
            "sessionId": "121",
            "ownerUserId": "110",
            "ownerName": "Amit Pandey",
            "ownerDesignation": "MD",
            "ownerOrganisation": "\"PSCL\"",
            "meetingDate": "24/03/2020 13:01:00",
            "title": "Review meetings Solid Waste management"
          },
          {
            "meetingId": "11",
            "sessionId": "120",
            "ownerUserId": "110",
            "ownerName": "Amit Pandey",
            "ownerDesignation": "MD",
            "ownerOrganisation": "\"PSCL\"",
            "meetingDate": "23/03/2020 13:01:00",
            "title": "Review meetings Solid Waste management"
          },
          {
            "meetingId": "11",
            "sessionId": "119",
            "ownerUserId": "110",
            "ownerName": "Amit Pandey",
            "ownerDesignation": "MD",
            "ownerOrganisation": "\"PSCL\"",
            "meetingDate": "23/03/2020 13:01:00",
            "title": "Review meetings Solid Waste management"
          },
          {
            "meetingId": "11",
            "sessionId": "118",
            "ownerUserId": "110",
            "ownerName": "Amit Pandey",
            "ownerDesignation": "MD",
            "ownerOrganisation": "\"PSCL\"",
            "meetingDate": "20/03/2020 13:01:00",
            "title": "Review meetings Solid Waste management"
          }
        ]
      }]

      return data
    }
catch (e) {
    this.logger.error(e);
    throw e;
  }
}

}