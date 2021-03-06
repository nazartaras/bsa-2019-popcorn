import { EntityRepository, Repository } from "typeorm";
import { Voting } from "../models/VotingModel";
import { Voting as VotingEntity } from "../entities/Voting";
import UserRepository from "./user.repository";
import { getCustomRepository, getRepository } from "typeorm";
import { VotingOption } from "../models/VotingOptionModel";
import VotingOptionRepository from "./votingOption.repository";

@EntityRepository(VotingEntity)
class VotingRepository extends Repository<Voting> {
  async createVoting(
    id: string,
    voting: Voting,
    votingOptions: VotingOption[],
    next?
  ) {
    try {
      const user = await getCustomRepository(UserRepository).findOne(id);
      if (!user) {
        return next({ status: 404, message: "User is not found" }, null);
      }

      voting.user = user;

      await Promise.all(
        votingOptions.map(votingOption =>
          getCustomRepository(VotingOptionRepository).createVotingOption(
            votingOption,
            next
          )
        )
      );

      voting.votingOptions = votingOptions;
      return await this.save(voting);
    } catch (err) {
      return next({ status: err.status, message: err.message }, null);
    }
  }

  async getVotings(next?) {
    try {
      return await this.find();
    } catch (err) {
      return next({ status: err.status, message: err.message }, null);
    }
  }

  async getVotingById(id: string, next?) {
    try {
      const voting = await getRepository(VotingEntity)
        .createQueryBuilder("voting")
        .leftJoinAndSelect("voting.votingOptions", "options")
        .leftJoinAndSelect("options.votingOptionReactions", "votingOptionReactions")
        .where("voting.id = :id", { id })
        .getOne();
      if (!voting) {
        return next({ status: 404, message: "Voting is not found" }, null);
      }

      return voting;
    } catch (err) {
      console.log(err)
      throw err;
    }
  }

  async getVotingByUserId(id: string, next?) {
    try {
      const user = await getCustomRepository(UserRepository).findOne(id);
      if (!user) {
        return next({ status: 404, message: "User is not found" }, null);
      }

      return await this.find({ user });
    } catch (err) {
      return next({ status: err.status, message: err.message }, null);
    }
  }

  async updateVotingById(id: string, voting: Voting, next?) {
    try {
      await this.update({ id }, voting);
      const updatedVoting = await this.getVotingById(id, next);
      return updatedVoting
        ? updatedVoting
        : next({ status: 404, message: "Voiting is not found" }, null);
    } catch (err) {
      return next({ status: err.status, message: err.message }, null);
    }
  }

  async deleteVotingById(id: string, next?) {
    try {
      const voting = await this.getVotingById(id, next);
      if (!voting) {
        return next({ status: 404, message: "Voiting is not found" }, null);
      }

      await this.delete({ id });
      return {};
    } catch (err) {
      return next({ status: err.status, message: err.message }, null);
    }
  }

  async createVotingOptionByVotingId(
    id: string,
    votingOption: VotingOption,
    next?
  ) {
    try {
      const voting = await this.getVotingById(id, next);
      if (!voting) {
        return next({ status: 404, message: "Voiting is not found" }, null);
      }

      const newOption = await getCustomRepository(
        VotingOptionRepository
      ).createVotingOption(votingOption, next, voting);
      voting.votingOptions = await getCustomRepository(
        VotingOptionRepository
      ).getVotingOptionByVotingId(id, next);
      await this.save(voting);
      return newOption;
    } catch (err) {
      return next({ status: err.status, message: err.message }, null);
    }
  }
}

export default VotingRepository;
