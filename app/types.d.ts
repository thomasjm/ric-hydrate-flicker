/// <reference types="next" />
/// <reference types="next/types/global" />


interface ILoginInfo {
  loggedIn: boolean;
  userEmail: string;
  userName: string;
  userUsername: string;
}

interface IValidityInfo {
  status: true | false | "pending" | null;
  errorMessage?: string;
}

interface IAppOptions {
  disableLandingPage: boolean;
  disableAuth: boolean;
}

interface ISortInfo<T> {
  column_name: T;
  direction: AscendingOrDescending;
}
type SortInfo<T> = ISortInfo<T>;

/* Used by prop fetchers */

interface IHasLoggedIn { loggedIn: boolean; }
interface IHasLoginInfo { loginInfo: ILoginInfo; }
interface IHasAuthMethods { authMethods: AuthMethod[]; }
interface IHasUserInfo { userInfo: ProfileUserInfo; }
interface IHasUserInfoOrNull { userInfo: ProfileUserInfo | null; }
interface IHasTeamMemberships { teamMemberships: ProfileTeamMemberships; }
interface IHasTeamInfo { teamInfo: ProfileTeamInfo; }
interface IHasWritableNamespaces { writableNamespaces: string[]; }
interface IHasTeamInfo { teamInfo: ProfileTeamInfo; }
interface IHasServerMode { serverMode: ServerMode; }
interface IHasOtherUserInfo { otherUserInfo: ProfileUserInfo; }
interface IHasDocTree { docTree: IDocTree[]; }
interface IHasStatusCode { statusCode: number | null; }
interface IHasStartConfigs { startConfigs: Array<IStartConfig<any>>; }
interface IHasStatusCode { statusCode: number | null; }
interface IHasSandboxes { sandboxes: Array<ProfileSandboxInfo>; }
interface IHasAppOptions { appOptions: IAppOptions; }
interface IHasServerOptions { options: Options; }
interface IHasOptionStaleness { optionsStaleness: MultiServerResponse<boolean>; }

interface IHasInitialDoc {
  initialDocName: string;
  initialDocMarkdown: string;
}

type IndexLayoutProps = IHasLoginInfo & IHasUserInfo & IHasAppOptions;

interface ITextAndStatus {
  text: string;
  status: number;
}

declare module "*.png" {
   const value: any;
   export = value;
}

declare module "*.ico" {
   const value: any;
   export = value;
}

declare module "*.jpg" {
   const value: any;
   export = value;
}
