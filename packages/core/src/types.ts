
export interface User {
  avatar?: string;
  name?: string;
  url?: string;
  [k: string]: any;
}

export type MessageId = string;

export type IMessageStatus = 'pending' | 'sent' | 'fail';

export interface MessageProps {
  /**
   * 唯一ID
   */
  _id: MessageId;
  /**
   * 消息类型
   */
  type: string;
  /**
   * 消息内容
   */
  content?: any;
  /**
   * 消息创建时间
   */
  createdAt?: number;
  /**
   * 消息发送者信息
   */
  user?: User;
  /**
   * 消息位置
   */
  position?: 'left' | 'right' | 'center' | 'pop';
  /**
   * 是否显示时间
   */
  hasTime?: boolean;
  /**
   * 状态
   */
  status?: IMessageStatus;
}


export interface QuickReplyItemProps {
  name: string
  icon?: string
  isNew?: boolean
  isHighlight?: boolean
  [key: string]: any
}

