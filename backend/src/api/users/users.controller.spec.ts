import { Test } from "@nestjs/testing";
import { UsersController } from "@users/users.controller";
import { UsersService } from "@users/users.service";
import { User } from "@entities/user.entity";
import { ObjectLiteral, Repository } from "typeorm";
import { Role } from "@enums/roles.enum";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ModuleMocker, MockMetadata } from "jest-mock";

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
    let usersController: UsersController;

    type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

    const mockUsers: User[] = [{
        id: 1,
        name: 'Testir',
        email: 'testmail@google.com',
        passwordHash: 'hashedPass1',
        role: Role.Admin,
    }];

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UsersController]
        })
            .useMocker((token) => {
                if (token === UsersService) {
                    return { findAll: jest.fn().mockResolvedValue(mockUsers) };
                }

                if (token === getRepositoryToken(User)) {
                    return { find: jest.fn().mockResolvedValue(mockUsers) };
                }

                if (typeof token === 'function') {
                    const mockMetadata = moduleMocker.getMetadata(token);
                    if (!mockMetadata) { return {}; }
                    return moduleMocker.generateFromMetadata(mockMetadata);
                }
            })
            .compile();

        usersController = moduleRef.get(UsersController);
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const result = await usersController.findAll();
            expect(result).toEqual(mockUsers);
        })
    })



    // beforeEach(async () => {
    //     const mockUserRepository = {
    //         find: jest.fn(),
    //         findOne: jest.fn(),
    //         save: jest.fn(),
    //     };
    //     const moduleRef = await Test.createTestingModule({
    //         controllers: [UsersController],
    //         providers: [
    //             UsersService,
    //             {
    //                 provide: getRepositoryToken(User),
    //                 useValue: mockUserRepository,
    //             },
    //             {
    //                 provide: JwtService,
    //                 useValue: {
    //                     sign: jest.fn(),
    //                     verify: jest.fn(),
    //                 },
    //             },
    //             {
    //                 provide: ConfigService,
    //                 useValue: {
    //                     get: jest.fn(),
    //                 },
    //             },
    //         ],
    //     }).compile();

    //     userRepository = moduleRef.get<MockRepository<User>>(getRepositoryToken(User));
    //     usersService = moduleRef.get(UsersService);
    //     usersController = moduleRef.get(UsersController);
    // });


})