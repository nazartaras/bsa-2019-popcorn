import { SeedUsers1565158741121 } from "./1565158741121-SeedUsers";
import { SeedPosts1565202279038 } from "./1565202279038-SeedPosts";
import { SeedPostComments1565823065222 } from "./1565823065222-SeedPostComments";
import { SeedStory1565606634607 } from "./1565606634607-SeedStory";
import { SeedPostReaction1565847243749 } from "./1565847243749-SeedPostReaction";
import { SeedSurvey1565849537210 } from "./1565849537210-SeedSurvey";

export default [
  SeedUsers1565158741121,
  SeedPosts1565202279038,
  SeedStory1565606634607,
  SeedPostComments1565823065222,
  SeedPostReaction1565847243749,
  SeedSurvey1565849537210
];
//to create new migration run in this folder: typeorm migration:create -n <name>
// then import this migration hear and export in array below
