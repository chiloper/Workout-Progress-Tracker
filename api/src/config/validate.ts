import { plainToInstance } from "class-transformer";
import { EnvironmentVariables } from "./environments";
import { validateSync } from "class-validator";

export function validate(config: Record<string, any>) {
  const validateConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true }
  );

  const errors = validateSync(validateConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    const errorMessages = errors.flatMap(err => Object.values(err.constraints ?? {}));

    throw new Error(`\n\n❌ [Env Validation Error]:\n - ${errorMessages.join('\n - ')}\n`);

  }

  return validateConfig
}