import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersServices: UsersService) { }

    @Post()
    create(@Body() req: CreateUserDTO) {
        return this.usersServices.create()
    }

    @Get()
    findAll() {
        return this.usersServices.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: number) {
        return this.usersServices.findOne(id)
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: number,
        @Body() req: UpdateUserDTO) {
        return this.usersServices.update(id, req)
    }
}