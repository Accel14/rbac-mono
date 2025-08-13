import { Test } from "@nestjs/testing";
import { UsersController } from "@users/users.controller";
import { UsersService } from "@users/users.service";
import { User } from "@entities/user.entity";
import { ObjectLiteral, Repository } from "typeorm";
import { Role } from "@enums/roles.enum";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;
    let userRepository: MockRepository;

    type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

    beforeEach(async () => {
        const mockUserRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
        };
        const moduleRef = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verify: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        userRepository = moduleRef.get<MockRepository<User>>(getRepositoryToken(User));
        usersService = moduleRef.get(UsersService);
        usersController = moduleRef.get(UsersController);
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const result = Promise.resolve<User[]>([{
                id: 1,
                name: 'Testir',
                email: 'testmail@google.com',
                passwordHash: 'hashedPass1',
                role: Role.Admin,
            }]);
            jest.spyOn(usersService, 'findAll').mockImplementation(() => result);

            expect(await usersController.findAll()).toBe(await result);
        })
    })
})