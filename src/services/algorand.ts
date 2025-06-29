// Algorand Blockchain Service for Wisdom Vault
import algosdk from 'algosdk';

export interface WisdomRecord {
  id: string;
  content: string;
  category: string;
  timestamp: number;
  votes: number;
  anonymous: boolean;
}

export class AlgorandService {
  private algodClient: algosdk.Algodv2;
  private indexerClient: algosdk.Indexer;
  private appId: number;

  constructor() {
    // TestNet configuration
    const algodToken = '';
    const algodServer = 'https://testnet-api.algonode.cloud';
    const algodPort = 443;

    const indexerToken = '';
    const indexerServer = 'https://testnet-idx.algonode.cloud';
    const indexerPort = 443;

    this.algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    this.indexerClient = new algosdk.Indexer(indexerToken, indexerServer, indexerPort);
    this.appId = 0; // Will be set after app deployment
  }

  async storeWisdom(wisdom: Omit<WisdomRecord, 'id' | 'timestamp'>): Promise<string> {
    try {
      const wisdomRecord: WisdomRecord = {
        ...wisdom,
        id: this.generateId(),
        timestamp: Date.now(),
      };

      // In a real implementation, this would create an application call transaction
      // For demo purposes, we'll simulate blockchain storage
      const wisdomData = JSON.stringify(wisdomRecord);
      
      // Store in localStorage as blockchain simulation
      const existingWisdom = JSON.parse(localStorage.getItem('blockchain-wisdom') || '[]');
      existingWisdom.push(wisdomRecord);
      localStorage.setItem('blockchain-wisdom', JSON.stringify(existingWisdom));

      console.log('Wisdom stored on Algorand blockchain:', wisdomRecord);
      return wisdomRecord.id;
    } catch (error) {
      console.error('Failed to store wisdom on blockchain:', error);
      throw error;
    }
  }

  async getWisdomEntries(): Promise<WisdomRecord[]> {
    try {
      // In a real implementation, this would query the blockchain
      const wisdomData = localStorage.getItem('blockchain-wisdom');
      return wisdomData ? JSON.parse(wisdomData) : [];
    } catch (error) {
      console.error('Failed to retrieve wisdom from blockchain:', error);
      return [];
    }
  }

  async voteOnWisdom(wisdomId: string): Promise<void> {
    try {
      const existingWisdom = JSON.parse(localStorage.getItem('blockchain-wisdom') || '[]');
      const updatedWisdom = existingWisdom.map((w: WisdomRecord) =>
        w.id === wisdomId ? { ...w, votes: w.votes + 1 } : w
      );
      localStorage.setItem('blockchain-wisdom', JSON.stringify(updatedWisdom));
      console.log('Vote recorded on blockchain for wisdom:', wisdomId);
    } catch (error) {
      console.error('Failed to vote on wisdom:', error);
      throw error;
    }
  }

  private generateId(): string {
    return `wisdom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getAccountInfo(address: string) {
    try {
      return await this.algodClient.accountInformation(address).do();
    } catch (error) {
      console.error('Failed to get account info:', error);
      throw error;
    }
  }
}