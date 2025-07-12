export interface Events {
  title : string
  content : string
  startTime : Date
  endTime : Date 
  recurring : boolean
  userId : string
  sharedEmails : string[]
  color : number
  recurDays : number[]
  recurEnd : Date
}