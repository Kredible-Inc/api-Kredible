import { Injectable } from "@nestjs/common";
import { FirebaseService } from "../../firebase/firebase.service";

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

  async createUser(userData: {
    walletAddress: string;
    email?: string;
    name?: string;
  }): Promise<any> {
    const user = {
      ...userData,
      createdAt: new Date(),
      isActive: true,
      documents: [],
      activities: [],
    };

    return await this.firebaseService.createUser(user);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<any> {
    return await this.firebaseService.getUserByWalletAddress(walletAddress);
  }

  async updateUser(walletAddress: string, updateData: any): Promise<any> {
    // TODO: Implement user update in Firebase
    return { walletAddress, ...updateData };
  }

  async addDocument(
    walletAddress: string,
    documentData: {
      type: string;
      url: string;
      uploadedAt: Date;
    }
  ): Promise<any> {
    // TODO: Implement document upload
    return { walletAddress, document: documentData };
  }

  async getUserActivity(walletAddress: string): Promise<any> {
    // TODO: Implement activity tracking
    return { walletAddress, activities: [] };
  }
}
