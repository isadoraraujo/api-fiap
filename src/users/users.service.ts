import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { users } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) { }


  async getUserById(id: string): Promise<users> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND)
    }
    return user
  }

  async verifyUserExists(email: string): Promise<boolean> {
    const user = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    return user ? true : false;
  }

  async crypto(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    return hashedPassword
  }

  async create(data: CreateUserDTO): Promise<users> {
    const { name, email, password } = data;
    const checkUser = await this.verifyUserExists(email);
    let user = undefined;

    if (!checkUser) {
      user = await this.prisma.users.create({
        data: {
          name,
          email,
          password: await this.crypto(password),
        },
      });

      if (await this.emailService.sendEmail(email, 'Bem vinda ao sistema', 'Você se cadastrou no site fiap-avanade', {})) {
        console.log('Email enviado com sucesso!')
      }
    }

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Erro ao criar usuário!',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }

  async findAll(): Promise<users[]> {
    return await this.prisma.users.findMany();
  }

  async findOne(id: number): Promise<users> {
    return await this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, req: UpdateUserDTO): Promise<object> {
    const user = await this.getUserById(id.toString());

    const { name, email, password } = req;
    if(email) {
      const checkEmail = await this.prisma.users.findMany({
        where: {
          AND: [{email: email}, {id: {not: Number(id)} }]
        }
      })

      if(checkEmail) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message: 'Este email está indisponível!'
          },
          HttpStatus.FORBIDDEN
        )
      }
    }

    const updatedUser = await this.prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name ? name : user.name,
        email: email ? email : user.email,
        password: password ? await this.crypto(password) : user.password,
      },
    });

    if (!updatedUser) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Erro ao atualizar usuário!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return { msg: `Usuário ${updatedUser.name} atualizado com sucesso!` };
  }


  async remove(id: number): Promise<string> {
    return `Usuário ${id} deletado com sucesso!`;
  }
}