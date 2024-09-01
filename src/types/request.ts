import {Request as ExpressRequest} from "express";

export interface IRequest extends ExpressRequest {
  userId: number
}