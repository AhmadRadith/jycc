import { Schema, model, models } from 'mongoose';

export type ChatMessageDocument = {
  ticketId: string;
  senderId: string;
  senderName: string;
  text?: string;
  imageData?: string;
  createdAt: Date;
};

const ChatMessageSchema = new Schema<ChatMessageDocument>(
  {
    ticketId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    text: { type: String },
    imageData: { type: String },
    createdAt: { type: Date, default: () => new Date(), index: true },
  },
  {
    versionKey: false,
  }
);

export const ChatMessage =
  models.ChatMessage || model<ChatMessageDocument>('ChatMessage', ChatMessageSchema);

