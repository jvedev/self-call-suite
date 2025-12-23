export type MatchLogEntryType = 'score' | 'warning' | 'time'

export class MatchLogEntry{
    public type : MatchLogEntryType = 'time'
    public time : number = 0;
    public dateTime : Date = new Date();
    public matchID : string = '';
    public description : string = '';

}