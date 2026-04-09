import { diffArrays } from './diff';

export class ContextEngine {
  analyze(context: string[], proposal: string[], code: string[]) {
    return {
      contextVsProposal: diffArrays(context, proposal),
      proposalVsCode: diffArrays(proposal, code)
    };
  }
}