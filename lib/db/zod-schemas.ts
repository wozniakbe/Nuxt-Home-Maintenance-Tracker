import { z } from "zod";

export const NameSchema = z.string().min(1).max(100);
export const DescriptionSchema = z.string().max(1000).or(z.null());
export const FloorSchema = z.number().min(0).max(2);
export const RoomSchema = z.string().min(0).max(100);
