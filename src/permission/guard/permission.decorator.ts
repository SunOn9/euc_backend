import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { RawRule } from "../casl/rules";

export const PERMISSION_CHECKER_KEY = "permission_checker_params_key";
export const CheckPermissions = (...params: RawRule[]): CustomDecorator<string> =>
  SetMetadata(PERMISSION_CHECKER_KEY, params);