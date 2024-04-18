
export interface Channel {
  user: string,  // the user creating or joining the channel
  channel: string,
}

export interface ChannelRecord {
  id: number,
  author: string,
  message: string,
}
export interface ChannelRecords extends Array<ChannelRecord>{}
