import { NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';

export function validateUUID(uuid: string) {
  if (!isUUID(uuid)) throw new NotFoundException('Invalid id');
}
