import nodemailer, { TransportOptions } from "nodemailer";
import {
  etherealHost,
  gmailEmail,
  gmailPassword,
  gmailPort,
  orgEmail,
  orgHost,
  orgPassword,
  orgPort,
} from "../../Utilities/Configs";

class MailerConfig {
  private testAccount: nodemailer.TestAccount | null;

  constructor() {
    this.testAccount = null;
  }

  async initializeTestAccount(): Promise<void> {
    this.testAccount = await nodemailer.createTestAccount();
  }

  get gmailParam(): any {
    return {
      // Use createTransport with appropriate configuration
      transporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailEmail,
          pass: gmailPassword,
        },
      }),
    };
  }

  get mainParam(): any {
    return {
      host: orgHost,
      port: orgPort,
      secure: orgPort === 465, // true when port is 465, false for other ports
      auth: {
        user: orgEmail,
        pass: orgPassword,
      },
    };
  }

  async getEtherealTestParam(): Promise<any> {
    if (!this.testAccount) {
      await this.initializeTestAccount();
    }

    return {
      host: etherealHost,
      port: gmailPort,
      secure: gmailPort === 465, // true when port is 465, false for other ports
      auth: {
        user: this.testAccount.user,
        pass: this.testAccount.pass,
      },
    };
  }
}

export default MailerConfig;
