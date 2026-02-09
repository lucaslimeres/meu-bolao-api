import { IGroupRepository } from "@/domain/repositories";
import { IWalletRepository } from "@/domain/repositories/wallet-repository";

interface JoinGroupRequest {
  userId: string;
  groupId?: string;
  inviteCode?: string;
}

export class JoinGroupUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private walletRepository: IWalletRepository
  ) {}

  async execute({ userId, groupId, inviteCode }: JoinGroupRequest) {
    let group;

    // 1. Localizar o grupo por ID ou Código de Convite
    if (groupId) {
      group = await this.groupRepository.findById(groupId);
    } else if (inviteCode) {
      group = await this.groupRepository.findByInviteCode(inviteCode);
    }

    if (!group) {
      throw new Error("Grupo não encontrado.");
    }

    // 2. Validar Privacidade (se for privado, exige o código correto)
    if (group.privacyType === 'private' && inviteCode !== group.inviteCode) {
      throw new Error("Este grupo é privado e requer um código de convite válido.");
    }

    // 3. Validar Data Limite
    if (new Date() > group.entryDeadline) {
      throw new Error("O prazo para entrar neste grupo já encerrou.");
    }

    // 4. Validar se o utilizador já é membro (esta lógica pode estar no repositório)
    const myGroups = await this.groupRepository.listByUser(userId);
    if (myGroups.find(g => g.id === group.id)) {
      throw new Error("Você já faz parte deste grupo.");
    }

    // 5. Validar Financeiro (Entry Fee)
    if (group.entryFee > 0) {
      const balance = await this.walletRepository.getBalance(userId);
      
      if (balance < group.entryFee) {
        throw new Error("Saldo insuficiente na carteira para entrar neste grupo.");
      }

      // Deduzir valor e registar transação
      await this.walletRepository.updateBalance(userId, group.entryFee, 'debit');
      await this.walletRepository.createTransaction({
        userId,
        amount: group.entryFee,
        type: 'debit',
        category: 'entry_fee',
        description: `Entrada no grupo: ${group.title}`
      });
    }

    // 6. Adicionar Membro (Aqui usamos o repositório de grupo modificado)
    // Nota: Adicionaremos um método 'addMember' ao IGroupRepository
    await (this.groupRepository as any).addMember(group.id, userId, group.entryFee > 0);

    return { message: "Entrada no grupo confirmada!", groupId: group.id };
  }
}