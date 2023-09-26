import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { PermissionService } from './permission.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import CustomException from 'lib/utils/custom.exception'

@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createUser(
    // @Req() req: Request,
    @Body() bodyData: CreatePermissionDto,
  ): Promise<boolean> {
    const data = await this.service.create(bodyData)

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    const test = await this.service.findAll()
    console.log(test)
    return true
    // const response = {} as PermissionReply

    // response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    // response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    // response.payload = data.value
    // return response
  }

  // @Get()
  // async findAll() {
  //   return true
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.permissionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
  //   return this.permissionService.update(+id, updatePermissionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.permissionService.remove(+id);
  // }
}
