import { PartialType } from '@nestjs/swagger';
import { CreateOrdenTargetDto } from './create-orden.dto';

export class UpdateOrdenDto extends PartialType(CreateOrdenTargetDto) {}