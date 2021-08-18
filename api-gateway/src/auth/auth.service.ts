import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../user/dto/user.dto';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { UserMSG } from '../common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxySuperFlights,
    private readonly jwtService: JwtService,
  ) {}
  private _clientProxyUser = this.clientProxy.clientProxyUsers();

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this._clientProxyUser.send(UserMSG.VALID_USER, {
      username,
      password,
    });
    user ? user : null;
  }
  async signIn(user) {
    const payload = {
      username: user.username,
      sub: user._id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(userDTO: UserDTO) {
    return await this._clientProxyUser.send(UserMSG.CREATE, userDTO);
  }
}
